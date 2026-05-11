import {
  handleVoiceChat,
  handleGenerateSpeech,
} from "../services/assistantService.js";

export const voiceChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Không tìm thấy file âm thanh",
        intent: "error",
        reply: "Không tìm thấy file âm thanh.",
        action: null,
        platform: "unknown",
      });
    }

    const audioBuffer = req.file.buffer;

    // Xử lý voice chat
    const result = await handleVoiceChat({
      content: null,
      audioPath: audioBuffer,
      userId: req.user.id,
      userAgent: req.headers["user-agent"] || "",
      check: true,
    });

    return res.status(200).json({
      intent: result?.intent ?? "unknown",
      reply: result?.reply ?? "",
      action: result?.action ?? null,
      platform: result?.platform ?? "unknown",
      user_text: result?.user_text ?? "",
    });
  } catch (error) {
    console.error("Voice Chat Error:", error);

    return res.status(500).json({
      error: "Voice assistant failed",
      intent: "error",
      reply: "Voice assistant failed",
      action: null,
      platform: "unknown",
    });
  }
};

export const speak = async (req, res) => {
  try {
    const text = req.body?.text ?? req.body?.message ?? req.query?.text;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const audioBuffer = await handleGenerateSpeech(text);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    return res.send(audioBuffer);
  } catch (error) {
    console.error("TTS Error:", error);

    return res.status(500).json({
      error: "TTS failed",
    });
  }
};

export const chat = async (req, res) => {
  try {
    const text = req.body?.text ?? req.body?.message;
    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    // Xử lý voice chat
    const result = await handleVoiceChat({
      content: text,
      audioPath: null,
      userId: req.user.id,
      userAgent: req.headers["user-agent"] || "",
      check: false,
    });

    return res.status(200).json({
      intent: result?.intent ?? "unknown",
      reply: result?.reply ?? "",
      action: result?.action ?? null,
      platform: result?.platform ?? "unknown",
      user_text: result?.user_text ?? "",
    });
  } catch (error) {
    console.error("Voice Chat Error:", error);

    return res.status(500).json({
      error: "Voice assistant failed",
      intent: "error",
      reply: "Voice assistant failed",
      action: null,
      platform: "unknown",
    });
  }
};
