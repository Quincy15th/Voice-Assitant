const path = require("path");
const fs = require("fs-extra");
const nodeFs = require("fs");
const { execFile } = require("child_process");
const { PYTHON_PATH } = require("../configs/env");

function runLocalWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "stt.py");

    console.log("pythonCmd:", PYTHON_PATH);
    console.log("scriptPath:", scriptPath);
    console.log("audioPath:", audioPath);
    console.log("python exists:", nodeFs.existsSync(PYTHON_PATH));
    console.log("script exists:", nodeFs.existsSync(scriptPath));
    console.log("audio exists:", nodeFs.existsSync(audioPath));

    execFile(
      PYTHON_PATH,
      [scriptPath, audioPath],
      {
        timeout: 120000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);

        if (error) {
          return reject(
            new Error(
              `execFile error: ${error.message}\nstdout: ${stdout}\nstderr: ${stderr}`,
            ),
          );
        }

        try {
          const parsed = JSON.parse(stdout);

          if (!parsed.success) {
            return reject(new Error(parsed.error || "Local whisper failed"));
          }

          resolve(parsed);
        } catch (parseError) {
          reject(
            new Error(
              `Invalid JSON from stt.py: ${stdout || stderr || parseError.message}`,
            ),
          );
        }
      },
    );
  });
}

async function transcribeAudio(filePath) {
  if (!nodeFs.existsSync(filePath)) {
    const error = new Error("Uploaded audio file not found on server");
    error.statusCode = 500;
    throw error;
  }

  const transcription = await runLocalWhisper(filePath);
  const text = transcription?.text?.trim() || "";

  await fs.remove(filePath);

  if (!text) {
    const error = new Error("Whisper returned empty text");
    error.statusCode = 400;
    error.publicMessage = "Cannot recognize speech";
    throw error;
  }

  return {
    transcription: text,
    language: transcription?.language || "unknown",
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  transcribeAudio,
};
