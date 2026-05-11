/* eslint-disable no-unused-vars */
import { env } from "../utils/env.js";

export function errorHandler(err, req, res, next) {
  const status = Number(err.status || err.statusCode || 500);

  const message =
    status >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  if (env.nodeEnv !== "production") {
    // Keep server-side stack traces out of prod responses.
    console.error(err);
  }

  res.status(status).json({
    error: {
      code: err.code || (status >= 500 ? "INTERNAL" : "BAD_REQUEST"),
      message,
    },
  });
}
