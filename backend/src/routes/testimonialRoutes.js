const express = require("express");
const router = express.Router();
const { submit, listPublic, adminList, adminSetStatus } = require("../controllers/testimonialController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// عام
router.post("/", submit);        // إرسال تجربة/شكوى
router.get("/", listPublic);     // التجارب المعتمدة للعرض

// أدمن
router.get("/admin", protect, adminOnly, adminList);
router.patch("/admin/:id", protect, adminOnly, adminSetStatus);

module.exports = router;
