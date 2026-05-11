import { MEMORY_RULES } from "../constant/memory_patterns.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../repository/userRepository.js";
import { normalizeText } from "../utils/helper.js";

function isInvalidMemoryValue(value) {
  const invalid = ["gì", "bao nhiêu", "ở đâu", "khi nào", "là ai", "thế nào"];
  return invalid.some((k) => value.includes(k));
}

async function saveMemory(userId, field, value) {
  const profile = await getUserProfile(userId);

  const oldValue = profile?.[field];

  if (field === "hobbies") {
    const normalizedValue = typeof value === "string" ? value.trim() : value;

    const hobbies = new Set(profile.hobbies || []);

    if (hobbies.has(normalizedValue)) {
      return null;
    }

    hobbies.add(normalizedValue);

    await updateUserProfile(userId, {
      hobbies: [...hobbies],
    });

    return `Đã thêm sở thích: ${normalizedValue}.`;
  }

  if (oldValue === value) {
    return null;
  }

  // update field
  await updateUserProfile(userId, {
    [field]: value,
  });

  if (oldValue !== undefined && oldValue !== null) {
    return `Đã cập nhật ${field} từ ${oldValue} thành ${value}.`;
  }

  return `Đã ghi nhớ ${field}: ${value}.`;
}

export async function handlePersonalization(userId, text) {
  text = normalizeText(text);

  /* Rule-based extraction */
  for (const rule of MEMORY_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (!match) continue;

      const value = match[1]?.trim();
      if (!value || isInvalidMemoryValue(value)) return null;

      const msg = await saveMemory(userId, rule.field, value);

      if (msg) return msg;

      return rule.template.replace("{}", value);
    }
  }

  return null;
}
