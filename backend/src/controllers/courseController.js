const Course = require("../models/Course");

const SEED = [
  { title: "جرّب الغوص (Discover Scuba)", level: "try", agency: "PADI", price: 300, currency: "SAR", duration: "نصف يوم", description: "أول تجربة غوص بدون خبرة أو رخصة — تحت إشراف مدرّب، آمنة تمامًا.", includes: ["مدرّب خاص", "كامل المعدات", "غطسة في مياه ضحلة", "لا تحتاج سباحة متقدمة"], order: 0 },
  { title: "غواص المياه المفتوحة (Open Water)", level: "open_water", agency: "PADI", price: 2200, currency: "SAR", duration: "3-4 أيام", description: "أول رخصة غوص دولية معتمدة تتيح لك الغوص حتى 18 مترًا حول العالم.", includes: ["مواد تعليمية رقمية", "تدريب مسبح", "غطسات مفتوحة", "شهادة PADI دولية"], order: 1 },
  { title: "الغواص المتقدم (Advanced Open Water)", level: "advanced", agency: "PADI", price: 1800, currency: "SAR", duration: "2-3 أيام", description: "وسّع مهاراتك: غوص عميق، ملاحة، وتخصصات مغامرة.", includes: ["5 غطسات مغامرة", "غوص عميق وملاحة", "شهادة متقدمة"], order: 2 },
  { title: "غواص الإنقاذ (Rescue Diver)", level: "rescue", agency: "PADI", price: 2800, currency: "SAR", duration: "3-4 أيام", description: "تعلّم إدارة الطوارئ وإنقاذ نفسك والآخرين — نقطة تحوّل في كل غوّاص.", includes: ["سيناريوهات إنقاذ", "إدارة الطوارئ", "شهادة Rescue"], order: 3 },
  { title: "الإسعافات الأولية (EFR)", level: "specialty", agency: "PADI", price: 750, currency: "SAR", duration: "يوم واحد", description: "إنعاش قلبي رئوي وإسعافات أولية — مطلوبة لدورة الإنقاذ.", includes: ["CPR", "إسعافات أولية", "شهادة EFR"], order: 4 },
  { title: "مرشد الغوص (Divemaster)", level: "divemaster", agency: "PADI", price: 5000, currency: "SAR", duration: "حسب البرنامج", description: "أول مستوى احترافي — قُد الغوصات واعمل في مجال الغوص.", includes: ["تدريب احترافي", "خبرة عملية", "شهادة Divemaster"], order: 5 },
  { title: "الغوص الحر (Freediving)", level: "freediving", agency: "PADI", price: 1200, currency: "SAR", duration: "2 أيام", description: "اكتشف حرية الغوص بحبس النفس — تقنيات تنفّس واسترخاء.", includes: ["تقنيات التنفّس", "تدريب عملي", "شهادة Freediver"], order: 6 },
  { title: "برنامج الأطفال (Bubblemaker / Seal Team)", level: "kids", agency: "PADI", price: 900, currency: "SAR", duration: "حسب البرنامج", description: "مغامرة آمنة وممتعة للأطفال في مياه ضحلة تحت إشراف متخصص.", includes: ["مياه ضحلة آمنة", "مدرّب أطفال", "مهمات ممتعة"], order: 7 },
];

const getCourses = async (req, res) => {
  try {
    const q = { active: true };
    if (req.query.level) q.level = req.query.level;
    const courses = await Course.find(q).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const getCourseById = async (req, res) => {
  try { const c = await Course.findById(req.params.id); if (!c) return res.status(404).json({ success: false, message: "الدورة غير موجودة" }); res.json({ success: true, course: c }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
const createCourse = async (req, res) => { try { const c = await Course.create(req.body); res.status(201).json({ success: true, course: c }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
const updateCourse = async (req, res) => { try { const c = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!c) return res.status(404).json({ success: false, message: "غير موجودة" }); res.json({ success: true, course: c }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
const deleteCourse = async (req, res) => { try { await Course.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
const seedCourses = async (req, res) => {
  try { let created = 0, skipped = 0; for (const c of SEED) { const ex = await Course.findOne({ title: c.title }); if (ex) { skipped++; continue; } await Course.create(c); created++; } res.json({ success: true, created, skipped }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, seedCourses };
