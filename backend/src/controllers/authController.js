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
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};