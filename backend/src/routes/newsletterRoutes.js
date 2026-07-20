const express = require("express");
const router = express.Router();
const { subscribe, confirm, unsubscribe, health } = require("../controllers/newsletterController");

// عامة (بدون تسجيل دخول)
router.get("/health", health); // فحص تشخيصي لحالة البريد وقاعدة البيانات
router.post("/subscribe", subscribe);
router.get("/confirm", confirm);
router.get("/unsubscribe", unsubscribe);

module.exports = router;
