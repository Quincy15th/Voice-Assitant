const chatService = require("../services/chatService");

async function chat(req, res, next) {
  try {
    const { message, resetHistory = false } = req.body;
    const result = await chatService.generateChatResponse(
      message,
      resetHistory,
    );
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chat,
};
