"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

export default function HomePageCards() {
  const [cards, setCards] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setCards(d.settings?.homeCards || [])).catch(() => {});
  }, []);
  if (!cards.length) return null;

  return (
    <section style={{ padding: "70px 20px", background: "white" }}>
      <h2 style={{ textAlign: "center", color: "var(--navy)", fontSize: "clamp(24px,5vw,34px)", marginBottom: "40px" }}>اكتشف المزيد</h2>
      <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "22px" }}>
        {cards.map((c, i) => (
          <Link key={i} href={c.href || "#"} style={{ background: "var(--background)", borderRadius: "18px", padding: "32px 24px", textAlign: "center", display: "block", borderBottom: "4px solid var(--mid)", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>{c.icon || "✦"}</div>
            <h3 style={{ color: "var(--navy)", fontSize: "21px", marginBottom: "10px" }}>{c.label}</h3>
            {c.desc && <p style={{ color: "#555", lineHeight: 1.7 }}>{c.desc}</p>}
            <span style={{ color: "var(--mid)", fontWeight: 600, display: "inline-block", marginTop: "12px" }}>اذهب ←</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
