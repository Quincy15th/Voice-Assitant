const express = require("express");
const cors = require("cors");
const multer = require("multer");
const OpenAI = require("openai");
const fs = require("fs-extra");
const nodeFs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "Voice Chat App",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const uploadDir = path.join(__dirname, "uploads");
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

let conversationHistory = [];

function runLocalWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    const pythonCmd =
      process.env.PYTHON_PATH ||
      "C:/Users/saoma/AppData/Local/Programs/Python/Python314/python.exe";

    const scriptPath = path.join(__dirname, "stt.py");

    console.log("pythonCmd:", pythonCmd);
    console.log("scriptPath:", scriptPath);
    console.log("audioPath:", audioPath);
    console.log("python exists:", nodeFs.existsSync(pythonCmd));
    console.log("script exists:", nodeFs.existsSync(scriptPath));
    console.log("audio exists:", nodeFs.existsSync(audioPath));

    execFile(
      pythonCmd,
      [scriptPath, audioPath],
      {
        timeout: 120000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);

        if (error) {
          return reject(
            `execFile error: ${error.message}\nstdout: ${stdout}\nstderr: ${stderr}`,
          );
        }

        try {
          const parsed = JSON.parse(stdout);

          if (!parsed.success) {
            return reject(parsed.error || "Local whisper failed");
          }

          resolve(parsed);
        } catch (parseError) {
          reject(
            `Invalid JSON from stt.py: ${stdout || stderr || parseError.message}`,
          );
        }
      },
    );
  });
}

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Voice Chat API is running" });
});

app.post("/api/tts", (req, res) => {
  return res.status(410).json({
    error: "TTS endpoint is disabled",
    details: "Use browser SpeechSynthesis on the frontend instead.",
  });
});

app.post("/api/stt", upload.single("audio"), async (req, res) => {
  let filePath = null;

  try {
    console.log("===== STT LOCAL REQUEST =====");
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        error: "Audio file is required",
      });
    }

    filePath = req.file.path;

    console.log("1. filePath:", filePath);
    console.log("2. exists:", nodeFs.existsSync(filePath));

    if (!nodeFs.existsSync(filePath)) {
      return res.status(500).json({
        error: "Uploaded audio file not found on server",
      });
    }

    console.log("3. calling local whisper...");
    const transcription = await runLocalWhisper(filePath);
    console.log("4. local whisper response:", transcription);

    const text = transcription?.text?.trim() || "";

    await fs.remove(filePath);
    console.log("5. temp file removed");

    if (!text) {
      return res.status(400).json({
        error: "Cannot recognize speech",
        details: "Whisper returned empty text",
      });
    }

    return res.json({
      transcription: text,
      language: transcription?.language || "unknown",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("===== STT ERROR =====");
    console.error("message:", error);

    try {
      if (filePath) {
        await fs.remove(filePath);
      }
    } catch (_) {}

    return res.status(500).json({
      error: "Failed to transcribe audio",
      details: String(error) || "Unknown error",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, resetHistory = false } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (resetHistory) {
      conversationHistory = [];
    }

    conversationHistory.push({
      role: "user",
      content: message.trim(),
    });

    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    const completion = await openrouter.chat.completions.create({
      model: process.env.CHAT_MODEL || "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful voice assistant. Keep your responses conversational and concise, as they will be converted to speech.",
        },
        ...conversationHistory,
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseText =
      completion?.choices?.[0]?.message?.content ||
      "Xin lỗi, tôi chưa có phản hồi.";

    conversationHistory.push({
      role: "assistant",
      content: responseText,
    });

    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return res.json({
      response: responseText,
      timestamp: new Date().toISOString(),
      conversationLength: conversationHistory.length,
    });
  } catch (error) {
    console.error("===== CHAT ERROR =====");
    console.error("message:", error?.message);
    console.error("status:", error?.status);
    console.error("response data:", error?.response?.data);
    console.error("full error:", error);

    return res.status(500).json({
      error: "Failed to generate response",
      details:
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Unknown error",
    });
  }
});

app.get("/api/history", (req, res) => {
  return res.json({
    history: conversationHistory,
    length: conversationHistory.length,
  });
});

app.delete("/api/history", (req, res) => {
  conversationHistory = [];
  return res.json({ message: "Conversation history cleared" });
});

app.use((error, req, res, next) => {
  console.error("===== SERVER ERROR =====");
  console.error(error);
  return res.status(500).json({
    error: "Internal server error",
    details: error?.message || "Unknown error",
  });
});

app.listen(PORT, () => {
  console.log(`Voice Chat Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
