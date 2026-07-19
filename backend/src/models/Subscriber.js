const mongoose = require("mongoose");
const crypto = require("crypto");

// مشترك في القائمة البريدية (قائم على الموافقة / Opt-in).
// منفصل عن User: القائمة قد تضم زوّاراً لم يسجّلوا حساباً بعد.
const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, default: "" },

    // الدور يساعد على تقسيم القائمة والتوفيق: مدرّب / متدرّب / عام
    role: {
      type: String,
      enum: ["instructor", "trainee", "general"],
      default: "general",
    },

    // اللغة المفضّلة للرسائل
    locale: { type: String, enum: ["ar", "en"], default: "ar" },

    // حالة الاشتراك — أساس الامتثال القانوني:
    // pending      = اشترك ولم يؤكّد بعد (Double Opt-in)
    // confirmed    = أكّد الاشتراك — يُسمح بالإرسال إليه
    // unsubscribed = ألغى الاشتراك — يُمنع الإرسال إليه
    // bounced      = ارتد بريده — يُستبعد من الإرسال
    status: {
      type: String,
      enum: ["pending", "confirmed", "unsubscribed", "bounced"],
      default: "pending",
      index: true,
    },

    // وسوم حرّة للتقسيم (مثل: جدة، الغردقة، freediving)
    tags: { type: [String], default: [] },

    // مصدر الاشتراك (لأي حملة/قناة أتى)
    source: { type: String, default: "signup-form" },

    // سجلّ الموافقة (إلزامي قانونياً في السعودية ومصر)
    consent: {
      given: { type: Boolean, default: false },
      at: { type: Date },
      ip: { type: String, default: "" },
      userAgent: { type: String, default: "" },
      text: { type: String, default: "" }, // نص الموافقة الذي وافق عليه
    },

    confirmedAt: { type: Date },
    unsubscribedAt: { type: Date },

    // رموز آمنة للتأكيد وإلغاء الاشتراك (روابط بدون تسجيل دخول)
    confirmToken: { type: String, index: true },
    unsubscribeToken: { type: String, index: true },

    // محرّك تسلسل الترحيب:
    // welcomeStep = رقم آخر خطوة أُرسلت (0 = لم يبدأ بعد)
    welcomeStep: { type: Number, default: 0 },
    welcomeDone: { type: Boolean, default: false },

    // إحصاءات بسيطة
    lastSentAt: { type: Date },
    sendCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// توليد الرموز تلقائياً عند الإنشاء
SubscriberSchema.pre("validate", function (next) {
  if (!this.confirmToken) this.confirmToken = crypto.randomBytes(24).toString("hex");
  if (!this.unsubscribeToken) this.unsubscribeToken = crypto.randomBytes(24).toString("hex");
  next();
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
