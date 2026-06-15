"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/dashboard`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => (d.success ? setStats(d.stats) : setErr(d.message || "تعذّر التحميل")))
      .catch(() => setErr("تعذّر الاتصال بالخادم"));
  }, []);

  const cards = stats
    ? [
        { label: "الأعضاء", value: stats.users },
        { label: "مواقع الغوص", value: stats.diveSites },
        { label: "التقييمات", value: stats.reviews },
        { label: "المنشورات", value: stats.posts },
        { label: "التعليقات", value: stats.comments },
      ]
    : [];

  return (
    <div>
      <h1 style={{ color: "var(--navy)", marginBottom: "24px" }}>لوحة المعلومات</h1>
      {err && <p style={{ color: "#c0392b" }}>{err}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "18px" }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: "white", borderRadius: "14px", padding: "26px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "34px", fontWeight: 700, color: "var(--navy)" }}>{c.value}</div>
            <div style={{ color: "#666", marginTop: "6px" }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
