const mongoose = require("mongoose");

// رسائل «راسلني عبر الموقع» — يرسلها الزائر من بروفايل المدرب،
// ويقرؤها المدرب في صندوق الوارد بصفحة بروفايله. لا تتطلب تسجيل دخول من الزائر.
const InstructorMessageSchema = new mongoose.Schema(
  {
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "InstructorProfile", required: true, index: true },
    name: { type: String, required: true, trim: true },  // اسم المرسل
    contact: { type: String, default: "" },              // إيميل أو واتساب المرسل للرد
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read"], default: "new" },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // إن كان الزائر مسجلًا
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstructorMessage", InstructorMessageSchema);
