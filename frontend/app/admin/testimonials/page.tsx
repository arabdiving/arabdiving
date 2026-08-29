"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

/*
  مراجعة تجارب وشكاوى الزوار (صندوق «شاركنا»).
  العام لا يظهر للناس إلا بعد الضغط على «نشر». الخاص يبقى للاطلاع فقط.
*/

const badge = (s: string) =>
  s === "pending" ? { t: "⏳ بانتظار النشر", bg: "#fff7e0", c: "#b45309" }
  : s === "approved" ? { t: "🌍 منشور", bg: "#ecf7f0", c: "#1e7e34" }
  : s === "private" ? { t: "🔒 خاص", bg: "#eef2f6", c: "#475569" }
  : { t: "🚫 مخفي", bg: "#fef2f2", c: "#b91c1c" };

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API_BASE}/api/testimonials/admin`, { headers: authHeaders() })
      .then((r) => r.json()).then((d) => setItems(d.testimonials || []))
      .catch(() => setMsg("تعذّر التحميل")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setStatus = async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/api/testimonials/admin/${id}`, {
      method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }),
    });
    const d = await res.json();
    if (d.success) load(); else setMsg(d.message || "تعذّر التحديث");
  };

  return (
    <div style={{ maxWidth: "820px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "6px" }}>تجارب وشكاوى الزوار</h1>
      <p style={{ color: "#666", marginBottom: "18px", fontSize: "14.5px", lineHeight: 1.8 }}>
        من طلب النشر العام يظهر «⏳ بانتظار النشر» — اضغط «نشر» ليقرأه الجميع. والخاص للاطلاع فقط.
      </p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {loading ? <p style={{ color: "#666" }}>جارٍ التحميل...</p>
        : items.length === 0 ? <p style={{ color: "#888" }}>لا توجد رسائل بعد.</p>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((t) => {
              const b = badge(t.status);
              return (
                <div key={t._id} style={{ background: "white", borderRadius: "14px", padding: "18px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: t.status === "pending" ? "2px solid #fcd34d" : "1px solid #eef2f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <div>
                      <strong style={{ color: "var(--navy)", fontSize: "15px" }}>{t.name}</strong>
                      {t.contact && <span style={{ color: "#777", fontSize: "12.5px", marginInlineStart: "8px" }} dir="ltr">{t.contact}</span>}
                      {t.brand && <span style={{ color: "#0d6cb0", fontSize: "12.5px", marginInlineStart: "8px" }}>· {t.brand}</span>}
                    </div>
                    <span style={{ background: b.bg, color: b.c, borderRadius: "20px", padding: "4px 13px", fontSize: "12.5px", fontWeight: 800 }}>{b.t}</span>
                  </div>
                  <p style={{ color: "#333", fontSize: "14px", lineHeight: 1.9, margin: "0 0 12px", whiteSpace: "pre-wrap" }}>{t.message}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {t.status !== "approved" && t.wantsPublic && (
                      <button onClick={() => setStatus(t._id, "approved")} style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "9px", padding: "8px 18px", fontWeight: 800, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>🌍 نشر للجميع</button>
                    )}
                    {t.status === "approved" && (
                      <button onClick={() => setStatus(t._id, "hidden")} style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: "9px", padding: "8px 16px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>إخفاء</button>
                    )}
                    {t.status !== "hidden" && t.status !== "approved" && (
                      <button onClick={() => setStatus(t._id, "hidden")} style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: "9px", padding: "8px 16px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>🚫 رفض/إخفاء</button>
                    )}
                    <span style={{ color: "#94a3b8", fontSize: "12px", alignSelf: "center" }}>{new Date(t.createdAt).toLocaleString("ar-EG")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
