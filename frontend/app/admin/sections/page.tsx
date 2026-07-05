"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { authHeaders } from "@/app/lib/adminFetch";
import { DEFAULT_SECTIONS, Section } from "@/app/lib/sections";
import { PAGE_OPTIONS, COLOR_SWATCHES } from "@/app/lib/mapSvg";

/* إدارة الأقسام — كل قسم له اسم وأيقونة ولون وصفحات، ويظهر كقائمة منسدلة + صفحة هَب. */

export default function AdminSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => {
      const s = d.settings?.sections;
      setSections(Array.isArray(s) && s.length > 0 ? s : DEFAULT_SECTIONS);
    }).catch(() => setSections(DEFAULT_SECTIONS)).finally(() => setLoading(false));
  }, []);

  const patch = (i: number, p: Partial<Section>) => setSections((xs) => xs.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const togglePage = (i: number, href: string) => setSections((xs) => xs.map((s, j) => {
    if (j !== i) return s;
    const has = s.pages.includes(href);
    return { ...s, pages: has ? s.pages.filter((h) => h !== href) : [...s.pages, href] };
  }));
  const addSection = () => setSections((xs) => [...xs, { slug: "section" + (xs.length + 1), name: "قسم جديد", icon: "📁", color: "#06b6d4", pages: [] }]);
  const del = (i: number) => setSections((xs) => xs.filter((_, j) => j !== i));

  const save = async () => {
    setSaved("");
    try {
      const clean = sections.map((s) => ({ ...s, slug: (s.slug || "").trim().replace(/\s+/g, "-") || "section" }));
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ sections: clean }) });
      if (res.ok) { setSaved("تم الحفظ ✓"); fetch("/api/revalidate", { method: "POST" }).catch(() => {}); setTimeout(() => setSaved(""), 2500); }
      else setSaved("فشل الحفظ — تأكد من تسجيل الدخول كأدمن");
    } catch { setSaved("تعذّر الاتصال"); }
  };

  const field: React.CSSProperties = { padding: "9px 11px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--text)", fontFamily: "inherit", fontSize: "14px" };

  if (loading) return <p style={{ padding: "40px", color: "var(--muted)" }}>جارٍ التحميل...</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "10px 4px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "10px" }}>
        <div>
          <h1 style={{ color: "var(--ink, var(--navy))", fontSize: "24px", fontWeight: 900 }}>🗂️ إدارة الأقسام</h1>
          <p style={{ color: "var(--muted)", fontSize: "13.5px", marginTop: "4px" }}>كل قسم يظهر كقائمة منسدلة في القائمة + صفحة هَب مصوّرة (/section/الرابط).</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {saved && <span style={{ color: saved.includes("✓") ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{saved}</span>}
          <button onClick={() => { setSections(DEFAULT_SECTIONS); }} style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>استعادة الافتراضي</button>
          <button onClick={save} style={{ background: "var(--gold)", border: "none", color: "#04121f", padding: "10px 22px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 800 }}>💾 حفظ</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {sections.map((sec, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderInlineStart: `5px solid ${sec.color}`, borderRadius: "16px", padding: "18px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" }}>
              <input value={sec.icon} onChange={(e) => patch(i, { icon: e.target.value })} style={{ ...field, width: "56px", textAlign: "center", fontSize: "20px" }} />
              <input value={sec.name} onChange={(e) => patch(i, { name: e.target.value })} placeholder="اسم القسم" style={{ ...field, flex: "1 1 180px", fontWeight: 700 }} />
              <input value={sec.slug} onChange={(e) => patch(i, { slug: e.target.value })} placeholder="الرابط (slug)" style={{ ...field, width: "140px" }} />
              <button onClick={() => del(i)} style={{ background: "#fee2e2", color: "#b91c1c", border: "none", padding: "9px 14px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "13px" }}>🗑️ حذف</button>
            </div>
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "14px" }}>
              {COLOR_SWATCHES.map((c) => <button key={c} onClick={() => patch(i, { color: c })} style={{ width: "26px", height: "26px", borderRadius: "50%", background: c, border: sec.color === c ? "3px solid var(--text)" : "1px solid var(--border)", cursor: "pointer" }} />)}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "12.5px", fontWeight: 700, marginBottom: "8px" }}>الصفحات تحت القسم ({sec.pages.length}):</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {PAGE_OPTIONS.map((o) => {
                const on = sec.pages.includes(o.href);
                return (
                  <button key={o.href} onClick={() => togglePage(i, o.href)} style={{ background: on ? sec.color : "var(--background)", color: on ? "#04121f" : "var(--text)", border: on ? "none" : "1px solid var(--border)", borderRadius: "20px", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: on ? 800 : 500 }}>
                    {o.icon} {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addSection} style={{ marginTop: "16px", width: "100%", background: "var(--surface)", border: "2px dashed var(--border)", color: "var(--text)", padding: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>＋ إضافة قسم جديد</button>
    </div>
  );
}
