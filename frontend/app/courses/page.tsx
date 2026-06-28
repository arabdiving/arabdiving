"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { symbolOf } from "@/app/lib/currency";
import { siteImageSrc } from "@/app/lib/image";

const LEVELS: Record<string, string> = {
  try: "جرّب الغوص", open_water: "مبتدئ", advanced: "متقدّم", rescue: "إنقاذ",
  divemaster: "احترافي", specialty: "تخصص", freediving: "غوص حر", kids: "أطفال",
};

export default function CoursesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wa, setWa] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/courses`).then((r) => r.json()).then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false));
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setWa(d.settings?.whatsappNumber || "")).catch(() => {});
  }, []);

  const levels = useMemo(() => Array.from(new Set(items.map((c) => c.level))), [items]);
  const shown = items.filter((c) => !level || c.level === level);
  const enroll = (c: any) => {
    const text = `مرحبًا، أرغب في التسجيل بدورة: ${c.title} (${c.price} ${symbolOf(c.currency)})`;
    return wa ? `https://wa.me/${wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      <section style={{ background: "linear-gradient(135deg, var(--hero), var(--mid))", color: "white", padding: "64px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px,6vw,44px)", marginBottom: "10px" }}>🎓 دورات الغوص</h1>
        <p style={{ opacity: 0.93, maxWidth: "640px", margin: "0 auto", lineHeight: 1.8, fontSize: "clamp(16px,4vw,19px)" }}>من أول تجربة بدون خبرة إلى الاحتراف — دورات معتمدة دوليًا بأسعار واضحة.</p>
        <Link href="/try-diving" style={{ display: "inline-block", marginTop: "20px", background: "var(--gold)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: 700 }}>جديد على الغوص؟ ابدأ من «جرّب الغوص» ←</Link>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 18px 70px" }}>
        {levels.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            <button onClick={() => setLevel("")} style={chip(level === "")}>الكل</button>
            {levels.map((l) => <button key={l} onClick={() => setLevel(l)} style={chip(level === l)}>{LEVELS[l] || l}</button>)}
          </div>
        )}

        {loading ? <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>جارٍ التحميل...</p>
          : shown.length === 0 ? <div style={{ textAlign: "center", color: "var(--muted)", padding: "50px", background: "var(--surface)", borderRadius: "16px" }}><p style={{ fontSize: "44px" }}>🎓</p><p>لا توجد دورات بعد.</p></div>
          : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "22px" }}>
            {shown.map((c) => {
              const img = siteImageSrc(c.images?.[0] || c.image);
              return (
                <div key={c._id} style={{ background: "var(--surface)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", border: "1px solid var(--border)" }}>
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={c.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ background: "var(--navy)", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{c.agency}</span>
                      <span style={{ background: "rgba(46,117,182,0.12)", color: "var(--mid)", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{LEVELS[c.level] || c.level}</span>
                      {c.duration && <span style={{ color: "var(--muted)", fontSize: "12px", alignSelf: "center" }}>⏱ {c.duration}</span>}
                    </div>
                    <h3 style={{ color: "var(--text)", fontSize: "19px", marginBottom: "6px" }}>{c.title}</h3>
                    {c.description && <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "10px" }}>{c.description}</p>}
                    {c.includes?.length > 0 && (
                      <ul style={{ margin: "0 0 12px", paddingInlineStart: "18px", color: "var(--muted)", fontSize: "13px", lineHeight: 1.9 }}>
                        {c.includes.slice(0, 5).map((x: string, i: number) => <li key={i}>{x}</li>)}
                      </ul>
                    )}
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ color: "var(--text)", fontWeight: 800, fontSize: "18px" }}>{c.price} {symbolOf(c.currency)}</div>
                      <a href={enroll(c)} target="_blank" rel="noopener noreferrer" style={{ background: "var(--gold)", color: "white", padding: "9px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "14px" }}>سجّل الآن</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
function chip(active: boolean): React.CSSProperties {
  return { background: active ? "var(--mid)" : "var(--surface)", color: active ? "white" : "var(--text)", border: active ? "2px solid var(--mid)" : "1px solid var(--border)", borderRadius: "22px", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" };
}
