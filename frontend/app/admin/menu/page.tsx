"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

interface Item { href: string; label: string; }
interface Group { label: string; items: Item[]; }

const KNOWN: Item[] = [
  { href: "/", label: "الرئيسية" }, { href: "/dive-sites", label: "مواقع الغوص" }, { href: "/marketplace", label: "المتجر" },
  { href: "/family-booking", label: "احجز رحلة" }, { href: "/retreats", label: "باقات خاصة" }, { href: "/trips", label: "الرحلات" },
  { href: "/guide", label: "الدليل" }, { href: "/weight-calculator", label: "حاسبة الأوزان" }, { href: "/trends", label: "الصيحات والأمان" },
  { href: "/temperatures", label: "حرارة المياه" }, { href: "/community", label: "المجتمع" }, { href: "/quiz", label: "اكتشف نمطك" },
  { href: "/stories", label: "القصص" }, { href: "/youth", label: "الشباب" }, { href: "/women", label: "النساء" }, { href: "/kids", label: "الأطفال" },
  { href: "/members", label: "الأعضاء" }, { href: "/communities", label: "المجتمعات" }, { href: "/messages", label: "الرسائل" },
  { href: "/my-store", label: "متجري" }, { href: "/logbook", label: "اللوج بوك" },
];

export default function AdminMenu() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setGroups(d.settings?.navGroups || [])).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  const addGroup = () => setGroups((g) => [...g, { label: "قائمة جديدة", items: [] }]);
  const updGroup = (i: number, patch: Partial<Group>) => setGroups((g) => g.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const removeGroup = (i: number) => setGroups((g) => g.filter((_, j) => j !== i));
  const moveGroup = (i: number, d: -1 | 1) => setGroups((g) => { const b = [...g]; const j = i + d; if (j < 0 || j >= b.length) return g; [b[i], b[j]] = [b[j], b[i]]; return b; });
  const addItem = (gi: number, href: string) => { const k = KNOWN.find((x) => x.href === href); updGroup(gi, { items: [...groups[gi].items, { href, label: k?.label || href }] }); };
  const removeItem = (gi: number, ii: number) => updGroup(gi, { items: groups[gi].items.filter((_, j) => j !== ii) });

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ navGroups: groups }) });
      const d = await res.json();
      setMsg(d.success ? "تم الحفظ ✅" : d.message || "تعذّر الحفظ");
    } catch { setMsg("تعذّر الاتصال"); } finally { setSaving(false); }
  };

  const inp: React.CSSProperties = { padding: "8px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px" };

  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "6px" }}>تنظيم القائمة</h1>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px", lineHeight: 1.7 }}>
        أنشئ «قوائم» — كل قائمة بها زر رئيسي وبداخلها روابط (تصبح قائمة منسدلة). القائمة ذات الرابط الواحد تظهر كزر عادي.
        <br />اتركها فارغة لاستخدام القائمة الافتراضية (كل الصفحات أزرار).
      </p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {!loaded ? <p style={{ color: "#666" }}>جارٍ التحميل...</p> : (
        <>
          {groups.map((g, gi) => (
            <div key={gi} style={{ background: "white", borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                <input value={g.label} onChange={(e) => updGroup(gi, { label: e.target.value })} placeholder="اسم القائمة/الزر" style={{ ...inp, flex: "1 1 160px", fontWeight: 700 }} />
                <button onClick={() => moveGroup(gi, -1)} style={mini("#64748b")}>▲</button>
                <button onClick={() => moveGroup(gi, 1)} style={mini("#64748b")}>▼</button>
                <button onClick={() => removeGroup(gi)} style={mini("#b91c1c")}>حذف القائمة</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {g.items.map((it, ii) => (
                  <span key={ii} style={{ background: "#eef4fa", color: "#0d6cb0", borderRadius: "8px", padding: "5px 10px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                    {it.label}<button onClick={() => removeItem(gi, ii)} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", fontWeight: 700 }}>✕</button>
                  </span>
                ))}
                {g.items.length === 0 && <span style={{ color: "#94a3b8", fontSize: "13px" }}>لا عناصر بعد</span>}
              </div>
              <select value="" onChange={(e) => { if (e.target.value) addItem(gi, e.target.value); }} style={inp}>
                <option value="">＋ أضف صفحة لهذه القائمة...</option>
                {KNOWN.map((k) => <option key={k.href} value={k.href}>{k.label}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button onClick={addGroup} style={{ background: "#1e7e34", color: "white", border: "none", padding: "10px 18px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit" }}>+ قائمة جديدة</button>
            <button onClick={save} disabled={saving} style={{ background: "var(--mid)", color: "white", border: "none", padding: "10px 26px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{saving ? "جارٍ الحفظ..." : "حفظ القائمة"}</button>
            {groups.length > 0 && <button onClick={() => setGroups([])} style={{ background: "#eef2f6", color: "#444", border: "none", padding: "10px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit" }}>استعادة الافتراضي</button>}
          </div>
        </>
      )}
    </div>
  );
}
function mini(bg: string): React.CSSProperties { return { background: bg, color: "white", border: "none", padding: "7px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }; }
