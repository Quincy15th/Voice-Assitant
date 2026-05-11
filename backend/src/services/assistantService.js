import { createMessage } from "../repository/conversationRepository.js";
import { generateSpeech, predictIntent, transcribe } from "./aiApiService.js";
import { qaHandler } from "./qaService.js";
import { handlePersonalization } from "./memoryService.js";
import { deviceHandler } from "./deviceControlService.js";
import { calendarHandler } from "./calendarService.js";

const detectPlatformFromUserAgent = (ua) => {
  const s = (ua || "").toLowerCase();
  if (!s) return "unknown";
  if (s.includes("android") || s.includes("iphone") || s.includes("ipad"))
    return "mobile";
  return "pc";
};

export const handleVoiceChat = async ({
  content,
  audioPath,
  userId,
  userAgent = "",
  check,
}) => {
  // 1. STT
  let text = "";
  if (check) {
    text = await transcribe(audioPath);
  } else {
    text = content;
  }

  text = text.trim().toLowerCase();
  // 2. Save user message
  await createMessage(userId, "user", text);

  console.log("---------------Transcribed Text:", text);
  // 3. Intent
  const intent = await predictIntent(text);

  console.log("---------------Predicted Intent:", intent);
  const platform = detectPlatformFromUserAgent(userAgent);
  let reply = "";
  let action = null;

  // 4. Route handler
  switch (intent) {
    case "qa":
      reply = await qaHandler(text, userId);
      break;

    case "calendar":
      reply = await calendarHandler(text, userId);
      break;

    case "personalize":
      reply = await handlePersonalization(userId, text);
      if (!reply) {
        reply = await qaHandler(text, userId);
      }
      break;

    case "control_device":
      {
        const out = await deviceHandler(text, { userId, platform });
        reply = out.reply;
        action = out.action || null;
      }
      break;

    default:
      reply = "Tôi chưa hiểu yêu cầu của bạn.";
  }

  console.log("-------------------", reply, action || "");
  // 5. Save assistant message;
  await createMessage(userId, "assistant", reply);

  return { intent, reply, action, platform };
};

export const handleGenerateSpeech = async (text) => {
  return await generateSpeech(text);
};
