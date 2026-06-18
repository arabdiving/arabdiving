const express = require("express");
const router = express.Router();
const { sendDM, getConversation, listConversations, unreadCount } = require("../controllers/dmController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, listConversations);
router.get("/unread", protect, unreadCount);
router.get("/:userId", protect, getConversation);
router.post("/:userId", protect, sendDM);

module.exports = router;
