const mongoose = require("mongoose");

/*
  تجارب وشكاوى الزوار (تُرسل من صندوق «شاركنا تجربتك» في صفحات القصص).
  الزائر يختار: منشور عام يقرأه الجميع، أو رسالة خاصة للإدارة فقط.
  العام لا يظهر إلا بعد موافقة الإدارة (حماية من السبام والإساءة).
*/
const StoryTestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, default: "" },         // إيميل/واتساب للرد (لا يُعرض علنًا)
    brand: { type: String, default: "" },            // العلامة/الجهة (اختياري: Suunto، مركز، ...)
    message: { type: String, required: true },
    // اختيار الزائر: هل يريدها منشورًا عامًا؟
    wantsPublic: { type: Boolean, default: false },
    // حالة النشر: pending (بانتظار الموافقة) | approved (منشور) | private (خاص للإدارة) | hidden
    status: { type: String, enum: ["pending", "approved", "private", "hidden"], default: "private" },
    page: { type: String, default: "" },             // من أي صفحة أُرسلت
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoryTestimonial", StoryTestimonialSchema);
