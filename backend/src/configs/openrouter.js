const OpenAI = require("openai");
const { OPENROUTER_API_KEY } = require("./env");

if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

const openrouter = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "Voice Chat App",
  },
});

module.exports = openrouter;
