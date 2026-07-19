/**
 * وحدة الإرسال — nodemailer عبر SMTP.
 * إن لم تُضبط بيانات SMTP في .env تعمل بوضع DRY_RUN (تسجّل بدل الإرسال)،
 * حتى تختبر النظام كاملاً دون حساب بريد.
 *
 * متغيّرات .env المطلوبة للإرسال الفعلي:
 *   SMTP_HOST      (مثال Brevo: smtp-relay.brevo.com)
 *   SMTP_PORT      (587)
 *   SMTP_USER
 *   SMTP_PASS
 *   MAIL_FROM      (مثال: "ArabDiving <no-reply@arabdiving.com>")
 *   APP_URL        (رابط الموقع لروابط التأكيد/الإلغاء، مثال https://arabdiving.com)
 *   MAIL_SENDER_NAME, MAIL_SENDER_ADDRESS  (لعرضهما في تذييل الامتثال)
 */
const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM = "ArabDiving <info@arabdiving.com>",
  // عنوان الردود — تذهب إليه رسائل من يضغط Reply (صندوق حقيقي)
  MAIL_REPLY_TO = "info@arabdiving.com",
} = process.env;

const DRY_RUN = !(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter = null;
if (!DRY_RUN) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * إرسال رسالة واحدة.
 * @returns {Promise<{ok:boolean, dryRun?:boolean, id?:string, error?:string}>}
 */
async function sendMail({ to, subject, html, from = MAIL_FROM, replyTo = MAIL_REPLY_TO, headers = {} }) {
  if (DRY_RUN) {
    console.log(`✉️  [DRY_RUN] → ${to} | ${subject} | reply-to: ${replyTo}`);
    return { ok: true, dryRun: true };
  }
  try {
    const info = await transporter.sendMail({ from, to, replyTo, subject, html, headers });
    return { ok: true, id: info.messageId };
  } catch (error) {
    console.error(`✉️  فشل الإرسال إلى ${to}:`, error.message);
    return { ok: false, error: error.message };
  }
}

function isDryRun() {
  return DRY_RUN;
}

// التحقق من جاهزية الاتصال (يُستدعى عند الإقلاع للتشخيص)
async function verify() {
  if (DRY_RUN) return { ok: true, dryRun: true };
  try {
    await transporter.verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

module.exports = { sendMail, isDryRun, verify, MAIL_FROM };
