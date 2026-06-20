"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

const STATUS_LABEL: Record<string, string> = { pending_confirmation: "بانتظار التأكيد", pending_payment: "بانتظار الدفع", confirmed: "مؤكّد", cancelled: "ملغى" };
const STATUS_COLOR: Record<string, string> = { pending_confirmation: "#b7791f", pending_payment: "#b7791f", confirmed: "#1e7e34", cancelled: "#b91c1c" };

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [addons, setAddons] = useState<any[]>([]);
  const [addonsMsg, setAddonsMsg] = useState("");
  const [savingAddons, setSavingAddons] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 20;

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }),
      });
      const d = await res.json();
      if (d.success) setBookings((prev) => prev.map((b) => (b._id === id ? d.booking : b)));
      else alert(d.message || "تعذّر التحديث");
    } catch { alert("تعذّر الاتصال بالخادم"); }
  };

  const loadBookings = (p: number) => {
    fetch(`${API_BASE}/api/bookings/admin?page=${p}&limit=${limit}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings || []); setPages(d.pages || 1); })
      .catch(() => setMsg("تعذّر تحميل الحجوزات"));
  };

  useEffect(() => {
    loadBookings(page);
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setAddons(d.settings?.addons || [])).catch(() => {});
  }, [page]);

  const updAddon = (i: number, patch: any) => setAddons((a) => a.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const addAddon = () => setAddons((a) => [...a, { key: "item" + (a.length + 1), label: "", price: 0, perPerson: false }]);
  const removeAddon = (i: number) => setAddons((a) => a.filter((_, j) => j !== i));
  const saveAddons = async () => {
    setSavingAddons(true); setAddonsMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ addons }) });
      const d = await res.json();
      setAddonsMsg(d.success ? "تم حفظ الأسعار ✅" : d.message || "تعذّر الحفظ");
    } catch { setAddonsMsg("تعذّر الاتصال بالخادم"); } finally { setSavingAddons(false); }
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "18px" }}>الحجوزات ({bookings.length})</h1>

      <div style={{ background: "white", borderRadius: "14px", padding: "18px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "26px" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "6px" }}>أسعار الإضافات (قابلة للتعديل)</h3>
        <p style={{ color: "#666", fontSize: "13px", marginBottom: "14px" }}>تظهر هذه الإضافات وأسعارها للعميل في خطوة الحجز. السعر بالدولار. «لكل فرد» تضرب السعر في عدد الأفراد.</p>
        {addons.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "10px" }}>
            <input value={a.label} onChange={(e) => updAddon(i, { label: e.target.value })} placeholder="اسم الإضافة" style={{ flex: "2 1 200px", padding: "9px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit" }} />
            <input type="number" value={a.price} onChange={(e) => updAddon(i, { price: Number(e.target.value) })} placeholder="السعر $" style={{ flex: "1 1 90px", padding: "9px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit" }} />
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#555" }}>
              <input type="checkbox" checked={!!a.perPerson} onChange={(e) => updAddon(i, { perPerson: e.target.checked })} /> لكل فرد
            </label>
            <button onClick={() => removeAddon(i)} style={{ background: "#b91c1c", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>حذف</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px", flexWrap: "wrap" }}>
          <button onClick={addAddon} style={{ background: "#1e7e34", color: "white", border: "none", padding: "9px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>+ إضافة</button>
          <button onClick={saveAddons} disabled={savingAddons} style={{ background: "var(--mid)", color: "white", border: "none", padding: "9px 22px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{savingAddons ? "جارٍ الحفظ..." : "حفظ الأسعار"}</button>
          {addonsMsg && <span style={{ color: addonsMsg.includes("✅") ? "#1e7e34" : "#c0392b", fontSize: "14px" }}>{addonsMsg}</span>}
        </div>
      </div>
      {msg && <p style={{ color: "#c0392b" }}>{msg}</p>}
      {bookings.length === 0 && !msg && <p style={{ color: "#666" }}>لا توجد حجوزات بعد.</p>}

      {pages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page <= 1 ? 0.5 : 1 }}>→ السابق</button>
          <span style={{ padding: "8px 12px", color: "var(--navy)" }}>{page} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page >= pages ? 0.5 : 1 }}>التالي ←</button>
        </div>
      )}

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
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                {b.status !== "confirmed" && (
                  <button onClick={() => updateStatus(b._id, "confirmed")} style={{ background: "#1e7e34", color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 700 }}>تأكيد الحجز ✓</button>
                )}
                {b.status !== "cancelled" && (
                  <button onClick={() => updateStatus(b._id, "cancelled")} style={{ background: "#b91c1c", color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>إلغاء ✕</button>
                )}
                <button onClick={() => setOpen(open === b._id ? null : b._id)} style={{ background: "#eef4fa", color: "#0d6cb0", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
                  {open === b._id ? "إخفاء التفاصيل" : "عرض الركاب والمقاسات"}
                </button>
              </div>
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
                  <div style={{ marginTop: "6px", color: "#0d6cb0" }}>📨 يفضّل التواصل عبر: {b.contactMethod === "phone" ? `مكالمة${b.bestCallTime ? " · " + b.bestCallTime : ""}` : b.contactMethod === "email" ? "البريد" : "واتساب"}</div>
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
