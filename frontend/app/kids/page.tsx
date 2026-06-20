"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

const HERO = "linear-gradient(135deg, #0aa3c2 0%, #34d1e0 55%, #7ee8c0 100%)";
const DEEP = "#0a6b86";
const SUN = "#ffc233";
const SOFT = "#f0fbff";
const FUN = ["#ff7a59", "#34c0e0", "#ffc233", "#7ac74f", "#e0578b", "#8a5cf6"];

export default function KidsPage() {
  const c = useContent("kids");
  const hero = c.hero || {};
  const reasons = c.reasons || [];
  const programs = c.programs || [];
  const cta = c.cta || {};

  return (
    <main style={{ background: SOFT }}>
      <section style={{ background: HERO, color: "white", padding: "90px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.25)", padding: "10px 22px", borderRadius: "30px", marginBottom: "22px", fontSize: "16px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 52px)", lineHeight: 1.3, marginBottom: "20px", maxWidth: "820px", marginInline: "auto", textShadow: "1px 2px 6px rgba(0,0,0,0.15)" }}>{hero.title}</h1>
        <p style={{ fontSize: "clamp(17px, 4vw, 20px)", opacity: 0.97, lineHeight: 1.9, maxWidth: "680px", marginInline: "auto", marginBottom: "34px" }}>{hero.subtitle}</p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={hero.primaryHref || "/register"} style={{ background: SUN, color: "#0a3b4a", padding: "14px 30px", borderRadius: "30px", fontSize: "17px", fontWeight: 800 }}>{hero.primaryLabel}</Link>
          <Link href={hero.secondaryHref || "/game"} style={{ background: "rgba(255,255,255,0.95)", color: DEEP, padding: "14px 30px", borderRadius: "30px", fontSize: "17px", fontWeight: 700 }}>{hero.secondaryLabel}</Link>
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", color: DEEP, marginBottom: "50px" }}>{c.whyTitle}</h2>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "26px" }}>
          {reasons.map((r: any, i: number) => (
            <div key={i} style={{ background: SOFT, borderRadius: "22px", padding: "34px 28px", textAlign: "center", borderTop: `5px solid ${FUN[i % FUN.length]}` }}>
              <div style={{ fontSize: "46px", marginBottom: "14px" }}>{r.icon}</div>
              <h3 style={{ color: DEEP, fontSize: "22px", marginBottom: "12px" }}>{r.title}</h3>
              <p style={{ color: "#5a6b6e", lineHeight: 1.8 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: SOFT }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", color: DEEP, marginBottom: "14px" }}>{c.programsTitle}</h2>
        <p style={{ textAlign: "center", color: "#5a6b6e", marginBottom: "50px", fontSize: "18px" }}>{c.programsSubtitle}</p>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "26px" }}>
          {programs.map((p: any, i: number) => (
            <div key={i} style={{ background: "white", borderRadius: "22px", padding: "32px", boxShadow: "0 10px 30px rgba(10,107,134,0.10)", borderTop: `5px solid ${FUN[i % FUN.length]}` }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>{p.icon}</div>
              <h3 style={{ color: DEEP, fontSize: "23px", marginBottom: "6px" }}>{p.title}</h3>
              <span style={{ display: "inline-block", background: "rgba(10,163,194,0.12)", color: "#0a6b86", padding: "5px 14px", borderRadius: "20px", fontSize: "14px", marginBottom: "16px" }}>{p.age}</span>
              <p style={{ color: "#5a6b6e", lineHeight: 1.8 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: HERO, color: "white", padding: "70px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 32px)", marginBottom: "16px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.97, fontSize: "18px", maxWidth: "600px", marginInline: "auto", marginBottom: "30px", lineHeight: 1.9 }}>{cta.text}</p>
        <Link href={cta.href || "/community"} style={{ background: SUN, color: "#0a3b4a", padding: "15px 34px", borderRadius: "30px", fontSize: "17px", fontWeight: 800 }}>{cta.label}</Link>
      </section>
    </main>
  );
}
