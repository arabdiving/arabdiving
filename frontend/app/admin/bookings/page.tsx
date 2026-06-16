"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

const STATUS_LABEL: Record<string, string> = { pending_payment: "بانتظار الدفع", confirmed: "مؤكّد", cancelled: "ملغى" };
const STATUS_COLOR: Record<string, string> = { pending_payment: "#b7791f", confirmed: "#1e7e34", cancelled: "#b91c1c" };

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/bookings/admin`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => setMsg("تعذّر تحميل الحجوزات"));
  }, []);

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "18px" }}>الحجوزات ({bookings.length})</h1>
      {msg && <p style={{ color: "#c0392b" }}>{msg}</p>}
      {bookings.length === 0 && !msg && <p style={{ color: "#666" }}>لا توجد حجوزات بعد.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {bookings.map((b) => {
          const kids = (b.passengers || []).filter((p: any) => p.type === "child" && p.profile);
          return (
            <div key={b._id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <strong style={{ color: "var(--navy)" }}>{b.ticketCode}</strong> · {b.centerName}
                  <div style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>📅 {b.date || "—"} · 👥 {b.peopleCount} · 💰 {b.total}{b.currency}</div>
                  <div style={{ color: "#666", fontSize: "13px" }}>👤 {b.contact?.name} · 📞 {b.contact?.phone}</div>
                </div>
                <span style={{ background: STATUS_COLOR[b.status] || "#666", color: "white", height: "fit-content", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>{STATUS_LABEL[b.status] || b.status}</span>
              </div>
              <button onClick={() => setOpen(open === b._id ? null : b._id)} style={{ marginTop: "10px", background: "#eef4fa", color: "#0d6cb0", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
                {open === b._id ? "إخفاء التفاصيل" : "عرض الركاب والمقاسات"}
              </button>
              {open === b._id && (
                <div style={{ marginTop: "10px", borderTop: "1px solid #eee", paddingTop: "10px", fontSize: "14px" }}>
                  {(b.passengers || []).map((p: any, i: number) => (
                    <div key={i} style={{ padding: "4px 0" }}>
                      {p.type === "child" ? "🧒" : "🧑"} {p.name || "—"}
                      {p.type === "child" && p.profile && (
                        <span style={{ color: "#0d6cb0" }}> — العمر {p.profile.age || "?"} · طول {p.profile.sizes?.height || "?"}سم · وزن {p.profile.sizes?.weight || "?"}كجم · حذاء {p.profile.sizes?.shoe || "?"} · نظارة {p.profile.sizes?.mask || "?"} {p.profile.pledge ? "· 🐢 وقّع العهد" : ""}</span>
                      )}
                    </div>
                  ))}
                  {(b.addons || []).length > 0 && <div style={{ marginTop: "6px", color: "#666" }}>الإضافات: {b.addons.map((a: any) => a.label).join("، ")}</div>}
                  {kids.length > 0 && <div style={{ marginTop: "6px", color: "#1e7e34" }}>🏅 {kids.length} وسام «حامي البحر الأحمر»</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
