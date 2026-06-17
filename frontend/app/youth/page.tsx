"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

const HERO = "linear-gradient(135deg, #053b4a 0%, #0e7c86 48%, #19b3a6 100%)";
const DEEP = "#06414f";
const TEAL = "#0e7c86";
const CORAL = "#ff7a59";
const SOFT = "#f1fbfa";

export default function YouthPage() {
  const c = useContent("youth");
  const hero = c.hero || {};
  const tracks = c.tracks || [];
  const perks = c.perks || [];
  const cta = c.cta || {};

  return (
    <main style={{ background: SOFT }}>
      <section style={{ background: HERO, color: "white", padding: "90px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", padding: "10px 22px", borderRadius: "30px", marginBottom: "22px", fontSize: "16px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 54px)", lineHeight: 1.3, marginBottom: "20px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "clamp(17px, 4vw, 20px)", opacity: 0.95, lineHeight: 1.9, maxWidth: "700px", marginInline: "auto", marginBottom: "34px" }}>{hero.subtitle}</p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={hero.primaryHref || "/register"} style={{ background: CORAL, color: "white", padding: "14px 30px", borderRadius: "30px", fontSize: "17px", fontWeight: 700 }}>{hero.primaryLabel}</Link>
          <Link href={hero.secondaryHref || "/logbook"} style={{ background: "transparent", color: "white", border: "1px solid white", padding: "14px 30px", borderRadius: "30px", fontSize: "17px" }}>{hero.secondaryLabel}</Link>
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", color: DEEP, marginBottom: "14px" }}>{c.tracksTitle}</h2>
        <p style={{ textAlign: "center", color: "#5a6b6e", marginBottom: "50px", fontSize: "18px" }}>{c.tracksSubtitle}</p>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "26px" }}>
          {tracks.map((t: any, i: number) => (
            <div key={i} style={{ background: SOFT, borderRadius: "18px", padding: "34px 28px", borderTop: `4px solid ${CORAL}` }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>{t.icon}</div>
              <h3 style={{ color: DEEP, fontSize: "23px", marginBottom: "12px" }}>{t.title}</h3>
              <p style={{ color: "#5a6b6e", lineHeight: 1.8 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: SOFT }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", color: DEEP, marginBottom: "50px" }}>{c.perksTitle}</h2>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "26px" }}>
          {perks.map((p: any, i: number) => (
            <div key={i} style={{ background: "white", borderRadius: "18px", padding: "30px 26px", boxShadow: "0 10px 30px rgba(14,124,134,0.10)", textAlign: "center", borderBottom: `3px solid ${TEAL}` }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>{p.icon}</div>
              <h3 style={{ color: DEEP, fontSize: "20px", marginBottom: "10px" }}>{p.title}</h3>
              <p style={{ color: "#5a6b6e", lineHeight: 1.8 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: HERO, color: "white", padding: "70px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 32px)", marginBottom: "16px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.95, fontSize: "18px", maxWidth: "620px", marginInline: "auto", marginBottom: "30px", lineHeight: 1.9 }}>{cta.text}</p>
        <Link href={cta.href || "/community"} style={{ background: CORAL, color: "white", padding: "15px 34px", borderRadius: "30px", fontSize: "17px", fontWeight: 700 }}>{cta.label}</Link>
      </section>
    </main>
  );
}
