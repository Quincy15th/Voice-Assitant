import {
  createReminder,
  deletePendingReminder,
  findPendingReminderById,
  listPendingReminders,
  updatePendingReminder,
} from "../../repository/reminderRepository.js";
import {
  detectCalendarAction,
  extractId,
  parseExplicitDate,
  parseRelativeDate,
  tryRuleBased,
  extractWithLlm,
  tryExtractNewTitle,
  pickCandidatesByTitle,
} from "./calendarParser.js";
import { normalizeText } from "../helper.js";
import { formatViDateTime, formatReminderLine, filterByDateInTz, isValidDate } from "./calendarUtils.js";

export async function handleListAction(userId, normalized, now) {
  const dateOnly = parseExplicitDate(normalized, now) || parseRelativeDate(normalized, now);

  const itemsAll = await listPendingReminders(userId, { limit: 50 });
  const items = filterByDateInTz(itemsAll, dateOnly).slice(0, 10);

  if (!items.length) {
    if (dateOnly) {
      const d = dateOnly.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      return `Ngày ${d} bạn chưa có nhắc việc nào.`;
    }
    return "Bạn chưa có nhắc việc nào đang chờ.";
  }

  const lines = items.map(formatReminderLine).join("\n");
  if (dateOnly) {
    const d = dateOnly.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    return `Lịch ngày ${d} của bạn:\n${lines}\nBạn muốn hủy/sửa cái nào? (nói "hủy #ID" hoặc "đổi #ID sang …")`;
  }

  return `Đây là các nhắc việc sắp tới:\n${lines}\nBạn muốn hủy/sửa cái nào? (nói "hủy #ID" hoặc "đổi #ID sang …")`;
}

export async function handleDeleteAction(userId, normalized, rawText, recent) {
  const id = extractId(normalized);
  let target = null;

  if (id) {
    target = await findPendingReminderById(userId, id);
  } else {
    const candidates = pickCandidatesByTitle(recent, rawText);
    if (candidates.length === 1) target = candidates[0];
    if (candidates.length > 1) {
      const lines = candidates.slice(0, 5).map(formatReminderLine).join("\n");
      return `Bạn muốn hủy nhắc nào?\n${lines}\nHãy nói "hủy #ID".`;
    }
  }

  if (!target) {
    const items = recent.slice(0, 5);
    if (!items.length) return "Bạn chưa có nhắc việc nào để hủy.";
    const lines = items.map(formatReminderLine).join("\n");
    return `Mình chưa xác định được nhắc cần hủy. Bạn chọn giúp mình:\n${lines}\nNói "hủy #ID".`;
  }

  await deletePendingReminder(userId, target.id);
  return `Ok, mình đã hủy nhắc #${target.id}: "${target.title}".`;
}

export async function handleUpdateAction(userId, normalized, rawText, recent, now, reminderTime) {
  const id = extractId(normalized);
  let target = null;

  if (id) {
    target = await findPendingReminderById(userId, id);
  } else {
    const candidates = pickCandidatesByTitle(recent, rawText);
    if (candidates.length === 1) target = candidates[0];
    if (candidates.length > 1) {
      const lines = candidates.slice(0, 5).map(formatReminderLine).join("\n");
      return `Bạn muốn sửa nhắc nào?\n${lines}\nHãy nói "đổi #ID sang …".`;
    }
  }

  if (!target) {
    const items = recent.slice(0, 5);
    if (!items.length) return "Bạn chưa có nhắc việc nào để sửa.";
    const lines = items.map(formatReminderLine).join("\n");
    return `Mình chưa xác định được nhắc cần sửa. Bạn chọn giúp mình:\n${lines}\nNói "đổi #ID sang ngày/giờ …".`;
  }

  // parse new time from the user's message
  let newWhen = reminderTime;
  if (!newWhen || !isValidDate(newWhen)) {
    // try LLM extraction (for update we allow even if signal is weak)
    const llm = await extractWithLlm(rawText, now);
    if (llm?.datetimeIso) {
      const d = new Date(llm.datetimeIso);
      if (isValidDate(d)) newWhen = d;
    }
  }

  const newTitle = tryExtractNewTitle(rawText);

  if ((!newWhen || !isValidDate(newWhen)) && !newTitle) {
    return `Bạn muốn đổi nhắc #${target.id} sang thời gian nào (hoặc đổi nội dung)? Ví dụ: "đổi #${target.id} sang ngày mai lúc 9h".`;
  }

  if (newWhen && isValidDate(newWhen) && newWhen.getTime() < now.getTime() + 60_000) {
    return `Thời gian mới đó đã qua (${formatViDateTime(newWhen)}). Bạn muốn đổi sang lúc nào khác?`;
  }

  const fields = {};
  if (newWhen && isValidDate(newWhen)) fields.reminderTime = newWhen;
  if (newTitle) fields.title = newTitle;

  await updatePendingReminder(userId, target.id, fields);

  const whenText = fields.reminderTime
    ? ` vào ${formatViDateTime(new Date(fields.reminderTime))}`
    : "";
  const titleText = fields.title ? ` nội dung "${fields.title}"` : ` "${target.title}"`;
  return `Ok, mình đã cập nhật nhắc #${target.id}:${titleText}${whenText}.`;
}

export async function handleCreateAction(userId, rawText, now, ruleTitle, reminderTime, hasAnySignal) {
  let title = ruleTitle;
  let when = reminderTime;

  if (!when || !isValidDate(when)) {
    // fallback to LLM extraction only when user seems to be doing calendar-ish thing
    if (hasAnySignal) {
      const llm = await extractWithLlm(rawText, now);
      if (llm?.title) title = llm.title;
      if (llm?.datetimeIso) {
        const d = new Date(llm.datetimeIso);
        if (isValidDate(d)) when = d;
      }
    }
  }

  if (!when || !isValidDate(when)) {
    return "Bạn muốn mình nhắc vào thời gian nào? Ví dụ: \"ngày mai lúc 9 giờ nhắc tôi họp team\".";
  }

  // if user only gave date but no time, we defaulted to 09:00. If it's already past, propose next hour/day.
  if (when.getTime() < now.getTime() + 60_000) {
    return `Thời gian đó đã qua (${formatViDateTime(when)}). Bạn muốn nhắc vào lúc nào khác?`;
  }

  await createReminder(userId, title, when);

  return `Ok, mình đã đặt nhắc: "${title}" vào ${formatViDateTime(when)}.`;
}
