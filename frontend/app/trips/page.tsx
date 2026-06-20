"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

export default function TripsPage() {
  const c = useContent("trips");
  const hero = c.hero || {};
  const trips = c.trips || [];
  const cta = c.cta || {};

  return (
    <main style={{ background: "var(--background)" }}>
      <section style={{ background: "linear-gradient(135deg, #08233e 0%, #0d2c54 45%, #2e75b6 100%)", color: "white", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "46px", marginBottom: "18px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "19px", opacity: 0.92, lineHeight: 1.9, maxWidth: "680px", marginInline: "auto" }}>{hero.subtitle}</p>
      </section>

      <section style={{ padding: "70px 20px" }}>
        <div style={{ maxWidth: "1150px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          {trips.map((t: any, i: number) => (
            <div key={i} style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "46px", marginBottom: "14px" }}>{t.icon}</div>
              <h2 style={{ color: "var(--navy)", fontSize: "24px", marginBottom: "10px" }}>{t.title}</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                <span style={{ background: "rgba(46,117,182,0.12)", color: "var(--mid)", padding: "5px 13px", borderRadius: "20px", fontSize: "13px" }}>⏱ {t.duration}</span>
                <span style={{ background: "rgba(201,149,42,0.15)", color: "#9a6f1f", padding: "5px 13px", borderRadius: "20px", fontSize: "13px" }}>🎚 {t.level}</span>
              </div>
              <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "16px" }}>{t.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", color: "#444" }}>
                {(t.highlights || []).map((h: string, j: number) => (
                  <li key={j} style={{ marginBottom: "8px" }}>🪸 {h}</li>
                ))}
              </ul>
              <Link href="/community" style={{ marginTop: "auto", background: "var(--mid)", color: "white", padding: "12px 22px", borderRadius: "10px", textAlign: "center" }}>نسّق رحلتك مع المجتمع</Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--navy)", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "14px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.9, fontSize: "18px", maxWidth: "600px", marginInline: "auto", marginBottom: "26px", lineHeight: 1.9 }}>{cta.text}</p>
        <Link href={cta.href || "/community"} style={{ background: "#c9952a", color: "white", padding: "14px 32px", borderRadius: "10px", fontSize: "17px" }}>{cta.label}</Link>
      </section>
    </main>
  );
}
