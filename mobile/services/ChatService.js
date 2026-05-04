import axios from "axios";

// Đổi IP này thành IP máy đang chạy backend Node.js
// Ví dụ: http://192.168.1.15:3001
const API_BASE_URL = "http://192.168.1.19:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const chatService = {
  async sendMessage(message, resetHistory = false) {
    const res = await api.post("/api/chat", {
      message,
      resetHistory,
    });
    return res.data;
  },

  async getHistory() {
    const res = await api.get("/api/history");
    return res.data;
  },

  async clearHistory() {
    const res = await api.delete("/api/history");
    return res.data;
  },
};

export default chatService;
