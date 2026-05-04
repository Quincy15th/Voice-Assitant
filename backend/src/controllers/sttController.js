const sttService = require("../services/sttService");
const { safeRemove } = require("../utils/fileCleanup");

async function transcribe(req, res, next) {
  let filePath = null;

  try {
    console.log("===== STT LOCAL REQUEST =====");
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        error: "Audio file is required",
      });
    }

    filePath = req.file.path;

    console.log("1. filePath:", filePath);

    const result = await sttService.transcribeAudio(filePath);
    return res.json(result);
  } catch (error) {
    await safeRemove(filePath);
    next(error);
  }
}

module.exports = {
  transcribe,
};
