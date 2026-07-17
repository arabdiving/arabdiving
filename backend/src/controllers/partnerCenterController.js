const PartnerCenter = require("../models/PartnerCenter");
const InstructorProfile = require("../models/InstructorProfile");
const { publicProfile, contactAllowed } = require("./instructorController");

const BADGE_KEYS = ["womenStaff", "privateTrip", "family", "separateFacilities", "sanitizedGear", "technical", "ecoFriendly"];

// الواتساب يظهر فقط بموافقة المركز + مفتاح المنصة العام
function sanitize(center, allowed) {
  const o = center.toObject ? center.toObject() : { ...center };
  if (!allowed || o.showContact === false) o.whatsapp = "";
  delete o.team;
  return o;
}

// Public: list active centers, with optional filters.
// Query: city, q (name search), and badge flags (e.g. womenStaff=true).
const getPartnerCenters = async (req, res) => {
  try {
    const query = {};
    if (req.query.all !== "true") query.active = true;
    if (req.query.city) query.city = req.query.city;
    if (req.query.q) query.name = { $regex: String(req.query.q).trim(), $options: "i" };
    if (req.query.featured === "true") query.featuredOnHome = true;
    for (const key of BADGE_KEYS) {
      if (req.query[key] === "true") query[`badges.${key}`] = true;
    }
    const [centers, allowed] = await Promise.all([
      PartnerCenter.find(query).sort({ tier: -1, rating: -1 }),
      contactAllowed(),
    ]);
    res.json({ success: true, count: centers.length, data: centers.map((c) => sanitize(c, allowed)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPartnerCenterById = async (req, res) => {
  try {
    const [center, allowed] = await Promise.all([PartnerCenter.findById(req.params.id), contactAllowed()]);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    // فريق المدربين المعتمد (بموافقة الطرفين) — يظهر في صفحة المركز
    const approvedIds = (center.team || []).filter((t) => t.status === "approved").map((t) => t.instructor);
    const teamProfiles = approvedIds.length
      ? await InstructorProfile.find({ _id: { $in: approvedIds }, active: true }).populate("user", "name profileImage")
      : [];
    res.json({ success: true, center: sanitize(center, allowed), team: teamProfiles.map((p) => publicProfile(p, allowed)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePartnerCenter = async (req, res) => {
  try {
    const center = await PartnerCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    res.json({ success: true, data: center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePartnerCenter = async (req, res) => {
  try {
    const center = await PartnerCenter.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleFeaturedPartnerCenter = async (req, res) => {
  try {
    const center = await PartnerCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    center.featuredOnHome = !center.featuredOnHome;
    await center.save();
    res.json({ success: true, featuredOnHome: center.featuredOnHome });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleActivePartnerCenter = async (req, res) => {
  try {
    const center = await PartnerCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    center.active = (center.active === false);
    await center.save();
    res.json({ success: true, active: center.active });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  toggleActivePartnerCenter,
  getPartnerCenters,
  getPartnerCenterById,
  updatePartnerCenter,
  deletePartnerCenter,
  toggleFeaturedPartnerCenter,
};
