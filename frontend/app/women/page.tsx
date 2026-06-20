"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

// Feminine palette
const HERO = "linear-gradient(135deg, #5d1a49 0%, #9c1f63 48%, #e98bb3 100%)";
const PLUM = "#5d1a49";
const ROSE = "#c2185b";
const ROSE_SOFT = "#fff5f9";
const ROSE_BTN = "#d6418a";

export default function WomenPage() {
  const c = useContent("women");
  const hero = c.hero || {};
  const features = c.features || [];
  const steps = c.steps || [];
  const cta = c.cta || {};

  return (
    <main style={{ background: ROSE_SOFT }}>
      <section style={{ background: HERO, color: "white", padding: "90px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "10px 22px", borderRadius: "30px", marginBottom: "22px", fontSize: "16px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", lineHeight: 1.3, marginBottom: "20px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "clamp(17px, 4vw, 20px)", opacity: 0.95, lineHeight: 1.9, maxWidth: "700px", marginInline: "auto", marginBottom: "34px" }}>{hero.subtitle}</p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={hero.primaryHref || "/register"} style={{ background: "#fff", color: ROSE, padding: "14px 30px", borderRadius: "30px", fontSize: "17px", fontWeight: 700 }}>{hero.primaryLabel}</Link>
          <Link href={hero.secondaryHref || "/community"} style={{ background: "transparent", color: "white", border: "1px solid white", padding: "14px 30px", borderRadius: "30px", fontSize: "17px" }}>{hero.secondaryLabel}</Link>
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", color: PLUM, marginBottom: "50px" }}>{c.featuresTitle}</h2>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "26px" }}>
          {features.map((f: any, i: number) => (
            <div key={i} style={{ background: ROSE_SOFT, borderRadius: "20px", padding: "32px 26px", textAlign: "center", border: "1px solid #fadfe9", borderBottom: `4px solid ${ROSE}` }}>
              <div style={{ fontSize: "42px", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ color: PLUM, fontSize: "21px", marginBottom: "12px" }}>{f.title}</h3>
              <p style={{ color: "#6b5560", lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: ROSE_SOFT }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", color: PLUM, marginBottom: "50px" }}>{c.stepsTitle}</h2>
        <div style={{ maxWidth: "1000px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "26px" }}>
          {steps.map((s: any, i: number) => (
            <div key={i} style={{ background: "white", borderRadius: "20px", padding: "34px 28px", boxShadow: "0 10px 30px rgba(156,31,99,0.10)", textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg, ${ROSE}, ${ROSE_BTN})`, color: "white", fontSize: "26px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>{s.n}</div>
              <h3 style={{ color: PLUM, fontSize: "21px", marginBottom: "12px" }}>{s.title}</h3>
              <p style={{ color: "#6b5560", lineHeight: 1.8 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: HERO, color: "white", padding: "70px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 32px)", marginBottom: "16px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.95, fontSize: "18px", maxWidth: "620px", marginInline: "auto", marginBottom: "30px", lineHeight: 1.9 }}>{cta.text}</p>
        <Link href={cta.href || "/register"} style={{ background: "#fff", color: ROSE, padding: "15px 34px", borderRadius: "30px", fontSize: "17px", fontWeight: 700 }}>{cta.label}</Link>
      </section>
    </main>
  );
}
