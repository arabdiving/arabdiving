const mongoose = require("mongoose");

// حملة بريدية (نشرة جماعية أو إيميل مخصص لمجموعة).
const EmailCampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // اسم داخلي للحملة
    subject: { type: String, required: true, trim: true }, // عنوان الإيميل
    preheader: { type: String, default: "" }, // نص المعاينة القصير
    html: { type: String, required: true }, // محتوى HTML (يدعم متغيرات {{name}})

    // فلتر الجمهور — لمن تُرسل الحملة
    audience: {
      role: { type: String, enum: ["all", "instructor", "trainee", "general"], default: "all" },
      tag: { type: String, default: "" }, // وسم اختياري
      locale: { type: String, enum: ["all", "ar", "en"], default: "all" },
    },

    status: {
      type: String,
      enum: ["draft", "sending", "sent", "failed"],
      default: "draft",
      index: true,
    },

    // إحصاءات الإرسال
    stats: {
      recipients: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },

    scheduledAt: { type: Date }, // اختياري: جدولة مستقبلية
    sentAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailCampaign", EmailCampaignSchema);
