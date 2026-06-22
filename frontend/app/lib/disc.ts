export type ColorKey = "red" | "yellow" | "green" | "blue";

export const DISC: Record<ColorKey, {
  key: ColorKey; name: string; emoji: string; main: string; light: string;
  desc: string; strengths: string[]; weaknesses: string[];
  asTeacher: string; asStudent: string; teachAdvice: string; studentMatch: string;
}> = {
  red: { key: "red", name: "الأحمر — القائد", emoji: "🔴", main: "#b91c1c", light: "#fef2f2",
    desc: "شخصية قيادية حاسمة مباشرة. تحب التحدي والنتائج السريعة، وتتخذ القرارات بثقة ولا تخاف المواجهة.",
    strengths: ["قيادة", "حسم", "شجاعة", "سرعة قرار", "وضوح"], weaknesses: ["قلة صبر", "تسلّط", "تجاهل المشاعر"],
    asTeacher: "أنت مدرّب قوي وحازم. قدّم الأهداف والنتائج المتوقّعة بوضوح، وكن مباشرًا في ملاحظاتك، واختصر المقدمات وقدّم تحديات تشعل الحماس.",
    asStudent: "تتعلّم أفضل حين يكون الهدف واضحًا. المدرّب المثالي لك: حازم، واضح، يعطيك مساحة للقيادة.",
    teachAdvice: "كن مباشرًا وحاسمًا. أعطه هدفًا وتحديًا واضحًا. ركّز على النتيجة دون إطالة.",
    studentMatch: "يناسبه مدرّب أحمر أو أصفر. الأخضر والأزرق قد يبطئانه." },
  yellow: { key: "yellow", name: "الأصفر — المبدع", emoji: "🟡", main: "#b45309", light: "#fffbeb",
    desc: "شخصية اجتماعية مبدعة مفعمة بالحيوية. تحب المرح والتواصل وتكوين العلاقات وتفكّر خارج الصندوق.",
    strengths: ["إبداع", "حماس", "تواصل", "تفاؤل", "عفوية"], weaknesses: ["تشتّت", "قلة انضباط", "مبالغة عاطفية"],
    asTeacher: "أنت مدرّب ملهم. استخدم القصص والأنشطة والطاقة، لكن نظّم المعلومة وقدّمها متسلسلة كي لا تشتّت متدرّبيك.",
    asStudent: "تتعلّم أفضل في جو مرح وتفاعلي. المدرّب المثالي لك: حيوي ومتنوّع الوسائل ويمنحك مساحة للتعبير.",
    teachAdvice: "استخدم القصص والوسائل البصرية والمرح. تجنّب المحاضرات الطويلة، وحافظ على حماسه.",
    studentMatch: "يناسبه مدرّب أصفر أو أحمر ينظّم طاقته. الأزرق ثقيل عليه قليلًا." },
  green: { key: "green", name: "الأخضر — المسالم", emoji: "🟢", main: "#15803d", light: "#f0fdf4",
    desc: "شخصية ودودة متعاونة صبورة. تقدّر العلاقات والانسجام، تستمع جيدًا وتتجنّب الخلافات وتفضّل الاستقرار.",
    strengths: ["صبر", "تعاون", "استماع", "وفاء", "هدوء"], weaknesses: ["تجنّب المواجهة", "خوف من التغيير", "صعوبة قول لا"],
    asTeacher: "أنت مدرّب صبور وحنون. ابنِ علاقة ثقة ووفّر بيئة آمنة، واحرص أحيانًا على حزم أكثر لدفع المتدرّب للتميّز.",
    asStudent: "تتعلّم أفضل في بيئة آمنة وداعمة وتحتاج أن تثق بمدرّبك. المدرّب المثالي لك: صبور ودود مشجّع.",
    teachAdvice: "كن صبورًا وداعمًا. استمع له وشجّعه وقدّر جهوده، ووفّر بيئة آمنة دون ضغط.",
    studentMatch: "يناسبه مدرّب أخضر أو أزرق منظّم. الأحمر قد يخيفه والأصفر قد يرهقه." },
  blue: { key: "blue", name: "الأزرق — المحلّل", emoji: "🔵", main: "#1d4ed8", light: "#eef4fa",
    desc: "شخصية تحليلية دقيقة منطقية. تحب البيانات الموثّقة وتفكّر بعمق قبل القرار، وتقدّر النظام والدقّة.",
    strengths: ["تحليل", "دقة", "منطق", "تنظيم", "صبر"], weaknesses: ["تردّد", "برود عاطفي", "كثرة أسئلة"],
    asTeacher: "أنت مدرّب دقيق ومنظّم. قدّم المعلومة منطقيًا بأدلّة، لكن احذر كثرة التفاصيل التي تطغى على الصورة الكبيرة.",
    asStudent: "تتعلّم أفضل حين تفهم المنطق و«لماذا». المدرّب المثالي لك: دقيق منطقي يمنحك وقتًا للتحليل.",
    teachAdvice: "قدّم مصادر موثّقة وأدلّة منطقية. أعطه وقتًا للتحليل ونظّم المعلومة وتجنّب العشوائية.",
    studentMatch: "يناسبه مدرّب أزرق أو أحمر يختصر له. الأصفر مزعج له والأخضر مقبول." },
};

export const DISC_ORDER: ColorKey[] = ["red", "yellow", "green", "blue"];

export const roleLabel = (r?: string) => r === "teacher" ? "مدرّب" : r === "student" ? "متدرّب" : r === "both" ? "مدرّب ومتدرّب" : "";

export function pairCell(t1: ColorKey, t2: ColorKey) {
  const star = { label: "⭐", color: "#dcfce7", textColor: "#15803d", w: 700 };
  const ok = { label: "👍", color: "#eef4fa", textColor: "#1e40af", w: 400 };
  const spark = { label: "⚡", color: "#fef2f2", textColor: "#b91c1c", w: 400 };
  const hard = { label: "🔄", color: "#fef2f2", textColor: "#991b1b", w: 400 };
  const m: Record<string, any> = {
    "red-red": star, "red-yellow": ok, "red-green": spark, "red-blue": ok,
    "yellow-red": ok, "yellow-yellow": star, "yellow-green": ok, "yellow-blue": hard,
    "green-red": spark, "green-yellow": ok, "green-green": star, "green-blue": ok,
    "blue-red": ok, "blue-yellow": hard, "blue-green": ok, "blue-blue": star,
  };
  return m[`${t1}-${t2}`] || ok;
}
