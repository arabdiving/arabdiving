import StandardsClientForms from "./StandardsClientForms";

/*
  صفحة عامة: معايير اعتماد المراكز — النسخة المبسطة من ميثاق ArabDiving.
  الناصح الأمين يعلن معاييره للجمهور: الغواص يعرف حقوقه، والمركز يعرف شروطنا قبل أن يراسلنا.
*/

const FOUNDER_RULES = [
  { icon: "🗓️", title: "قاعدة آخر غطسة", desc: "انقطعت عن الغوص 5 أشهر أو أكثر؟ المركز المعتمد ملزم بعمل مراجعة مهارات لك قبل أول غطسة — لسلامتك، وبدون رسوم مبالغ فيها." },
  { icon: "😴", title: "قاعدة الوصول المرهق", desc: "وصلت من سفر طويل بلا نوم؟ المركز المعتمد يسألك عن حالتك ويعرض عليك التأجيل للغد دون أي غرامة. الحادث يبدأ على اليابسة قبل الغطسة بيوم." },
  { icon: "🛑", title: "قاعدة لا للمجاملة", desc: "للمرشد الحق الكامل في إلغاء أو تعديل غطستك عند الشك في الجاهزية — والمركز الذي يوافق على كل شيء خوفًا من خسارة الحجز يخسر اعتمادنا." },
  { icon: "📷", title: "قاعدة الكاميرا", desc: "من يقود مجموعتك تحت الماء لا يصوّر. التصوير مهمة شخص منفصل — المرشد المشغول بالكاميرا مرشد غائب." },
  { icon: "👥", title: "قاعدة النسب الآمنة", desc: "حد أقصى 4 متدربين لكل مدرب تحت الماء، ونسب مرافقة آمنة في الغطسات الترفيهية — لا قطعان تحت الماء." },
];

const SECTIONS = [
  {
    icon: "🎫", title: "شروط الدخول — غير قابلة للتفاوض",
    items: [
      "ترخيص CDWS ساري (غرفة الغوص المصرية الرسمية)",
      "التوافق مع المعيار الدولي ISO 24803 لمزودي خدمات الغوص",
      "تأمين مسؤولية مدنية يغطي العملاء",
      "شهادات سارية لكل الطاقم + مؤهل إسعافات وأكسجين في كل رحلة",
    ],
  },
  {
    icon: "🗣️", title: "الخدمة العربية",
    items: [
      "بريفينج الغطسة والسلامة بالعربية — فهم تعليمات السلامة ليس رفاهية",
      "متحدث عربي في كل رحلة فيها عملاؤنا",
      "رد على استفساراتك بالعربية خلال 24 ساعة كحد أقصى",
    ],
  },
  {
    icon: "🧕", title: "خصوصية السيدات والملاءمة الثقافية",
    items: [
      "مدرِّبة أو مرشدة عند الطلب المسبق + مرافق تبديل مستقلة نظيفة",
      "معدات نسائية محتشمة للإيجار: غطاء رأس غوص (هود)، بدلة كاملة التغطية، راش جارد طويل، ومايوه شرعي مناسب للغوص — بمقاسات متنوعة ومعقمة",
      "لا تصوير ولا نشر لصورك دون موافقة خطية صريحة — ولك الرفض الكامل دون تأثير على الخدمة",
      "مناطق خالية تمامًا من التدخين على القارب وفي المركز — حتى في الهواء المفتوح — لحماية العائلات والأطفال وغير المدخنين",
      "فصل تام لتقديم المشروبات الكحولية (إن وُجدت) بعيدًا عن مساحاتك، مع خيار رحلات خالية منها كليًا",
      "وقت ومكان للصلاة، طعام حلال مؤكد، ورحلات عائلية بلا كحول عند الطلب",
    ],
  },
  {
    icon: "💰", title: "الشفافية التجارية",
    items: [
      "وثيقة «ماذا يشمل السعر بالضبط» تستلمها قبل الدفع — وأي انحراف عنها يهدد اعتماد المركز",
      "لا رسوم مفاجئة: كل رسم محتمل يُعلن مسبقًا",
      "سياسة استرداد مكتوبة ومعلنة — إلغاء الغطسة لسوء الأحوال أو بقرار سلامة = استرداد أو إعادة جدولة بلا غرامة",
    ],
  },
  {
    icon: "🎓", title: "التعليم المتوافق — بصمة ArabDiving",
    items: [
      "المدرب يقرأ بطاقاتك (اللون، التوافق التدريبي، دعم التعلم) قبل أول حصة ويتكيف معها",
      "منهج بصيغة فيديو وصوت لمن يحتاجه + وقت إضافي في الاختبار النظري بلا حرج",
      "باقة «أول غطسة» بإيقاع هادئ للمبتدئ الخائف — مع حق إيقاف التجربة في أي لحظة",
      "استعداد لاستقبال ذوي الهمم بالتنسيق معنا",
    ],
  },
  {
    icon: "🤝", title: "ما بعد الرحلة",
    items: [
      "متابعة إصدار شهادتك وتصحيح أي خطأ خلال أسبوعين",
      "الاستجابة لأي شكوى تصلنا خلال 48 ساعة — نحن وسيطك ولسنا مجرد دليل",
      "نتابع تجربتك بعد الرحلة — رأيك يحدد استمرار اعتماد المركز",
    ],
  },
];

const BADGES = [
  { icon: "🧕", label: "خصوصية نسائية" },
  { icon: "👨‍👩‍👧‍👦", label: "مناسب للعائلات" },
  { icon: "⚙️", label: "غوص تقني" },
  { icon: "🌿", label: "صديق للبيئة" },
  { icon: "💪", label: "يستقبل ذوي الهمم" },
  { icon: "🎓", label: "تعليم متوافق" },
];

export const metadata = {
  title: "معايير اعتماد المراكز | ArabDiving",
  description: "هذا ما نشترطه على أي مركز غوص قبل أن نرشحه لك — ميثاق ArabDiving للسلامة والخدمة العربية والخصوصية والشفافية.",
};

export default function StandardsPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#060e24 0%,#0d2c54 60%,#0891b2 100%)", padding: "56px 24px 70px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, color: "white", marginBottom: "14px" }}>
          🛡️ هذا ما نشترطه قبل أن نرشح لك أي مركز
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", maxWidth: "640px", margin: "0 auto", lineHeight: 1.9 }}>
          نحن لا نرشح مكانًا لا ننزل فيه بأنفسنا. هذه معاييرنا كاملة ومعلنة — لأن الناصح الأمين
          يعلن معاييره ولا يتفاوض عليها في الغرف المغلقة.
        </p>
      </div>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 18px 80px" }}>

        {/* قواعد المؤسس الخمس */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "clamp(20px,4vw,28px)", marginBottom: "8px" }}>⚓ قواعد المؤسس الخمس للسلامة</h2>
          <p style={{ color: "#666", marginBottom: "20px", lineHeight: 1.8 }}>
            من خبرة أكثر من عشرين عامًا كمدرب غوص — قواعد لا نتنازل عنها لأن وراء كل واحدة قصة حقيقية.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
            {FOUNDER_RULES.map((r) => (
              <div key={r.title} style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", borderTop: "4px solid var(--gold)" }}>
                <div style={{ fontSize: "30px", marginBottom: "8px" }}>{r.icon}</div>
                <div style={{ fontWeight: 800, color: "var(--navy)", marginBottom: "6px", fontSize: "16px" }}>{r.title}</div>
                <div style={{ color: "#555", fontSize: "13.5px", lineHeight: 1.8 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* الأقسام */}
        {SECTIONS.map((s) => (
          <section key={s.title} style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "18px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "19px", marginBottom: "14px" }}>{s.icon} {s.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {s.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14.5px", lineHeight: 1.8, color: "#444" }}>
                  <span style={{ color: "#0d9488", fontWeight: 900, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* الشارات */}
        <section style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "18px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "19px", marginBottom: "6px" }}>🏅 الشارات التي تراها على المراكز المعتمدة</h2>
          <p style={{ color: "#666", fontSize: "13.5px", marginBottom: "16px", lineHeight: 1.8 }}>تُمنح بعد التحقق الفعلي فقط — وليست للبيع.</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {BADGES.map((b) => (
              <span key={b.label} style={{ background: "#eef4fa", color: "var(--navy)", borderRadius: "20px", padding: "8px 18px", fontSize: "14px", fontWeight: 700 }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </section>

        {/* كيف نتحقق */}
        <section style={{ background: "linear-gradient(135deg,#134e4a,#0d9488)", borderRadius: "16px", padding: "26px", marginBottom: "18px", color: "white" }}>
          <h2 style={{ fontSize: "19px", marginBottom: "12px" }}>🔍 كيف نتحقق؟</h2>
          <p style={{ fontSize: "14.5px", lineHeight: 2, margin: 0, color: "rgba(255,255,255,0.92)" }}>
            مستندات رسمية (ترخيص، تأمين، شهادات، سجلات صيانة) + زيارة ميدانية بعين مدرب محترف +
            تقييم عملائنا بعد كل رحلة. ومن يخالف: إنذار، ثم تعليق، ثم شطب معلن.
            انتهاك خصوصية أو تهاون في السلامة يقفز مباشرة للتعليق.
          </p>
        </section>

        {/* CTA — interactive forms */}
        <StandardsClientForms />

        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginTop: "30px", lineHeight: 1.8 }}>
          مرجعيتنا: خبرة ميدانية +20 عامًا · المعيار الدولي ISO 24803 · لوائح غرفة الغوص المصرية CDWS
        </p>
      </main>
    </div>
  );
}
