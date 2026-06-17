"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

const WET = ["XS", "S", "M", "L", "XL", "XXL"];
const MASK = ["S", "M", "L"];

export default function SizesPage({ params }: { params: Promise<{ group: string }> }) {
  const { group: raw } = use(params);
  const group = raw === "women" ? "women" : "men";
  const isWomen = group === "women";
  const groupLabel = isWomen ? "الشابات" : "الشباب";

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [f, setF] = useState({
    height: "", weight: "", shoe: "", wetsuit: "", mask: "",
    hoodie: "", swimCover: "", notes: "",
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { setAuthed(false); setLoading(false); return; }
    setAuthed(true);
    fetch(`${API_BASE}/api/size-profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const p = d.profile;
        if (p) setF((prev) => ({
          ...prev,
          height: p.sizes?.height ?? "", weight: p.sizes?.weight ?? "", shoe: p.sizes?.shoe ?? "",
          wetsuit: p.sizes?.wetsuit ?? "", mask: p.sizes?.mask ?? "",
          hoodie: p.womenExtras?.hoodie ?? "", swimCover: p.womenExtras?.swimCover ?? "",
          notes: p.notes ?? "",
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/size-profiles/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          group,
          sizes: {
            height: f.height ? Number(f.height) : undefined,
            weight: f.weight ? Number(f.weight) : undefined,
            shoe: f.shoe ? Number(f.shoe) : undefined,
            wetsuit: f.wetsuit, mask: f.mask,
          },
          womenExtras: isWomen ? { hoodie: f.hoodie, swimCover: f.swimCover } : {},
          notes: f.notes,
        }),
      });
      const d = await res.json();
      setMsg(d.success ? "تم حفظ مقاساتك ✅ يمكنك تعديلها لاحقًا من ملفك الشخصي." : d.message || "تعذّر الحفظ");
    } catch { setMsg("تعذّر الاتصال بالخادم"); } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ التحميل...</div>;

  if (!authed) {
    return (
      <main style={{ maxWidth: "560px", margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontSize: "52px" }}>📏</div>
        <h1 style={{ color: "var(--navy)", marginBottom: "10px" }}>سجّل مقاساتك</h1>
        <p style={{ color: "#666", marginBottom: "22px", lineHeight: 1.8 }}>لتسجيل مقاساتك وربطها بحسابك (وتعديلها لاحقًا من ملفك الشخصي)، سجّل الدخول أولًا.</p>
        <Link href="/login" style={{ background: "var(--gold)", color: "white", padding: "13px 30px", borderRadius: "10px", fontWeight: 700 }}>تسجيل الدخول</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "clamp(20px, 5vw, 44px) 18px" }}>
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
        <div style={{ fontSize: "46px" }}>📏🤿</div>
        <h1 style={{ color: "var(--navy)", fontSize: "clamp(24px, 5vw, 34px)" }}>مقاسات معدات {groupLabel}</h1>
        <p style={{ color: "#666", lineHeight: 1.8 }}>سجّل مقاساتك لنجهّز معداتك مسبقًا قبل وصولك — تُحفظ في حسابك وتقدر تعدّلها وقت ما تشاء.</p>
      </div>

      {msg && <p style={{ textAlign: "center", color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "16px" }}>{msg}</p>}

      <div style={{ background: "white", borderRadius: "16px", padding: "clamp(18px, 4vw, 28px)", boxShadow: "0 10px 30px rgba(0,0,0,0.07)" }}>
        <div style={grid}>
          <Field label="الطول (سم)"><input type="number" inputMode="numeric" value={f.height} onChange={(e) => set("height", e.target.value)} style={inp} /></Field>
          <Field label="الوزن (كجم)"><input type="number" inputMode="numeric" value={f.weight} onChange={(e) => set("weight", e.target.value)} style={inp} /></Field>
          <Field label="مقاس الحذاء (للزعانف)"><input type="number" inputMode="numeric" value={f.shoe} onChange={(e) => set("shoe", e.target.value)} style={inp} /></Field>
          <Field label="مقاس بدلة الغوص">
            <select value={f.wetsuit} onChange={(e) => set("wetsuit", e.target.value)} style={inp}><option value="">اختر...</option>{WET.map((x) => <option key={x} value={x}>{x}</option>)}</select>
          </Field>
          <Field label="مقاس النظارة">
            <select value={f.mask} onChange={(e) => set("mask", e.target.value)} style={inp}><option value="">اختر...</option>{MASK.map((x) => <option key={x} value={x}>{x}</option>)}</select>
          </Field>
        </div>

        {isWomen && (
          <>
            <div style={{ margin: "10px 0 14px", color: "var(--navy)", fontWeight: 700, borderTop: "1px solid #eef2f6", paddingTop: "16px" }}>🧕 خيارات إضافية للخصوصية</div>
            <div style={grid}>
              <Field label="مقاس الهودي">
                <select value={f.hoodie} onChange={(e) => set("hoodie", e.target.value)} style={inp}><option value="">اختر...</option>{WET.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </Field>
              <Field label="كاش مايوه (غطاء للبدلة)">
                <select value={f.swimCover} onChange={(e) => set("swimCover", e.target.value)} style={inp}>
                  <option value="">غير مطلوب</option>
                  {WET.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}

        <Field label="ملاحظات (اختياري)"><textarea rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} style={{ ...inp, resize: "vertical" }} placeholder="أي تفضيلات أو ملاحظات للمركز..." /></Field>

        <button onClick={save} disabled={saving} style={{ background: "var(--gold)", color: "white", border: "none", padding: "13px 30px", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "16px", marginTop: "8px", width: "100%" }}>
          {saving ? "جارٍ الحفظ..." : "حفظ المقاسات"}
        </button>
        <p style={{ textAlign: "center", marginTop: "12px" }}><Link href="/profile" style={{ color: "var(--mid)", fontSize: "14px" }}>عرض/تعديل من ملفي الشخصي ←</Link></p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: "14px" }}><label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "5px" }}>{label}</label>{children}</div>;
}
const inp: React.CSSProperties = { width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "15px", color: "#06324f", boxSizing: "border-box" };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" };
