const express = require("express");
const router = express.Router();
const { readSettings, updateSettings } = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/", readSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
