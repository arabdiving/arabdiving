"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

type Theme = { navy: string; mid: string; gold: string; background: string };
const DEFAULT: Theme = { navy: "#0d2c54", mid: "#2e75b6", gold: "#c9952a", background: "#f5f7fa" };

const PRESETS: { name: string; t: Theme }[] = [
  { name: "أزرق كلاسيك (الافتراضي)", t: DEFAULT },
  { name: "فيروزي بحري", t: { navy: "#063b4a", mid: "#0e9aa7", gold: "#ff8c42", background: "#f1fbfb" } },
  { name: "وردي راقٍ", t: { navy: "#5d1a49", mid: "#c2185b", gold: "#d6418a", background: "#fff5f9" } },
  { name: "زمردي فاخر", t: { navy: "#0b3d2e", mid: "#1e8a5a", gold: "#c9a84c", background: "#f3faf6" } },
  { name: "ليلي عميق", t: { navy: "#10131f", mid: "#4361ee", gold: "#f4a261", background: "#f0f2f8" } },
];

const FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "navy", label: "اللون الرئيسي (الهيدر/العناوين)" },
  { key: "mid", label: "اللون الثانوي (روابط/حدود)" },
  { key: "gold", label: "لون التمييز (الأزرار)" },
  { key: "background", label: "لون الخلفية" },
];

export default function AdminTheme() {
  const [t, setT] = useState<Theme>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setT({ ...DEFAULT, ...(d.settings?.theme || {}) })).catch(() => {});
  }, []);

  // live preview on this page
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--navy", t.navy); root.style.setProperty("--mid", t.mid);
    root.style.setProperty("--gold", t.gold); root.style.setProperty("--background", t.background);
  }, [t]);

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ theme: t }) });
      const d = await res.json();
      setMsg(d.success ? "تم حفظ الألوان ✅ (تطبّق على الموقع كله)" : d.message || "تعذّر الحفظ");
    } catch { setMsg("تعذّر الاتصال بالخادم"); } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "6px" }}>ألوان الموقع</h1>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "18px" }}>غيّر ألوان الموقع كله من هنا — البطاقات والأزرار والخلفية والعناوين تتبع هذه الألوان. (معاينة حيّة فورية على هذه الصفحة.)</p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>قوالب جاهزة:</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => setT(p.t)} style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid #d4dae3", background: "white", borderRadius: "10px", padding: "8px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
              <span style={{ display: "flex" }}>{[p.t.navy, p.t.mid, p.t.gold].map((c) => <span key={c} style={{ width: "14px", height: "14px", background: c, borderRadius: "3px", marginInlineStart: "-3px", border: "1px solid #fff" }} />)}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        {FIELDS.map((f) => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <input type="color" value={t[f.key]} onChange={(e) => setT({ ...t, [f.key]: e.target.value })} style={{ width: "48px", height: "40px", border: "none", background: "none", cursor: "pointer" }} />
            <input value={t[f.key]} onChange={(e) => setT({ ...t, [f.key]: e.target.value })} style={{ width: "120px", padding: "9px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit" }} />
            <span style={{ color: "#444", fontSize: "14px" }}>{f.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
          <button onClick={save} disabled={saving} style={{ background: "var(--mid)", color: "white", border: "none", padding: "12px 30px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{saving ? "جارٍ الحفظ..." : "حفظ الألوان"}</button>
          <button onClick={() => setT(DEFAULT)} style={{ background: "#eef2f6", color: "#444", border: "none", padding: "12px 18px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>استعادة الافتراضي</button>
        </div>
      </div>

      {/* Sample preview */}
      <div style={{ marginTop: "22px", background: "var(--background)", borderRadius: "14px", padding: "20px" }}>
        <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "10px" }}>معاينة:</div>
        <div style={{ background: "var(--navy)", color: "white", padding: "12px 16px", borderRadius: "10px", marginBottom: "10px" }}>هيدر / عنوان</div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={{ background: "var(--gold)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>زر رئيسي</button>
          <span style={{ color: "var(--mid)", padding: "10px", fontWeight: 700 }}>رابط ثانوي</span>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderBottom: "4px solid var(--mid)", borderRadius: "12px", padding: "14px 18px", color: "var(--navy)" }}>بطاقة</div>
        </div>
      </div>
    </div>
  );
}
