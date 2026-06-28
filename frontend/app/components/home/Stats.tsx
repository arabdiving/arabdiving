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
    <section style={{ padding: "80px 20px", background: "white" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: "var(--surface)",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "var(--text)", fontSize: "40px", marginBottom: "10px" }}>
              {c.value}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "18px" }}>{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
