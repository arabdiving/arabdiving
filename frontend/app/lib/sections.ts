import { PAGE_OPTIONS } from "@/app/lib/mapSvg";

// نظام الأقسام — كل قسم له صفحة هَب مصوّرة + قائمة منسدلة في النافبار.
// تُخزَّن في Settings.sections ويحرّرها الأدمن من /admin/sections،
// وإن كانت فارغة تُستخدم DEFAULT_SECTIONS المبدئية أدناه.

export type Section = {
  slug: string;
  name: string;
  icon: string;
  color: string;
  pages: string[]; // روابط الصفحات تحت القسم
};

export const DEFAULT_SECTIONS: Section[] = [
  { slug: "tools", name: "أدوات مساعدة", icon: "🧰", color: "#06b6d4", pages: ["/survey", "/quiz", "/training-fit", "/weight-calculator", "/temperatures", "/sizes"] },
  { slug: "learn", name: "تعلّم الغوص", icon: "🎓", color: "#a855f7", pages: ["/courses", "/try-diving", "/guide", "/dive-sites", "/standards"] },
  { slug: "community", name: "المجتمع", icon: "👥", color: "#e879f9", pages: ["/community", "/members", "/stories", "/communities"] },
  { slug: "trips", name: "الرحلات والحجز", icon: "🚢", color: "#c9952a", pages: ["/family-booking", "/trips", "/retreats"] },
  { slug: "audiences", name: "لكل الفئات", icon: "🧕", color: "#f97316", pages: ["/women", "/youth", "/kids"] },
  { slug: "shop", name: "المتجر والمعدات", icon: "🛒", color: "#34d399", pages: ["/marketplace"] },
];

const SUB: Record<string, string> = {
  "/survey": "اعرف أسلوب تعلّمك", "/quiz": "اكتشف نمط شخصيتك", "/training-fit": "توافقك التدريبي",
  "/weight-calculator": "احسب وزن حزامك", "/temperatures": "حرارة المياه الآن", "/sizes": "دليل المقاسات",
  "/courses": "PADI و SDI معتمدة", "/try-diving": "أول تجربة بدون شهادة", "/guide": "دليل الغوّاص الشامل",
  "/dive-sites": "أشهر مواقع البحر الأحمر", "/standards": "معاييرنا لاعتماد المراكز",
  "/community": "شارك وتواصل", "/members": "تعرّف على الغوّاصين", "/stories": "قصص وتجارب", "/communities": "مجتمعات متخصصة",
  "/family-booking": "احجز رحلتك", "/trips": "كل الرحلات", "/retreats": "باقات VIP خاصة",
  "/women": "غوص السيدات", "/youth": "برامج الشباب", "/kids": "غوص الأطفال",
  "/marketplace": "معدات من مراكز موثوقة",
};

export function pageMeta(href: string): { label: string; icon: string; sub: string } {
  const o = PAGE_OPTIONS.find((p) => p.href === href);
  return { label: o?.label || href, icon: o?.icon || "📄", sub: SUB[href] || "" };
}
