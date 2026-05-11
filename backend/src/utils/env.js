import dotenv from "dotenv";

dotenv.config();

export function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}
export function optional(...names) {
  for (const n of names) {
    const v = process.env[n];
    if (v) return v;
  }
  return undefined;
}
export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  corsOrigin: optional("CORS_ORIGIN", "CLIENT_URL") || "*",
  aiServiceBaseUrl: optional("AI_SERVICE_BASE_URL") || "http://localhost:5000",
  dbUser: required("DB_USER"),
  dbPassword: required("DB_PASSWORD"),
  dbHost: required("DB_HOST"),
  dbPort: Number(required("DB_PORT")),
  dbName: required("DB_NAME"),
  jwtSecret:
    optional("JWT_SECRET", "ACCESS_TOKEN_SECRET") || required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  LLM_URL: process.env.LLM_URL || "http://127.0.0.1:1234/v1/chat/completions",
  LLM_MODEL: process.env.LLM_MODEL || "google/gemma-3-4b",
  weatherApiKey: optional("WEATHER_API_KEY"),
  weatherCity: process.env.WEATHER_CITY || "Hanoi",
};
