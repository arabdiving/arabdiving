"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

export default function KidsPage() {
  const c = useContent("kids");
  const hero = c.hero || {};
  const reasons = c.reasons || [];
  const programs = c.programs || [];
  const cta = c.cta || {};

  return (
    <main style={{ background: "var(--background)" }}>
      <section style={{ background: "linear-gradient(135deg, #08233e 0%, #0d2c54 45%, #2e75b6 100%)", color: "white", padding: "90px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "10px 22px", borderRadius: "30px", marginBottom: "22px", fontSize: "16px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "52px", lineHeight: 1.3, marginBottom: "20px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "20px", opacity: 0.92, lineHeight: 1.9, maxWidth: "680px", marginInline: "auto", marginBottom: "34px" }}>{hero.subtitle}</p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={hero.primaryHref || "/register"} style={{ background: "#c9952a", color: "white", padding: "14px 30px", borderRadius: "10px", fontSize: "17px" }}>{hero.primaryLabel}</Link>
          <Link href={hero.secondaryHref || "/dive-sites"} style={{ background: "transparent", color: "white", border: "1px solid white", padding: "14px 30px", borderRadius: "10px", fontSize: "17px" }}>{hero.secondaryLabel}</Link>
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", color: "var(--navy)", marginBottom: "50px" }}>{c.whyTitle}</h2>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "26px" }}>
          {reasons.map((r: any, i: number) => (
            <div key={i} style={{ background: "var(--background)", borderRadius: "18px", padding: "34px 28px", textAlign: "center" }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>{r.icon}</div>
              <h3 style={{ color: "var(--navy)", fontSize: "22px", marginBottom: "12px" }}>{r.title}</h3>
              <p style={{ color: "#555", lineHeight: 1.8 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 20px", background: "var(--background)" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", color: "var(--navy)", marginBottom: "14px" }}>{c.programsTitle}</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "50px", fontSize: "18px" }}>{c.programsSubtitle}</p>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "26px" }}>
          {programs.map((p: any, i: number) => (
            <div key={i} style={{ background: "white", borderRadius: "18px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", borderTop: "4px solid var(--mid)" }}>
              <div style={{ fontSize: "42px", marginBottom: "14px" }}>{p.icon}</div>
              <h3 style={{ color: "var(--navy)", fontSize: "23px", marginBottom: "6px" }}>{p.title}</h3>
              <span style={{ display: "inline-block", background: "rgba(46,117,182,0.12)", color: "var(--mid)", padding: "5px 14px", borderRadius: "20px", fontSize: "14px", marginBottom: "16px" }}>{p.age}</span>
              <p style={{ color: "#555", lineHeight: 1.8 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--navy)", color: "white", padding: "70px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.9, fontSize: "18px", maxWidth: "600px", marginInline: "auto", marginBottom: "30px", lineHeight: 1.9 }}>{cta.text}</p>
        <Link href={cta.href || "/community"} style={{ background: "#c9952a", color: "white", padding: "15px 34px", borderRadius: "10px", fontSize: "17px" }}>{cta.label}</Link>
      </section>
    </main>
  );
}
