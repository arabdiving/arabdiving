import { CITIES } from "@/app/lib/cityWeather";
import SiteClimate from "@/app/components/SiteClimate";

export const metadata = { title: "حرارة مياه وجو البحر الأحمر" };

export default function TemperaturesPage() {
  return (
    <main style={{ background: "var(--background)" }}>
      <section style={{ background: "linear-gradient(135deg, #08233e 0%, #0d2c54 45%, #2e75b6 100%)", color: "white", padding: "70px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "8px 20px", borderRadius: "30px", marginBottom: "14px", fontSize: "15px" }}>🌡️ الطقس البحري</span>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 44px)", marginBottom: "12px" }}>درجات حرارة المياه والجو</h1>
        <p style={{ fontSize: "clamp(16px, 4vw, 19px)", opacity: 0.92, maxWidth: "640px", margin: "0 auto", lineHeight: 1.8 }}>حرارة لحظية ومتوسطات سنوية لأهم مدن الغوص في البحر الأحمر — لتخطّط رحلتك في الوقت المثالي.</p>
      </section>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "clamp(30px, 6vw, 60px) 18px", display: "flex", flexDirection: "column", gap: "40px" }}>
        {CITIES.map((c) => (
          <div key={c.key}>
            <h2 style={{ color: "var(--navy)", fontSize: "clamp(22px, 5vw, 30px)", marginBottom: "10px" }}>📍 {c.label}</h2>
            <SiteClimate city={c.label} />
          </div>
        ))}
      </section>
    </main>
  );
}
