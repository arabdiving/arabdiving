const express = require("express");
const router = express.Router();
const { getContent, updateContent } = require("../controllers/contentController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/:page", getContent);
router.put("/:page", protect, adminOnly, updateContent);

module.exports = router;
