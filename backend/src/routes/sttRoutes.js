const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { transcribe } = require("../controllers/sttController");

const router = express.Router();

router.post("/", upload.single("audio"), transcribe);

module.exports = router;
