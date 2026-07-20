/**
 * مصدر واحد لقائمة الأصول (Origins) المسموح بها.
 * يستخدمه server.js لإعداد CORS، ونقطة /health لعرض القائمة الفعلية.
 */
function buildAllowedOrigins() {
  const list = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

  // السماح دائماً بأصل الخادم نفسه: المتصفح يرسل ترويسة Origin مع طلبات POST
  // حتى من نفس الموقع، فالصفحات التي يخدمها هذا الخادم (مثل /email/subscribe.html)
  // تحتاج أن يكون أصلها ضمن القائمة.
  if (process.env.APP_URL) {
    const self = process.env.APP_URL.trim().replace(/\/$/, "");
    if (self && !list.includes(self)) list.push(self);
  }
  return list;
}

module.exports = { buildAllowedOrigins };
