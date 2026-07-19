const express = require("express");
const router = express.Router();
const {
  listSubscribers,
  stats,
  listCampaigns,
  createCampaign,
  sendCampaign,
  sendCustom,
  getSequence,
  updateSequence,
} = require("../controllers/emailAdminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// كل المسارات محميّة للمشرف فقط
router.use(protect, adminOnly);

router.get("/subscribers", listSubscribers);
router.get("/stats", stats);

router.get("/campaigns", listCampaigns);
router.post("/campaigns", createCampaign);
router.post("/campaigns/:id/send", sendCampaign);

router.post("/send-custom", sendCustom);

router.get("/sequence", getSequence);
router.put("/sequence", updateSequence);

module.exports = router;
