const express = require("express");
const router = express.Router();
const { createChildProfile, listChildProfiles } = require("../controllers/childProfileController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Public create (parents may not be logged in during check-in).
router.post("/", createChildProfile);
// Admin list.
router.get("/", protect, adminOnly, listChildProfiles);

module.exports = router;
