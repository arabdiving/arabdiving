const mongoose = require("mongoose");

/*
  بروفايل المدرب — قلب تحول المنصة لدليل مدربين.
  «بصمة المدرب»: تقييم ذاتي علمي (6 محاور مستمدة من Danielson + TSES + معايير PADI IE).
  أقوى محورين يُعرضان علنًا كنقاط تميّز؛ أضعف محور خاص بالمدرب (إلا إذا اختار إظهاره).
*/

const InstructorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    // بيانات الاعتماد
    agency: { type: String, default: "PADI" },          // PADI | SDI | SSI | CMAS | NAUI | أخرى
    instructorNumber: { type: String, default: "" },     // رقم المدرب لدى المنظمة
    rank: { type: String, default: "" },                 // OWSI | MSDT | IDC Staff | Course Director ...
    sinceYear: { type: Number, default: null },          // سنة أن أصبح مدربًا — تُحسب الخبرة منها

    // التخصصات واللغات
    specialties: { type: [String], default: [] },
    languages: { type: [String], default: ["العربية"] },

    city: { type: String, default: "" },
    bio: { type: String, default: "" },
    whatsapp: { type: String, default: "" },

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

    verified: { type: Boolean, default: false },     // توثيق الإدارة (بعد التحقق من رقم المدرب)
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstructorProfile", InstructorProfileSchema);
