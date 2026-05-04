const historyService = require("../services/historyService");

function getHistory(req, res) {
  return res.json(historyService.getHistoryResponse());
}

function clearHistory(req, res) {
  historyService.resetHistory();
  return res.json({ message: "Conversation history cleared" });
}

module.exports = {
  getHistory,
  clearHistory,
};
