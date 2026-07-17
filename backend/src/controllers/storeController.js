const PartnerCenter = require("../models/PartnerCenter");
const Product = require("../models/Product");
const Booking = require("../models/Booking");
const Course = require("../models/Course");
const InstructorProfile = require("../models/InstructorProfile");
const { publicProfile, contactAllowed } = require("./instructorController");

const findMyCenter = (userId) => PartnerCenter.findOne({ owner: userId });

// تعقيم مركز للعرض العام — الواتساب يظهر فقط بموافقة المركز والمنصة معًا
function sanitizeCenter(center, allowed) {
  const o = center.toObject ? center.toObject() : { ...center };
  if (!allowed || o.showContact === false) o.whatsapp = "";
  delete o.team; // الفريق يُرسل مُعقّمًا على حدة
  return o;
}

// Public: partner page by slug + its active products AND courses + approved team.
const getStoreBySlug = async (req, res) => {
  try {
    const center = await PartnerCenter.findOne({ slug: req.params.slug, active: true });
    if (!center) return res.status(404).json({ success: false, message: "المتجر غير موجود" });
    const approvedIds = (center.team || []).filter((t) => t.status === "approved").map((t) => t.instructor);
    const [ownProducts, ownCourses, featProducts, featCourses, teamProfiles, allowed] = await Promise.all([
      Product.find({ center: center._id, active: true }).sort({ createdAt: -1 }),
      Course.find({ center: center._id, active: true }).sort({ order: 1, createdAt: -1 }),
      (center.featuredProducts && center.featuredProducts.length) ? Product.find({ _id: { $in: center.featuredProducts }, active: true }) : [],
      (center.featuredCourses && center.featuredCourses.length) ? Course.find({ _id: { $in: center.featuredCourses }, active: true }) : [],
      approvedIds.length ? InstructorProfile.find({ _id: { $in: approvedIds }, active: true }).populate("user", "name profileImage") : [],
      contactAllowed(),
    ]);
    const pMap = new Map(); [...ownProducts, ...featProducts].forEach((p) => pMap.set(String(p._id), p));
    const cMap = new Map(); [...ownCourses, ...featCourses].forEach((c) => cMap.set(String(c._id), c));
    res.json({
      success: true,
      center: sanitizeCenter(center, allowed),
      products: [...pMap.values()], courses: [...cMap.values()],
      team: teamProfiles.map((p) => publicProfile(p, allowed)),
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ─── المركز يعدّل صفحته: وصف/صورة/فيديو/واتساب/إظهار التواصل ─── */
const updateMyCenter = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز. تواصل مع الإدارة." });
    const b = req.body || {};
    if (typeof b.description === "string") center.description = b.description.slice(0, 1200);
    if (typeof b.image === "string") center.image = b.image.slice(0, 300);
    if (typeof b.video === "string") center.video = b.video.slice(0, 300);
    if (typeof b.whatsapp === "string") center.whatsapp = b.whatsapp.slice(0, 20);
    if (typeof b.showContact === "boolean") center.showContact = b.showContact;
    await center.save();
    res.json({ success: true, center });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ─── فريق المدربين — جهة المركز ─── */

// فريقي بكل الحالات (طلبات واردة + دعواتي المرسلة + المعتمدون)
const getMyTeam = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.json({ success: true, team: [] });
    const ids = (center.team || []).map((t) => t.instructor);
    const profiles = ids.length ? await InstructorProfile.find({ _id: { $in: ids } }).populate("user", "name profileImage") : [];
    const pMap = new Map(profiles.map((p) => [String(p._id), p]));
    const team = (center.team || []).map((t) => {
      const p = pMap.get(String(t.instructor));
      return p ? { instructor: publicProfile(p, true), status: t.status, at: t.at } : null;
    }).filter(Boolean);
    res.json({ success: true, team });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// المركز يدعو مدربًا
const inviteInstructor = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز." });
    const ins = await InstructorProfile.findOne({ _id: req.body.instructorId, active: true });
    if (!ins) return res.status(404).json({ success: false, message: "المدرب غير موجود" });
    const existing = (center.team || []).find((t) => String(t.instructor) === String(ins._id));
    if (existing) {
      if (existing.status === "approved") return res.status(409).json({ success: false, message: "المدرب ضمن فريقك بالفعل" });
      if (existing.status === "pending_instructor") return res.status(409).json({ success: false, message: "دعوتك السابقة ما زالت بانتظار رد المدرب" });
      // كان المدرب قد طلب الانضمام — دعوتك الآن تُعتبر موافقة
      existing.status = "approved"; existing.at = new Date();
      await center.save();
      return res.json({ success: true, status: "approved", message: "المدرب كان قد طلب الانضمام — تم الاعتماد ✅" });
    }
    center.team.push({ instructor: ins._id, status: "pending_instructor", at: new Date() });
    await center.save();
    res.json({ success: true, status: "pending_instructor", message: "أُرسلت الدعوة — بانتظار موافقة المدرب" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// المركز يرد على طلب مدرب (قبول/رفض) أو يزيله من الفريق
const respondToInstructor = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز." });
    const entry = (center.team || []).find((t) => String(t.instructor) === String(req.params.instructorId));
    if (!entry) return res.status(404).json({ success: false, message: "لا توجد علاقة مع هذا المدرب" });
    if (req.body.accept === true) {
      if (entry.status !== "pending_center") return res.status(400).json({ success: false, message: "لا يوجد طلب بانتظار ردك" });
      entry.status = "approved"; entry.at = new Date();
      await center.save();
      return res.json({ success: true, status: "approved" });
    }
    center.team = center.team.filter((t) => String(t.instructor) !== String(req.params.instructorId));
    await center.save();
    res.json({ success: true, status: "removed" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ─── كورسات الشريك: يضيفها من قوالب كتالوج المنصة ─── */

// قوالب الكتالوج المتاحة للشركاء (كورسات المنصة غير المرتبطة بمركز)
const getCourseTemplates = async (_req, res) => {
  try {
    const templates = await Course.find({ center: null, active: true }).sort({ order: 1 });
    res.json({ success: true, templates });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyCourses = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.json({ success: true, courses: [] });
    const courses = await Course.find({ center: center._id }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, courses });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// إضافة كورس من قالب: ينسخ محتوى المنصة المعتمد ويسمح للشريك بتحديد سعره وصورته فقط
const addMyCourseFromTemplate = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز. تواصل مع الإدارة." });
    const tpl = await Course.findOne({ _id: req.body.templateId, center: null, active: true });
    if (!tpl) return res.status(404).json({ success: false, message: "القالب غير موجود" });
    const exists = await Course.findOne({ center: center._id, template: tpl._id });
    if (exists) return res.status(409).json({ success: false, message: "هذا الكورس مضاف لصفحتك بالفعل" });
    const course = await Course.create({
      title: tpl.title, level: tpl.level, agency: tpl.agency,
      duration: tpl.duration, description: tpl.description, includes: tpl.includes,
      order: tpl.order, active: true,
      // ما يتحكم فيه الشريك:
      price: Number(req.body.price) || 0,
      currency: req.body.currency || tpl.currency,
      image: req.body.image || tpl.image || "",
      images: tpl.images || [],
      center: center._id, template: tpl._id,
    });
    res.status(201).json({ success: true, course });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// الشريك يعدّل سعره وعملته وصورته وحالة التفعيل فقط — المحتوى المعتمد ثابت من المنصة
const updateMyCourse = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز." });
    const course = await Course.findOne({ _id: req.params.id, center: center._id });
    if (!course) return res.status(404).json({ success: false, message: "الكورس غير موجود" });
    const allowed = ["price", "currency", "image", "active"];
    allowed.forEach((k) => { if (req.body[k] !== undefined) course[k] = req.body[k]; });
    await course.save();
    res.json({ success: true, course });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteMyCourse = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز." });
    await Course.deleteOne({ _id: req.params.id, center: center._id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyCenter = async (req, res) => {
  try { const center = await findMyCenter(req.user._id); res.json({ success: true, center: center || null }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyOrders = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.json({ success: true, orders: [], centerName: "" });
    const orders = await Booking.find({ center: center._id }).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, orders, centerName: center.name });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getMyProducts = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.json({ success: true, products: [] });
    const products = await Product.find({ center: center._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const createMyProduct = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك متجرًا. تواصل مع الإدارة." });
    const p = await Product.create({ ...req.body, center: center._id });
    res.status(201).json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateMyProduct = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك متجرًا." });
    const p = await Product.findOne({ _id: req.params.id, center: center._id });
    if (!p) return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    const body = { ...req.body }; delete body.center;
    Object.assign(p, body);
    await p.save();
    res.json({ success: true, product: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteMyProduct = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك متجرًا." });
    await Product.deleteOne({ _id: req.params.id, center: center._id });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const setMyFeatured = async (req, res) => {
  try {
    const center = await findMyCenter(req.user._id);
    if (!center) return res.status(403).json({ success: false, message: "لا تملك صفحة مركز. تواصل مع الإدارة." });
    if (!["gold", "platinum"].includes(center.tier)) return res.status(403).json({ success: false, message: "الانتقاء المميّز متاح للشركاء من الفئة الذهبية والبلاتينية فقط." });
    if (Array.isArray(req.body.featuredProducts)) center.featuredProducts = req.body.featuredProducts.slice(0, 50);
    if (Array.isArray(req.body.featuredCourses)) center.featuredCourses = req.body.featuredCourses.slice(0, 50);
    await center.save();
    res.json({ success: true, featuredProducts: center.featuredProducts, featuredCourses: center.featuredCourses });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = {
  setMyFeatured,
  getStoreBySlug, getMyCenter, getMyOrders, getMyProducts, createMyProduct, updateMyProduct, deleteMyProduct,
  getCourseTemplates, getMyCourses, addMyCourseFromTemplate, updateMyCourse, deleteMyCourse,
  updateMyCenter, getMyTeam, inviteInstructor, respondToInstructor,
};
