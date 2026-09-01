const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  adminUpdateUser,
  createUser,
  deleteUser,
  getAllPosts,
  adminDeletePost,
  adminDeleteComment,
  seedDiveSites,
} = require("../controllers/adminController");
const { uploadImage } = require("../controllers/uploadController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const DiveSite = require("../models/DiveSite");
const PartnerCenter = require("../models/PartnerCenter");
const User = require("../models/User");

// Everything here requires an authenticated admin.
router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id", adminUpdateUser);

// Image upload (returns Cloudinary URL)
router.post("/upload", upload.single("image"), uploadImage);

// Moderation
router.get("/posts", getAllPosts);
router.delete("/posts/:id", adminDeletePost);
router.delete("/comments/:id", adminDeleteComment);

// Dive sites management
router.post("/dive-sites/seed-defaults", seedDiveSites);

router.post("/dive-sites", async (req, res) => {
  try {
    const diveSite = await DiveSite.create(req.body);
    res.status(201).json({ success: true, diveSite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/dive-sites/:id", async (req, res) => {
  try {
    const diveSite = await DiveSite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!diveSite) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    res.json({ success: true, diveSite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/dive-sites/:id", async (req, res) => {
  try {
    const diveSite = await DiveSite.findByIdAndDelete(req.params.id);
    if (!diveSite) return res.status(404).json({ success: false, message: "الموقع غير موجود" });
    res.json({ success: true, message: "تم حذف الموقع" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Partner centers management
const SEED_CENTERS = [
  { name: "نجمة البحر للغوص", city: "شرم الشيخ", description: "مركز فاخر متخصص في تجارب العائلات والسيدات، بطاقم نسائي ومرافق مستقلة.", priceFrom: 240, currency: "$", rating: 4.9, reviewsCount: 128, tier: "platinum", badges: { womenStaff: true, privateTrip: true, family: true, separateFacilities: true, sanitizedGear: true, technical: false, ecoFriendly: true } },
  { name: "أعماق مرسى علم", city: "مرسى علم", description: "رحلات هادئة لمشاهدة الدلافين والسلاحف، مثالية للعائلات والمبتدئين.", priceFrom: 200, currency: "$", rating: 4.7, reviewsCount: 86, tier: "gold", badges: { womenStaff: true, privateTrip: false, family: true, separateFacilities: true, sanitizedGear: true, technical: false, ecoFriendly: true } },
  { name: "بلو ريف - دهب", city: "دهب", description: "مركز متكامل للغوص الترفيهي والتقني مع تدريب على النيتروكس وخلط الغازات.", priceFrom: 180, currency: "$", rating: 4.6, reviewsCount: 64, tier: "gold", badges: { womenStaff: false, privateTrip: true, family: true, separateFacilities: false, sanitizedGear: true, technical: true, ecoFriendly: true } },
  { name: "مركز الغوص الملكي", city: "الغردقة", description: "رحلات قوارب يومية ومعدات حديثة، مع باقات خاصة للعائلات الخليجية.", priceFrom: 160, currency: "$", rating: 4.5, reviewsCount: 142, tier: "silver", badges: { womenStaff: false, privateTrip: true, family: true, separateFacilities: true, sanitizedGear: true, technical: false, ecoFriendly: false } },
];


async function resolveOwner(body) {
  if (typeof body.ownerEmail === "string") {
    const email = body.ownerEmail.trim().toLowerCase();
    delete body.ownerEmail;
    if (email) { const u = await User.findOne({ email }); body.owner = u ? u._id : null; }
    else body.owner = null;
  }
  return body;
}

router.post("/partner-centers/seed-defaults", async (req, res) => {
  try {
    let created = 0, skipped = 0;
    for (const c of SEED_CENTERS) {
      const exists = await PartnerCenter.findOne({ name: c.name });
      if (exists) { skipped++; continue; }
      await PartnerCenter.create(c);
      created++;
    }
    res.json({ success: true, created, skipped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/partner-centers", async (req, res) => {
  try {
    await resolveOwner(req.body);
    const center = await PartnerCenter.create(req.body);
    res.status(201).json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/partner-centers/:id", async (req, res) => {
  try {
    await resolveOwner(req.body);
    const center = await PartnerCenter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/partner-centers/:id", async (req, res) => {
  try {
    const center = await PartnerCenter.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    res.json({ success: true, message: "تم حذف المركز" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/admin/notifications ──────────────────────────
// إشعارات الأدمن المرئية (لا تعتمد على البريد): أعداد ما يحتاج انتباهًا.
const InstructorProfile = require("../models/InstructorProfile");
const Booking = require("../models/Booking");
const StoryTestimonial = require("../models/StoryTestimonial");
const { getSettings } = require("../controllers/settingsController");
router.get("/notifications", async (req, res) => {
  try {
    const s = await getSettings();
    // «حجوزات جديدة» = التي وصلت بعد آخر اطّلاع للأدمن (تُصفّر عند فتح صفحة الحجوزات)
    const bookingsSince = s.adminBookingsSeenAt ? { createdAt: { $gt: s.adminBookingsSeenAt } } : {};
    const [pendingInstructors, newBookings, totalBookings, pendingTestimonials] = await Promise.all([
      InstructorProfile.countDocuments({ active: true, applicationStatus: "pending" }),
      Booking.countDocuments(bookingsSince),
      Booking.countDocuments({}),
      StoryTestimonial.countDocuments({ status: "pending" }),
    ]);
    // آخر 5 طلبات مدربين قيد المراجعة (للعرض السريع)
    const recentInstructors = await InstructorProfile.find({ active: true, applicationStatus: "pending" })
      .populate("user", "name email").sort({ createdAt: -1 }).limit(5)
      .select("user agency city createdAt cardImages");
    res.json({
      success: true,
      counts: {
        pendingInstructors,   // طلبات مدربين قيد المراجعة
        newBookings,          // حجوزات بانتظار التأكيد
        pendingTestimonials,  // تجارب بانتظار النشر
        total: pendingInstructors + newBookings + pendingTestimonials,
      },
      recentInstructors: recentInstructors.map((p) => ({
        _id: p._id, name: p.user?.name || "—", email: p.user?.email || "",
        agency: p.agency, city: p.city, cards: (p.cardImages || []).length, at: p.createdAt,
      })),
      totalBookings,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/admin/notifications/seen/bookings — يصفّر تنبيه الحجوزات (يُستدعى عند فتح صفحة الحجوزات)
router.post("/notifications/seen/bookings", async (req, res) => {
  try {
    const s = await getSettings();
    s.adminBookingsSeenAt = new Date();
    await s.save();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
