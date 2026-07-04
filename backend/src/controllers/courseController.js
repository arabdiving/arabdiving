const Course = require("../models/Course");

const SEED = [
  { title: "مقدمة للغوص — اكتشاف الغوص (PADI Discover Scuba Diving)", level: "try", agency: "PADI", price: 300, currency: "SAR", duration: "نصف يوم", description: "أول تجربة غوص بدون خبرة أو رخصة، تحت إشراف مدرّب في مياه ضحلة — آمنة تمامًا وممتعة.", includes: ["مدرّب خاص", "كامل المعدات", "غطسة تجريبية", "لا تحتاج خبرة سابقة"], order: 0 },
  { title: "مقدمة للغوص — اكتشاف الغوص (SDI Discover Scuba Diving)", level: "try", agency: "SDI", price: 300, currency: "SAR", duration: "نصف يوم", description: "تجربة الغوص الأولى مع SDI بدون رخصة، بإشراف مدرّب معتمد — بداية مثالية لعالم الغوص.", includes: ["مدرّب خاص", "كامل المعدات", "غطسة تجريبية", "لا تحتاج خبرة سابقة"], order: 1 },
  { title: "اكتشاف الغوص للأطفال (PADI Bubblemaker)", level: "kids", agency: "PADI", price: 900, currency: "SAR", duration: "حسب البرنامج", description: "مغامرة آمنة وممتعة للأطفال (من 8 سنوات) في مياه ضحلة تحت إشراف متخصص.", includes: ["مياه ضحلة آمنة", "مدرّب أطفال", "معدات بمقاسات الأطفال", "مهام ممتعة"], order: 2 },
  { title: "اكتشاف الغوص للأطفال (SDI Future Buddies)", level: "kids", agency: "SDI", price: 900, currency: "SAR", duration: "حسب البرنامج", description: "برنامج SDI لتعريف الأطفال بالغوص في بيئة آمنة وممتعة بإشراف مدرّب متخصص.", includes: ["مياه ضحلة آمنة", "مدرّب أطفال", "معدات بمقاسات الأطفال", "أنشطة تفاعلية"], order: 3 },
  { title: "غواص المياه المفتوحة (PADI Open Water Diver)", level: "open_water", agency: "PADI", price: 2200, currency: "SAR", duration: "3-4 أيام", description: "أول رخصة غوص دولية معتمدة — تتيح لك الغوص حتى عمق 18 مترًا حول العالم مع زميل.", includes: ["مواد تعليمية رقمية", "تدريب مياه محصورة", "4 غطسات مفتوحة", "شهادة PADI دولية", "أقصى عمق 18 مترًا"], order: 4 },
  { title: "غواص المياه المفتوحة (SDI Open Water Scuba Diver)", level: "open_water", agency: "SDI", price: 2200, currency: "SAR", duration: "3-4 أيام", description: "رخصة الغوص الأساسية من SDI — غوص مستقل حتى عمق 18 مترًا مع تدريب على كمبيوتر الغوص منذ البداية.", includes: ["مواد تعليمية رقمية", "تدريب مياه محصورة", "4 غطسات مفتوحة", "شهادة SDI دولية", "أقصى عمق 18 مترًا"], order: 5 },
  { title: "الغواص المتطوّر (PADI Advanced Open Water)", level: "advanced", agency: "PADI", price: 1800, currency: "SAR", duration: "2-3 أيام", description: "وسّع مهاراتك: غوص عميق وملاحة وتخصصات مغامرة — يرفع حدّ الغوص إلى عمق 30 مترًا.", includes: ["5 غطسات مغامرة", "غوص عميق وملاحة", "شهادة متقدمة", "أقصى عمق 30 مترًا"], order: 6 },
  { title: "الغواص المتطوّر (SDI Advanced Adventure Diver)", level: "advanced", agency: "SDI", price: 1800, currency: "SAR", duration: "2-3 أيام", description: "برنامج SDI المتقدّم: تخصّصات مغامرة تشمل الغوص العميق والملاحة — حتى عمق 30 مترًا.", includes: ["غطسات تخصّصية", "غوص عميق وملاحة", "شهادة متقدمة", "أقصى عمق 30 مترًا"], order: 7 },
  { title: "غواص الإنقاذ (PADI Rescue Diver)", level: "rescue", agency: "PADI", price: 2800, currency: "SAR", duration: "3-4 أيام", description: "تعلّم إدارة الطوارئ وإنقاذ نفسك والآخرين — نقطة تحوّل في مسار كل غوّاص.", includes: ["سيناريوهات إنقاذ", "إدارة الطوارئ", "الإسعافات الأولية مطلوبة", "شهادة Rescue"], order: 8 },
  { title: "غواص الإنقاذ (SDI Rescue Diver)", level: "rescue", agency: "SDI", price: 2800, currency: "SAR", duration: "3-4 أيام", description: "دورة الإنقاذ من SDI: مهارات الوقاية والاستجابة للطوارئ تحت الماء وعلى السطح.", includes: ["سيناريوهات إنقاذ", "إدارة الطوارئ", "الإسعافات الأولية مطلوبة", "شهادة Rescue"], order: 9 },
  { title: "مرشد الغوص (PADI Divemaster)", level: "divemaster", agency: "PADI", price: 5000, currency: "SAR", duration: "حسب البرنامج", description: "أول مستوى احترافي — قُد الغوصات وابدأ العمل في مجال الغوص.", includes: ["تدريب احترافي", "خبرة عملية موسّعة", "قيادة الغوصات", "شهادة Divemaster"], order: 10 },
  { title: "مرشد الغوص (SDI Divemaster)", level: "divemaster", agency: "SDI", price: 5000, currency: "SAR", duration: "حسب البرنامج", description: "المستوى الاحترافي الأول مع SDI — إعداد الغوّاص ليقود ويساعد في تدريب الآخرين.", includes: ["تدريب احترافي", "خبرة عملية موسّعة", "قيادة الغوصات", "شهادة Divemaster"], order: 11 },
];

const getCourses = async (req, res) => {
  try {
    const q = { active: true };
    if (req.query.level) q.level = req.query.level;
    // الكتالوج العام يعرض قوالب المنصة فقط؛ ?center=<id> يعرض كورسات مركز محدد
    if (req.query.center) q.center = req.query.center;
    else q.center = null;
    const courses = await Course.find(q).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const getCourseById = async (req, res) => {
  try {
    const c = await Course.findById(req.params.id).populate("center", "name slug city country badges tier whatsapp");
    if (!c) return res.status(404).json({ success: false, message: "الدورة غير موجودة" });
    // مراكز أخرى تقدم نفس القالب (لعرضها في صفحة التفاصيل)
    const tplId = c.template || (c.center ? null : c._id);
    const offeredBy = tplId
      ? await Course.find({ template: tplId, active: true }).populate("center", "name slug city tier").select("price currency center")
      : [];
    res.json({ success: true, course: c, offeredBy });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const createCourse = async (req, res) => { try { const c = await Course.create(req.body); res.status(201).json({ success: true, course: c }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
const updateCourse = async (req, res) => { try { const c = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!c) return res.status(404).json({ success: false, message: "غير موجودة" }); res.json({ success: true, course: c }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
const deleteCourse = async (req, res) => { try { await Course.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
const seedCourses = async (req, res) => {
  try { let created = 0, skipped = 0; for (const c of SEED) { const ex = await Course.findOne({ title: c.title }); if (ex) { skipped++; continue; } await Course.create(c); created++; } res.json({ success: true, created, skipped }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, seedCourses };
