const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, enrollInNewsletter } = require("../lib/notifyEmails");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

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

// ── POST /api/auth/google ──────────────────────────────────
// يستقبل credential (Google ID token) من زر الدخول، يتحقق منه لدى جوجل،
// ثم يوجد المستخدم أو ينشئه (بلا كلمة مرور) ويعيد JWT.
const googleAuth = async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({ success: false, message: "الدخول بجوجل غير مُفعّل — GOOGLE_CLIENT_ID مفقود على الخادم" });
    }
    const credential = req.body.credential || req.body.token;
    if (!credential) return res.status(400).json({ success: false, message: "لم يصل رمز جوجل" });

    // التحقق من صحة الرمز وأنه صادر لتطبيقنا
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      return res.status(400).json({ success: false, message: "بريد جوجل غير موثّق" });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0];
    const googleId = payload.sub;
    const picture = payload.picture || "";

    let user = await User.findOne({ email });
    let isNew = false;

    if (user) {
      // اربط حساب جوجل بحساب موجود بنفس البريد (لأول مرة)
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider || "google";
        if (!user.profileImage && picture) user.profileImage = picture;
        await user.save();
      }
    } else {
      isNew = true;
      user = await User.create({
        name, email, googleId, authProvider: "google",
        profileImage: picture, role: "member",
      });
    }

    const token = signToken(user);
    res.json({
      success: true,
      message: "Login successful",
      token,
      mustChangePassword: false, // حسابات جوجل لا تحتاج كلمة مرور
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

    // 📧 ترحيب للحساب الجديد فقط (بعد الرد)
    if (isNew) { try { sendWelcomeEmail(user); } catch (e) { console.error("📧 ترحيب جوجل:", e.message); } }
    return;
  } catch (error) {
    return res.status(401).json({ success: false, message: "تعذّر التحقق من حساب جوجل" });
  }
};

module.exports = {
  changePassword,
  googleAuth,
  registerUser,
  loginUser,
};