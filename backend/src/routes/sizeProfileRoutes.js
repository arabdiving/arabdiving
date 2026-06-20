const express = require("express");
const router = express.Router();
const { getMyProfile, saveMyProfile, listProfiles } = require("../controllers/sizeProfileController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, saveMyProfile);
router.get("/", protect, adminOnly, listProfiles);

module.exports = router;
