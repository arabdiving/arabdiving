import Link from "next/link";

/* ─── إعدادات كل صفحة ─────────────────────────────────── */
const PAGE_PROMOS: Record<string, {
  icon: string; label: string; desc: string; href: string;
  bg: string; accent: string; cta: string; bullets: string[];
}> = {
  survey: {
    icon: "🧠", label: "استبيان أسلوب التعلم", href: "/survey",
    desc: "اكتشف أسلوب تعلّمك وتلقَّ توصيات مخصصة تساعدك على الاستفادة القصوى من دورات الغوص",
    bg: "linear-gradient(135deg,#0d2c54 0%,#0891b2 100%)",
    accent: "#f5c218", cta: "ابدأ الاستبيان",
    bullets: ["17 سؤالاً فقط — 5 دقائق", "توصيات فورية مخصصة لك", "مبني على أدوات WHO المعتمدة"],
  },
  courses: {
    icon: "🎓", label: "الدورات المعتمدة", href: "/courses",
    desc: "دورات PADI وSSI وشهادات الغوص المعتمدة — ابدأ رحلتك من الصفر أو طوّر مستواك",
    bg: "linear-gradient(135deg,#1e3a5f 0%,#2e75b6 100%)",
    accent: "#c9952a", cta: "استعرض الدورات",
    bullets: ["شهادات PADI & SSI معتمدة", "مدربون عرب متخصصون", "دورات للمبتدئين والمحترفين"],
  },
  guide: {
    icon: "📖", label: "دليل الغوّاص العربي", href: "/guide",
    desc: "كل ما يحتاجه الغوّاص العربي في مرجع واحد — معدات، سلامة، مواقع، وأكثر",
    bg: "linear-gradient(135deg,#064e3b 0%,#059669 100%)",
    accent: "#fbbf24", cta: "اقرأ الدليل",
    bullets: ["دليل المعدات والمقاسات", "نصائح السلامة والطوارئ", "أفضل مواقع الغوص العربية"],
  },
  quiz: {
    icon: "🧩", label: "اكتشف نمط غوصك", href: "/quiz",
    desc: "اختبر معلوماتك وشخصيتك كغوّاص — اكتشف هل أنت مستكشف، سرعة، أم حكمة؟",
    bg: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)",
    accent: "#f5c218", cta: "ابدأ الاختبار",
    bullets: ["اختبار شخصية الغوص", "توصيات بالرحلات المناسبة", "شارك نتيجتك مع المجتمع"],
  },
  women: {
    icon: "🧕", label: "غوص السيدات", href: "/women",
    desc: "رحلات نسائية بالكامل مع مدربات معتمدات وطاقم نسائي — بيئة آمنة ومريحة",
    bg: "linear-gradient(135deg,#831843 0%,#db2777 100%)",
    accent: "#fbbf24", cta: "اكتشفي الرحلات",
    bullets: ["طاقم نسائي بالكامل", "مدربات PADI معتمدات", "بيئة آمنة ومريحة للسيدات"],
  },
  youth: {
    icon: "⚡", label: "برامج الشباب", href: "/youth",
    desc: "تحديات ومغامرات مصممة للشباب العربي — اكتشف البحر الأحمر مع أقرانك",
    bg: "linear-gradient(135deg,#92400e 0%,#f59e0b 100%)",
    accent: "white", cta: "انضم للشباب",
    bullets: ["مجموعات شبابية تفاعلية", "تحديات ومسابقات", "أسعار خاصة للشباب"],
  },
  kids: {
    icon: "👧", label: "غوص الأطفال", href: "/kids",
    desc: "برامج غوص آمنة وممتعة للأطفال من 8 سنوات — اكتشاف البحر بعيون الصغار",
    bg: "linear-gradient(135deg,#065f46 0%,#34d399 100%)",
    accent: "#fbbf24", cta: "اعرف أكثر",
    bullets: ["مناسب من عمر 8 سنوات", "مدربون متخصصون بالأطفال", "معدات بمقاسات الأطفال"],
  },
  try_diving: {
    icon: "🤿", label: "جرّب الغوص", href: "/try-diving",
    desc: "أول تجربة غوص لك بدون شهادة — جرّب ببساطة وأمان مع مدرب معتمد",
    bg: "linear-gradient(135deg,#0c4a6e 0%,#0ea5e9 100%)",
    accent: "#fbbf24", cta: "احجز تجربتك",
    bullets: ["لا تحتاج شهادة أو خبرة", "جلسة تحضيرية قبل الغوص", "مدرب معك طوال الوقت"],
  },
  logbook: {
    icon: "📒", label: "اللوج بوك الرقمي", href: "/logbook",
    desc: "سجّل كل غطساتك رقمياً — تتبع تقدمك وشارك ذكرياتك مع المجتمع",
    bg: "linear-gradient(135deg,#1e3a5f 0%,#334155 100%)",
    accent: "#c9952a", cta: "افتح لوج بوكي",
    bullets: ["سجّل عمق ووقت كل غطسة", "خرائط المواقع التي زرتها", "إحصائيات شاملة لمسيرتك"],
  },
  marketplace: {
    icon: "🛍️", label: "متجر المعدات", href: "/marketplace",
    desc: "معدات ومستلزمات الغوص من مراكز موثوقة — اشترِ وبع بأمان داخل المجتمع",
    bg: "linear-gradient(135deg,#1c1917 0%,#44403c 100%)",
    accent: "#c9952a", cta: "تصفّح المتجر",
    bullets: ["معدات جديدة ومستعملة", "مراكز غوص موثّقة", "مقارنة الأسعار والمواصفات"],
  },
  retreats: {
    icon: "✨", label: "الباقات الخاصة", href: "/retreats",
    desc: "تجارب غوص استثنائية وباقات VIP لمن يبحث عن شيء مختلف",
    bg: "linear-gradient(135deg,#3b0764 0%,#6d28d9 100%)",
    accent: "#f5c218", cta: "اكتشف الباقات",
    bullets: ["باقات كورسات شاملة", "رحلات مجموعات خاصة", "لياليَ وإقامة بجانب البحر"],
  },
  trips: {
    icon: "🚢", label: "جميع الرحلات", href: "/trips",
    desc: "قائمة شاملة بكل الرحلات المتاحة — فلتر حسب الوجهة والتاريخ والميزانية",
    bg: "linear-gradient(135deg,#0f172a 0%,#1e40af 100%)",
    accent: "#60a5fa", cta: "استعرض الرحلات",
    bullets: ["رحلات يومية وليلية", "Live-aboard لمحبي الأعماق", "رحلات خاصة للمجموعات"],
  },
  temperatures: {
    icon: "🌡️", label: "حرارة المياه", href: "/temperatures",
    desc: "درجات حرارة المياه الحالية في مواقع الغوص العربية — اختر الوقت الأمثل لرحلتك",
    bg: "linear-gradient(135deg,#0c4a6e 0%,#0891b2 100%)",
    accent: "#fbbf24", cta: "تحقق الآن",
    bullets: ["بيانات محدّثة بانتظام", "رسم بياني لدرجات الحرارة", "توصيات الملابس لكل موسم"],
  },
  trends: {
    icon: "🛡️", label: "الصيحات والأمان", href: "/trends",
    desc: "أحدث اتجاهات الغوص ونصائح السلامة — ابقَ على اطلاع دائم",
    bg: "linear-gradient(135deg,#1c1917 0%,#b45309 100%)",
    accent: "#fbbf24", cta: "اطّلع الآن",
    bullets: ["أحدث معدات وتقنيات 2024", "نصائح سلامة من خبراء", "تحذيرات ومناطق محظورة"],
  },
  weight_calc_promo: {
    icon: "⚖️", label: "حاسبة وزن الحزام", href: "/weight-calculator",
    desc: "احسب الوزن المثالي لحزامك بدقة — أداة سريعة تحمي سلامتك تحت الماء",
    bg: "linear-gradient(135deg,#1e3a5f 0%,#334155 100%)",
    accent: "#c9952a", cta: "احسب الآن",
    bullets: ["معادلة PADI المعتمدة", "دعم بدلات مختلفة", "نتيجة فورية بدون تسجيل"],
  },
  communities: {
    icon: "🌐", label: "المجتمعات", href: "/communities",
    desc: "انضم إلى مجتمعات متخصصة حسب الاهتمام والمنطقة والمستوى",
    bg: "linear-gradient(135deg,#1e1b4b 0%,#4338ca 100%)",
    accent: "#a5f3fc", cta: "استعرض المجتمعات",
    bullets: ["مجتمعات بالمنطقة الجغرافية", "مجتمعات حسب المستوى", "مجموعات خاصة للهوايات"],
  },
  stories: {
    icon: "📝", label: "قصص الغوّاصين", href: "/stories",
    desc: "قصص ملهمة وتجارب حقيقية من رحلات الغوّاصين العرب حول العالم",
    bg: "linear-gradient(135deg,#14532d 0%,#16a34a 100%)",
    accent: "#fbbf24", cta: "اقرأ القصص",
    bullets: ["قصص حقيقية من الأعماق", "صور ومقاطع من الرحلات", "شارك قصتك مع المجتمع"],
  },
  dive_sites: {
    icon: "📍", label: "دليل مواقع الغوص", href: "/dive-sites",
    desc: "استكشف أشهر مواقع الغوص في البحر الأحمر والخليج — الأعماق، الرؤية، والكائنات المتوقعة",
    bg: "linear-gradient(135deg,#0c4a6e 0%,#2563eb 100%)",
    accent: "#f5c218", cta: "استكشف المواقع",
    bullets: ["خرائط ومعلومات لكل موقع", "مستوى الصعوبة والعمق", "تقييمات الغوّاصين الحقيقية"],
  },
  game: {
    icon: "🎮", label: "لعبة أبطال البحر", href: "/game",
    desc: "تعلّم قواعد الغوص والسلامة وأنت تلعب — تحدَّ أصدقاءك واجمع النقاط",
    bg: "linear-gradient(135deg,#312e81 0%,#7c3aed 100%)",
    accent: "#f5c218", cta: "العب الآن",
    bullets: ["تعلّم بالمرح للصغار والكبار", "تحديات ومستويات متدرجة", "نافس مجتمع الغوّاصين"],
  },
  family_booking: {
    icon: "👨‍👩‍👧‍👦", label: "الحجز العائلي", href: "/family-booking",
    desc: "رحلات مصممة للعائلة كاملة — برامج للأطفال وأنشطة للجميع في مكان واحد",
    bg: "linear-gradient(135deg,#065f46 0%,#0d9488 100%)",
    accent: "#fbbf24", cta: "خطط لرحلة عائلتك",
    bullets: ["برامج آمنة لكل الأعمار", "أنشطة بديلة لغير الغوّاصين", "حجز واحد للعائلة كلها"],
  },
  sizes: {
    icon: "📏", label: "دليل المقاسات", href: "/sizes",
    desc: "اعرف مقاسك الصحيح لكل معدات الغوص قبل الشراء أو الاستئجار",
    bg: "linear-gradient(135deg,#334155 0%,#64748b 100%)",
    accent: "#f5c218", cta: "اعرف مقاسك",
    bullets: ["جداول مقاسات البدلات والزعانف", "احفظ مقاساتك في ملفك", "شاركها مع مركز الغوص مباشرة"],
  },
  members: {
    icon: "🤝", label: "دليل الأعضاء", href: "/members",
    desc: "تعرّف على غوّاصي المجتمع — كوّن صداقات وجد رفيق غطستك القادمة",
    bg: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 100%)",
    accent: "#a5f3fc", cta: "تصفّح الأعضاء",
    bullets: ["غوّاصون من كل الخليج والعالم العربي", "ابحث حسب الدولة والمستوى", "أضف أصدقاء وراسلهم"],
  },
  training_fit: {
    icon: "🧭", label: "استبيان التوافق التدريبي", href: "/training-fit",
    desc: "8 أسئلة عملية تحدد احتياجك الحقيقي من المدرب — الوتيرة، الطمأنينة، والأسلوب المناسب لك",
    bg: "linear-gradient(135deg,#134e4a 0%,#0d9488 100%)",
    accent: "#f5c218", cta: "ابدأ الاستبيان",
    bullets: ["نتيجة عملية تشاركها مع مدربك", "يراعي القلق من الماء وتفضيلاتك", "أدق من اختبارات الشخصية"],
  },
};

export default function HomePromoSection({ pageKey }: { pageKey: string }) {
  const cfg = PAGE_PROMOS[pageKey];
  if (!cfg) return null;

  return (
    <section style={{ padding: "70px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          background: cfg.bg, borderRadius: "24px", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "300px",
        }}>
          {/* Left: content */}
          <div style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px", lineHeight: 1 }}>{cfg.icon}</div>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 900, color: "white", marginBottom: "14px", lineHeight: 1.25 }}>
              {cfg.label}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.8, marginBottom: "24px", maxWidth: "420px" }}>
              {cfg.desc}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
              {cfg.bullets.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.accent, flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
            <Link href={cfg.href} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: cfg.accent, color: "#0f172a",
              padding: "13px 28px", borderRadius: "12px",
              fontWeight: 800, fontSize: "15px", alignSelf: "flex-start",
              textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            }}>
              {cfg.cta} ←
            </Link>
          </div>
          {/* Right: decorative */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "120px", opacity: 0.25,
          }}>
            {cfg.icon}
          </div>
        </div>
      </div>
    </section>
  );
}
