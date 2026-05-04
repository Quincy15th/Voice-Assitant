let conversationHistory = [];

function resetHistory() {
  conversationHistory = [];
}

function getHistory() {
  return conversationHistory;
}

function addMessage(role, content) {
  conversationHistory.push({ role, content });

  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }
}

function getHistoryResponse() {
  return {
    history: conversationHistory,
    length: conversationHistory.length,
  };
}

module.exports = {
  resetHistory,
  getHistory,
  addMessage,
  getHistoryResponse,
};
