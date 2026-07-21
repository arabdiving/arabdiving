/*
  وضعا الموقع (يحدَّد من لوحة الإدارة):
  - full  = الموقع الكامل بكل صفحاته
  - focus = «موقع يحل مشكلة»: دليل المدربين + مراكز الغوص + الأدوات فقط
    الأدوات = حاسبة الأوزان + خريطة مواقع الغوص + الاستبيانات (اكتشف نمطك، التوافق، التعلم)
*/

export type SiteMode = "full" | "focus";

// الصفحات العامة المسموحة في وضع «يحل مشكلة» (مطابقة بالبادئة)
export const FOCUS_ALLOWED: string[] = [
  "/",                     // رئيسية مختصرة
  "/instructors",          // دليل المدربين + الانضمام + البروفايلات
  "/family-booking",       // دليل مراكز الغوص + الحجز
  "/store",                // صفحات المراكز العامة
  "/community",            // مجتمع الغواصين (المنشورات وصفحاتها المنفردة)
  "/weight-calculator",    // أداة: حاسبة الأوزان
  "/dive-sites",           // أداة: خريطة مواقع الغوص
  "/course-standards",     // معايير الأوبن ووتر والأدفانس الدولية
  "/quiz",                 // استبيان: اكتشف نمطك
  "/training-fit",         // استبيان: التوافق التدريبي
  "/survey",               // استبيان: التعلم
  "/learning-difficulties",// استبيان: صعوبات التعلم
  // أساسيات التشغيل (لا تظهر في القوائم لكنها تعمل)
  "/login", "/register", "/profile", "/admin", "/my-store", "/change-password",
];

export function isAllowedInFocus(pathname: string): boolean {
  if (pathname === "/") return true;
  return FOCUS_ALLOWED.some((p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/")));
}

// قوائم وضع «يحل مشكلة»
export const FOCUS_NAV_MAIN = [
  { href: "/", label: "الرئيسية" },
  { href: "/instructors", label: "دليل المدربين 🧑‍🏫" },
  { href: "/family-booking", label: "مراكز الغوص 🏛️" },
  { href: "/community", label: "المجتمع 💬" },
];

export const FOCUS_NAV_TOOLS = [
  { href: "/course-standards", label: "📏 معايير الكورسات الدولية" },
  { href: "/weight-calculator", label: "⚖️ حاسبة الأوزان" },
  { href: "/dive-sites", label: "🗺️ خريطة مواقع الغوص" },
  { href: "/quiz", label: "🎨 اكتشف نمطك" },
  { href: "/training-fit", label: "🤝 استبيان التوافق" },
  { href: "/survey", label: "🧠 استبيان التعلم" },
];
