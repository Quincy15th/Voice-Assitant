const openrouter = require("../configs/openrouter");
const { CHAT_MODEL } = require("../configs/env");
const historyService = require("./historyService");

async function generateChatResponse(message, resetHistory = false) {
  if (!message || !message.trim()) {
    const error = new Error("Message is required");
    error.statusCode = 400;
    throw error;
  }

  if (resetHistory) {
    historyService.resetHistory();
  }

  historyService.addMessage("user", message.trim());

  const completion = await openrouter.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful voice assistant. Keep your responses conversational and concise, as they will be converted to speech.",
      },
      ...historyService.getHistory(),
    ],
    max_tokens: 150,
    temperature: 0.7,
  });

  const responseText =
    completion?.choices?.[0]?.message?.content ||
    "Xin lỗi, tôi chưa có phản hồi.";

  historyService.addMessage("assistant", responseText);

  return {
    response: responseText,
    timestamp: new Date().toISOString(),
    conversationLength: historyService.getHistory().length,
  };
}

module.exports = {
  generateChatResponse,
};
