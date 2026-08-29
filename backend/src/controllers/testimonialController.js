const StoryTestimonial = require("../models/StoryTestimonial");

/* ── عام: زائر يرسل تجربته/شكواه ── */
const submit = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim().slice(0, 80);
    const message = String(req.body.message || "").trim().slice(0, 3000);
    if (!name || !message) return res.status(400).json({ success: false, message: "الاسم والرسالة مطلوبان" });

    const wantsPublic = req.body.wantsPublic === true || req.body.wantsPublic === "true";
    const doc = await StoryTestimonial.create({
      name,
      contact: String(req.body.contact || "").trim().slice(0, 120),
      brand: String(req.body.brand || "").trim().slice(0, 60),
      message,
      wantsPublic,
      // عام → بانتظار موافقة الإدارة | خاص → رسالة خاصة فقط
      status: wantsPublic ? "pending" : "private",
      page: String(req.body.page || "").slice(0, 120),
      fromUser: req.user?._id || undefined,
    });

    res.status(201).json({
      success: true,
      message: wantsPublic
        ? "وصلتنا تجربتك ✅ — ستُنشر للجميع بعد مراجعتها. شكرًا لمشاركتك!"
        : "وصلتنا رسالتك ✅ — سنطّلع عليها ونرد عليك إن تركت وسيلة تواصل. شكرًا لك!",
    });

    // 📧 أخطر الأدمن (بعد الرد)
    try {
      const { notifyAdminNewTestimonial } = require("../lib/notifyEmails");
      notifyAdminNewTestimonial(doc);
    } catch (e) { console.error("📧 إشعار تجربة:", e.message); }
    return;
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── عام: التجارب المعتمدة للعرض ── */
const listPublic = async (req, res) => {
  try {
    const q = { status: "approved", wantsPublic: true };
    if (req.query.brand) q.brand = req.query.brand;
    const items = await StoryTestimonial.find(q).sort({ createdAt: -1 }).limit(100)
      .select("name brand message createdAt"); // بلا وسيلة تواصل — خصوصية
    res.json({ success: true, testimonials: items });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── أدمن: كل التجارب ── */
const adminList = async (req, res) => {
  try {
    const items = await StoryTestimonial.find({}).sort({ createdAt: -1 }).limit(500);
    const order = { pending: 0, private: 1, approved: 2, hidden: 3 };
    const sorted = items.sort((a, b) => (order[a.status] ?? 4) - (order[b.status] ?? 4));
    res.json({
      success: true,
      pending: items.filter((i) => i.status === "pending").length,
      testimonials: sorted,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── أدمن: تغيير الحالة (نشر/إخفاء) ── */
const adminSetStatus = async (req, res) => {
  try {
    const t = await StoryTestimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: "غير موجود" });
    if (["pending", "approved", "private", "hidden"].includes(req.body.status)) t.status = req.body.status;
    await t.save();
    res.json({ success: true, status: t.status });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { submit, listPublic, adminList, adminSetStatus };
