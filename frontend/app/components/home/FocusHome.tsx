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
  { key: "focus_gates",       visible: true,  order: 1 },
  { key: "focus_tools",       visible: true,  order: 2 },
  { key: "focus_map",         visible: false, order: 3 },
  { key: "focus_instructors", visible: false, order: 4 },
  { key: "focus_centers",     visible: false, order: 5 },
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
        <div style={{ position: "relative", zIndex: 2, maxWidth: "760px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(30px,6.5vw,50px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "14px", lineHeight: 1.4 }}>
            اعرف مدربك ومركزك<br />
            <span style={{ background: IG.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>قبل أول غطسة 🤿</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(15px,3vw,18px)", lineHeight: 2, marginBottom: "30px" }}>
            الناصح الأمين للغواص العربي في البحر الأحمر — مدربون ببصمة تدريبية علمية،
            مراكز معتمدة بمعايير واضحة، وأدوات مجانية تجهّزك قبل السفر.
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
  const list = (blocks && blocks.length ? blocks : DEFAULT_FOCUS_BLOCKS)
    .filter((b) => b.visible)
    .sort((a, b) => a.order - b.order);

  const render = (key: string) => {
    switch (key) {
      case "focus_hero":        return <FocusHero key={key} />;
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
