import type { Metadata } from "next";

/*
  طبقة السيو لصفحة قصة Suunto — الصفحة نفسها client component (مبدّل لغة)
  فلا يمكنها تصدير metadata، لذا نضعها هنا في الـ layout.
  كلمات مفتاحية غنية (Suunto اسم يُبحث عنه كثيرًا) بالعربية والإنجليزية،
  + أوصاف Open Graph لمشاركة أنيقة على السوشيال.
*/

const TITLE =
  "My Suunto D6 Story — Battery Replacement, Fogging & Screen Failure | قصتي مع Suunto D6 | ArabDiving";
const DESC =
  "A scuba diving instructor's honest experience with a Suunto D6 dive computer in Egypt: authorized battery replacement, internal fogging/condensation, screen damage, back-casing gap, dead backlight — Suunto's official responses, their 30% upgrade offer, and why I declined it. Read it in Arabic, English, German, Spanish & Chinese. تجربة مدرب غوص مع كمبيوتر الغوص سونتو D6: استبدال البطارية، التضبيب، تلف الشاشة، الفجوة في الظهر، ورد سونتو وعرض الترقية.";

const KEYWORDS = [
  // Suunto — إنجليزي
  "Suunto", "Suunto D6", "Suunto D6 review", "Suunto dive computer", "Suunto dive computer problem",
  "Suunto D6 screen problem", "Suunto D6 fogging", "Suunto battery replacement", "Suunto service center Egypt",
  "Suunto repair Egypt", "Suunto repair Dahab", "Suunto authorized service center", "Suunto warranty",
  "Suunto condensation", "Suunto screen bleeding", "Suunto D6 battery", "Suunto customer service", "Suunto Red Sea",
  "dive computer fogging", "dive computer screen damage", "dive computer battery replacement", "best dive computer",
  // Suunto — عربي
  "سونتو", "سونتو D6", "كمبيوتر غوص سونتو", "صيانة سونتو مصر", "مركز صيانة سونتو", "استبدال بطارية سونتو",
  "بطارية كمبيوتر الغوص", "تضبيب كمبيوتر الغوص", "مشكلة شاشة سونتو", "صيانة سونتو دهب", "تجربتي مع سونتو",
  "أفضل كمبيوتر غوص", "كمبيوتر غوص", "مراكز صيانة سونتو في مصر",
  // ArabDiving / الغوص — للربط
  "ArabDiving", "scuba diving Egypt", "Red Sea diving", "diving Dahab", "diving Hurghada", "diving Sharm El Sheikh",
  "diving Marsa Alam", "scuba instructor Egypt", "الغوص في مصر", "الغوص في البحر الأحمر", "الغوص في دهب",
  "الغوص في الغردقة", "الغوص في شرم الشيخ", "مدرب غوص", "دليل المدربين", "تعلم الغوص", "الغوص في السعودية",
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: KEYWORDS,
  alternates: { canonical: "https://arabdiving.com/suunto-story" },
  openGraph: {
    type: "article",
    url: "https://arabdiving.com/suunto-story",
    siteName: "ArabDiving",
    title: "My Suunto D6 Story — A Diving Instructor's Honest Experience | قصتي مع Suunto D6",
    description:
      "373 logged dive hours. An authorized battery replacement. Then fogging, screen damage, and Suunto's reply: “the unit is more than 24 years old.” My full account — in 5 languages.",
    locale: "ar_EG",
    alternateLocale: ["en_US", "de_DE", "es_ES", "zh_CN"],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Suunto D6 Story — A Diving Instructor's Honest Experience",
    description:
      "373 dive hours, an authorized battery service, then fogging & a failed screen — and Suunto's official response. In Arabic, English, German, Spanish & Chinese.",
  },
  robots: { index: true, follow: true },
};

// بيانات منظّمة (JSON-LD) — تساعد جوجل على فهم الصفحة كمقال/تجربة وتحسّن الظهور
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "My Suunto D6 Story — A Diving Instructor's Honest Experience",
  inLanguage: ["ar", "en", "de", "es", "zh"],
  author: { "@type": "Person", name: "Ibrahim El-Mekkawi", jobTitle: "Scuba Diving Instructor" },
  publisher: { "@type": "Organization", name: "ArabDiving", url: "https://arabdiving.com" },
  about: [
    { "@type": "Product", name: "Suunto D6", category: "Dive Computer" },
    { "@type": "Thing", name: "Dive computer battery replacement" },
    { "@type": "Thing", name: "Dive computer service in Egypt" },
  ],
  url: "https://arabdiving.com/suunto-story",
  mainEntityOfPage: "https://arabdiving.com/suunto-story",
};

export default function SuuntoStoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {children}
    </>
  );
}
