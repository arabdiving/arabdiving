import Link from "next/link";

/*
  الرئيسية المختصرة لوضع «موقع يحل مشكلة»:
  رسالة واحدة واضحة + ثلاث بوابات: دليل المدربين، مراكز الغوص، الأدوات.
  بأسلوب Dark Ocean (زجاج + خلفية عميقة) وتعمل مع الثيمين عبر متغيرات CSS.
*/

const glass: React.CSSProperties = {
  background: "var(--glass-bg,rgba(8,20,48,0.78))",
  border: "1px solid var(--glass-border,rgba(255,255,255,0.08))",
  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
};

const TOOLS = [
  { href: "/weight-calculator", icon: "⚖️", label: "حاسبة الأوزان", desc: "وزن الرصاص المناسب لجسمك وبدلتك" },
  { href: "/dive-sites", icon: "🗺️", label: "خريطة مواقع الغوص", desc: "أفضل مواقع البحر الأحمر بالتفصيل" },
  { href: "/quiz", icon: "🎨", label: "اكتشف نمطك", desc: "نظام الألوان — اعرف أسلوبك في التعلم" },
  { href: "/training-fit", icon: "🤝", label: "استبيان التوافق", desc: "أي مدرب يناسب شخصيتك؟" },
  { href: "/survey", icon: "🧠", label: "استبيان التعلم", desc: "افهم طريقة تعلمك قبل أول دورة" },
];

export default function FocusHome() {
  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      {/* الرسالة */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "70px 20px 50px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "760px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(30px,6.5vw,50px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "14px", lineHeight: 1.4 }}>
            اعرف مدربك ومركزك<br />قبل أول غطسة 🤿
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(15px,3vw,18px)", lineHeight: 2, marginBottom: "30px" }}>
            الناصح الأمين للغواص العربي في البحر الأحمر — مدربون ببصمة تدريبية علمية،
            مراكز معتمدة بمعايير واضحة، وأدوات مجانية تجهّزك قبل السفر.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/instructors" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", padding: "14px 30px", borderRadius: "13px", fontWeight: 800, fontSize: "15.5px", boxShadow: "0 4px 18px rgba(201,149,42,0.5)" }}>
              🧑‍🏫 دليل المدربين
            </Link>
            <Link href="/family-booking" style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "white", padding: "14px 30px", borderRadius: "13px", fontWeight: 800, fontSize: "15.5px", boxShadow: "0 4px 18px rgba(8,145,178,0.5)" }}>
              🏛️ مراكز الغوص
            </Link>
          </div>
        </div>
      </section>

      {/* البوابتان الرئيسيتان */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 18px 10px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "18px" }}>
        <Link href="/instructors" style={{ ...glass, borderRadius: "20px", padding: "28px", textDecoration: "none", display: "block" }}>
          <div style={{ fontSize: "42px", marginBottom: "10px" }}>🧑‍🏫</div>
          <h2 style={{ color: "#fff", fontSize: "21px", fontWeight: 900, marginBottom: "8px" }}>دليل المدربين</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.9, margin: 0 }}>
            كل مدرب له «بصمة تدريبية» علمية تُظهر نقاط تميّزه، ويصارحك بمن يناسبه ومن لا يناسبه.
            اختر موقعك وشاهد الأقرب إليك على الخريطة.
          </p>
          <span style={{ color: "#22d3ee", fontWeight: 800, fontSize: "13.5px", display: "inline-block", marginTop: "12px" }}>تصفح المدربين ←</span>
        </Link>
        <Link href="/family-booking" style={{ ...glass, borderRadius: "20px", padding: "28px", textDecoration: "none", display: "block" }}>
          <div style={{ fontSize: "42px", marginBottom: "10px" }}>🏛️</div>
          <h2 style={{ color: "#fff", fontSize: "21px", fontWeight: 900, marginBottom: "8px" }}>دليل مراكز الغوص</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.9, margin: 0 }}>
            مراكز بشارات ثقة واضحة: طاقم نسائي، معتمد للعائلات، معدات معقّمة —
            مع فريق مدربيها المعتمد وحجز مباشر بدون دفع مقدم.
          </p>
          <span style={{ color: "#22d3ee", fontWeight: 800, fontSize: "13.5px", display: "inline-block", marginTop: "12px" }}>تصفح المراكز ←</span>
        </Link>
      </section>

      {/* الأدوات */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "26px 18px 70px" }}>
        <h2 style={{ color: "var(--ink,#fff)", fontSize: "22px", fontWeight: 900, textAlign: "center", marginBottom: "20px" }}>🧰 أدوات مجانية تجهّزك قبل السفر</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px" }}>
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} style={{ ...glass, borderRadius: "16px", padding: "20px", textDecoration: "none", display: "block", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{t.icon}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", marginBottom: "5px" }}>{t.label}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.7 }}>{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
