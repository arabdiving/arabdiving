"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

export default function Community() {
  const cm = useContent("home").community || {};
  const segments = cm.segments || [];

  return (
    <section style={{ padding: "90px 20px", background: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "55px" }}>
          <span style={{ display: "inline-block", background: "rgba(46,117,182,0.12)", color: "var(--mid)", padding: "8px 20px", borderRadius: "30px", marginBottom: "18px", fontSize: "15px" }}>{cm.badge}</span>
          <h2 style={{ fontSize: "38px", color: "var(--navy)", marginBottom: "16px" }}>{cm.title}</h2>
          <p style={{ fontSize: "19px", color: "#666", maxWidth: "640px", margin: "auto", lineHeight: 1.9 }}>{cm.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "28px" }}>
          {segments.map((s: any, i: number) => (
            <Link key={i} href={s.href || "#"} style={{ background: "var(--background)", borderRadius: "20px", padding: "40px 30px", textAlign: "center", display: "block", borderBottom: `4px solid ${s.color || "#2e75b6"}` }}>
              <div style={{ fontSize: "52px", marginBottom: "18px" }}>{s.icon}</div>
              <h3 style={{ color: "var(--navy)", fontSize: "24px", marginBottom: "12px" }}>{s.title}</h3>
              <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "18px" }}>{s.desc}</p>
              <span style={{ color: s.color || "#2e75b6", fontWeight: 600 }}>اكتشف المزيد ←</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
