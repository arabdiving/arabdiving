const Course = require("../models/Course");

const SEED = [
  { title: "مقدمة للغوص — اكتشاف الغوص (PADI Discover Scuba Diving)", level: "try", agency: "PADI", price: 300, currency: "SAR", duration: "نصف يوم", description: "أول تجربة غوص بدون شهادة أو خبرة، بإشراف مباشر من مدرّب PADI — من عمر 10 سنوات وحتى عمق 12 مترًا في بيئة آمنة.", includes: ["من عمر 10 سنوات", "أقصى عمق 12 مترًا", "لا تحتاج شهادة أو خبرة سابقة", "جلسة تحضيرية + غطسة بإشراف مدرّب"], order: 0 },
  { title: "مقدمة للغوص — اكتشاف الغوص (SDI Discover Scuba Diving)", level: "try", agency: "SDI", price: 300, currency: "SAR", duration: "نصف يوم", description: "تجربة الغوص الأولى مع SDI بدون رخصة، بإشراف مدرّب معتمد — بداية آمنة لعالم الغوص من عمر 10 سنوات.", includes: ["من عمر 10 سنوات", "بإشراف مدرّب SDI", "لا تحتاج خبرة سابقة", "مقدمة نظرية + غطسة تجريبية"], order: 1 },
  { title: "اكتشاف الغوص للأطفال (PADI Bubblemaker)", level: "kids", agency: "PADI", price: 900, currency: "SAR", duration: "حسب البرنامج", description: "برنامج PADI للأطفال من عمر 8 سنوات — يستخدمون معدات الغوص ويتنفّسون تحت الماء في مياه ضحلة حتى عمق مترين، بإشراف متخصص.", includes: ["من عمر 8 سنوات", "أقصى عمق مترين (مياه ضحلة)", "معدات بمقاسات الأطفال", "مدرّب متخصص بالأطفال", "تجربة آمنة وممتعة"], order: 2 },
  { title: "اكتشاف الغوص للأطفال (SDI Future Buddies)", level: "kids", agency: "SDI", price: 900, currency: "SAR", duration: "حسب البرنامج", description: "برنامج SDI Future Buddies للأطفال من 8 إلى 12 سنة — مقدمة للغوص في بيئة محكومة تحت إشراف مباشر من مدرّب، حتى عمق 6 أمتار.", includes: ["من 8 إلى 12 سنة", "أقصى عمق 6 أمتار", "إشراف مباشر من مدرّب", "معدات بمقاسات الأطفال", "أنشطة تفاعلية آمنة"], order: 3 },
  { title: "غواص المياه المفتوحة (PADI Open Water Diver)", level: "open_water", agency: "PADI", price: 2200, currency: "SAR", duration: "3-4 أيام", description: "أول رخصة غوص دولية معتمدة من PADI — تتيح لك الغوص حتى عمق 18 مترًا مع زميل حول العالم. تشمل دروسًا نظرية وتدريب مياه محصورة و4 غطسات مفتوحة.", includes: ["من عمر 10 سنوات (10-11 حتى 12م بمرافقة مختص)", "أقصى عمق 18 مترًا", "4 غطسات مفتوحة + تدريب مياه محصورة", "يتطلب سباحة 200م والطفو 10 دقائق", "شهادة PADI دولية مدى الحياة"], order: 4 },
  { title: "غواص المياه المفتوحة (SDI Open Water Scuba Diver)", level: "open_water", agency: "SDI", price: 2200, currency: "SAR", duration: "3-4 أيام", description: "رخصة الغوص الأساسية من SDI — غوص مستقل حتى عمق 18 مترًا، مع تدريب على كمبيوتر الغوص منذ البداية، من عمر 10 سنوات.", includes: ["من عمر 10 سنوات (بموافقة ولي الأمر للقُصّر)", "أقصى عمق 18 مترًا", "تدريب على كمبيوتر الغوص منذ البداية", "تدريب مياه محصورة + غطسات مفتوحة", "شهادة SDI دولية"], order: 5 },
  { title: "الغواص المتطوّر (PADI Advanced Open Water)", level: "advanced", agency: "PADI", price: 1800, currency: "SAR", duration: "2-3 أيام", description: "طوّر مهاراتك مع 5 غطسات مغامرة تشمل الغوص العميق والملاحة إلزاميًا — يرفع حدّ غوصك إلى 30 مترًا. المتطلب: غواص مياه مفتوحة.", includes: ["المتطلب: غواص مياه مفتوحة", "من عمر 15 سنة (12-14 جونيور حتى 21م)", "5 غطسات مغامرة (عميق + ملاحة + 3 اختيارية)", "أقصى عمق 30 مترًا", "شهادة PADI متقدمة"], order: 6 },
  { title: "الغواص المتطوّر (SDI Advanced Adventure Diver)", level: "advanced", agency: "SDI", price: 1800, currency: "SAR", duration: "2-3 أيام", description: "برنامج SDI المتقدّم: 5 غطسات (العميق والملاحة إلزاميان + 3 اختيارية) — يوسّع خبرتك حتى عمق 30 مترًا.", includes: ["المتطلب: غواص مياه مفتوحة", "5 غطسات (عميق + ملاحة + 3 تخصّصية)", "أقصى عمق 30 مترًا (جونيور 10-15 حتى 21م)", "تجربة عملية موجّهة", "شهادة SDI متقدمة"], order: 7 },
  { title: "غواص الإنقاذ (PADI Rescue Diver)", level: "rescue", agency: "PADI", price: 2800, currency: "SAR", duration: "3-4 أيام", description: "نقطة تحوّل كل غوّاص — تعلّم الوقاية من الحوادث وإدارة الطوارئ وإنقاذ نفسك والآخرين. المتطلب: غواص متقدّم + إسعافات أولية (EFR) خلال 24 شهرًا.", includes: ["المتطلب: غواص متقدّم أو ما يعادله", "إسعافات أولية EFR (أساسي وثانوي) خلال 24 شهرًا", "من عمر 15 سنة (12 جونيور)", "سيناريوهات إنقاذ وإدارة طوارئ", "شهادة PADI Rescue"], order: 8 },
  { title: "غواص الإنقاذ (SDI Rescue Diver)", level: "rescue", agency: "SDI", price: 2800, currency: "SAR", duration: "3-4 أيام", description: "دورة الإنقاذ من SDI: مهارات الوقاية والاستجابة للطوارئ تحت الماء وعلى السطح. المتطلب: Advanced Adventure أو Open Water + 15 غطسة، وإسعافات أولية سارية.", includes: ["المتطلب: Advanced Adventure أو Open Water + 15 غطسة", "إسعافات أولية وإنعاش (CPR) سارية", "من عمر 18 (أو 10 بموافقة ولي الأمر)", "سيناريوهات إنقاذ عملية", "شهادة SDI Rescue"], order: 9 },
  { title: "مرشد الغوص (PADI Divemaster)", level: "divemaster", agency: "PADI", price: 5000, currency: "SAR", duration: "حسب البرنامج", description: "أول مستوى احترافي في PADI — قُد الغوصات واعمل في مجال الغوص. المتطلبات: Open Water + Advanced + Rescue، وإسعافات أولية، و40 غطسة للبدء (60 للتخرّج)، وفحص طبي.", includes: ["من عمر 18 سنة", "المتطلب: Open Water + Advanced + Rescue", "40 غطسة مسجّلة للبدء / 60 للتخرّج", "إسعافات أولية EFR خلال 24 شهرًا", "فحص طبي معتمد خلال 12 شهرًا", "شهادة PADI Divemaster المهنية"], order: 10 },
  { title: "مرشد الغوص (SDI Divemaster)", level: "divemaster", agency: "SDI", price: 5000, currency: "SAR", duration: "حسب البرنامج", description: "المستوى الاحترافي الأول مع SDI — يؤهّلك لقيادة الغوصات ومساعدة المدرّبين. المتطلبات: Advanced Adventure + Rescue، وإسعافات أولية وأكسجين، و40 غطسة على الأقل.", includes: ["من عمر 18 سنة", "المتطلب: Advanced Adventure + Rescue", "40 غطسة مسجّلة على الأقل", "إسعافات أولية + CPR + مزوّد أكسجين ساري", "خبرة عملية في التخصصات", "شهادة SDI Divemaster المهنية"], order: 11 },
  { title: "اكتشاف الغوص التكيّفي — ذوي الهمم (SDI Scubility Scuba Discovery)", level: "scubility", agency: "SDI", price: 600, currency: "SAR", duration: "نصف يوم", exclusive: true, tag: "مدربو عرب ديفنج فقط", description: "تجربة غوص تكيّفية أولى مصمّمة لذوي الاحتياجات، مع تعديل المعدات والتقنيات حسب احتياج كل غوّاص وبإشراف مدرّب SDI Scubility معتمد — دون المساس بالسلامة أو الكرامة.", includes: ["مصمّمة لذوي الاحتياجات الجسدية", "تعديل المعدات والتقنيات حسب الحاجة", "بإشراف مدرّب SDI Scubility", "بيئة آمنة وداعمة", "حصري: مدربو عرب ديفنج فقط"], order: 12 },
  { title: "السنوركل التكيّفي — ذوي الهمم (SDI Scubility Snorkel Diver)", level: "scubility", agency: "SDI", price: 500, currency: "SAR", duration: "نصف يوم", exclusive: true, tag: "مدربو عرب ديفنج فقط", description: "برنامج سنوركل تكيّفي يمهّد لعالم الماء لذوي الاحتياجات، بأدوات وتقنيات معدّلة وإشراف متخصص.", includes: ["مصمّمة لذوي الاحتياجات", "معدات سنوركل معدّلة", "مهارات الطفو والتنفّس السطحي", "بإشراف مدرّب Scubility", "حصري: مدربو عرب ديفنج فقط"], order: 13 },
  { title: "غواص المياه المفتوحة التكيّفي — ذوي الهمم (SDI Scubility Open Water Diver)", level: "scubility", agency: "SDI", price: 4400, currency: "SAR", duration: "حسب البرنامج", exclusive: true, tag: "مدربو عرب ديفنج فقط", description: "رخصة غوص تكيّفية تمنح الغوّاص من ذوي الاحتياجات المهارات لأداء غوصات في المياه المفتوحة ضمن شروط مشابهة لتدريبه — بمرونة تُمنح الشهادة حسب ما يستطيع الغوّاص تحقيقه، وقد يرافقه رفيق غوص مؤهّل حسب حالته.", includes: ["مصمّمة لذوي الاحتياجات الجسدية", "الشهادة حسب قدرات كل غوّاص", "تعديل كامل للمعدات والتقنيات", "قد يتطلب رفيق غوص مؤهّل حسب الحالة", "شهادة SDI Scubility دولية", "حصري: مدربو عرب ديفنج فقط"], order: 14 },
  { title: "رفيق الغوص التكيّفي — ذوي الهمم (SDI Scubility Dive Buddy)", level: "scubility", agency: "SDI", price: 600, currency: "SAR", duration: "حسب البرنامج", exclusive: true, tag: "مدربو عرب ديفنج فقط", description: "برنامج يؤهّل الغوّاصين لمرافقة ومساندة غوّاصي ذوي الاحتياجات بأمان أثناء الغوص — تعلّم كيف تكون رفيقًا داعمًا وفعّالًا.", includes: ["للراغبين في مرافقة غوّاصي ذوي الهمم", "تقنيات المساندة والسلامة", "التواصل والدعم تحت الماء", "بإشراف مدرّب Scubility", "حصري: مدربو عرب ديفنج فقط"], order: 15 },
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
  try {
    let created = 0, updated = 0;
    for (const c of SEED) {
      const ex = await Course.findOne({ title: c.title });
      if (ex) {
        ex.description = c.description; ex.includes = c.includes; ex.duration = c.duration; ex.level = c.level; ex.agency = c.agency; ex.tag = c.tag || ""; ex.exclusive = !!c.exclusive;
        await ex.save(); updated++;
      } else { await Course.create(c); created++; }
    }
    res.json({ success: true, created, updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, seedCourses };
