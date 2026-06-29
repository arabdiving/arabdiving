"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

interface SiteStats {
  members: number;
  diveSites: number;
  countries: number;
  dives: number;
}

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k+` : `${n}`);

export default function Stats() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  const cards = [
    { value: stats ? fmt(stats.members) : "—", label: "عضو" },
    { value: stats ? fmt(stats.diveSites) : "—", label: "موقع غوص" },
    { value: stats ? `${stats.countries}` : "—", label: "دولة" },
    { value: stats ? fmt(stats.dives) : "—", label: "غوصة مسجلة" },
  ];

  return (
    <section style={{
      padding: "80px 20px",
      background: "var(--navy)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* خلفية زخرفية */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "radial-gradient(circle at 20% 50%, var(--gold) 0%, transparent 50%), radial-gradient(circle at 80% 50%, var(--mid) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "auto", position: "relative" }}>
        {/* عنوان القسم */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{
            display: "inline-block", background: "rgba(201,168,76,0.15)",
            color: "var(--gold)", padding: "5px 18px", borderRadius: "30px",
            fontSize: "13px", marginBottom: "12px",
          }}>
            ArabDiving بالأرقام
          </span>
          <h2 style={{
            color: "#fff", fontSize: "clamp(22px,3.5vw,32px)", margin: 0,
          }}>
            مجتمع الغوص العربي ينمو
          </h2>
        </div>

        {/* البطاقات */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}>
          {cards.map((c) => (
            <div
              key={c.label}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
                padding: "32px 20px",
                textAlign: "center",
                backdropFilter: "blur(8px)",
                transition: "transform 0.2s",
              }}
            >
              <h2 style={{
                color: "var(--gold)", fontSize: "clamp(36px,5vw,52px)",
                fontWeight: 800, margin: "0 0 10px", lineHeight: 1,
              }}>
                {c.value}
              </h2>
              <p style={{
                color: "rgba(255,255,255,0.75)", fontSize: "16px",
                margin: 0, fontWeight: 500,
              }}>
                {c.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
