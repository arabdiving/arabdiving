/**
 * رسائل الأحداث (Transactional) — ترحيب التسجيل، قرار المدرب، نتائج الاستبيانات.
 * هذه رسائل خدمة يحق للمستخدم استقبالها بحكم تعامله مع المنصة (ليست تسويقًا)،
 * لذا تذييلها يوضح سبب الوصول دون ادعاء «اشتراك بالنشرة».
 * كل الدوال غير معطِّلة: تُستدعى بـ .catch وتسجّل نتيجتها فقط.
 */
const { sendMail } = require("./mailer");
const { APP_URL } = require("./emailTemplates");

const SENDER_NAME = process.env.MAIL_SENDER_NAME || "ArabDiving";
const SENDER_ADDRESS =
  process.env.MAIL_SENDER_ADDRESS || "ArabDiving — info@arabdiving.com";
const SITE_URL = process.env.SITE_URL || "https://arabdiving.com";

// غلاف رسائل الخدمة (بدون رابط إلغاء نشرة — ليست نشرة)
function wrapService(contentHtml) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f4f7fa;font-family:Tahoma,Arial,sans-serif;color:#1a2b3c;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#0b6ea8;color:#fff;padding:18px 24px;border-radius:12px 12px 0 0;font-size:20px;font-weight:bold;">
      🤿 ${SENDER_NAME}
    </div>
    <div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;line-height:1.9;font-size:15px;">
      ${contentHtml}
    </div>
    <div style="text-align:center;color:#7a8a99;font-size:12px;padding:18px 8px;line-height:1.8;">
      <div>${SENDER_ADDRESS}</div>
      <div>وصلتك هذه الرسالة لأن لديك حسابًا أو طلبًا على منصة ${SENDER_NAME}.</div>
    </div>
  </div>
</body>
</html>`;
}

const log = (label) => (r) => {
  if (r?.ok) console.log(`📧 ${label}: أُرسلت ✅`);
  else console.error(`📧 ${label}: فشلت ❌ ${r?.error || ""}`);
};

// عنوان الأدمن: ADMIN_EMAIL من البيئة، وإلا أول حساب أدمن في القاعدة (يُخزَّن مؤقتًا)
let _adminEmailCache = null;
async function resolveAdminEmail() {
  if (process.env.ADMIN_EMAIL) return process.env.ADMIN_EMAIL.trim();
  if (_adminEmailCache) return _adminEmailCache;
  try {
    const User = require("../models/User");
    const admin = await User.findOne({ role: "admin" }, "email").sort({ createdAt: 1 });
    _adminEmailCache = admin?.email || null;
    return _adminEmailCache;
  } catch { return null; }
}

/* ── 1) ترحيب بعد إنشاء الحساب ── */
function sendWelcomeEmail(user) {
  if (!user?.email) return;
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">أهلًا بك في مجتمع الغوص العربي 🌊</h2>
    <p>مرحبًا ${user.name || "صديقنا الغوّاص"}،</p>
    <p>تم إنشاء حسابك بنجاح. إليك أفضل نقطة بداية حسب هدفك:</p>
    <ul style="line-height:2.2;">
      <li>🧑‍🏫 <a href="${SITE_URL}/instructors" style="color:#0b6ea8;">دليل المدربين</a> — اعرف مدربك ببصمته التدريبية قبل أول غطسة</li>
      <li>📏 <a href="${SITE_URL}/course-standards" style="color:#0b6ea8;">معايير الكورسات الدولية</a> — حقك في الأوبن ووتر بالأرقام</li>
      <li>🤝 <a href="${SITE_URL}/training-fit" style="color:#0b6ea8;">استبيان التوافق</a> — أي مدرب يناسب شخصيتك؟</li>
    </ul>
    <p>ولو كنت <b>مدرب غوص</b>: أنشئ بروفايلك من
      <a href="${SITE_URL}/instructors/join" style="color:#0b6ea8;">انضم كمدرب</a> 🤿</p>
    <p style="color:#7a8a99;font-size:13px;">أسئلتك تصلنا بالرد على هذه الرسالة مباشرة.</p>`);
  sendMail({ to: user.email, subject: "أهلًا بك في ArabDiving 🤿", html })
    .then(log(`ترحيب ${user.email}`)).catch((e) => console.error("📧 ترحيب:", e.message));
}

/* ── 2) قرار طلب المدرب (موافقة مبدئية / رفض) ── */
function sendInstructorDecisionEmail(user, status, slugOrId = "") {
  if (!user?.email) return;
  const profileUrl = `${SITE_URL}/instructors/${encodeURIComponent(slugOrId)}`;
  const html = status === "approved"
    ? wrapService(`
      <h2 style="color:#1e7e34;">مبروك كابتن ${user.name || ""} — تمت الموافقة المبدئية ✅</h2>
      <p>بروفايلك أصبح ظاهرًا في دليل المدربين، والمتدربون يمكنهم الآن مراسلتك مباشرة.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${profileUrl}" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-weight:bold;">شاهد بروفايلك العام</a>
      </p>
      <p><b>خطوتان تضاعفان فرصك:</b></p>
      <ul style="line-height:2.2;">
        <li>أكمل استبياني «بصمة المدرب» و«من يناسبني» إن لم تفعل — البروفايلات المكتملة تتصدر</li>
        <li>شارك رابط بروفايلك في حساباتك — من يبحث عن اسمك يجدك</li>
      </ul>
      <p style="color:#7a8a99;font-size:13px;">التوثيق ✅ (الشارة الزرقاء) خطوة لاحقة بعد التحقق من رقمك لدى منظمتك.</p>`)
    : wrapService(`
      <h2 style="color:#b45309;">بخصوص طلب انضمامك كمدرب</h2>
      <p>مرحبًا كابتن ${user.name || ""}،</p>
      <p>لم نتمكن من الموافقة المبدئية على طلبك في هذه المرحلة — السبب الأكثر شيوعًا صور كارنيه غير واضحة أو ناقصة (المطلوب: وش وضهر لكل كارنيه).</p>
      <p>عدّل صورك من صفحة <a href="${SITE_URL}/instructors/join" style="color:#0b6ea8;">ملف المدرب</a> واحفظ — يعود طلبك تلقائيًا لقائمة المراجعة.</p>
      <p style="color:#7a8a99;font-size:13px;">ولأي استفسار رُدّ على هذه الرسالة مباشرة.</p>`);
  sendMail({
    to: user.email,
    subject: status === "approved" ? "تمت الموافقة على انضمامك كمدرب ✅ — ArabDiving" : "بخصوص طلب انضمامك كمدرب — ArabDiving",
    html,
  }).then(log(`قرار مدرب ${user.email}`)).catch((e) => console.error("📧 قرار مدرب:", e.message));
}

/* ── 3) نتيجة استبيان «بصمة المدرب» ── */
const AXES_AR = {
  planning: "🎯 التخطيط والبريفينج",
  strategies: "📚 استراتيجيات الشرح",
  management: "🛡️ إدارة المجموعة والوعي الظرفي",
  engagement: "❤️ التحفيز واحتواء الخوف",
  watermanship: "🌊 الإتقان المائي والعرض",
  professionalism: "📈 الاحترافية والتطوير",
};

function sendFingerprintResultEmail(user, scores = {}, strengths = [], weakness = null) {
  if (!user?.email) return;
  const bars = Object.entries(AXES_AR).map(([k, label]) => {
    const v = scores[k] || 0;
    const pct = Math.round((v / 5) * 100);
    const star = strengths.includes(k) ? " ⭐" : "";
    return `<tr>
      <td style="padding:6px 0;font-size:13.5px;white-space:nowrap;">${label}${star}</td>
      <td style="width:55%;padding:6px 10px;">
        <div style="background:#e8eef4;border-radius:6px;height:12px;"><div style="width:${pct}%;height:12px;border-radius:6px;background:${strengths.includes(k) ? "#c9952a" : "#0b6ea8"};"></div></div>
      </td>
      <td style="font-size:13px;color:#7a8a99;">${v}/5</td></tr>`;
  }).join("");
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">🧬 بصمتك التدريبية — النتيجة الكاملة</h2>
    <p>كابتن ${user.name || ""}، هذا ملخص تقييمك الذاتي (مبني على TSES وDanielson ومعايير مدربي الغوص):</p>
    <table style="width:100%;border-collapse:collapse;margin:14px 0;">${bars}</table>
    <p>⭐ <b>نقطتا تميّزك المعلنتان:</b> ${strengths.map((s) => AXES_AR[s] || s).join(" · ") || "—"}</p>
    ${weakness ? `<div style="background:#fff7e6;border:1px solid #f0d9a8;border-radius:10px;padding:12px 16px;font-size:13.5px;">
      🔒 <b>مجال تطويرك (سرّي — لك وحدك):</b> ${AXES_AR[weakness] || weakness}.
      لا يظهر في بروفايلك العام إلا إذا اخترت إظهاره بنفسك — والشجاعة في إظهاره تُحترم.</div>` : ""}
    <p style="margin-top:16px;">احتفظ بهذه الرسالة — وأعد الاستبيان بعد كل موسم لترى تطورك.</p>`);
  sendMail({ to: user.email, subject: "🧬 نتيجة بصمتك التدريبية — ArabDiving", html })
    .then(log(`بصمة ${user.email}`)).catch((e) => console.error("📧 بصمة:", e.message));
}

/* ── 4) نتيجة استبيان «من يناسبني؟» ── */
const FIT_AR = {
  level: { beginner: "المبتدئ والخائف من الماء", advanced: "المتقدم الباحث عن التحدي" },
  pace: { patient: "من يحتاج صبرًا وتكرارًا", fast: "سريع التعلم ومحب الإيقاع السريع" },
  age: { kids: "الأطفال والنشء", adults: "البالغون" },
  style: { structured: "محبو النظام والخطط", fun: "من يتعلم بالمرح والمرونة" },
  group: { private: "التدريب الفردي الخاص", group: "المجموعات والطاقة الجماعية" },
  special: { adaptive: "ذوو الهمم والحالات الخاصة", standard: "الحالات القياسية بإتقان" },
};

function sendFitResultEmail(user, fit = {}) {
  if (!user?.email) return;
  const suits = Object.entries(FIT_AR)
    .map(([k, m]) => m[fit[k]])
    .filter(Boolean)
    .map((t) => `<li>✅ ${t}</li>`)
    .join("");
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">🤝 «من يناسبك؟» — اختياراتك الصادقة</h2>
    <p>كابتن ${user.name || ""}، هذه خلاصة اختياراتك القسرية — وهي ما سيظهر للمتدربين في بروفايلك:</p>
    <ul style="line-height:2.2;">${suits || "<li>—</li>"}</ul>
    <p>تذكّر فلسفتها: <b>كل اختيار له ثمن، وهذا سرّ صدقه</b> — الصادق يحصل على طلاب يناسبونه فيبدع وتعلو تقييماته.</p>
    <p>يمكنك إعادة الاستبيان في أي وقت من صفحة <a href="${SITE_URL}/instructors/join" style="color:#0b6ea8;">ملف المدرب</a>.</p>`);
  sendMail({ to: user.email, subject: "🤝 نتيجة «من يناسبك؟» — ArabDiving", html })
    .then(log(`ملاءمة ${user.email}`)).catch((e) => console.error("📧 ملاءمة:", e.message));
}

/* ── 5) تسجيل اختياري في النشرة أثناء إنشاء الحساب ──
   ينشئ مشتركًا pending ويرسل بريد التأكيد (Double Opt-in يبقى إلزاميًا). */
async function enrollInNewsletter({ email, name = "", ip = "", userAgent = "" }) {
  try {
    const Subscriber = require("../models/Subscriber");
    const { build } = require("./emailTemplates");
    const clean = String(email || "").toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return;

    const consentRecord = {
      given: true,
      at: new Date(),
      ip,
      userAgent,
      text: "وافقت أثناء إنشاء الحساب على استلام النشرة البريدية من ArabDiving، مع علمي بإمكانية إلغاء الاشتراك في أي وقت.",
    };

    let sub = await Subscriber.findOne({ email: clean });
    if (sub && sub.status === "confirmed") return; // مشترك مؤكد بالفعل
    if (sub) {
      sub.name = name || sub.name;
      sub.status = "pending";
      sub.consent = consentRecord;
      sub.source = "register-form";
      await sub.save();
    } else {
      sub = await Subscriber.create({ email: clean, name, status: "pending", source: "register-form", consent: consentRecord });
    }

    const confirmUrl = `${APP_URL}/api/newsletter/confirm?token=${sub.confirmToken}`;
    const html = build({
      subscriber: sub,
      html: `
        <h2 style="color:#0b6ea8;">خطوة أخيرة لتأكيد اشتراكك في النشرة 🌊</h2>
        <p>مرحبًا {{name}}،</p>
        <p>اخترت أثناء إنشاء حسابك الاشتراك في نشرة ArabDiving. اضغط الزر لتأكيد اشتراكك:</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${confirmUrl}" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:14px 34px;border-radius:10px;font-weight:bold;">تأكيد الاشتراك</a>
        </p>
        <p style="color:#7a8a99;font-size:13px;">إن لم تكن أنت، تجاهل هذه الرسالة ولن تصلك النشرة.</p>`,
    });
    sendMail({ to: sub.email, subject: "أكّد اشتراكك في نشرة ArabDiving 🤿", html })
      .then(log(`تأكيد نشرة ${sub.email}`));
  } catch (e) {
    console.error("📧 تسجيل النشرة من إنشاء الحساب:", e.message);
  }
}

/* ── 6) حساب أنشأه الأدمن: بيانات الدخول + إلزام تغيير كلمة المرور ── */
function sendAdminCreatedAccountEmail(user, tempPassword, opts = {}) {
  if (!user?.email) return;
  const isInstructor = !!opts.instructor;
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">تم إنشاء حسابك في ${SENDER_NAME} 🤿</h2>
    <p>مرحبًا ${user.name || ""}،</p>
    <p>أنشأت إدارة المنصة حسابًا لك. هذه بيانات دخولك:</p>
    <div style="background:#f4f7fa;border:1px solid #dbe4ee;border-radius:10px;padding:16px;margin:16px 0;font-size:14px;line-height:2;">
      <div>📧 <b>البريد:</b> <span dir="ltr">${user.email}</span></div>
      <div>🔑 <b>كلمة المرور المؤقتة:</b> <span dir="ltr" style="background:#fff;border:1px solid #dbe4ee;border-radius:6px;padding:2px 10px;font-family:monospace;">${tempPassword}</span></div>
    </div>
    <div style="background:#fff7e6;border:1px solid #f0d9a8;border-radius:10px;padding:12px 16px;font-size:13.5px;">
      ⚠️ <b>مهم:</b> كلمة المرور هذه مؤقتة — سيطلب منك النظام تغييرها عند أول تسجيل دخول. لا تشاركها مع أحد.
    </div>
    <p style="text-align:center;margin:24px 0;">
      <a href="${SITE_URL}/login" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:14px 34px;border-radius:10px;font-weight:bold;">تسجيل الدخول الآن</a>
    </p>
    ${isInstructor ? `<p><b>وبما أنك مدرب:</b> أكمل بروفايلك من
      <a href="${SITE_URL}/instructors/join" style="color:#0b6ea8;">صفحة ملف المدرب</a> —
      البيانات، ثم استبيان البصمة التدريبية، ثم «من يناسبني». وارفع صور الكارنيه للتوثيق.</p>` : ""}
    <p style="color:#7a8a99;font-size:13px;">لأي استفسار رُدّ على هذه الرسالة مباشرة.</p>`);
  sendMail({ to: user.email, subject: `بيانات دخولك إلى ${SENDER_NAME} 🔑`, html })
    .then(log(`حساب أدمن ${user.email}`)).catch((e) => console.error("📧 حساب أدمن:", e.message));
}

/* ── 7) إشعار المدرب برسالة جديدة وصلته عبر «راسلني» ── */
function sendInstructorNewMessageEmail(user, msg = {}) {
  if (!user?.email) return;
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">📬 وصلتك رسالة جديدة من زائر</h2>
    <p>كابتن ${user.name || ""}، أرسل لك <b>${msg.name || "زائر"}</b> رسالة عبر بروفايلك:</p>
    <div style="background:#f4f7fa;border-right:4px solid #0b6ea8;border-radius:8px;padding:14px 16px;margin:14px 0;font-size:14px;line-height:1.9;white-space:pre-wrap;">${(msg.message || "").slice(0, 800)}</div>
    ${msg.contact ? `<p>📞 وسيلة تواصله للرد: <b dir="ltr">${msg.contact}</b></p>` : `<p style="color:#b45309;">لم يترك وسيلة تواصل — رُدّ من صندوق رسائلك في الموقع.</p>`}
    <p style="text-align:center;margin:22px 0;">
      <a href="${SITE_URL}/instructors/join" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-weight:bold;">افتح صندوق رسائلي</a>
    </p>`);
  sendMail({ to: user.email, subject: `📬 رسالة جديدة من ${msg.name || "زائر"} — ArabDiving`, html })
    .then(log(`رسالة مدرب ${user.email}`)).catch((e) => console.error("📧 رسالة مدرب:", e.message));
}

/* ── 8) إشعار الأدمن بحجز جديد ── */
async function notifyAdminNewBooking(booking = {}) {
  const to = await resolveAdminEmail();
  if (!to) return;
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">🎟️ حجز جديد وصل المنصة</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:2;">
      <tr><td style="color:#7a8a99;">رقم الحجز:</td><td><b>${booking.ticketCode || "—"}</b></td></tr>
      <tr><td style="color:#7a8a99;">النوع:</td><td>${booking.type === "course" ? "دورة" : "رحلة"}${booking.centerName ? " · " + booking.centerName : ""}</td></tr>
      <tr><td style="color:#7a8a99;">العميل:</td><td>${booking.contact?.name || "—"}</td></tr>
      <tr><td style="color:#7a8a99;">الجوال:</td><td dir="ltr">${booking.contact?.phone || "—"}</td></tr>
      <tr><td style="color:#7a8a99;">التاريخ:</td><td>${booking.date || "—"} · ${booking.peopleCount || 1} فرد</td></tr>
      <tr><td style="color:#7a8a99;">التواصل المفضّل:</td><td>${booking.contactMethod === "phone" ? "مكالمة" : booking.contactMethod === "email" ? "بريد" : "واتساب"}${booking.bestCallTime ? " · " + booking.bestCallTime : ""}</td></tr>
    </table>
    <p style="text-align:center;margin:22px 0;">
      <a href="${SITE_URL}/admin/bookings" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-weight:bold;">إدارة الحجوزات</a>
    </p>`);
  sendMail({ to, subject: `🎟️ حجز جديد (${booking.contact?.name || "عميل"}) — ArabDiving`, html })
    .then(log(`حجز للأدمن ${to}`)).catch((e) => console.error("📧 حجز أدمن:", e.message));
}

/* ── 9) إشعار الأدمن بطلب انضمام مدرب جديد للمراجعة ── */
async function notifyAdminNewInstructorApplication(user = {}, profile = {}) {
  const to = await resolveAdminEmail();
  if (!to) return;
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">🧑‍🏫 طلب انضمام مدرب جديد — بانتظار مراجعتك</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:2;">
      <tr><td style="color:#7a8a99;">المدرب:</td><td><b>${user.name || "—"}</b> · <span dir="ltr">${user.email || ""}</span></td></tr>
      <tr><td style="color:#7a8a99;">المنظمة/الرتبة:</td><td>${profile.agency || "—"} · ${profile.rank || "—"}</td></tr>
      <tr><td style="color:#7a8a99;">المدينة:</td><td>${profile.city || "—"}</td></tr>
      <tr><td style="color:#7a8a99;">صور الكارنيه:</td><td>${(profile.cardImages || []).length} صورة مرفوعة</td></tr>
    </table>
    <p>راجع صور الكارنيه وبياناته ثم وافق مبدئيًا أو ارفض:</p>
    <p style="text-align:center;margin:22px 0;">
      <a href="${SITE_URL}/admin/instructors" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-weight:bold;">مراجعة طلبات المدربين</a>
    </p>`);
  sendMail({ to, subject: `🧑‍🏫 طلب مدرب جديد (${user.name || "—"}) — ArabDiving`, html })
    .then(log(`طلب مدرب للأدمن ${to}`)).catch((e) => console.error("📧 طلب مدرب أدمن:", e.message));
}

/* ── 10) إشعار الأدمن بمنشور مجتمع جديد ── */
async function notifyAdminNewPost(user = {}, post = {}) {
  const to = await resolveAdminEmail();
  if (!to) return;
  const snippet = String(post.content || "").slice(0, 300) || (post.image ? "📷 صورة" : post.video ? "🎬 فيديو" : "—");
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">💬 منشور جديد في المجتمع</h2>
    <p><b>${user.name || "عضو"}</b>${user.email ? ` · <span dir="ltr">${user.email}</span>` : ""} نشر:</p>
    <div style="background:#f4f7fa;border-right:4px solid #0b6ea8;border-radius:8px;padding:14px 16px;margin:14px 0;font-size:14px;line-height:1.9;white-space:pre-wrap;">${snippet}</div>
    <p style="text-align:center;margin:20px 0;">
      <a href="${SITE_URL}/community" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:bold;">فتح المجتمع</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}/admin/comments" style="color:#0b6ea8;font-weight:bold;">إدارة المحتوى</a>
    </p>`);
  sendMail({ to, subject: `💬 منشور جديد من ${user.name || "عضو"} — ArabDiving`, html })
    .then(log(`منشور للأدمن ${to}`)).catch((e) => console.error("📧 منشور أدمن:", e.message));
}

/* ── 11) إشعار الأدمن باستفسار/رسالة جديدة عبر نموذج التواصل ── */
async function notifyAdminNewInquiry(msg = {}) {
  const to = await resolveAdminEmail();
  if (!to) return;
  const html = wrapService(`
    <h2 style="color:#0b6ea8;">✉️ استفسار جديد من زائر</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:2;">
      <tr><td style="color:#7a8a99;">الاسم:</td><td><b>${msg.name || "—"}</b></td></tr>
      ${msg.contact ? `<tr><td style="color:#7a8a99;">وسيلة التواصل:</td><td dir="ltr">${msg.contact}</td></tr>` : ""}
      ${msg.page ? `<tr><td style="color:#7a8a99;">من صفحة:</td><td dir="ltr">${msg.page}</td></tr>` : ""}
    </table>
    ${msg.message ? `<div style="background:#f4f7fa;border-right:4px solid #0b6ea8;border-radius:8px;padding:14px 16px;margin:14px 0;font-size:14px;line-height:1.9;white-space:pre-wrap;">${String(msg.message).slice(0, 800)}</div>` : ""}
    <p style="text-align:center;margin:20px 0;">
      <a href="${SITE_URL}/admin/messages" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:bold;">فتح الرسائل</a>
    </p>`);
  sendMail({ to, subject: `✉️ استفسار جديد (${msg.name || "زائر"}) — ArabDiving`, html })
    .then(log(`استفسار للأدمن ${to}`)).catch((e) => console.error("📧 استفسار أدمن:", e.message));
}

module.exports = {
  resolveAdminEmail,
  sendWelcomeEmail,
  sendAdminCreatedAccountEmail,
  sendInstructorNewMessageEmail,
  notifyAdminNewBooking,
  notifyAdminNewInstructorApplication,
  notifyAdminNewPost,
  notifyAdminNewInquiry,
  sendInstructorDecisionEmail,
  sendFingerprintResultEmail,
  sendFitResultEmail,
  enrollInNewsletter,
};
