const express = require("express");
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorHandler");

const healthRoutes = require("./src/routes/healthRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const sttRoutes = require("./src/routes/sttRoutes");
const historyRoutes = require("./src/routes/historyRoutes");
const { PORT } = require("./src/configs/env");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/health", healthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/stt", sttRoutes);
app.use("/api/history", historyRoutes);

app.post("/api/tts", (req, res) => {
  return res.status(410).json({
    error: "TTS endpoint is disabled",
    details: "Use browser SpeechSynthesis on the frontend instead.",
  });
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Voice Chat Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
