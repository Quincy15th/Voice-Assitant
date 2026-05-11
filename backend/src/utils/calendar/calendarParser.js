import axios from "axios";
import { env } from "../env.js";
import { normalizeText } from "../helper.js";
import { getNow } from "../datetime.js";
import { isValidDate, clampInt, stripCommandNoise } from "./calendarUtils.js";

function applyDayPeriod(text, hour) {
  // "chiều/tối" + hour <= 11 => add 12. "sáng" keeps.
  const hasAfternoon = /\b(chiều)\b/.test(text);
  const hasEvening = /\b(tối|đêm)\b/.test(text);
  const hasMorning = /\b(sáng)\b/.test(text);

  if ((hasAfternoon || hasEvening) && hour >= 1 && hour <= 11) return hour + 12;
  if (hasMorning) return hour; // no change
  return hour;
}

export function detectCalendarAction(text) {
  // default: create
  // Note: avoid \b with Vietnamese diacritics (Unicode word boundary issues)
  if (
    /(?:^|\s)(danh sách|liệt kê|xem lịch|xem nhắc|nhắc gì|có nhắc)(?:\s|$)/.test(text) ||
    /(?:^|\s)(có gì|lịch gì|có lịch gì)(?:\s|$)/.test(text)
  ) {
    return "list";
  }
  if (/(?:^|\s)(hủy|huỷ|xóa|xoá|bỏ|cancel)(?:\s|$)/.test(text)) {
    return "delete";
  }
  if (/(?:^|\s)(đổi|dời|chuyển|sửa|lùi|dời lại|chuyển sang)(?:\s|$)/.test(text)) {
    return "update";
  }
  return "create";
}

export function extractId(text) {
  // "id 12", "mã 12", "#12", "số 12"
  let m = text.match(/(?:^|\s)(?:id|mã|ma|số|so)\s*(\d{1,18})(?=\s|$)/);
  if (!m) m = text.match(/#\s*(\d{1,18})(?=\s|$)/);
  if (!m?.[1]) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

export function parseTimeOfDay(text) {
  // Returns {hour, minute} or null
  // Support: "7h", "7 h 30", "7 giờ 30", "lúc 7", "7 rưỡi"
  let m =
    text.match(/\b(lúc\s*)?(\d{1,2})\s*(h|giờ)\s*(\d{1,2})?\b/) ||
    text.match(/\b(lúc\s*)?(\d{1,2})\s*h\s*(\d{1,2})\b/);

  if (m) {
    const hour = clampInt(parseInt(m[2], 10), 0, 23);
    const minuteRaw = m[4] ? parseInt(m[4], 10) : 0;
    const minute = clampInt(minuteRaw, 0, 59);
    return { hour, minute };
  }

  m = text.match(/\b(lúc\s*)?(\d{1,2})\s*(rưỡi)\b/);
  if (m) {
    const hour = clampInt(parseInt(m[2], 10), 0, 23);
    return { hour, minute: 30 };
  }

  m = text.match(/\b(lúc\s*)?(\d{1,2})\b/);
  if (m && /\b(lúc|giờ|h)\b/.test(text)) {
    const hour = clampInt(parseInt(m[2], 10), 0, 23);
    return { hour, minute: 0 };
  }

  return null;
}

export function parseExplicitDate(text, now) {
  // dd/mm(/yyyy) or dd-mm(-yyyy)
  let m = text.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
  if (m) {
    const day = clampInt(parseInt(m[1], 10), 1, 31);
    const month = clampInt(parseInt(m[2], 10), 1, 12);
    let year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
    if (year < 100) year += 2000;
    return new Date(year, month - 1, day);
  }

  // "ngày 12 tháng 5 (năm 2026)"
  m = text.match(/\bngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})(?:\s+năm\s+(\d{4}))?\b/);
  if (m) {
    const day = clampInt(parseInt(m[1], 10), 1, 31);
    const month = clampInt(parseInt(m[2], 10), 1, 12);
    const year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
    return new Date(year, month - 1, day);
  }

  return null;
}

export function parseRelativeDate(text, now) {
  // Avoid \b for Vietnamese diacritics (Unicode word boundary issues)
  if (/(?:^|\s)(hôm nay)(?:\s|$)/.test(text)) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (/(?:^|\s)(ngày mai)(?:\s|$)/.test(text)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (/(?:^|\s)(mốt|ngày kia)(?:\s|$)/.test(text)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 2);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  let m = text.match(/(?:^|\s)(\d+)\s+ngày\s+nữa(?:\s|$)/);
  if (m) {
    const days = clampInt(parseInt(m[1], 10), 0, 365);
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  return null;
}

export function buildReminderDateTime({ dateOnly, time, rawText }) {
  if (!dateOnly || !isValidDate(dateOnly)) return null;

  const h = applyDayPeriod(rawText, time?.hour ?? 9);
  const m = time?.minute ?? 0;
  const dt = new Date(dateOnly.getFullYear(), dateOnly.getMonth(), dateOnly.getDate(), h, m, 0, 0);
  return isValidDate(dt) ? dt : null;
}

export function extractTitle(rawText) {
  let t = stripCommandNoise(rawText);

  // remove time phrases to keep title clean
  t = t
    .replace(/\b(hôm nay|ngày mai|ngày kia|mốt)\b/g, " ")
    .replace(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/g, " ")
    .replace(/\bngày\s+\d{1,2}\s+tháng\s+\d{1,2}(?:\s+năm\s+\d{4})?\b/g, " ")
    .replace(/\b(lúc\s*)?\d{1,2}\s*(h|giờ)\s*(\d{1,2})?\b/g, " ")
    .replace(/\b(lúc\s*)?\d{1,2}\s*h\s*(\d{1,2})\b/g, " ")
    .replace(/\b(lúc\s*)?\d{1,2}\s*rưỡi\b/g, " ")
    .replace(/\b(sáng|chiều|tối|đêm)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!t) return "Nhắc việc";
  return t;
}

export function tryExtractNewTitle(rawText) {
  // Only treat as "change title" when user explicitly mentions content/title,
  // or uses quotes after "thành". Avoid interpreting "sang ngày mai..." as title.
  let m = rawText.match(/\b(nội dung|tiêu đề)\s*(là|thành)?\s*(.+)\s*$/i);
  if (m?.[3]) {
    const candidate = (m[3] || "").trim();
    return candidate || null;
  }

  m = rawText.match(/\bthành\s+[[""](.+?)[[""]]\s*$/i);
  if (m?.[1]) {
    const candidate = (m[1] || "").trim();
    return candidate || null;
  }

  return null;
}

export function pickCandidatesByTitle(reminders, rawText) {
  const t = extractTitle(rawText);
  const key = normalizeText(t);
  if (!key) return [];

  // simple contains-based matching
  return reminders.filter((r) => normalizeText(r.title).includes(key));
}

export async function extractWithLlm(rawText, now) {
  const systemPrompt = `
Bạn là bộ trích xuất dữ liệu lịch/nhắc việc.
Nhiệm vụ: từ câu tiếng Việt của người dùng, trích xuất thông tin nhắc việc và trả về JSON DUY NHẤT.

YÊU CẦU:
- Chỉ xuất JSON, không thêm chữ khác.
- JSON schema:
{
  "title": string,
  "datetime_iso": string | null
}
- "datetime_iso" phải là ISO-8601 (ví dụ "2026-05-09T14:30:00+07:00") theo múi giờ Asia/Ho_Chi_Minh.
- Nếu người dùng không nói rõ thời gian/ngày → để null.
`;

  const userPrompt = `
[NOW]
${now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}

[USER MESSAGE]
${rawText}
`;

  const response = await axios.post(
    env.LLM_URL,
    {
      model: env.LLM_MODEL,
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
      temperature: 0.0,
      max_tokens: 220,
      stream: false,
    },
    { timeout: 30000 },
  );

  const output = response?.data?.choices?.[0]?.message?.content?.trim() || "";

  const jsonText = output
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonText);
    const title = typeof parsed?.title === "string" ? parsed.title.trim() : "";
    const datetimeIso =
      typeof parsed?.datetime_iso === "string" ? parsed.datetimeIso.trim() : null;

    return {
      title: title || extractTitle(rawText),
      datetimeIso: datetimeIso || null,
    };
  } catch {
    return null;
  }
}

export function tryRuleBased(rawText) {
  const text = normalizeText(rawText);
  const now = getNow();

  const dateOnly = parseExplicitDate(text, now) || parseRelativeDate(text, now);
  const time = parseTimeOfDay(text);
  const dt = dateOnly ? buildReminderDateTime({ dateOnly, time, rawText: text }) : null;

  const title = extractTitle(text);

  return { now, title, reminderTime: dt, hasAnySignal: Boolean(dateOnly || time) };
}
