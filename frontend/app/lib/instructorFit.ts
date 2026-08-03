/*
  «من يناسبني؟» — نظام الملاءمة بالاختيار القسري (Forced-Choice).
  لماذا قسري؟ في مقياس 1-5 الجميع يعطي نفسه 5. أما «اختر واحدًا» فكل اختيار له ثمن —
  اختيار المبتدئ يعني التنازل عن صورة "مدرب المحترفين"، فلا توجد إجابة تجميلية.
  والحافز متوافق: من يحدد من لا يناسبه يحصل على طلاب أنسب له — الصدق يربح.
*/

export type FitKey = "level" | "pace" | "age" | "style" | "group" | "special";

export const FIT_QUESTIONS: Array<{
  key: FitKey;
  question: string;
  a: { value: string; label: string; icon: string };
  b: { value: string; label: string; icon: string };
}> = [
  {
    key: "level",
    question: "أيهما تستمتع بتدريبه أكثر — بصدق؟",
    a: { value: "beginner", label: "المبتدئ الخائف الذي أبني ثقته من الصفر", icon: "🐣" },
    b: { value: "advanced", label: "المتقدم الطموح الذي أصقل مهاراته وأتحداه", icon: "🚀" },
  },
  {
    key: "pace",
    question: "أي إيقاع تدريب يناسب طبيعتك فعلًا؟",
    a: { value: "patient", label: "الصبر والتكرار حتى يتقن الطالب — مهما أخذ وقتًا", icon: "🐢" },
    b: { value: "fast", label: "إيقاع سريع وتحديات — الطالب البطيء يستنزفني", icon: "⚡" },
  },
  {
    key: "age",
    question: "مع من أداؤك التدريبي في قمته؟",
    a: { value: "kids", label: "الأطفال والنشء — أملك لغتهم وصبرهم", icon: "👧" },
    b: { value: "adults", label: "البالغون — أفضل حوار الكبار وجديتهم", icon: "🧑" },
  },
  {
    key: "style",
    question: "أسلوبك الحقيقي في الحصة؟",
    a: { value: "structured", label: "نظام وانضباط وخطة تُنفَّذ حرفيًا", icon: "📋" },
    b: { value: "fun", label: "مرح ومرونة — الخطة تخدم المتعة لا العكس", icon: "🎈" },
  },
  {
    key: "group",
    question: "أين تكون في أفضل حالاتك؟",
    a: { value: "private", label: "تدريب فردي وخاص — تركيز كامل على شخص واحد", icon: "🎯" },
    b: { value: "group", label: "مجموعات وطاقة جماعية — الديناميكية تلهمني", icon: "👥" },
  },
  {
    key: "special",
    question: "الحالات الخاصة (ذوو الهمم، رهاب شديد، احتياجات فريدة)؟",
    a: { value: "adaptive", label: "تحدٍّ أعشقه — لدي الصبر والأدوات لهم", icon: "💪" },
    b: { value: "standard", label: "أفضل الحالات القياسية — الخاصة تحتاج متخصصًا غيري", icon: "🤿" },
  },
];

// الصياغة العلنية: «يناسبه» + توجيه محترم لمن لا يناسبه (ملاءمة لا عيب)
export const FIT_DISPLAY: Record<string, Record<string, { suits: string; redirect: string }>> = {
  level: {
    beginner: { suits: "المبتدئ والخائف من الماء", redirect: "تبحث عن تحديات متقدمة وتقنية" },
    advanced: { suits: "المتقدم الباحث عن صقل مهاراته", redirect: "في أول غطساتك وتحتاج بناء ثقة هادئًا" },
  },
  pace: {
    patient: { suits: "من يحتاج وقته الكامل دون ضغط", redirect: "تحب الإيقاع السريع والإنجاز المكثف" },
    fast: { suits: "سريع التعلم ومحب للتحدي", redirect: "تفضّل التمهل والتكرار حتى الإتقان" },
  },
  age: {
    kids: { suits: "الأطفال والنشء والعائلات", redirect: "تفضّل أجواء تدريب البالغين" },
    adults: { suits: "البالغين بجدية واحترافية", redirect: "تبحث عن مدرب متخصص بالأطفال" },
  },
  style: {
    structured: { suits: "محبي النظام والخطط الواضحة", redirect: "تفضّل أجواء مرحة عفوية" },
    fun: { suits: "من يتعلم بالمرح والمرونة", redirect: "تفضّل الانضباط الصارم والجدية الكاملة" },
  },
  group: {
    private: { suits: "التدريب الفردي والخصوصية", redirect: "تحب طاقة المجموعات والأصدقاء" },
    group: { suits: "المجموعات والأجواء الجماعية", redirect: "تريد تركيزًا فرديًا كاملًا عليك" },
  },
  special: {
    adaptive: { suits: "ذوي الهمم والحالات الخاصة — بصبر وأدوات متخصصة", redirect: "" },
    standard: { suits: "الحالات القياسية بإتقان", redirect: "من ذوي الهمم أو حالة خاصة — مدرب تكيّفي متخصص أنسب لك" },
  },
};

// إحداثيات مدن التدريب (للخريطة وحساب الأقرب) — مصر + السعودية
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // 🇪🇬 مصر — البحر الأحمر وخليج العقبة
  "شرم الشيخ": { lat: 27.9158, lng: 34.3299 },
  "دهب":       { lat: 28.4913, lng: 34.5136 },
  "الغردقة":   { lat: 27.2579, lng: 33.8116 },
  "مرسى علم":  { lat: 25.0676, lng: 34.8790 },
  "الجونة":    { lat: 27.3949, lng: 33.6782 },
  "سفاجا":     { lat: 26.7517, lng: 33.9344 },
  "نويبع":     { lat: 29.0327, lng: 34.6672 },
  // 🇸🇦 السعودية — ساحل البحر الأحمر
  "جدة":       { lat: 21.4858, lng: 39.1925 },
  "ينبع":      { lat: 24.0895, lng: 38.0618 },
  "أملج":      { lat: 25.0209, lng: 37.2685 },
  "الوجه":     { lat: 26.2408, lng: 36.4632 },
  "ضبا":       { lat: 27.3494, lng: 35.6907 },
  "الليث":     { lat: 20.1500, lng: 40.2667 },
  "جزر فرسان": { lat: 16.7000, lng: 42.1167 },
  "نيوم":      { lat: 28.0000, lng: 35.2500 },
  // 🇸🇦 السعودية — الخليج العربي
  "الخبر":     { lat: 26.2794, lng: 50.2083 },
  "الجبيل":    { lat: 27.0174, lng: 49.6583 },
};

// الدول المدعومة ومدن كل دولة (لنموذج الانضمام والفلاتر)
export const COUNTRIES = ["مصر", "السعودية"] as const;
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "مصر": ["شرم الشيخ", "دهب", "الغردقة", "مرسى علم", "الجونة", "سفاجا", "نويبع", "أخرى"],
  "السعودية": ["جدة", "ينبع", "أملج", "الوجه", "ضبا", "نيوم", "الليث", "جزر فرسان", "الخبر", "الجبيل", "أخرى"],
};

// مسافة هافرساين بالكيلومتر
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}
