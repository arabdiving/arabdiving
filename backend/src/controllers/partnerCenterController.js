const PartnerCenter = require("../models/PartnerCenter");

const BADGE_KEYS = ["womenStaff", "privateTrip", "family", "separateFacilities", "sanitizedGear", "technical", "ecoFriendly"];

// Public: list active centers, with optional filters.
// Query: city, q (name search), and badge flags (e.g. womenStaff=true).
const getPartnerCenters = async (req, res) => {
  try {
    const query = { active: true };
    if (req.query.city) query.city = req.query.city;
    if (req.query.q) query.name = { $regex: String(req.query.q).trim(), $options: "i" };
    for (const key of BADGE_KEYS) {
      if (req.query[key] === "true") query[`badges.${key}`] = true;
    }
    const centers = await PartnerCenter.find(query).sort({ tier: -1, rating: -1 });
    res.json({ success: true, count: centers.length, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPartnerCenterById = async (req, res) => {
  try {
    const center = await PartnerCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPartnerCenters, getPartnerCenterById };
