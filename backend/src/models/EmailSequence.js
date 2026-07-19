const mongoose = require("mongoose");

// تسلسل الترحيب الآلي — وثيقة واحدة (Singleton) تحوي خطوات مرتّبة.
// يعالجها محرّك الأتمتة (lib/emailAutomation.js) دورياً.
const StepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true }, // ترتيب الخطوة (1، 2، 3 ...)
    delayHours: { type: Number, default: 0 }, // التأخير بالساعات منذ تأكيد الاشتراك
    subject: { type: String, required: true },
    html: { type: String, required: true }, // يدعم متغيرات {{name}}
    // لأي دور تُرسل هذه الخطوة (all = الجميع)
    role: { type: String, enum: ["all", "instructor", "trainee", "general"], default: "all" },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const EmailSequenceSchema = new mongoose.Schema(
  {
    key: { type: String, default: "welcome", unique: true }, // معرّف التسلسل
    name: { type: String, default: "تسلسل الترحيب" },
    enabled: { type: Boolean, default: true },
    steps: { type: [StepSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailSequence", EmailSequenceSchema);
