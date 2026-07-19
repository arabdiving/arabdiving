const express = require("express");
const router = express.Router();
const { subscribe, confirm, unsubscribe } = require("../controllers/newsletterController");

// عامة (بدون تسجيل دخول)
router.post("/subscribe", subscribe);
router.get("/confirm", confirm);
router.get("/unsubscribe", unsubscribe);

module.exports = router;
