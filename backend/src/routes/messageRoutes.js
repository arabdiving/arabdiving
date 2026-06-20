const express = require("express");
const router = express.Router();
const { createMessage, listMessages, markRead, deleteMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.post("/", createMessage);
router.get("/", protect, adminOnly, listMessages);
router.put("/:id/read", protect, adminOnly, markRead);
router.delete("/:id", protect, adminOnly, deleteMessage);

module.exports = router;
