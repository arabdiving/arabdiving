const express = require("express");
const router = express.Router();
const { getPartnerCenters, getPartnerCenterById } = require("../controllers/partnerCenterController");

router.get("/", getPartnerCenters);
router.get("/:id", getPartnerCenterById);

module.exports = router;
