const Subscriber = require("../models/Subscriber");
const EmailCampaign = require("../models/EmailCampaign");
const EmailSequence = require("../models/EmailSequence");
const { sendMail, isDryRun } = require("../lib/mailer");
const { build } = require("../lib/emailTemplates");

// يبني فلتر Mongo من إعدادات جمهور الحملة (المؤكَّدون فقط)
function audienceQuery(audience = {}) {
  const q = { status: "confirmed" };
  if (audience.role && audience.role !== "all") q.role = audience.role;
  if (audience.locale && audience.locale !== "all") q.locale = audience.locale;
  if (audience.tag) q.tags = audience.tag;
  return q;
}

// تأخير بسيط لتفادي حظر مزوّد SMTP (throttling)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── GET /api/email-admin/subscribers ────────────────────────
const listSubscribers = async (req, res) => {
  try {
    const { status, role, q, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (role) query.role = role;
    if (q) query.$or = [{ email: new RegExp(q, "i") }, { name: new RegExp(q, "i") }];

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Subscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Subscriber.countDocuments(query),
    ]);
    res.json({ success: true, total, page: Number(page), data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/email-admin/stats ──────────────────────────────
const stats = async (req, res) => {
  try {
    const [total, confirmed, pending, unsubscribed, instructors, trainees] = await Promise.all([
      Subscriber.countDocuments({}),
      Subscriber.countDocuments({ status: "confirmed" }),
      Subscriber.countDocuments({ status: "pending" }),
      Subscriber.countDocuments({ status: "unsubscribed" }),
      Subscriber.countDocuments({ status: "confirmed", role: "instructor" }),
      Subscriber.countDocuments({ status: "confirmed", role: "trainee" }),
    ]);
    res.json({
      success: true,
      dryRun: isDryRun(),
      data: { total, confirmed, pending, unsubscribed, instructors, trainees },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/email-admin/campaigns ──────────────────────────
const listCampaigns = async (req, res) => {
  try {
    const items = await EmailCampaign.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/email-admin/campaigns ─────────────────────────
// إنشاء حملة (مسودّة)
const createCampaign = async (req, res) => {
  try {
    const { title, subject, preheader = "", html, audience = {} } = req.body;
    if (!title || !subject || !html) {
      return res.status(400).json({ success: false, message: "العنوان الداخلي وعنوان الإيميل والمحتوى مطلوبة" });
    }
    const campaign = await EmailCampaign.create({
      title, subject, preheader, html, audience,
      createdBy: req.user?._id,
    });
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/email-admin/campaigns/:id/send ────────────────
// إرسال النشرة الجماعية للجمهور المطابق (المؤكَّدون فقط)
const sendCampaign = async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: "الحملة غير موجودة" });
    if (campaign.status === "sending") {
      return res.status(400).json({ success: false, message: "الحملة قيد الإرسال بالفعل" });
    }

    const recipients = await Subscriber.find(audienceQuery(campaign.audience));
    campaign.status = "sending";
    campaign.stats.recipients = recipients.length;
    campaign.stats.sent = 0;
    campaign.stats.failed = 0;
    await campaign.save();

    // نرد فوراً ونكمل الإرسال في الخلفية
    res.json({
      success: true,
      message: `بدأ الإرسال إلى ${recipients.length} مشترك.`,
      recipients: recipients.length,
      dryRun: isDryRun(),
    });

    let sent = 0, failed = 0;
    for (const sub of recipients) {
      const html = build({ subscriber: sub, html: campaign.html });
      const r = await sendMail({ to: sub.email, subject: campaign.subject, html });
      if (r.ok) {
        sent++;
        sub.lastSentAt = new Date();
        sub.sendCount = (sub.sendCount || 0) + 1;
        await sub.save();
      } else {
        failed++;
      }
      await sleep(120); // ~8 رسائل/ثانية كحد أقصى
    }
    campaign.stats.sent = sent;
    campaign.stats.failed = failed;
    campaign.status = failed && !sent ? "failed" : "sent";
    campaign.sentAt = new Date();
    await campaign.save();
    console.log(`📣 حملة "${campaign.title}": أُرسل ${sent}، فشل ${failed}`);
  } catch (error) {
    console.error("sendCampaign error:", error.message);
  }
};

// ── POST /api/email-admin/send-custom ───────────────────────
// إرسال إيميل مخصّص لمشترك واحد (يدعم متغيّرات {{name}})
const sendCustom = async (req, res) => {
  try {
    const { email, subject, html } = req.body;
    if (!email || !subject || !html) {
      return res.status(400).json({ success: false, message: "البريد والعنوان والمحتوى مطلوبة" });
    }
    const sub = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (!sub) return res.status(404).json({ success: false, message: "المشترك غير موجود" });
    if (sub.status === "unsubscribed") {
      return res.status(400).json({ success: false, message: "هذا المشترك ألغى اشتراكه — لا يجوز الإرسال إليه" });
    }
    const finalHtml = build({ subscriber: sub, html });
    const r = await sendMail({ to: sub.email, subject, html: finalHtml });
    if (!r.ok) return res.status(502).json({ success: false, message: r.error });
    return res.json({ success: true, message: "تم الإرسال", dryRun: !!r.dryRun });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/email-admin/sequence ───────────────────────────
const getSequence = async (req, res) => {
  try {
    let seq = await EmailSequence.findOne({ key: "welcome" });
    if (!seq) seq = await EmailSequence.create({ key: "welcome", steps: [] });
    res.json({ success: true, data: seq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/email-admin/sequence ───────────────────────────
// تحديث خطوات تسلسل الترحيب
const updateSequence = async (req, res) => {
  try {
    const { enabled, steps } = req.body;
    let seq = await EmailSequence.findOne({ key: "welcome" });
    if (!seq) seq = new EmailSequence({ key: "welcome" });
    if (typeof enabled === "boolean") seq.enabled = enabled;
    if (Array.isArray(steps)) {
      seq.steps = steps
        .map((s, i) => ({
          order: s.order ?? i + 1,
          delayHours: Number(s.delayHours) || 0,
          subject: s.subject,
          html: s.html,
          role: s.role || "all",
          active: s.active !== false,
        }))
        .sort((a, b) => a.order - b.order);
    }
    await seq.save();
    res.json({ success: true, data: seq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  listSubscribers,
  stats,
  listCampaigns,
  createCampaign,
  sendCampaign,
  sendCustom,
  getSequence,
  updateSequence,
};
