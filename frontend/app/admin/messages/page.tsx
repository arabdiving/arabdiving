"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

interface Message {
  _id: string; name: string; contact: string; message: string; page: string; status: string; createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // contact settings
  const [whatsapp, setWhatsapp] = useState("");
  const [chatEnabled, setChatEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  const loadMessages = (p: number) => {
    fetch(`${API_BASE}/api/messages?page=${p}&limit=20`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setMessages(d.messages || []); setPages(d.pages || 1); })
      .catch(() => setMsg("تعذّر تحميل الرسائل"))
      .finally(() => setLoaded(true));
  };

  useEffect(() => {
    loadMessages(page);
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => { setWhatsapp(d.settings?.whatsappNumber || ""); setChatEnabled(d.settings?.chatEnabled !== false); })
      .catch(() => {});
  }, [page]);

  const saveSettings = async () => {
    setSavingSettings(true); setSettingsMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT", headers: authHeaders(), body: JSON.stringify({ whatsappNumber: whatsapp, chatEnabled }),
      });
      const d = await res.json();
      setSettingsMsg(d.success ? "تم الحفظ ✅" : d.message || "تعذّر الحفظ");
    } catch { setSettingsMsg("تعذّر الاتصال بالخادم"); } finally { setSavingSettings(false); }
  };

  const markRead = async (id: string) => {
    await fetch(`${API_BASE}/api/messages/${id}/read`, { method: "PUT", headers: authHeaders() });
    setMessages((m) => m.map((x) => (x._id === id ? { ...x, status: "read" } : x)));
  };
  const remove = async (id: string) => {
    if (!confirm("حذف هذه الرسالة؟")) return;
    await fetch(`${API_BASE}/api/messages/${id}`, { method: "DELETE", headers: authHeaders() });
    setMessages((m) => m.filter((x) => x._id !== id));
  };

  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <div style={{ maxWidth: "760px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "16px" }}>الرسائل والتواصل</h1>

      {/* Contact settings card */}
      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "14px" }}>إعدادات التواصل</h3>
        <label style={{ display: "block", fontSize: "14px", color: "#444", marginBottom: "6px" }}>رقم واتساب (مع رمز الدولة بدون + أو 00)</label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="مثال: 201001234567" style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "15px", marginBottom: "14px" }} />
        <label style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "14px", color: "#444" }}>
          <input type="checkbox" checked={chatEnabled} onChange={(e) => setChatEnabled(e.target.checked)} /> تفعيل الشات بوت (جمع بيانات الزوّار)
        </label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={saveSettings} disabled={savingSettings} style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>{savingSettings ? "جارٍ الحفظ..." : "حفظ الإعدادات"}</button>
          {settingsMsg && <span style={{ color: settingsMsg.includes("✅") ? "#1e7e34" : "#c0392b", fontSize: "14px" }}>{settingsMsg}</span>}
        </div>
      </div>

      <h2 style={{ color: "var(--navy)", fontSize: "20px", marginBottom: "12px" }}>صندوق الرسائل ({unread ? `${unread} جديدة` : "لا توجد رسائل جديدة"})</h2>
      {msg && <p style={{ color: "#c0392b" }}>{msg}</p>}
      {loaded && messages.length === 0 && !msg && <p style={{ color: "#666" }}>لا توجد رسائل بعد.</p>}

      {pages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page <= 1 ? 0.5 : 1 }}>→ السابق</button>
          <span style={{ padding: "8px 12px", color: "var(--navy)" }}>{page} / {pages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= pages} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page >= pages ? 0.5 : 1 }}>التالي ←</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((m) => (
          <div key={m._id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", borderInlineStart: m.status === "new" ? "4px solid #1e7e34" : "4px solid transparent" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <strong style={{ color: "var(--navy)" }}>{m.name} {m.status === "new" && <span style={{ background: "#1e7e34", color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "20px", marginInlineStart: "6px" }}>جديد</span>}</strong>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>{new Date(m.createdAt).toLocaleString("ar-EG")}</span>
            </div>
            <div style={{ color: "#0d6cb0", fontSize: "14px", margin: "4px 0" }}>📞 {m.contact || "—"}{m.page ? ` · 📄 ${m.page}` : ""}</div>
            <p style={{ color: "#333", fontSize: "15px", lineHeight: 1.7, margin: "6px 0 10px" }}>{m.message || "—"}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {m.status === "new" && <button onClick={() => markRead(m._id)} style={mini("#2e75b6")}>تحديد كمقروء</button>}
              {m.contact && /^[0-9+]/.test(m.contact) && <a href={`https://wa.me/${m.contact.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ ...mini("#25D366"), textDecoration: "none", display: "inline-block" }}>رد عبر واتساب</a>}
              <button onClick={() => remove(m._id)} style={mini("#b91c1c")}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mini(bg: string): React.CSSProperties {
  return { background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" };
}
