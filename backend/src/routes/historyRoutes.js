const express = require("express");
const {
  getHistory,
  clearHistory,
} = require("../controllers/historyController");

const router = express.Router();

router.get("/", getHistory);
router.delete("/", clearHistory);

module.exports = router;
