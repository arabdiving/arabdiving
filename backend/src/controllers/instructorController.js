const InstructorProfile = require("../models/InstructorProfile");

const AXES = ["planning", "strategies", "management", "engagement", "watermanship", "professionalism"];
const clamp5 = (v) => Math.max(1, Math.min(5, Number(v) || 0));

// أقوى محورين (يظهران علنًا) + أضعف محور (خاص)
function analyze(scores) {
  if (!scores) return { strengths: [], weakness: null };
  const entries = AXES.filter((a) => typeof scores[a] === "number" && scores[a] > 0)
    .map((a) => [a, scores[a]]);
  if (entries.length < 3) return { strengths: [], weakness: null };
  const sorted = [...entries].sort((x, y) => y[1] - x[1]);
  return { strengths: [sorted[0][0], sorted[1][0]], weakness: sorted[sorted.length - 1][0] };
}

// تعقيم البروفايل للعرض العام
function publicProfile(p) {
  const o = p.toObject ? p.toObject() : p;
  const { strengths, weakness } = analyze(o.fingerprint?.scores);
  return {
    _id: o._id,
    user: o.user, // populated: name, profileImage
    agency: o.agency, rank: o.rank, sinceYear: o.sinceYear,
    yearsExp: o.sinceYear ? Math.max(0, new Date().getFullYear() - o.sinceYear) : null,
    specialties: o.specialties || [], languages: o.languages || [],
    city: o.city, bio: o.bio, whatsapp: o.whatsapp || "",
    verified: !!o.verified,
    hasFingerprint: Boolean(o.fingerprint?.takenAt),
    fingerprint: o.fingerprint?.scores || null, // الرادار كامل علني (الأرقام) — القوة تُبرز والضعف يُفسَّر فقط لصاحبه
    strengths,
    weakness: o.showWeakness ? weakness : null,
  };
}

/* ── عام: قائمة المدربين (فلاتر: city, agency, specialty) ── */
const listInstructors = async (req, res) => {
  try {
    const q = { active: true };
    if (req.query.city) q.city = req.query.city;
    if (req.query.agency) q.agency = req.query.agency;
    if (req.query.specialty) q.specialties = req.query.specialty;
    const list = await InstructorProfile.find(q)
      .populate("user", "name profileImage")
      .sort({ verified: -1, createdAt: 1 });
    res.json({ success: true, instructors: list.map(publicProfile) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

/* ── عام: بروفايل مدرب ── */
const getInstructor = async (req, res) => {
  try {
    const p = await InstructorProfile.findById(req.params.id).populate("user", "name profileImage");
    if (!p || !p.active) return res.status(404).json({ success: false, message: "المدرب غير موجود" });
    res.json({ success: true, instructor: publicProfile(p) });
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
      agency: String(b.agency || "PADI").slice(0, 20),
      instructorNumber: String(b.instructorNumber || "").slice(0, 40),
      rank: String(b.rank || "").slice(0, 60),
      sinceYear: b.sinceYear ? Math.max(1960, Math.min(new Date().getFullYear(), Number(b.sinceYear))) : null,
      specialties: Array.isArray(b.specialties) ? b.specialties.slice(0, 20).map((s) => String(s).slice(0, 40)) : [],
      languages: Array.isArray(b.languages) ? b.languages.slice(0, 10).map((s) => String(s).slice(0, 30)) : ["العربية"],
      city: String(b.city || "").slice(0, 40),
      bio: String(b.bio || "").slice(0, 600),
      whatsapp: String(b.whatsapp || "").slice(0, 20),
      ...(typeof b.showWeakness === "boolean" ? { showWeakness: b.showWeakness } : {}),
      active: true,
    };
    const p = await InstructorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: fields, $setOnInsert: { user: req.user._id } },
      { upsert: true, new: true }
    );
    res.json({ success: true, profile: p });
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
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { listInstructors, getInstructor, getMyInstructorProfile, upsertMyInstructorProfile, saveFingerprint };
