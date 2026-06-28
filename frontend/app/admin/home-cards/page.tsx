"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

interface Card { href: string; label: string; desc: string; icon: string; }

const KNOWN: { href: string; label: string }[] = [
  { href: "/marketplace", label: "المتجر" },
  { href: "/dive-sites", label: "مواقع الغوص" },
  { href: "/family-booking", label: "احجز رحلة" },
  { href: "/retreats", label: "الباقات الفاخرة" },
  { href: "/trips", label: "الرحلات" },
  { href: "/guide", label: "دليل الغوص" },
  { href: "/weight-calculator", label: "حاسبة الأوزان" },
  { href: "/trends", label: "الصيحات والأمان" },
  { href: "/temperatures", label: "حرارة المياه" },
  { href: "/community", label: "المجتمع" },
  { href: "/quiz", label: "اكتشف نمطك" },
  { href: "/stories", label: "القصص" },
  { href: "/youth", label: "الشباب" },
  { href: "/women", label: "النساء" },
  { href: "/kids", label: "الأطفال" },
  { href: "/communities", label: "المجتمعات" },
  { href: "/members", label: "الأعضاء" },
  { href: "/messages", label: "الرسائل" },
  { href: "/game", label: "لعبة الأطفال" },
  { href: "/logbook", label: "اللوج بوك" },
];

export default function AdminHomeCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setCards(d.settings?.homeCards || [])).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  const upd = (i: number, patch: Partial<Card>) => setCards((a) => a.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const add = () => setCards((a) => [...a, { href: "/marketplace", label: "المتجر", desc: "", icon: "🛒" }]);
  const remove = (i: number) => setCards((a) => a.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => setCards((a) => { const b = [...a]; const j = i + dir; if (j < 0 || j >= b.length) return a; [b[i], b[j]] = [b[j], b[i]]; return b; });

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ homeCards: cards }) });
      const d = await res.json();
      setMsg(d.success ? "تم الحفظ ✅ (قد تأخذ دقيقة لتظهر في الرئيسية)" : d.message || "تعذّر الحفظ");
    } catch { setMsg("تعذّر الاتصال بالخادم"); } finally { setSaving(false); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: "740px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "6px" }}>بطاقات الرئيسية</h1>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "18px" }}>بطاقات تظهر في الصفحة الرئيسية وتوجّه لأي صفحة. (تأكّد أن بلوك «بطاقات الصفحات» مُفعّل في «الصفحة الرئيسية».)</p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {!loaded ? <p style={{ color: "#666" }}>جارٍ التحميل...</p> : (
        <>
          {cards.map((c, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                <div><label style={lbl}>أيقونة</label><input style={inp} value={c.icon} onChange={(e) => upd(i, { icon: e.target.value })} placeholder="🛒" /></div>
                <div><label style={lbl}>العنوان</label><input style={inp} value={c.label} onChange={(e) => upd(i, { label: e.target.value })} /></div>
                <div><label style={lbl}>الصفحة</label>
                  <select style={inp} value={KNOWN.some((k) => k.href === c.href) ? c.href : "__custom"} onChange={(e) => { const v = e.target.value; if (v !== "__custom") { const k = KNOWN.find((x) => x.href === v); upd(i, { href: v, label: c.label || k?.label || "" }); } }}>
                    {KNOWN.map((k) => <option key={k.href} value={k.href}>{k.label}</option>)}
                    <option value="__custom">رابط مخصّص...</option>
                  </select>
                </div>
              </div>
              <label style={lbl}>الرابط (href)</label>
              <input style={{ ...inp, marginBottom: "8px" }} value={c.href} onChange={(e) => upd(i, { href: e.target.value })} placeholder="/marketplace" />
              <label style={lbl}>الوصف</label>
              <input style={inp} value={c.desc} onChange={(e) => upd(i, { desc: e.target.value })} />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button onClick={() => move(i, -1)} style={mini("#64748b")}>▲</button>
                <button onClick={() => move(i, 1)} style={mini("#64748b")}>▼</button>
                <button onClick={() => remove(i)} style={mini("#b91c1c")}>حذف</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px" }}>
            <button onClick={add} style={{ background: "#1e7e34", color: "white", border: "none", padding: "10px 18px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit" }}>+ إضافة بطاقة</button>
            <button onClick={save} disabled={saving} style={{ background: "var(--mid)", color: "white", border: "none", padding: "10px 26px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{saving ? "جارٍ الحفظ..." : "حفظ البطاقات"}</button>
          </div>
        </>
      )}
    </div>
  );
}
const lbl: React.CSSProperties = { display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" };
function mini(bg: string): React.CSSProperties { return { background: bg, color: "white", border: "none", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }; }
