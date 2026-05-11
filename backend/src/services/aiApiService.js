import axios from "axios";
import FormData from "form-data";
import { env } from "../utils/env.js";

const PYTHON_API = env.aiServiceBaseUrl;

// ===== INTENT =====
export const predictIntent = async (text) => {
  try {
    const response = await axios.post(`${PYTHON_API}/intent/predict`, {
      text,
    });

    return response.data.intent;
  } catch (error) {
    console.error("[INTENT API ERROR]:", error.message);

    return "unknown";
  }
};

// ===== FAQ =====
export const retrieveFAQ = async (query) => {
  try {
    const response = await axios.post(`${PYTHON_API}/faq`, {
      query,
    });

    return response.data.intent;
  } catch (error) {
    console.error("[FAQ API ERROR]:", error.message);

    return null;
  }
};

// ===== TTS =====
export const generateSpeech = async (text) => {
  const response = await axios.post(
    `${PYTHON_API}/tts/speak`,
    { text },
    {
      responseType: "arraybuffer",
    },
  );

  return response.data;
};

// ===== STT =====
export const transcribe = async (audioPath) => {
  const formData = new FormData();

  formData.append("audio", audioPath, {
    filename: "recording.webm",
    contentType: "audio/webm",
  });

  const response = await axios.post(`${PYTHON_API}/stt/transcribe`, formData, {
    headers: formData.getHeaders(),
  });

  return response.data.text;
};
