function errorHandler(error, req, res, next) {
  console.error("===== SERVER ERROR =====");
  console.error(error);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    error: error.publicMessage || error.message || "Internal server error",
    details: error.message || "Unknown error",
  });
}

module.exports = errorHandler;
