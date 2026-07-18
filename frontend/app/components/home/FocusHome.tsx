import Link from "next/link";
import RedSeaMap from "@/app/components/RedSeaMap";
import HomeDiveCenters from "@/app/components/home/HomeDiveCenters";
import HomePromoSection from "@/app/components/home/HomePromoSection";

/*
  الرئيسية المختصرة لوضع «موقع يحل مشكلة» — بهوية لونية مستوحاة من انستجرام:
  تدرجات بنفسجي → وردي → برتقالي (#405DE6 → #833AB4 → #E1306C → #F77737 → #FCAF45)
  على خلفية داكنة دافئة. مبنية على بلوكات مستقلة (settings.focusHomeBlocks).
*/

export interface FocusBlock { key: string; visible: boolean; order: number; }

export const DEFAULT_FOCUS_BLOCKS: FocusBlock[] = [
  { key: "focus_hero",        visible: true,  order: 0 },
  { key: "focus_iso",         visible: true,  order: 1 },
  { key: "focus_bias",        visible: true,  order: 2 },
  { key: "focus_gates",       visible: true,  order: 3 },
  { key: "focus_tools",       visible: true,  order: 4 },
  { key: "focus_map",         visible: false, order: 5 },
  { key: "focus_instructors", visible: false, order: 6 },
  { key: "focus_centers",     visible: false, order: 7 },
];

// 🎨 لوحة انستجرام
const IG = {
  bg: "#150a24",                                                                     // خلفية داكنة بنفسجية
  hero: "radial-gradient(ellipse at 50% 0%, #3b1d5e 0%, #1f0f38 45%, #150a24 75%)",  // هيرو
  grad: "linear-gradient(45deg,#405DE6,#833AB4,#C13584,#E1306C,#FD1D1D,#F77737,#FCAF45)", // التدرج الكامل
  gradBtn: "linear-gradient(45deg,#833AB4,#E1306C,#F77737)",                         // أزرار
  gradBtn2: "linear-gradient(45deg,#405DE6,#833AB4,#C13584)",                        // أزرار ثانوية
  pink: "#E1306C",
  orange: "#FCAF45",
  purple: "#833AB4",
  glass: {
    background: "rgba(38,18,64,0.72)",
    border: "1px solid rgba(225,48,108,0.22)",
    backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
  } as React.CSSProperties,
};

const TOOLS = [
  { href: "/course-standards", icon: "📏", label: "معايير الكورسات", desc: "حقك في الأوبن ووتر والأدفانس حسب الأيزو" },
  { href: "/weight-calculator", icon: "⚖️", label: "حاسبة الأوزان", desc: "وزن الرصاص المناسب لجسمك وبدلتك" },
  { href: "/dive-sites", icon: "🗺️", label: "خريطة مواقع الغوص", desc: "أفضل مواقع البحر الأحمر بالتفصيل" },
  { href: "/quiz", icon: "🎨", label: "اكتشف نمطك", desc: "نظام الألوان — اعرف أسلوبك في التعلم" },
  { href: "/training-fit", icon: "🤝", label: "استبيان التوافق", desc: "أي مدرب يناسب شخصيتك؟" },
  { href: "/survey", icon: "🧠", label: "استبيان التعلم", desc: "افهم طريقة تعلمك قبل أول دورة" },
];

function FocusHero() {
  return (
      <section style={{ position: "relative", overflow: "hidden", background: IG.hero, color: "#fff", padding: "70px 20px 50px", textAlign: "center" }}>
        {/* توهجات انستجرام */}
        <div style={{ position: "absolute", top: "-80px", insetInlineStart: "10%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle,#E1306C 0%,transparent 70%)", opacity: 0.25, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", insetInlineEnd: "8%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle,#FCAF45 0%,transparent 70%)", opacity: 0.18, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          {/* الأسئلة التي نسمعها كل يوم */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "18px" }}>
            {["«إيه أحسن مدرسة غوص؟»", "«مين أحسن مدرب؟»", "«فين أحسن مكان أتعلم فيه؟»"].map((q) => (
              <span key={q} style={{ ...IG.glass, color: "rgba(255,255,255,0.8)", fontSize: "clamp(12px,2.5vw,14px)", fontWeight: 700, padding: "8px 16px", borderRadius: "30px" }}>{q}</span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(28px,6vw,46px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "14px", lineHeight: 1.5 }}>
            ثلاثة أسئلة نسمعها كل يوم...<br />
            <span style={{ background: IG.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>والإجابة الصادقة ستفاجئك 🤿</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(15px,3vw,18px)", lineHeight: 2, marginBottom: "30px" }}>
            الحقيقة: كل مدارس الغوص المعتمدة تدرّس بنفس معيار الجودة العالمي.
            الفرق الحقيقي ليس في الشعار الذي على الشهادة — بل في <b style={{ color: "#FCAF45" }}>المدرب</b> الذي
            سيمسك يدك تحت الماء، و<b style={{ color: "#E1306C" }}>المركز</b> الذي ستثق به. ولهذا بنينا هذا الموقع.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/instructors" style={{ background: IG.gradBtn, color: "white", padding: "14px 30px", borderRadius: "13px", fontWeight: 800, fontSize: "15.5px", boxShadow: "0 4px 18px rgba(225,48,108,0.45)" }}>
              🧑‍🏫 دليل المدربين
            </Link>
            <Link href="/family-booking" style={{ background: IG.gradBtn2, color: "white", padding: "14px 30px", borderRadius: "13px", fontWeight: 800, fontSize: "15.5px", boxShadow: "0 4px 18px rgba(131,58,180,0.45)" }}>
              🏛️ مراكز الغوص
            </Link>
          </div>
        </div>
      </section>
  );
}

/* ── الحقيقة الأولى: الأيزو يوحّد الجودة ── */
function FocusIso() {
  const ISO_CARDS = [
    {
      icon: "🤿", code: "ISO 24801", title: "معيار تدريب الغواصين",
      body: "ثلاثة مستويات موحّدة عالميًا: غواص تحت إشراف، غواص مستقل (الـ Open Water الذي تعرفه)، وقائد غوص. المعيار يحدد الحد الأدنى من النظري ومهارات المياه المحصورة وغطسات المياه المفتوحة وحدود العمق — أيًا كان شعار المدرسة.",
    },
    {
      icon: "🧑‍🏫", code: "ISO 24802", title: "معيار تأهيل المدربين",
      body: "مستويان لمدرب الغوص يحددان ما يجب أن يتقنه قبل أن يُسمح له بالتدريس: مهارات مائية، علوم غوص، أساليب تعليم، وإدارة سلامة. مدرب SDI ومدرب PADI ومدرب SSI ومدرب CMAS — كلهم يجتازون نفس السقف الأدنى.",
    },
    {
      icon: "🏛️", code: "ISO 24803", title: "معيار مراكز الخدمة",
      body: "متطلبات مزوّد خدمة الغوص نفسه: صيانة المعدات، خطط الطوارئ، الإشراف، والشفافية مع العميل. المركز الجيد يستوفيها بغض النظر عن المنظمة التي يرفع علمها.",
    },
  ];
  return (
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "50px 18px 20px" }}>
        <p style={{ textAlign: "center", color: "#FCAF45", fontWeight: 800, fontSize: "13.5px", letterSpacing: "1px", marginBottom: "8px" }}>الحقيقة الأولى</p>
        <h2 style={{ color: "#fff", fontSize: "clamp(21px,4.5vw,30px)", fontWeight: 900, textAlign: "center", marginBottom: "10px" }}>
          كل المدارس المعتمدة تدرّس بنفس معيار الجودة 📏
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14.5px", lineHeight: 2, textAlign: "center", maxWidth: "720px", margin: "0 auto 26px" }}>
          منذ سنوات وضعت منظمة المعايير الدولية (الأيزو — نفس الجهة التي تعتمد جودة المصانع والمستشفيات)
          معايير موحّدة للغوص الترفيهي، وتخضع لها كبرى مدارس الغوص عبر هيئات تدقيق مستقلة
          (مثل المجلس العالمي WRSTC وهيئة الاعتماد الأوروبية EUF). النتيجة: شهادتك من أي مدرسة معتمدة
          <b style={{ color: "#fff" }}> معترف بها في كل بحار العالم</b>.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
          {ISO_CARDS.map((c) => (
            <div key={c.code} style={{ ...IG.glass, borderRadius: "18px", padding: "24px", borderTop: "3px solid #405DE6" }}>
              <div style={{ fontSize: "34px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ color: "#8fa8ff", fontWeight: 900, fontSize: "13px", letterSpacing: "1px", marginBottom: "4px" }} dir="ltr">{c.code}</div>
              <h3 style={{ color: "#fff", fontSize: "16.5px", fontWeight: 800, marginBottom: "8px" }}>{c.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.95, margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>
        <p style={{ ...IG.glass, borderRadius: "14px", padding: "14px 20px", color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.9, textAlign: "center", marginTop: "18px" }}>
          💡 خلاصة عملية: سؤال «أي مدرسة أفضل؟» يشبه سؤال «أي عداد كهرباء يقيس أدق؟» — كلها معايرة على نفس المرجع.
          السؤال الأذكى: <b style={{ color: "#FCAF45" }}>«أي مدرب وأي مركز أفضل لي أنا؟»</b>
        </p>
        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <Link href="/course-standards" style={{ background: IG.gradBtn2, color: "white", padding: "12px 26px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", display: "inline-block", boxShadow: "0 4px 16px rgba(64,93,230,0.4)" }}>
            📏 اقرأ حقك بالتفصيل: معايير الأوبن ووتر والأدفانس ←
          </Link>
        </div>
      </section>
  );
}

/* ── الحقيقة الثانية: لماذا يتعصب البعض لمدرسته؟ ── */
function FocusBias() {
  const REASONS = [
    {
      icon: "🏳️", title: "الانتماء قبل المنطق",
      body: "في تجارب عالم النفس هنري تاجفل الشهيرة، قُسّم أشخاص لمجموعات بقرعة عشوائية بحتة — وخلال دقائق بدأ كل فريق يحابي «جماعته» ويقلل من الآخرين، رغم أن لا شيء يفرّق بينهم. عقلنا مبرمج على التحيز لما ننتمي إليه، حتى لو كان الانتماء مجرد شعار على بطاقة.",
    },
    {
      icon: "💪", title: "تبرير الجهد",
      body: "تجربة أرونسون وميلز الكلاسيكية أثبتت أن من يمر بتجربة قبول أصعب يقتنع أن جماعته أفضل — ليبرر لنفسه التعب. من دفع وتعب وخاف في دورة غوص، سيدافع عن مدرسته بحرارة... لأن الاعتراف بأنها «مثل غيرها» يشعره أن جهده كان عاديًا.",
    },
    {
      icon: "⚓", title: "الكلفة الغارقة",
      body: "كلما استثمر الإنسان أكثر في طريق (شهادات، تخصصات، سنوات)، صعُب عليه الاعتراف بأن الطرق الأخرى توصل لنفس المكان. ليست كذبة يقولها — بل عدسة يرى بها.",
    },
    {
      icon: "🪞", title: "نقد مدرستي = نقدي أنا",
      body: "حين تصبح المدرسة جزءًا من هوية الشخص («أنا مدرب X»)، يتحول أي نقاش عنها لتهديد شخصي، فيدافع عن الشعار كأنه يدافع عن نفسه. هذا ما يسميه علماء النفس «الهوية الاجتماعية».",
    },
  ];
  const HISTORY = [
    {
      icon: "📚", tag: "من التعليم",
      title: "«حروب القراءة»",
      body: "عقود من الصراع بين مدرستي تعليم القراءة للأطفال (الصوتيات مقابل اللغة الكاملة) — معلمون رائعون في المعسكرين، وأجيال تعلمت بالطريقتين، بينما الحسم الحقيقي كان دائمًا: جودة المعلم نفسه.",
    },
    {
      icon: "🥋", tag: "من الرياضة",
      title: "حرب المدارس القتالية",
      body: "لعقود أقسم أتباع كل فن قتالي (كاراتيه، كونغ فو، ملاكمة) أن مدرستهم «الأقوى». حين جمعتهم البطولات المختلطة وجهًا لوجه، انهارت الأسطورة: لا مدرسة تنتصر — ينتصر المتدرب الأفضل إعدادًا ومدربه.",
    },
    {
      icon: "⚔️", tag: "من الحروب",
      title: "أدميرالات البوارج",
      body: "بعد الحرب العالمية الأولى تمسّك جيل كامل من الأدميرالات بالبوارج العملاقة التي بنوا مجدهم عليها، وسخروا ممن قال إن الطائرات ستغير البحار — حتى أثبتت الحرب التالية أن التعصب للمألوف يكلف غاليًا.",
    },
    {
      icon: "🩺", tag: "من الطب",
      title: "قصة سِملفايس",
      body: "الطبيب الذي اكتشف أن غسل الأيدي ينقذ الأمهات من حمى النفاس — فرفضه أطباء عصره بعنف، لأن قبول فكرته كان يعني الاعتراف بأن ممارستهم القديمة كانت تؤذي. الهوية غلبت الدليل... لعقود.",
    },
  ];
  return (
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 18px 30px" }}>
        <p style={{ textAlign: "center", color: "#E1306C", fontWeight: 800, fontSize: "13.5px", letterSpacing: "1px", marginBottom: "8px" }}>الحقيقة الثانية</p>
        <h2 style={{ color: "#fff", fontSize: "clamp(21px,4.5vw,30px)", fontWeight: 900, textAlign: "center", marginBottom: "10px" }}>
          فلماذا يقسم البعض أن مدرسته هي الأفضل؟ 🧠
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14.5px", lineHeight: 2, textAlign: "center", maxWidth: "720px", margin: "0 auto 26px" }}>
          ليس كذبًا ولا تضليلًا — بل طبيعة بشرية موثقة في علم النفس. نحن نتعصب لما ننتمي إليه،
          وقد تكرر نفس المشهد في التعليم والطب والرياضة وحتى الحروب:
        </p>

        {/* الأسباب النفسية */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "14px", marginBottom: "26px" }}>
          {REASONS.map((r) => (
            <div key={r.title} style={{ ...IG.glass, borderRadius: "16px", padding: "20px", borderTop: "3px solid #E1306C" }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>{r.icon}</div>
              <h3 style={{ color: "#fff", fontSize: "15.5px", fontWeight: 800, marginBottom: "6px" }}>{r.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.9, margin: 0 }}>{r.body}</p>
            </div>
          ))}
        </div>

        {/* أمثلة من التاريخ */}
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, textAlign: "center", marginBottom: "16px" }}>📜 نفس القصة... في كل مجال</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "14px", marginBottom: "22px" }}>
          {HISTORY.map((h) => (
            <div key={h.title} style={{ ...IG.glass, borderRadius: "16px", padding: "20px", borderTop: "3px solid #F77737" }}>
              <span style={{ background: "rgba(247,119,55,0.15)", color: "#F77737", borderRadius: "20px", padding: "3px 12px", fontSize: "11.5px", fontWeight: 800 }}>{h.icon} {h.tag}</span>
              <h4 style={{ color: "#fff", fontSize: "15px", fontWeight: 800, margin: "10px 0 6px" }}>{h.title}</h4>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.9, margin: 0 }}>{h.body}</p>
            </div>
          ))}
        </div>

        {/* الخلاصة */}
        <div style={{ ...IG.glass, borderRadius: "18px", padding: "26px", textAlign: "center", borderBottom: "3px solid #FCAF45" }}>
          <p style={{ color: "#fff", fontSize: "clamp(15px,3.2vw,18px)", fontWeight: 800, lineHeight: 2, margin: "0 0 16px" }}>
            لذلك لن نقول لك «هذه المدرسة أفضل» — لأن هذا ببساطة غير صحيح.<br />
            <span style={{ background: IG.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              سنساعدك في السؤال الوحيد الذي يستحق: من هو المدرب الأنسب لك أنت؟
            </span>
          </p>
          <Link href="/instructors" style={{ background: IG.gradBtn, color: "white", padding: "13px 30px", borderRadius: "13px", fontWeight: 800, fontSize: "15px", boxShadow: "0 4px 18px rgba(225,48,108,0.45)", display: "inline-block" }}>
            🧬 تعرّف على بصمات المدربين
          </Link>
        </div>
      </section>
  );
}

function FocusGates() {
  return (
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 18px 10px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "18px" }}>
        <Link href="/instructors" style={{ ...IG.glass, borderRadius: "20px", padding: "28px", textDecoration: "none", display: "block", borderTop: "3px solid #E1306C" }}>
          <div style={{ fontSize: "42px", marginBottom: "10px" }}>🧑‍🏫</div>
          <h2 style={{ color: "#fff", fontSize: "21px", fontWeight: 900, marginBottom: "8px" }}>دليل المدربين</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.9, margin: 0 }}>
            كل مدرب له «بصمة تدريبية» علمية تُظهر نقاط تميّزه، ويصارحك بمن يناسبه ومن لا يناسبه.
            اختر موقعك وشاهد الأقرب إليك على الخريطة.
          </p>
          <span style={{ color: "#E1306C", fontWeight: 800, fontSize: "13.5px", display: "inline-block", marginTop: "12px" }}>تصفح المدربين ←</span>
        </Link>
        <Link href="/family-booking" style={{ ...IG.glass, borderRadius: "20px", padding: "28px", textDecoration: "none", display: "block", borderTop: "3px solid #FCAF45" }}>
          <div style={{ fontSize: "42px", marginBottom: "10px" }}>🏛️</div>
          <h2 style={{ color: "#fff", fontSize: "21px", fontWeight: 900, marginBottom: "8px" }}>دليل مراكز الغوص</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.9, margin: 0 }}>
            مراكز بشارات ثقة واضحة: طاقم نسائي، معتمد للعائلات، معدات معقّمة —
            مع فريق مدربيها المعتمد وحجز مباشر بدون دفع مقدم.
          </p>
          <span style={{ color: "#FCAF45", fontWeight: 800, fontSize: "13.5px", display: "inline-block", marginTop: "12px" }}>تصفح المراكز ←</span>
        </Link>
      </section>
  );
}

function FocusTools() {
  return (
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "26px 18px 70px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 900, textAlign: "center", marginBottom: "20px" }}>
          <span style={{ background: IG.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>🧰 أدوات مجانية تجهّزك قبل السفر</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px" }}>
          {TOOLS.map((t, i) => (
            <Link key={t.href} href={t.href} style={{ ...IG.glass, borderRadius: "16px", padding: "20px", textDecoration: "none", display: "block", textAlign: "center", borderBottom: `3px solid ${["#405DE6", "#833AB4", "#E1306C", "#F77737", "#FCAF45"][i % 5]}` }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{t.icon}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", marginBottom: "5px" }}>{t.label}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.7 }}>{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>
  );
}

export default function FocusHome({ blocks, promoImages = {} }: { blocks?: FocusBlock[]; promoImages?: Record<string, string> }) {
  // دمج البلوكات الجديدة غير الموجودة في إعدادات قديمة (بظهورها الافتراضي) حتى لا تختفي القصة
  const base = blocks && blocks.length ? blocks : DEFAULT_FOCUS_BLOCKS;
  const have = new Set(base.map((b) => b.key));
  const merged = [
    ...base,
    ...DEFAULT_FOCUS_BLOCKS.filter((d) => !have.has(d.key)).map((d, i) => ({ ...d, order: d.order + 0.5 + i * 0.01 })),
  ];
  const list = merged.filter((b) => b.visible).sort((a, b) => a.order - b.order);

  const render = (key: string) => {
    switch (key) {
      case "focus_hero":        return <FocusHero key={key} />;
      case "focus_iso":         return <FocusIso key={key} />;
      case "focus_bias":        return <FocusBias key={key} />;
      case "focus_gates":       return <FocusGates key={key} />;
      case "focus_tools":       return <FocusTools key={key} />;
      case "focus_map":         return <RedSeaMap key={key} embedded />;
      case "focus_centers":     return <HomeDiveCenters key={key} />;
      case "focus_instructors": return (
        <div key={key} style={{ maxWidth: "1100px", margin: "0 auto", padding: "26px 20px" }}>
          <HomePromoSection pageKey="instructors" image={promoImages["instructors_promo"]} />
        </div>
      );
      default: return null;
    }
  };

  return (
    <main style={{ background: IG.bg, minHeight: "100vh" }}>
      {list.map((b) => render(b.key))}
    </main>
  );
}
