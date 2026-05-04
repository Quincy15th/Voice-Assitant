import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

class ChatService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  async sendMessage(message, resetHistory = false) {
    try {
      const response = await this.api.post("/api/chat", {
        message,
        resetHistory,
      });
      return response.data;
    } catch (error) {
      console.error("Chat API Error:", error);
      throw new Error(error.response?.data?.error || "Failed to send message");
    }
  }

  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await this.api.post("/api/stt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      console.error("STT API Error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to transcribe audio",
      );
    }
  }

  textToSpeech(text) {
    try {
      if (!text || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      const viVoice =
        voices.find((voice) => voice.lang === "vi-VN") ||
        voices.find((voice) => voice.lang?.toLowerCase().startsWith("vi"));

      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.lang = "vi-VN";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Browser TTS Error:", error);
      throw new Error("Failed to play speech");
    }
  }

  stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  async getHistory() {
    try {
      const response = await this.api.get("/api/history");
      return response.data;
    } catch (error) {
      console.error("History API Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get history");
    }
  }

  async clearHistory() {
    try {
      const response = await this.api.delete("/api/history");
      return response.data;
    } catch (error) {
      console.error("Clear History API Error:", error);
      throw new Error(error.response?.data?.error || "Failed to clear history");
    }
  }

  async healthCheck() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health Check Error:", error);
      throw new Error("Backend service is not available");
    }
  }
}

export const chatService = new ChatService();
