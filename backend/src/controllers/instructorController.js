const mongoose = require("mongoose");
const { sendInstructorDecisionEmail, sendFingerprintResultEmail, sendFitResultEmail, sendInstructorNewMessageEmail, notifyAdminNewInstructorApplication } = require("../lib/notifyEmails");
const InstructorProfile = require("../models/InstructorProfile");
const InstructorMessage = require("../models/InstructorMessage");
const PartnerCenter = require("../models/PartnerCenter");

// توليد سلاج من اسم المدرب (عربي أو لاتيني): «ابراهيم المكاوى» → «ابراهيم-المكاوى»
function slugifyName(name) {
  return String(name || "").trim()
    .replace(/[^؀-ۿa-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

// سلاج فريد لبروفايل: الاسم، وإن كان محجوزًا لمدرب آخر يُلحق برقم قصير
async function uniqueSlugFor(profileId, name) {
  const base = slugifyName(name);
  if (!base) return "";
  const clash = await InstructorProfile.findOne({ slug: base, _id: { $ne: profileId } }, "_id");
  return clash ? `${base}-${String(profileId).slice(-4)}` : base;
}

// إيجاد بروفايل بالسلاج (الاسم) أو بالمعرّف الرقمي — الروابط القديمة تبقى شغالة
async function findByIdOrSlug(idOrSlug) {
  if (mongoose.isValidObjectId(idOrSlug)) {
    const byId = await InstructorProfile.findById(idOrSlug);
    if (byId) return byId;
  }
  return InstructorProfile.findOne({ slug: idOrSlug });
}
const { getSettings } = require("./settingsController");

// المفتاح العام: هل التواصل المباشر مسموح على مستوى المنصة؟
async function contactAllowed() {
  try { const s = await getSettings(); return s.directContactEnabled !== false; }
  catch { return true; }
}

const AXES = ["planning", "strategies", "management", "engagement", "watermanship", "professionalism"];
const clamp5 = (v) => Math.max(1, Math.min(5, Number(v) || 0));

// إحداثيات مدن التدريب — تُملأ تلقائيًا في location عند اختيار المدينة (مصر + السعودية)
const CITY_COORDS = {
  // مصر
  "شرم الشيخ": { lat: 27.9158, lng: 34.3299 },
  "دهب":       { lat: 28.4913, lng: 34.5136 },
  "الغردقة":   { lat: 27.2579, lng: 33.8116 },
  "مرسى علم":  { lat: 25.0676, lng: 34.8790 },
  "الجونة":    { lat: 27.3949, lng: 33.6782 },
  "سفاجا":     { lat: 26.7517, lng: 33.9344 },
  "نويبع":     { lat: 29.0327, lng: 34.6672 },
  // السعودية — البحر الأحمر
  "جدة":       { lat: 21.4858, lng: 39.1925 },
  "ينبع":      { lat: 24.0895, lng: 38.0618 },
  "أملج":      { lat: 25.0209, lng: 37.2685 },
  "الوجه":     { lat: 26.2408, lng: 36.4632 },
  "ضبا":       { lat: 27.3494, lng: 35.6907 },
  "الليث":     { lat: 20.1500, lng: 40.2667 },
  "جزر فرسان": { lat: 16.7000, lng: 42.1167 },
  "نيوم":      { lat: 28.0000, lng: 35.2500 },
  // السعودية — الخليج العربي
  "الخبر":     { lat: 26.2794, lng: 50.2083 },
  "الجبيل":    { lat: 27.0174, lng: 49.6583 },
};

const FIT_VALUES = {
  level: ["beginner", "advanced"], pace: ["patient", "fast"], age: ["kids", "adults"],
  style: ["structured", "fun"], group: ["private", "group"], special: ["adaptive", "standard"],
};

// أقوى محورين (يظهران علنًا) + أضعف محور (خاص)
function analyze(scores) {
  if (!scores) return { strengths: [], weakness: null };
  const entries = AXES.filter((a) => typeof scores[a] === "number" && scores[a] > 0)
    .map((a) => [a, scores[a]]);
  if (entries.length < 3) return { strengths: [], weakness: null };
  const sorted = [...entries].sort((x, y) => y[1] - x[1]);
  return { strengths: [sorted[0][0], sorted[1][0]], weakness: sorted[sorted.length - 1][0] };
}

// تعقيم البروفايل للعرض العام — التواصل يظهر فقط إذا سمح المدرب والمنصة معًا
function publicProfile(p, showContactGlobal = true) {
  const o = p.toObject ? p.toObject() : p;
  const { strengths, weakness } = analyze(o.fingerprint?.scores);
  const contactVisible = showContactGlobal && o.showContact !== false;
  return {
    _id: o._id,
    slug: o.slug || "",
    user: o.user, // populated: name, profileImage
    agency: o.agency, rank: o.rank, sinceYear: o.sinceYear,
    yearsExp: o.sinceYear ? Math.max(0, new Date().getFullYear() - o.sinceYear) : null,
    specialties: o.specialties || [], languages: o.languages || [],
    country: o.country || "مصر",
    // الاعتماد المحلي: نعرض «موثّق محليًا» فقط (لا نكشف رقم الترخيص علنًا)
    localLicense: (() => {
      const la = o.localAccreditation || {};
      const has = la.hasLocalLicense || !!la.cdwsNumber || !!la.saudiLicense;
      if (!has) return null;
      return o.country === "السعودية"
        ? { label: "مرخّص من الاتحاد السعودي للرياضات البحرية والغوص", body: "الاتحاد السعودي" }
        : { label: "عضو غرفة الغوص المصرية (CDWS)", body: "CDWS" };
    })(),
    city: o.city, bio: o.bio,
    whatsapp: contactVisible ? (o.whatsapp || "") : "",
    email: contactVisible ? (o.email || "") : "",
    social: contactVisible ? (o.social || {}) : {},
    video: o.video || "",
    verified: !!o.verified,
    hasFingerprint: Boolean(o.fingerprint?.takenAt),
    fingerprint: o.fingerprint?.scores || null, // الرادار كامل علني (الأرقام) — القوة تُبرز والضعف يُفسَّر فقط لصاحبه
    strengths,
    weakness: o.showWeakness ? weakness : null,
    location: o.location?.lat ? o.location : null,
    fit: o.fit?.takenAt ? {
      level: o.fit.level, pace: o.fit.pace, age: o.fit.age,
      style: o.fit.style, group: o.fit.group, special: o.fit.special,
    } : null,
  };
}

/* ── عام: قائمة المدربين (فلاتر: city, agency, specialty) ── */
const listInstructors = async (req, res) => {
  try {
    // المعتمدون فقط (القديم بلا حقل الحالة يُعامل كمعتمد)
    const q = { active: true, applicationStatus: { $nin: ["pending", "rejected"] } };
    if (req.query.city) q.city = req.query.city;
    if (req.query.agency) q.agency = req.query.agency;
    if (req.query.specialty) q.specialties = req.query.specialty;
    const [list, allowed] = await Promise.all([
      InstructorProfile.find(q).populate("user", "name profileImage").sort({ verified: -1, createdAt: 1 }),
      contactAllowed(),
    ]);
    res.json({ success: true, instructors: list.map((p) => publicProfile(p, allowed)) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── عام: بروفايل مدرب بالاسم أو بالمعرّف (+ مراكزه المعتمدة) ── */
const getInstructor = async (req, res) => {
  try {
    const [found, allowed] = await Promise.all([findByIdOrSlug(req.params.id), contactAllowed()]);
    if (!found || !found.active || ["pending", "rejected"].includes(found.applicationStatus)) {
      return res.status(404).json({ success: false, message: "المدرب غير موجود" });
    }
    const p = await found.populate("user", "name profileImage");
    // تعبئة سلاج البروفايلات القديمة تلقائيًا عند أول زيارة
    if (!p.slug && p.user?.name) {
      p.slug = await uniqueSlugFor(p._id, p.user.name);
      if (p.slug) p.save().catch(() => {});
    }
    const centers = await PartnerCenter.find(
      { active: true, team: { $elemMatch: { instructor: p._id, status: "approved" } } },
      "name city image slug"
    );
    res.json({ success: true, instructor: { ...publicProfile(p, allowed), centers } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── خاص: بروفايلي (كامل — يشمل مجال التطوير) ── */
const getMyInstructorProfile = async (req, res) => {
  try {
    const p = await InstructorProfile.findOne({ user: req.user._id });
    if (!p) return res.json({ success: true, profile: null });
    const { strengths, weakness } = analyze(p.fingerprint?.scores);
    res.json({ success: true, profile: { ...p.toObject(), strengths, weakness } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── خاص: إنشاء/تحديث بيانات البروفايل ── */
const upsertMyInstructorProfile = async (req, res) => {
  try {
    const b = req.body || {};
    const fields = {
      agency: String(b.agency || "").slice(0, 20), // بلا افتراضي — الحياد أولًا
      instructorNumber: String(b.instructorNumber || "").slice(0, 40),
      rank: String(b.rank || "").slice(0, 60),
      sinceYear: b.sinceYear ? Math.max(1960, Math.min(new Date().getFullYear(), Number(b.sinceYear))) : null,
      specialties: Array.isArray(b.specialties) ? b.specialties.slice(0, 20).map((s) => String(s).slice(0, 40)) : [],
      languages: Array.isArray(b.languages) ? b.languages.slice(0, 10).map((s) => String(s).slice(0, 30)) : ["العربية"],
      country: ["مصر", "السعودية"].includes(b.country) ? b.country : "مصر",
      city: String(b.city || "").slice(0, 40),
      localAccreditation: {
        cdwsNumber:      String(b.localAccreditation?.cdwsNumber || "").slice(0, 40),
        saudiLicense:    String(b.localAccreditation?.saudiLicense || "").slice(0, 40),
        hasLocalLicense: !!b.localAccreditation?.hasLocalLicense,
      },
      bio: String(b.bio || "").slice(0, 600),
      whatsapp: String(b.whatsapp || "").slice(0, 20),
      email: String(b.email || "").slice(0, 120),
      social: {
        facebook:  String(b.social?.facebook || "").slice(0, 300),
        instagram: String(b.social?.instagram || "").slice(0, 300),
        tiktok:    String(b.social?.tiktok || "").slice(0, 300),
        youtube:   String(b.social?.youtube || "").slice(0, 300),
        x:         String(b.social?.x || "").slice(0, 300),
        linkedin:  String(b.social?.linkedin || "").slice(0, 300),
      },
      video: String(b.video || "").slice(0, 300),
      // صور الكارنيه (وش وضهر — حتى 8 صور لأكثر من كارنيه) — للإدارة فقط
      ...(Array.isArray(b.cardImages) ? { cardImages: b.cardImages.slice(0, 8).map((u) => String(u).slice(0, 300)) } : {}),
      ...(typeof b.showWeakness === "boolean" ? { showWeakness: b.showWeakness } : {}),
      ...(typeof b.showContact === "boolean" ? { showContact: b.showContact } : {}),
      active: true,
    };
    // المرفوض الذي يعدّل صوره ويحفظ يعود لطابور المراجعة تلقائيًا
    const existing = await InstructorProfile.findOne({ user: req.user._id }, "applicationStatus");
    if (existing?.applicationStatus === "rejected" && Array.isArray(b.cardImages) && b.cardImages.length) {
      fields.applicationStatus = "pending";
    }
    // موقع الخريطة: تلقائي من المدينة (أو إحداثيات صريحة إن أُرسلت)
    if (b.location?.lat && b.location?.lng) {
      fields.location = { lat: Number(b.location.lat), lng: Number(b.location.lng) };
    } else if (CITY_COORDS[fields.city]) {
      fields.location = CITY_COORDS[fields.city];
    }
    const p = await InstructorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: fields, $setOnInsert: { user: req.user._id } },
      { upsert: true, new: true }
    );
    // سلاج بالاسم للرابط: /instructors/اسم-المدرب
    if (!p.slug && req.user.name) {
      const slug = await uniqueSlugFor(p._id, req.user.name);
      if (slug) { p.slug = slug; await p.save(); }
    }
    res.json({ success: true, profile: p });

    // 📧 بعد الرد: أخطر الأدمن أول مرة يكتمل فيها الطلب (صور كارنيه + قيد المراجعة + لم يُشعَر بعد)
    // لا يعتمد على «أول إنشاء» — يضمن الإرسال حتى لو رفع الكارنيه في حفظة لاحقة.
    const isPending = (p.applicationStatus || "pending") === "pending";
    if (isPending && (p.cardImages || []).length && !p.applicationNotifiedAt) {
      try {
        await InstructorProfile.updateOne({ _id: p._id }, { $set: { applicationNotifiedAt: new Date() } });
        notifyAdminNewInstructorApplication(req.user, p);
        console.log(`📧 إشعار طلب مدرب جديد: ${req.user.email}`);
      } catch (e) { console.error("📧 إشعار طلب مدرب:", e.message); }
    }
    return;
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── خاص: حفظ بصمة المدرب (نتائج الاستبيان) ── */
const saveFingerprint = async (req, res) => {
  try {
    const s = req.body?.scores || {};
    const scores = {};
    AXES.forEach((a) => { scores[a] = clamp5(s[a]); });
    const p = await InstructorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { fingerprint: { scores, takenAt: new Date() } }, $setOnInsert: { user: req.user._id } },
      { upsert: true, new: true }
    );
    const { strengths, weakness } = analyze(scores);
    res.json({ success: true, fingerprint: p.fingerprint, strengths, weakness });

    // 📧 بعد الرد: نتيجة البصمة كاملة على إيميل المدرب (المجال الأضعف يبقى بينه وبين بريده)
    try { sendFingerprintResultEmail(req.user, scores, strengths, weakness); }
    catch (e) { console.error("📧 بصمة:", e.message); }
    return;
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── خاص: حفظ «من يناسبني؟» (الاختيارات القسرية) ── */
const saveFit = async (req, res) => {
  try {
    const b = req.body || {};
    const fit = { takenAt: new Date() };
    let valid = 0;
    Object.entries(FIT_VALUES).forEach(([k, allowed]) => {
      if (allowed.includes(b[k])) { fit[k] = b[k]; valid += 1; }
    });
    if (valid < Object.keys(FIT_VALUES).length) {
      return res.status(400).json({ success: false, message: "أجب على كل الاختيارات — كل اختيار له ثمن، وهذا سر صدقه" });
    }
    const p = await InstructorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { fit }, $setOnInsert: { user: req.user._id } },
      { upsert: true, new: true }
    );
    res.json({ success: true, fit: p.fit });

    // 📧 بعد الرد: خلاصة «من يناسبني» على إيميل المدرب
    try { sendFitResultEmail(req.user, fit); }
    catch (e) { console.error("📧 ملاءمة:", e.message); }
    return;
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ═══ عضوية المدرب في مراكز الغوص — بموافقة الطرفين ═══ */

// بروفايلي المدرب (يجب أن يكون موجودًا قبل أي طلب عضوية)
async function myProfile(userId) { return InstructorProfile.findOne({ user: userId, active: true }); }

/* ── خاص: مراكزي (كل الحالات: معتمد / بانتظار المركز / دعوة بانتظاري) ── */
const getMyCenters = async (req, res) => {
  try {
    const me = await myProfile(req.user._id);
    if (!me) return res.json({ success: true, memberships: [] });
    const centers = await PartnerCenter.find(
      { team: { $elemMatch: { instructor: me._id } } },
      "name city image slug team"
    );
    const memberships = centers.map((c) => {
      const entry = c.team.find((t) => String(t.instructor) === String(me._id));
      return { center: { _id: c._id, name: c.name, city: c.city, image: c.image, slug: c.slug }, status: entry?.status, at: entry?.at };
    });
    res.json({ success: true, memberships });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── خاص: المدرب يطلب الانضمام لمركز ── */
const requestJoinCenter = async (req, res) => {
  try {
    const me = await myProfile(req.user._id);
    if (!me) return res.status(403).json({ success: false, message: "أنشئ بروفايلك كمدرب أولًا" });
    const center = await PartnerCenter.findById(req.params.centerId);
    if (!center || !center.active) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    const existing = (center.team || []).find((t) => String(t.instructor) === String(me._id));
    if (existing) {
      if (existing.status === "approved") return res.status(409).json({ success: false, message: "أنت بالفعل ضمن فريق هذا المركز" });
      if (existing.status === "pending_center") return res.status(409).json({ success: false, message: "طلبك السابق ما زال بانتظار موافقة المركز" });
      // كان المركز قد دعاه — طلبه الآن يُعتبر قبولًا للدعوة
      existing.status = "approved"; existing.at = new Date();
      await center.save();
      return res.json({ success: true, status: "approved", message: "المركز كان قد دعاك — تم الاعتماد ✅" });
    }
    center.team.push({ instructor: me._id, status: "pending_center", at: new Date() });
    await center.save();
    res.json({ success: true, status: "pending_center", message: "أُرسل طلبك — بانتظار موافقة المركز" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── خاص: المدرب يرد على دعوة مركز (قبول/رفض) أو يغادر/يلغي طلبه ── */
const respondToCenter = async (req, res) => {
  try {
    const me = await myProfile(req.user._id);
    if (!me) return res.status(403).json({ success: false, message: "أنشئ بروفايلك كمدرب أولًا" });
    const center = await PartnerCenter.findById(req.params.centerId);
    if (!center) return res.status(404).json({ success: false, message: "المركز غير موجود" });
    const entry = (center.team || []).find((t) => String(t.instructor) === String(me._id));
    if (!entry) return res.status(404).json({ success: false, message: "لا توجد علاقة بينك وبين هذا المركز" });
    if (req.body.accept === true) {
      if (entry.status !== "pending_instructor") return res.status(400).json({ success: false, message: "لا توجد دعوة بانتظار ردك" });
      entry.status = "approved"; entry.at = new Date();
      await center.save();
      return res.json({ success: true, status: "approved" });
    }
    // رفض الدعوة أو إلغاء الطلب أو مغادرة الفريق — كلها إزالة للعلاقة
    center.team = center.team.filter((t) => String(t.instructor) !== String(me._id));
    await center.save();
    res.json({ success: true, status: "removed" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ═══ إدارة: الموافقة المبدئية على طلبات المدربين ═══ */

// أدمن: كل الطلبات مع صور الكارنيه (الأحدث أولًا، المعلقة في الصدارة)
const adminListApplications = async (req, res) => {
  try {
    const list = await InstructorProfile.find({})
      .populate("user", "name email profileImage")
      .sort({ createdAt: -1 });
    const order = { pending: 0, rejected: 1, approved: 2 };
    const apps = list
      .map((p) => ({
        _id: p._id,
        slug: p.slug || "",
        user: p.user,
        agency: p.agency, instructorNumber: p.instructorNumber, rank: p.rank,
        sinceYear: p.sinceYear, city: p.city,
        cardImages: p.cardImages || [],
        applicationStatus: p.applicationStatus || "approved", // القديم بلا حقل = معتمد
        verified: !!p.verified,
        createdAt: p.createdAt,
      }))
      .sort((a, b) => (order[a.applicationStatus] ?? 3) - (order[b.applicationStatus] ?? 3));
    res.json({ success: true, applications: apps });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// أدمن: موافقة مبدئية / رفض / توثيق
const adminSetApplicationStatus = async (req, res) => {
  try {
    const p = await InstructorProfile.findById(req.params.id).populate("user", "name email");
    if (!p) return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    const prevStatus = p.applicationStatus;
    if (["pending", "approved", "rejected"].includes(req.body.status)) p.applicationStatus = req.body.status;
    if (typeof req.body.verified === "boolean") p.verified = req.body.verified;
    await p.save();
    res.json({ success: true, applicationStatus: p.applicationStatus, verified: p.verified });

    // 📧 بعد الرد: أخطر المدرب بالقرار (فقط عند تغيّر الحالة إلى موافقة/رفض)
    if (p.user?.email && p.applicationStatus !== prevStatus && ["approved", "rejected"].includes(p.applicationStatus)) {
      try { sendInstructorDecisionEmail(p.user, p.applicationStatus, p.slug || String(p._id)); }
      catch (e) { console.error("📧 قرار مدرب:", e.message); }
    }
    return;
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ═══ رسائل «راسلني عبر الموقع» ═══ */

// عام: زائر يرسل رسالة لمدرب (لا يتطلب تسجيل دخول)
const sendMessageToInstructor = async (req, res) => {
  try {
    const ins = await findByIdOrSlug(req.params.id);
    if (!ins || !ins.active) return res.status(404).json({ success: false, message: "المدرب غير موجود" });
    const name = String(req.body.name || "").trim().slice(0, 80);
    const message = String(req.body.message || "").trim().slice(0, 1500);
    const contact = String(req.body.contact || "").trim().slice(0, 120);
    if (!name || !message) return res.status(400).json({ success: false, message: "الاسم والرسالة مطلوبان" });
    await InstructorMessage.create({ instructor: ins._id, name, contact, message, fromUser: req.user?._id || undefined });
    res.status(201).json({ success: true, message: "وصلت رسالتك للمدرب ✅ — سيرد عليك عبر وسيلة التواصل التي تركتها" });

    // 📧 بعد الرد: أخطر المدرب بالبريد بوصول رسالة جديدة
    try {
      const owner = await ins.populate("user", "name email");
      if (owner.user?.email) sendInstructorNewMessageEmail(owner.user, { name, contact, message });
    } catch (e) { console.error("📧 إشعار رسالة مدرب:", e.message); }
    return;
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// خاص: صندوق وارد المدرب
const getMyMessages = async (req, res) => {
  try {
    const me = await myProfile(req.user._id);
    if (!me) return res.json({ success: true, messages: [], unread: 0 });
    const messages = await InstructorMessage.find({ instructor: me._id }).sort({ createdAt: -1 }).limit(200);
    const unread = messages.filter((m) => m.status === "new").length;
    res.json({ success: true, messages, unread });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// خاص: تعليم رسالة كمقروءة
const markMessageRead = async (req, res) => {
  try {
    const me = await myProfile(req.user._id);
    if (!me) return res.status(403).json({ success: false, message: "لا تملك بروفايل مدرب" });
    await InstructorMessage.updateOne({ _id: req.params.msgId, instructor: me._id }, { $set: { status: "read" } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = {
  listInstructors, getInstructor, getMyInstructorProfile, upsertMyInstructorProfile, saveFingerprint, saveFit,
  getMyCenters, requestJoinCenter, respondToCenter, publicProfile, contactAllowed,
  sendMessageToInstructor, getMyMessages, markMessageRead,
  adminListApplications, adminSetApplicationStatus,
};
