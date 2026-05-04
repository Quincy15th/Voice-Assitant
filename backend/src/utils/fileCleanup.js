const fs = require("fs-extra");

async function safeRemove(filePath) {
  try {
    if (filePath) {
      await fs.remove(filePath);
    }
  } catch (_) {}
}

module.exports = {
  safeRemove,
};
