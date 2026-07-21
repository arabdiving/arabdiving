const mongoose = require("mongoose");

// mustChangePassword: يُرفع للحسابات التي أنشأها الأدمن بكلمة مرور مؤقتة،
// فيُجبر صاحبها على تغييرها عند أول دخول ثم يُخفض تلقائيًا.
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
profileImage: {
  type: String,
  default: "",
},
bio: {
  type: String,
  default: "",
  maxlength: 300,
},
    password: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    certificationLevel: {
      type: String,
      default: "Open Water",
    },

    divesCount: {
      type: Number,
      default: 0,
    },
    followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
    

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendReqIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendReqOut: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    privacy: {
      photo: { type: String, enum: ["public", "friends", "hidden"], default: "public" },
      info: { type: String, enum: ["public", "friends", "hidden"], default: "public" },
    },
    personality: {
      role: { type: String, default: "" },
      dominant: { type: String, default: "" },
      scores: {
        red: Number, yellow: Number, green: Number, blue: Number,
      },
      takenAt: Date,
    },
    showInColor: { type: Boolean, default: false },

    // استبيان التوافق التدريبي — احتياجات عملية لمطابقة المدرب بالمتدرب
    trainingFit: {
      goal: { type: String, default: "" }, // certification | fun | pro | fear
      scores: {
        comfort: Number,  // الطمأنينة في الماء (2-8)
        pace: Number,     // تفضيل التدرج الهادئ (2-8)
        theory: Number,   // تفضيل الشرح النظري أولًا (2-8)
        support: Number,  // الحاجة للتشجيع والدعم (2-8)
      },
      prefs: {
        arabic: { type: Boolean, default: false },
        femaleInstructor: { type: Boolean, default: false },
        smallGroup: { type: Boolean, default: false },
      },
      takenAt: Date,
    },

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },

    // إجبار تغيير كلمة المرور عند أول دخول (للحسابات المنشأة من لوحة الإدارة)
    mustChangePassword: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);