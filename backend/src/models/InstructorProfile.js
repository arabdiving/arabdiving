const mongoose = require("mongoose");

/*
  بروفايل المدرب — قلب تحول المنصة لدليل مدربين.
  «بصمة المدرب»: تقييم ذاتي علمي (6 محاور مستمدة من Danielson + TSES + معايير PADI IE).
  أقوى محورين يُعرضان علنًا كنقاط تميّز؛ أضعف محور خاص بالمدرب (إلا إذا اختار إظهاره).
*/

const InstructorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    // رابط بالاسم بدل الرقم: /instructors/ابراهيم-المكاوى — يتولد من اسم المدرب
    slug: { type: String, default: "", index: true },

    // بيانات الاعتماد
    agency: { type: String, default: "" },              // CMAS | NAUI | PADI | RAID | SDI | SSI | TDI | أخرى (بلا افتراضي — حياد)
    instructorNumber: { type: String, default: "" },     // رقم المدرب لدى المنظمة
    rank: { type: String, default: "" },                 // OWSI | MSDT | IDC Staff | Course Director ...
    sinceYear: { type: Number, default: null },          // سنة أن أصبح مدربًا — تُحسب الخبرة منها

    // التخصصات واللغات
    specialties: { type: [String], default: [] },
    languages: { type: [String], default: ["العربية"] },

    city: { type: String, default: "" },
    bio: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },          // إيميل التواصل (يظهر حسب إعدادات الإظهار)
    // روابط السوشيال ميديا — تظهر في البروفايل حسب إعدادات إظهار التواصل
    social: {
      facebook:  { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok:    { type: String, default: "" },
      youtube:   { type: String, default: "" },
      x:         { type: String, default: "" }, // تويتر/X
      linkedin:  { type: String, default: "" },
    },
    showContact: { type: Boolean, default: true }, // المدرب يتحكم في إظهار وسائل تواصله (والأدمن له مفتاح عام)
    video: { type: String, default: "" },          // رابط فيديو تعريفي (يوتيوب/رابط مباشر)

    // موقع التدريب على الخريطة (يُملأ تلقائيًا من المدينة، ويمكن ضبطه يدويًا لاحقًا)
    location: { lat: { type: Number, default: null }, lng: { type: Number, default: null } },

    // «من يناسبني؟» — اختيارات قسرية (Forced-Choice): كل اختيار له ثمن فلا مجال للتجمّل.
    // تُعرض علنًا: «يناسبه» + «قد يكون مدرب آخر أنسب لك إذا…» بصياغة محترمة.
    fit: {
      level:   { type: String, default: "" }, // beginner (المبتدئ الخائف) | advanced (المتقدم الطموح)
      pace:    { type: String, default: "" }, // patient (تكرار وصبر) | fast (إيقاع سريع وتحدٍ)
      age:     { type: String, default: "" }, // kids (أطفال ونشء) | adults (بالغون)
      style:   { type: String, default: "" }, // structured (نظام وانضباط) | fun (مرح ومرونة)
      group:   { type: String, default: "" }, // private (فردي وخاص) | group (مجموعات)
      special: { type: String, default: "" }, // adaptive (حالات خاصة وذوو همم) | standard (الحالات القياسية)
      takenAt: Date,
    },

    // بصمة المدرب (متوسط كل محور 1-5)
    fingerprint: {
      scores: {
        planning:        Number, // التخطيط والبريفينج
        strategies:      Number, // استراتيجيات الشرح
        management:      Number, // إدارة المجموعة والوعي الظرفي
        engagement:      Number, // التحفيز واحتواء الخوف
        watermanship:    Number, // الإتقان المائي والعرض
        professionalism: Number, // الاحترافية والتطوير
      },
      takenAt: Date,
    },
    showWeakness: { type: Boolean, default: false }, // هل يعرض مجال تطويره علنًا؟ (شجاعة تُحترم)

    // الموافقة المبدئية: المتدرب يقدّم طلب انضمام بصور كارنيه المدرب (وش وضهر — وأكثر من كارنيه)
    // pending = قيد مراجعة الإدارة | approved = معتمد (يظهر في الدليل) | rejected = مرفوض
    // ملاحظة: البروفايلات القديمة بلا هذا الحقل تُعامل كمعتمدة (للتوافق الرجعي)
    applicationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    cardImages: { type: [String], default: [] }, // صور الكارنيهات — تظهر للإدارة فقط، لا تُعرض علنًا أبدًا

    verified: { type: Boolean, default: false },     // توثيق الإدارة (بعد التحقق من رقم المدرب)
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstructorProfile", InstructorProfileSchema);
