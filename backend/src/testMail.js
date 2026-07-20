require("dotenv").config();
const { verify, sendMail, isDryRun, MAIL_FROM } = require("./lib/mailer");

// أداة تشخيص: تتحقق من اتصال SMTP ثم ترسل رسالة اختبار.
// الاستخدام:  npm run mail-test -- your@email.com
(async () => {
  const to = process.argv[2];

  console.log("──────────────────────────────────────");
  console.log("🔍 فحص إعدادات البريد");
  console.log("──────────────────────────────────────");
  console.log("SMTP_HOST :", process.env.SMTP_HOST || "(غير مضبوط)");
  console.log("SMTP_PORT :", process.env.SMTP_PORT || "(غير مضبوط)");
  console.log("SMTP_USER :", process.env.SMTP_USER || "(غير مضبوط)");
  console.log("SMTP_PASS :", process.env.SMTP_PASS ? "(مضبوطة)" : "❌ (فارغة)");
  console.log("MAIL_FROM :", MAIL_FROM);
  console.log("REPLY_TO  :", process.env.MAIL_REPLY_TO || "(غير مضبوط)");
  console.log("──────────────────────────────────────");

  if (isDryRun()) {
    console.log("⚠️  النظام في وضع المحاكاة (DRY_RUN) — لن تُرسَل رسائل فعلية.");
    console.log("    السبب: SMTP_HOST أو SMTP_USER أو SMTP_PASS غير مضبوط في backend/.env");
    console.log("    املأ SMTP_PASS بكلمة مرور التطبيق من Zoho ثم أعد المحاولة.");
    process.exit(0);
  }

  console.log("⏳ جارٍ التحقق من الاتصال بخادم SMTP...");
  const v = await verify();
  if (!v.ok) {
    console.error("❌ فشل الاتصال:", v.error);
    console.error("\nأسباب شائعة:");
    console.error("  • كلمة المرور العادية بدل App Password (Zoho يرفضها مع التحقق بخطوتين).");
    console.error("  • الهوست خاطئ: للدومين المخصص استخدم smtppro.zoho.com وليس smtp.zoho.com");
    console.error("  • مركز بيانات مختلف: جرّب smtppro.zoho.eu / .in / .sa حسب منطقة حسابك.");
    process.exit(1);
  }
  console.log("✅ الاتصال بخادم SMTP ناجح.");

  if (!to) {
    console.log("\nℹ️  لإرسال رسالة اختبار فعلية:  npm run mail-test -- your@email.com");
    process.exit(0);
  }

  console.log(`⏳ جارٍ إرسال رسالة اختبار إلى ${to} ...`);
  const r = await sendMail({
    to,
    subject: "✅ رسالة اختبار من ArabDiving",
    html: `<div style="font-family:Tahoma,Arial;direction:rtl;padding:20px;">
      <h2 style="color:#0b6ea8;">الإعداد ناجح! 🎉</h2>
      <p>لو وصلتك هذه الرسالة، فنظام البريد يعمل بشكل صحيح.</p>
      <p>جرّب الرد على هذه الرسالة — يجب أن يصل ردّك إلى <b>${process.env.MAIL_REPLY_TO}</b>.</p>
    </div>`,
  });

  if (r.ok) {
    console.log("✅ تم الإرسال بنجاح! تحقّق من صندوق الوارد (ومجلد Spam أيضاً).");
  } else {
    console.error("❌ فشل الإرسال:", r.error);
    process.exit(1);
  }
  process.exit(0);
})();
