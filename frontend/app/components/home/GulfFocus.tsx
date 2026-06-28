"use client";

import { useContent } from "@/app/lib/useContent";

export default function GulfFocus() {
  const g = useContent("home").gulf || {};
  const reasons = g.reasons || [];
  const countries = g.countries || [];

  return (
    <section style={{ padding: "90px 20px", background: "var(--background)" }}>
      <div style={{ maxWidth: "1150px", margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "38px", color: "var(--text)", marginBottom: "16px" }}>{g.title}</h2>
          <p style={{ fontSize: "19px", color: "var(--muted)", maxWidth: "660px", margin: "auto", lineHeight: 1.9 }}>{g.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "26px", marginBottom: "44px" }}>
          {reasons.map((r: any, i: number) => (
            <div key={i} style={{ background: "var(--surface)", borderRadius: "18px", padding: "32px 26px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>{r.icon}</div>
              <h3 style={{ color: "var(--text)", fontSize: "21px", marginBottom: "12px" }}>{r.title}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          {countries.map((c: string, i: number) => (
            <span key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "30px", padding: "10px 22px", fontSize: "16px", color: "var(--text)" }}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
