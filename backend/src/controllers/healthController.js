function healthCheck(req, res) {
  return res.json({
    status: "OK",
    message: "Voice Chat API is running",
  });
}

module.exports = {
  healthCheck,
};
