"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

// Pages that can be shown/hidden from the public navigation.
const PAGES: { href: string; label: string; locked?: boolean }[] = [
  { href: "/", label: "الرئيسية", locked: true },
  { href: "/dive-sites", label: "مواقع الغوص" },
  { href: "/family-booking", label: "احجز رحلة" },
  { href: "/retreats", label: "الباقات الفاخرة" },
  { href: "/trips", label: "الرحلات" },
  { href: "/guide", label: "دليل الغوص" },
  { href: "/temperatures", label: "حرارة المياه" },
  { href: "/community", label: "المجتمع" },
  { href: "/quiz", label: "اكتشف نمطك (DISC)" },
  { href: "/stories", label: "القصص والمسابقة" },
  { href: "/youth", label: "الشباب" },
  { href: "/women", label: "النساء" },
  { href: "/kids", label: "الأطفال / العائلات" },
  { href: "/game", label: "لعبة الأطفال" },
  { href: "/members", label: "الأعضاء" },
  { href: "/communities", label: "المجتمعات اللونية" },
  { href: "/messages", label: "الرسائل" },
  { href: "/logbook", label: "اللوج بوك" },
];

export default function AdminPagesVisibility() {
  const [hidden, setHidden] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setHidden(d.settings?.hiddenPages || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const isVisible = (href: string) => !hidden.includes(href);
  const toggle = (href: string) =>
    setHidden((h) => (h.includes(href) ? h.filter((x) => x !== href) : [...h, href]));

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT", headers: authHeaders(), body: JSON.stringify({ hiddenPages: hidden }),
      });
      const d = await res.json();
      setMsg(d.success ? "تم الحفظ ✅" : d.message || "تعذّر الحفظ");
    } catch { setMsg("تعذّر الاتصال بالخادم"); } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: "620px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "8px" }}>ظهور الصفحات</h1>
      <p style={{ color: "#666", marginBottom: "20px", fontSize: "15px" }}>تحكّم في إظهار أو إخفاء الصفحات من قائمة الموقع. الصفحات المخفيّة لا تظهر للزوّار في القائمة.</p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {!loaded ? (
        <p style={{ color: "#666" }}>جارٍ التحميل...</p>
      ) : (
        <>
          <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {PAGES.map((p, i) => {
              const visible = isVisible(p.href);
              return (
                <div key={p.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderTop: i === 0 ? "none" : "1px solid #f0f3f7" }}>
                  <div>
                    <strong style={{ color: "var(--navy)" }}>{p.label}</strong>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>{p.href}</div>
                  </div>
                  {p.locked ? (
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>دائمًا ظاهرة</span>
                  ) : (
                    <button onClick={() => toggle(p.href)} aria-label={visible ? "إخفاء" : "إظهار"}
                      style={{ position: "relative", width: "58px", height: "30px", borderRadius: "30px", border: "none", cursor: "pointer", background: visible ? "#1e7e34" : "#cbd5e1", transition: "background .2s" }}>
                      <span style={{ position: "absolute", top: "3px", insetInlineStart: visible ? "31px" : "3px", width: "24px", height: "24px", borderRadius: "50%", background: "white", transition: "inset-inline-start .2s" }} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={save} disabled={saving} style={{ background: "var(--mid)", color: "white", border: "none", padding: "12px 30px", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer", fontSize: "16px", fontFamily: "inherit" }}>
              {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </button>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>{hidden.length} صفحة مخفيّة</span>
          </div>
        </>
      )}
    </div>
  );
}
