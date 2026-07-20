const Subscriber = require("../models/Subscriber");
const { sendMail, isDryRun, transportMode, apiKeyDiagnostics } = require("../lib/mailer");
const { build, APP_URL } = require("../lib/emailTemplates");

// صفحة نتيجة بسيطة (تأكيد/إلغاء) تُعرض في المتصفّح
function resultPage(title, message, ok = true) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
  <body style="font-family:Tahoma,Arial,sans-serif;background:#f4f7fa;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
    <div style="background:#fff;max-width:440px;padding:40px;border-radius:16px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.08);">
      <div style="font-size:52px;">${ok ? "✅" : "⚠️"}</div>
      <h1 style="color:#0b6ea8;font-size:22px;">${title}</h1>
      <p style="color:#465;line-height:1.9;font-size:15px;">${message}</p>
      <a href="${APP_URL}" style="display:inline-block;margin-top:12px;background:#0b6ea8;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;">العودة للموقع</a>
    </div></body></html>`;
}

// ── POST /api/newsletter/subscribe ──────────────────────────
// اشتراك جديد بموافقة صريحة → يرسل بريد تأكيد (Double Opt-in)
const subscribe = async (req, res) => {
  try {
    const { email, name = "", role = "general", locale = "ar", tags = [], consent } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "بريد إلكتروني غير صحيح" });
    }
    // الموافقة الصريحة إلزامية قانونياً
    if (consent !== true && consent !== "true" && consent !== "on") {
      return res.status(400).json({ success: false, message: "يجب الموافقة على استلام الرسائل للاشتراك" });
    }

    const consentText =
      "أوافق على استلام النشرة البريدية والعروض من ArabDiving، وأعلم أنه يمكنني إلغاء الاشتراك في أي وقت.";
    const consentRecord = {
      given: true,
      at: new Date(),
      ip: req.ip || "",
      userAgent: req.headers["user-agent"] || "",
      text: consentText,
    };

    let sub = await Subscriber.findOne({ email: email.toLowerCase().trim() });

    if (sub) {
      if (sub.status === "confirmed") {
        return res.json({ success: true, message: "أنت مشترك بالفعل ومؤكَّد. شكراً لك!" });
      }
      // موجود لكن معلّق/ملغى → أعد تعيينه إلى pending وأعد إرسال التأكيد
      sub.name = name || sub.name;
      sub.role = role;
      sub.locale = locale;
      sub.tags = Array.isArray(tags) ? tags : sub.tags;
      sub.status = "pending";
      sub.consent = consentRecord;
      await sub.save();
    } else {
      sub = await Subscriber.create({
        email: email.toLowerCase().trim(),
        name,
        role,
        locale,
        tags: Array.isArray(tags) ? tags : [],
        status: "pending",
        source: req.body.source || "signup-form",
        consent: consentRecord,
      });
    }

    // نرد على المتصفح فوراً — الاشتراك محفوظ بالفعل.
    // إرسال بريد التأكيد يتم في الخلفية حتى لا يعلّق الطلب لو كان SMTP بطيئاً أو معطّلاً.
    res.json({
      success: true,
      message: "تم التسجيل! أرسلنا لك بريد تأكيد — افتحه واضغط زر التأكيد لإكمال الاشتراك.",
    });

    // ── إرسال بريد التأكيد (Double Opt-in) في الخلفية ──
    const confirmUrl = `${APP_URL}/api/newsletter/confirm?token=${sub.confirmToken}`;
    const html = build({
      subscriber: sub,
      html: `
        <h2 style="color:#0b6ea8;">خطوة أخيرة لتأكيد اشتراكك 🌊</h2>
        <p>مرحباً {{name}}،</p>
        <p>شكراً لاشتراكك في مجتمع ArabDiving للغوص. اضغط الزر بالأسفل لتأكيد اشتراكك وتبدأ باستقبال أفضل مواقع الغوص والعروض:</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${confirmUrl}" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:14px 34px;border-radius:10px;font-weight:bold;">تأكيد الاشتراك</a>
        </p>
        <p style="color:#7a8a99;font-size:13px;">إن لم تطلب هذا الاشتراك، تجاهل هذه الرسالة ولن يصلك أي بريد آخر.</p>`,
    });

    sendMail({ to: sub.email, subject: "أكّد اشتراكك في ArabDiving 🤿", html })
      .then((r) => {
        if (r.ok) console.log(`✅ بريد تأكيد أُرسل إلى ${sub.email}${r.dryRun ? " (وضع محاكاة)" : ""}`);
        else console.error(`❌ فشل إرسال بريد التأكيد إلى ${sub.email}: ${r.error}`);
      })
      .catch((e) => console.error(`❌ استثناء أثناء إرسال بريد التأكيد إلى ${sub.email}:`, e.message));

    return;
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/newsletter/confirm?token=... ───────────────────
const confirm = async (req, res) => {
  try {
    const { token } = req.query;
    const sub = token ? await Subscriber.findOne({ confirmToken: token }) : null;
    if (!sub) {
      return res.status(404).send(resultPage("رابط غير صالح", "رابط التأكيد غير صحيح أو منتهٍ.", false));
    }
    if (sub.status !== "confirmed") {
      sub.status = "confirmed";
      sub.confirmedAt = new Date();
      await sub.save();
    }
    return res.send(
      resultPage("تم تأكيد اشتراكك! 🎉", "أهلاً بك في مجتمع الغوص. ستصلك رسالتنا الترحيبية خلال لحظات.", true)
    );
  } catch (error) {
    return res.status(500).send(resultPage("خطأ", error.message, false));
  }
};

// ── GET /api/newsletter/unsubscribe?token=... ───────────────
const unsubscribe = async (req, res) => {
  try {
    const { token } = req.query;
    const sub = token ? await Subscriber.findOne({ unsubscribeToken: token }) : null;
    if (!sub) {
      return res.status(404).send(resultPage("رابط غير صالح", "رابط إلغاء الاشتراك غير صحيح.", false));
    }
    sub.status = "unsubscribed";
    sub.unsubscribedAt = new Date();
    await sub.save();
    return res.send(
      resultPage("تم إلغاء اشتراكك", "لن يصلك أي بريد بعد الآن. يمكنك الاشتراك مجدداً في أي وقت من الموقع.", true)
    );
  } catch (error) {
    return res.status(500).send(resultPage("خطأ", error.message, false));
  }
};

// ── GET /api/newsletter/health ──────────────────────────────
// فحص تشخيصي: يكشف هل السيرفر يرى إعدادات البريد وقاعدة البيانات
// (يعرض حالة فقط — لا يكشف أي كلمات مرور أو مفاتيح).
const health = async (req, res) => {
  const mongoose = require("mongoose");
  const dbStates = ["مفصول", "متصل", "جارٍ الاتصال", "جارٍ الفصل"];
  let subscriberCount = null;
  let dbError = null;
  try {
    subscriberCount = await Subscriber.estimatedDocumentCount();
  } catch (e) {
    dbError = e.message;
  }
  res.json({
    success: true,
    database: {
      state: dbStates[mongoose.connection.readyState] || "غير معروف",
      subscribers: subscriberCount,
      error: dbError,
    },
    mail: {
      dryRun: isDryRun(), // true = لن تُرسَل رسائل فعلية
      mode: transportMode(), // brevo-api (HTTPS) | smtp | dry-run
      brevoApiKeySet: !!process.env.BREVO_API_KEY,
      smtpHost: process.env.SMTP_HOST || null,
      smtpPort: process.env.SMTP_PORT || null,
      smtpUserSet: !!process.env.SMTP_USER,
      smtpPassSet: !!process.env.SMTP_PASS,
      mailFrom: process.env.MAIL_FROM || null,
      appUrl: APP_URL,
    },
    cors: {
      // القائمة الفعلية المحسوبة — يجب أن تتضمّن أصل هذا الخادم لتعمل طلبات POST
      allowedOrigins: require("../lib/corsOrigins").buildAllowedOrigins(),
      // الأصل الذي أرسله متصفحك في هذا الطلب (يساعد على كشف عدم التطابق)
      yourOrigin: req.headers.origin || "(لم يُرسَل — طلب مباشر)",
    },
  });
};

// ── GET /api/newsletter/selftest?to=...&key=... ─────────────
// تشخيص شامل بفتح رابط في المتصفح فقط — بلا نموذج ولا جافاسكريبت ولا CORS:
// 1) يكتب مشتركًا تجريبيًا في القاعدة (يثبت أن الكتابة تعمل)
// 2) يرسل رسالة فعلية عبر SMTP ويعيد رد الخادم نصًا (يكشف سبب رفض Brevo إن وُجد)
// محمي بمفتاح: MAIL_TEST_KEY في متغيرات البيئة (أو JWT_SECRET كاحتياطي).
const selftest = async (req, res) => {
  // المفتاح: MAIL_TEST_KEY المخصص، أو JWT_SECRET كاحتياطي. نتجاهل المسافات الزائدة.
  const expected = String(process.env.MAIL_TEST_KEY || process.env.JWT_SECRET || "").trim();
  const given = String(req.query.key || "").trim();
  if (!expected || given !== expected) {
    return res.status(403).json({
      success: false,
      message: "مفتاح غير صحيح",
      hint: {
        mailTestKeySet: !!process.env.MAIL_TEST_KEY,
        jwtSecretSet: !!process.env.JWT_SECRET,
        expectedLength: expected.length,   // طول المفتاح المتوقع (لا قيمته)
        youSentLength: given.length,       // طول ما أرسلته — قارن الرقمين
        note: !process.env.MAIL_TEST_KEY
          ? "لم تُضف MAIL_TEST_KEY في ريندر بعد — النظام يقارن بـ JWT_SECRET حاليًا. أضف MAIL_TEST_KEY ثم أعد النشر."
          : "MAIL_TEST_KEY موجود — تأكد أنك تنسخه حرفيًا (بلا مسافات)، وأن الخدمة أُعيد نشرها بعد إضافته.",
      },
    });
  }
  const to = String(req.query.to || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return res.status(400).json({ success: false, message: "أضف ?to=بريدك" });
  }

  const out = { to, steps: {} };

  // 1) اختبار الكتابة في قاعدة البيانات
  try {
    const probe = await Subscriber.findOneAndUpdate(
      { email: `selftest+${Date.now()}@arabdiving.com` },
      { $set: { name: "اختبار ذاتي", status: "unsubscribed", source: "selftest" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    out.steps.database = { ok: true, wroteId: String(probe._id) };
    await Subscriber.deleteOne({ _id: probe._id }); // تنظيف فوري
  } catch (e) {
    out.steps.database = { ok: false, error: e.message };
  }

  // 2) اختبار اتصال SMTP (verify)
  try {
    const { verify } = require("../lib/mailer");
    out.steps.smtpConnection = await verify();
  } catch (e) {
    out.steps.smtpConnection = { ok: false, error: e.message };
  }

  // 3) إرسال فعلي — هنا يظهر سبب الرفض الحقيقي إن رفض Brevo المرسِل
  const r = await sendMail({
    to,
    subject: "اختبار إرسال ArabDiving ✅",
    html: `<div dir="rtl" style="font-family:Tahoma,Arial;padding:20px">
      <h2 style="color:#0b6ea8">وصلت الرسالة — النظام يعمل 🎉</h2>
      <p>هذه رسالة اختبار من خادم ArabDiving عبر Brevo.</p>
      <p style="color:#7a8a99;font-size:13px">الوقت: ${new Date().toISOString()}</p></div>`,
  });
  out.steps.send = r;

  out.mode = transportMode();
  out.apiKey = apiKeyDiagnostics();

  const timedOut = /timeout|ETIMEDOUT|ECONNREFUSED/i.test(r.error || "");
  const badKey = /key not found|unauthorized|401/i.test(r.error || "");
  if (badKey) {
    return res.json({
      success: true,
      ...out,
      verdict: out.apiKey.looksLikeApiKey
        ? "❌ بريفو رفض المفتاح — تأكد أنه لم يُحذف/يُعاد توليده، وأن حسابك مفعّل"
        : `❌ ${out.apiKey.note}`,
    });
  }
  out.verdict = !out.steps.database?.ok
    ? "❌ مشكلة في قاعدة البيانات"
    : r.dryRun
    ? "⚠️ وضع المحاكاة — لا BREVO_API_KEY ولا بيانات SMTP على الخادم"
    : r.ok
    ? `✅ أُرسلت فعليًا عبر ${out.mode} — افحص بريدك (وSpam) ثم سجلات Brevo`
    : timedOut && out.mode.startsWith("smtp")
    ? "❌ منافذ SMTP محجوبة على هذه الاستضافة (Render المجاني يحجب 25/465/587). الحل: أضف BREVO_API_KEY لتتحول للإرسال عبر HTTPS."
    : `❌ فشل الإرسال (${out.mode}): ${r.error}`;

  return res.json({ success: true, ...out });
};

module.exports = { subscribe, confirm, unsubscribe, health, selftest };
