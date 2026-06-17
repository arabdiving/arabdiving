"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

export default function AdminSizeProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/size-profiles`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setProfiles(d.profiles || []))
      .catch(() => setMsg("تعذّر تحميل المقاسات"));
  }, []);

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "16px" }}>مقاسات الأعضاء ({profiles.length})</h1>
      {msg && <p style={{ color: "#c0392b" }}>{msg}</p>}
      {!msg && profiles.length === 0 && <p style={{ color: "#666" }}>لا توجد مقاسات مسجّلة بعد.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
        {profiles.map((p) => (
          <div key={p._id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <strong style={{ color: "var(--navy)" }}>{p.user?.name || p.name || "عضو"}</strong>
              <span style={{ background: p.group === "women" ? "#fce4ec" : "#e3f2fd", color: p.group === "women" ? "#ad1457" : "#0d6cb0", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>{p.group === "women" ? "الشابات" : "الشباب"}</span>
            </div>
            {p.user?.email && <div style={{ color: "#94a3b8", fontSize: "12px", direction: "ltr", textAlign: "right", marginTop: "2px" }}>{p.user.email}</div>}
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#333", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span>📐 الطول: {p.sizes?.height || "—"} سم · ⚖️ الوزن: {p.sizes?.weight || "—"} كجم</span>
              <span>👟 الحذاء: {p.sizes?.shoe || "—"} · 🤿 البدلة: {p.sizes?.wetsuit || "—"} · 🥽 النظارة: {p.sizes?.mask || "—"}</span>
              {p.group === "women" && (p.womenExtras?.hoodie || p.womenExtras?.swimCover) && (
                <span style={{ color: "#ad1457" }}>🧥 هودي: {p.womenExtras?.hoodie || "—"} · 🩱 كاش مايوه: {p.womenExtras?.swimCover || "—"}</span>
              )}
              {p.notes && <span style={{ color: "#777" }}>📝 {p.notes}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
