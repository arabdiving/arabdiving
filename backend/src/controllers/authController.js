const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, enrollInNewsletter } = require("../lib/notifyEmails");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // 📧 بعد الرد (غير معطِّل): رسالة ترحيب لكل حساب جديد
    try { sendWelcomeEmail(user); } catch (e) { console.error("📧 ترحيب:", e.message); }
    // واختياريًا: من علّم مربع النشرة → اشتراك pending + بريد تأكيد (Double Opt-in)
    if (req.body.newsletter === true || req.body.newsletter === "true" || req.body.newsletter === "on") {
      enrollInNewsletter({
        email: user.email,
        name: user.name,
        ip: req.ip || "",
        userAgent: req.headers["user-agent"] || "",
      }).catch((e) => console.error("📧 نشرة التسجيل:", e.message));
    }
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "30d",
  }
);

res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  // الواجهة تحوّل لصفحة تغيير كلمة المرور إن كانت مؤقتة
  mustChangePassword: !!user.mustChangePassword,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: !!user.mustChangePassword,
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── PUT /api/auth/change-password (يتطلب تسجيل دخول) ──
// يغيّر كلمة المرور ويخفض علم الإلزام. يُستخدم في أول دخول للحسابات المنشأة من الإدارة.
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "المستخدم غير موجود" });

    const ok = await bcrypt.compare(String(currentPassword || ""), user.password);
    if (!ok) return res.status(400).json({ success: false, message: "كلمة المرور الحالية غير صحيحة" });

    if (await bcrypt.compare(String(newPassword), user.password)) {
      return res.status(400).json({ success: false, message: "اختر كلمة مرور مختلفة عن الحالية" });
    }

    user.password = await bcrypt.hash(String(newPassword), 10);
    user.mustChangePassword = false;
    await user.save();
    res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  changePassword,
  registerUser,
  loginUser,
};