const express = require("express");

const {
  registerUser,
  loginUser,
  changePassword,
  googleAuth,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth); // الدخول/التسجيل بحساب جوجل
// تغيير كلمة المرور (يُلزَم به أصحاب الحسابات المنشأة من لوحة الإدارة عند أول دخول)
router.put("/change-password", protect, changePassword);

module.exports = router;
