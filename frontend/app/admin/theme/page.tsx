"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

type Theme = { navy: string; mid: string; gold: string; background: string; surface: string; text: string; muted: string; border: string; hero: string };
const DEFAULT: Theme = { navy: "#0d2c54", mid: "#2e75b6", gold: "#c9952a", background: "#f5f7fa", surface: "#ffffff", text: "#1e293b", muted: "#64748b", border: "#e2e8f0", hero: "#08233e" };

const PRESETS: { name: string; t: Theme }[] = [
  { name: "أزرق كلاسيك (الافتراضي)", t: DEFAULT },
  { name: "فيروزي بحري", t: { ...DEFAULT, navy: "#063b4a", mid: "#0e9aa7", gold: "#ff8c42", background: "#f1fbfb", hero: "#063b4a" } },
  { name: "وردي راقٍ", t: { ...DEFAULT, navy: "#5d1a49", mid: "#c2185b", gold: "#d6418a", background: "#fff5f9", hero: "#5d1a49" } },
  { name: "زمردي فاخر", t: { ...DEFAULT, navy: "#0b3d2e", mid: "#1e8a5a", gold: "#c9a84c", background: "#f3faf6", hero: "#0b3d2e" } },
  { name: "ليلي عميق (داكن)", t: { navy: "#0f1424", mid: "#4361ee", gold: "#f4a261", background: "#0b0f1a", surface: "#161c2e", text: "#e8ecf4", muted: "#9aa3b8", border: "#2a3350", hero: "#0f1424" } },
];

const FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "navy", label: "اللون الرئيسي (الهيدر/العناوين)" },
  { key: "mid", label: "اللون الثانوي (روابط/حدود)" },
  { key: "gold", label: "لون التمييز (الأزرار)" },
  { key: "background", label: "خلفية الصفحة" },
  { key: "surface", label: "سطح البطاقات" },
  { key: "text", label: "لون النص الأساسي" },
  { key: "muted", label: "لون النص الثانوي" },
  { key: "border", label: "لون الحدود" },
  { key: "hero", label: "لون الواجهة العلوية (Hero)" },
];

export default function AdminTheme() {
  const [t, setT] = useState<Theme>(DEFAULT);
  const [dnEnabled, setDnEnabled] = useState(false);
  const [day, setDay] = useState<Theme | null>(null);
  const [night, setNight] = useState<Theme | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => {
      setT({ ...DEFAULT, ...(d.settings?.theme || {}) });
      const dn = d.settings?.dayNight || {};
      setDnEnabled(!!dn.enabled);
      if (dn.day && Object.keys(dn.day).length) setDay({ ...DEFAULT, ...dn.day });
      if (dn.night && Object.keys(dn.night).length) setNight({ ...DEFAULT, ...dn.night });
    }).catch(() => {});
  }, []);

  // live preview
  useEffect(() => {
    const root = document.documentElement;
    (Object.keys(t) as (keyof Theme)[]).forEach((k) => root.style.setProperty(`--${k === "navy" ? "navy" : k}`, t[k]));
  }, [t]);

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ theme: t, dayNight: { enabled: dnEnabled, day: day || {}, night: night || {} } }) });
      const d = await res.json();
      setMsg(d.success ? "تم حفظ الألوان ✅ (تطبّق على الموقع كله)" : d.message || "تعذّر الحفظ");
    } catch { setMsg("تعذّر الاتصال بالخادم"); } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "6px" }}>ألوان الموقع</h1>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>غيّر ألوان الموقع كله (٩ متغيّرات). «سطح البطاقات» و«لون النص» منفصلان عن «خلفية الصفحة» — فالبطاقات لا تنقلب داكنة والنص يبقى واضحًا. معاينة حيّة فورية.</p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>قوالب جاهزة:</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => setT(p.t)} style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid #d4dae3", background: "white", borderRadius: "10px", padding: "8px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
              <span style={{ display: "flex" }}>{[p.t.navy, p.t.mid, p.t.gold, p.t.background].map((c, idx) => <span key={idx} style={{ width: "14px", height: "14px", background: c, borderRadius: "3px", marginInlineStart: "-3px", border: "1px solid #fff" }} />)}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        {FIELDS.map((f) => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
            <input type="color" value={t[f.key]} onChange={(e) => setT({ ...t, [f.key]: e.target.value })} style={{ width: "46px", height: "38px", border: "none", background: "none", cursor: "pointer" }} />
            <input value={t[f.key]} onChange={(e) => setT({ ...t, [f.key]: e.target.value })} style={{ width: "110px", padding: "8px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit" }} />
            <span style={{ color: "#444", fontSize: "14px" }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Day / Night */}
      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginTop: "18px" }}>
        <label style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--navy)", fontWeight: 700, marginBottom: "10px" }}>
          <input type="checkbox" checked={dnEnabled} onChange={(e) => setDnEnabled(e.target.checked)} /> 🌗 تفعيل التبديل التلقائي صباحي/مسائي
        </label>
        <p style={{ color: "#666", fontSize: "13px", marginBottom: "12px", lineHeight: 1.7 }}>عند التفعيل: الموقع يستخدم «الألوان النهارية» من 6 صباحًا حتى 6 مساءً، و«الليلية» بقية اليوم. اضبط الألوان أعلاه ثم احفظها كنهارية أو ليلية.</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setDay({ ...t })} style={chip(!!day, "☀️ احفظ الحالي كـ نهاري")} >☀️ الحالي = نهاري {day ? "✓" : ""}</button>
          <button onClick={() => setNight({ ...t })} style={chip(!!night, "🌙")}>🌙 الحالي = ليلي {night ? "✓" : ""}</button>
          {day && <button onClick={() => setT(day)} style={ghost}>تحميل النهاري</button>}
          {night && <button onClick={() => setT(night)} style={ghost}>تحميل الليلي</button>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "18px" }}>
        <button onClick={save} disabled={saving} style={{ background: "var(--mid)", color: "white", border: "none", padding: "12px 30px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{saving ? "جارٍ الحفظ..." : "حفظ الألوان"}</button>
        <button onClick={() => setT(DEFAULT)} style={ghost}>استعادة الافتراضي</button>
      </div>

      {/* Preview */}
      <div style={{ marginTop: "22px", background: "var(--background)", borderRadius: "14px", padding: "20px" }}>
        <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: "10px" }}>معاينة:</div>
        <div style={{ background: "var(--navy)", color: "white", padding: "12px 16px", borderRadius: "10px", marginBottom: "10px" }}>هيدر</div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button style={{ background: "var(--gold)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>زر رئيسي</button>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderBottom: "4px solid var(--mid)", borderRadius: "12px", padding: "14px 18px" }}>
            <div style={{ color: "var(--text)", fontWeight: 700 }}>عنوان البطاقة</div>
            <div style={{ color: "var(--muted)", fontSize: "13px" }}>نص ثانوي على سطح البطاقة</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function chip(active: boolean, _t: string): React.CSSProperties { return { background: active ? "#1e7e34" : "#eef2f6", color: active ? "white" : "#444", border: "none", padding: "9px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "14px" }; }
const ghost: React.CSSProperties = { background: "#eef2f6", color: "#444", border: "none", padding: "10px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit" };
