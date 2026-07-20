/**
 * وحدة الإرسال — تدعم مسارين وتختار تلقائيًا:
 *
 * 1) BREVO_API_KEY  →  واجهة Brevo عبر HTTPS (المنفذ 443)  ← الموصى به على Render
 *    السبب: منصة Render تحجب المنافذ 25/465/587 على الخطة المجانية، فأي إرسال
 *    عبر SMTP ينتهي بـ "Connection timeout". أما HTTPS فلا يمكن حجبه.
 *    المفتاح من: Brevo → SMTP & API → API Keys (يبدأ بـ xkeysib-)
 *
 * 2) SMTP_HOST/USER/PASS  →  nodemailer عبر SMTP (يعمل محليًا وعلى الخطط المدفوعة)
 *
 * 3) لا شيء منهما → وضع DRY_RUN: يسجّل بدل الإرسال (لا يعطّل النظام).
 *
 * متغيّرات أخرى: MAIL_FROM, MAIL_REPLY_TO, APP_URL, MAIL_SENDER_NAME, MAIL_SENDER_ADDRESS
 */
const nodemailer = require("nodemailer");

const {
  BREVO_API_KEY,
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM = "ArabDiving <info@arabdiving.com>",
  // عنوان الردود — تذهب إليه رسائل من يضغط Reply (صندوق حقيقي)
  MAIL_REPLY_TO = "info@arabdiving.com",
} = process.env;

const USE_API = !!BREVO_API_KEY;
const USE_SMTP = !USE_API && !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
const DRY_RUN = !USE_API && !USE_SMTP;

let transporter = null;
if (USE_SMTP) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// تفكيك "الاسم <العنوان>" إلى كائن يفهمه Brevo API
function parseAddress(str) {
  const m = String(str || "").match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1] || undefined, email: m[2].trim() };
  return { email: String(str || "").trim() };
}

/** الإرسال عبر واجهة Brevo (HTTPS) — يتجاوز حجب منافذ SMTP */
async function sendViaBrevoApi({ to, subject, html, from, replyTo, headers }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000); // مهلة 20 ثانية
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: parseAddress(from),
        to: [{ email: to }],
        replyTo: parseAddress(replyTo),
        subject,
        htmlContent: html,
        ...(headers && Object.keys(headers).length ? { headers } : {}),
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    let body = null;
    try { body = JSON.parse(text); } catch { /* رد غير JSON */ }

    if (!res.ok) {
      // نُظهر رسالة Brevo الحرفية (مثل: sender not valid / unauthorized)
      const reason = body?.message || text.slice(0, 300) || `HTTP ${res.status}`;
      return { ok: false, via: "api", error: `Brevo API ${res.status}: ${reason}` };
    }
    return { ok: true, via: "api", id: body?.messageId || null };
  } catch (error) {
    const msg = error.name === "AbortError" ? "انتهت مهلة الاتصال بواجهة Brevo" : error.message;
    return { ok: false, via: "api", error: msg };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * إرسال رسالة واحدة.
 * @returns {Promise<{ok:boolean, via?:string, dryRun?:boolean, id?:string, error?:string}>}
 */
async function sendMail({ to, subject, html, from = MAIL_FROM, replyTo = MAIL_REPLY_TO, headers = {} }) {
  if (DRY_RUN) {
    console.log(`✉️  [DRY_RUN] → ${to} | ${subject} | reply-to: ${replyTo}`);
    return { ok: true, dryRun: true };
  }

  if (USE_API) {
    const r = await sendViaBrevoApi({ to, subject, html, from, replyTo, headers });
    if (!r.ok) console.error(`✉️  فشل الإرسال (API) إلى ${to}:`, r.error);
    return r;
  }

  try {
    const info = await transporter.sendMail({ from, to, replyTo, subject, html, headers });
    return { ok: true, via: "smtp", id: info.messageId };
  } catch (error) {
    console.error(`✉️  فشل الإرسال (SMTP) إلى ${to}:`, error.message);
    return { ok: false, via: "smtp", error: error.message };
  }
}

function isDryRun() {
  return DRY_RUN;
}

// أي مسار إرسال يعمل الآن — يظهر في /health و/selftest
function transportMode() {
  return USE_API ? "brevo-api (HTTPS)" : USE_SMTP ? `smtp (${SMTP_HOST}:${SMTP_PORT})` : "dry-run";
}

// التحقق من جاهزية الاتصال (يُستدعى في التشخيص)
async function verify() {
  if (DRY_RUN) return { ok: true, dryRun: true };
  if (USE_API) {
    // نستعلم عن الحساب — يثبت أن المفتاح صحيح وأن HTTPS غير محجوب
    try {
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": BREVO_API_KEY, accept: "application/json" },
      });
      const text = await res.text();
      if (!res.ok) return { ok: false, via: "api", error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
      let acc = null; try { acc = JSON.parse(text); } catch {}
      return { ok: true, via: "api", account: acc?.email || null };
    } catch (error) {
      return { ok: false, via: "api", error: error.message };
    }
  }
  try {
    await transporter.verify();
    return { ok: true, via: "smtp" };
  } catch (error) {
    return { ok: false, via: "smtp", error: error.message };
  }
}

module.exports = { sendMail, isDryRun, verify, transportMode, MAIL_FROM };
