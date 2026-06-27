const express = require("express");
const router = express.Router();
const {
  getPartnerCenters,
  getPartnerCenterById,
  updatePartnerCenter,
  deletePartnerCenter,
  toggleFeaturedPartnerCenter,
} = require("../controllers/partnerCenterController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/", getPartnerCenters);
router.get("/:id", getPartnerCenterById);
router.put("/:id", protect, adminOnly, updatePartnerCenter);
router.delete("/:id", protect, adminOnly, deletePartnerCenter);
router.patch("/:id/toggle-featured", protect, adminOnly, toggleFeaturedPartnerCenter);

module.exports = router;
