/**
 * قوالب البريد: دمج المتغيّرات + غلاف RTL موحّد + تذييل الامتثال الإلزامي
 * (هوية المرسِل + عنوانه + رابط إلغاء الاشتراك) المطلوب قانونياً في السعودية ومصر.
 */

const APP_URL = process.env.APP_URL || "http://localhost:5000";
const SENDER_NAME = process.env.MAIL_SENDER_NAME || "ArabDiving";
const SENDER_ADDRESS =
  process.env.MAIL_SENDER_ADDRESS || "ArabDiving — البحر الأحمر، مصر / السعودية";

// دمج متغيّرات بسيطة مثل {{name}} داخل النص
function render(str, vars = {}) {
  if (!str) return "";
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : ""
  );
}

// غلاف HTML موحّد يتضمّن تذييل الامتثال ورابط إلغاء الاشتراك
function wrap({ contentHtml, subscriber }) {
  const unsubUrl = subscriber
    ? `${APP_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
    : `${APP_URL}/api/newsletter/unsubscribe`;

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
      <div>
        وصلتك هذه الرسالة لأنك اشتركت في قائمتنا البريدية.
        <a href="${unsubUrl}" style="color:#0b6ea8;">إلغاء الاشتراك</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// يبني رسالة كاملة: يدمج المتغيّرات ثم يغلّفها
function build({ html, subscriber, vars = {} }) {
  const merged = render(html, {
    name: subscriber?.name || "صديقنا الغوّاص",
    email: subscriber?.email || "",
    ...vars,
  });
  return wrap({ contentHtml: merged, subscriber });
}

module.exports = { render, wrap, build, APP_URL };
