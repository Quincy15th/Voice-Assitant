require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  CHAT_MODEL: process.env.CHAT_MODEL || "openai/gpt-4o-mini",
  PYTHON_PATH:
    process.env.PYTHON_PATH ||
    "C:/Users/saoma/AppData/Local/Programs/Python/Python310/python.exe",
};
