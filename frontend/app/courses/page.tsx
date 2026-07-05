"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { symbolOf } from "@/app/lib/currency";
import { siteImageSrc } from "@/app/lib/image";

const LEVELS: Record<string, string> = {
  try: "جرّب الغوص", open_water: "مبتدئ", advanced: "متقدّم", rescue: "إنقاذ",
  divemaster: "احترافي", specialty: "تخصص", freediving: "غوص حر", kids: "أطفال", scubility: "غوص تكيّفي (ذوي الهمم)",
};

export default function CoursesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wa, setWa] = useState("");
  const [level, setLevel] = useState("");

  // تسجيل دورة
  const [enrollFor, setEnrollFor] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/courses`).then((r) => r.json()).then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false));
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setWa(d.settings?.whatsappNumber || "")).catch(() => {});
  }, []);

  const levels = useMemo(() => Array.from(new Set(items.map((c) => c.level))), [items]);
  const shown = items.filter((c) => !level || c.level === level);

  const openEnroll = (c: any) => { setEnrollFor(c); setForm({ name: "", phone: "" }); setDone(""); setErr(""); };

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) { setErr("الاسم ورقم الجوال مطلوبان."); return; }
    setSending(true); setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", courseTitle: enrollFor.title, courseId: enrollFor._id, centerName: enrollFor.title, peopleCount: 1, contact: { name: form.name.trim(), phone: form.phone.trim(), email: "" }, contactMethod: "whatsapp" }),
      });
      const d = await res.json();
      if (d.success) setDone(d.booking?.ticketCode || "ok");
      else setErr(d.message || "تعذّر التسجيل");
    } catch { setErr("تعذّر الاتصال — تأكد من اتصالك وحاول مجددًا."); }
    setSending(false);
  };

  const waHref = () => {
    const text = `مرحبًا، سجّلت في دورة: ${enrollFor.title}\nالاسم: ${form.name}\nالجوال: ${form.phone}${done && done !== "ok" ? `\nرقم الطلب: ${done}` : ""}`;
    return wa ? `https://wa.me/${wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const inp: React.CSSProperties = { width: "100%", padding: "11px 13px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--text)", fontFamily: "inherit", fontSize: "15px" };

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      <section style={{ background: "linear-gradient(135deg, var(--hero), var(--mid))", color: "white", padding: "64px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px,6vw,44px)", marginBottom: "10px" }}>🎓 دورات الغوص</h1>
        <p style={{ opacity: 0.93, maxWidth: "640px", margin: "0 auto", lineHeight: 1.8, fontSize: "clamp(16px,4vw,19px)" }}>من أول تجربة بدون خبرة إلى الاحتراف — دورات معتمدة دوليًا (PADI و SDI) بأسعار واضحة.</p>
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
                      {(c.exclusive || c.tag) && <span style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "20px" }}>⭐ {c.tag || "حصري"}</span>}
                      {c.duration && <span style={{ color: "var(--muted)", fontSize: "12px", alignSelf: "center" }}>⏱ {c.duration}</span>}
                    </div>
                    <Link href={`/courses/${c._id}`}><h3 style={{ color: "var(--text)", fontSize: "19px", marginBottom: "6px" }}>{c.title}</h3></Link>
                    {c.description && <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "10px" }}>{c.description}</p>}
                    {c.includes?.length > 0 && (
                      <ul style={{ margin: "0 0 12px", paddingInlineStart: "18px", color: "var(--muted)", fontSize: "13px", lineHeight: 1.9 }}>
                        {c.includes.slice(0, 5).map((x: string, i: number) => <li key={i}>{x}</li>)}
                      </ul>
                    )}
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ color: "var(--text)", fontWeight: 800, fontSize: "18px" }}>{c.price > 0 ? `${c.price} ${symbolOf(c.currency)}` : ""}</div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link href={`/courses/${c._id}`} style={{ color: "var(--mid)", border: "1px solid var(--mid)", padding: "9px 16px", borderRadius: "10px", fontWeight: 700, fontSize: "14px" }}>التفاصيل</Link>
                        <button onClick={() => openEnroll(c)} style={{ background: "var(--gold)", color: "white", padding: "9px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer", fontFamily: "inherit" }}>سجّل الآن</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* نموذج التسجيل */}
      {enrollFor && (
        <div onClick={() => setEnrollFor(null)} style={{ position: "fixed", inset: 0, background: "rgba(2,8,20,0.7)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "18px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "26px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            {!done ? (
              <>
                <h2 style={{ color: "var(--text)", fontSize: "20px", fontWeight: 800, marginBottom: "4px" }}>التسجيل في الدورة</h2>
                <p style={{ color: "var(--mid)", fontSize: "14px", fontWeight: 700, marginBottom: "18px" }}>{enrollFor.title}</p>
                <label style={{ display: "block", color: "var(--muted)", fontSize: "13px", fontWeight: 700, marginBottom: "5px" }}>الاسم الكامل *</label>
                <input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <label style={{ display: "block", color: "var(--muted)", fontSize: "13px", fontWeight: 700, margin: "14px 0 5px" }}>رقم الجوال *</label>
                <input style={inp} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="مثال: 9665..." />
                {err && <p style={{ color: "#f87171", fontSize: "13.5px", marginTop: "12px" }}>{err}</p>}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button onClick={() => setEnrollFor(null)} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "12px", borderRadius: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>إلغاء</button>
                  <button onClick={submit} disabled={sending} style={{ flex: 2, background: "var(--gold)", border: "none", color: "#04121f", padding: "12px", borderRadius: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 800, opacity: sending ? 0.7 : 1 }}>{sending ? "جارٍ التسجيل..." : "أكّد التسجيل"}</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>✅</div>
                <h2 style={{ color: "var(--text)", fontSize: "20px", fontWeight: 800, marginBottom: "6px" }}>تم تسجيلك بنجاح</h2>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.8, marginBottom: "18px" }}>سجّلنا طلبك في «{enrollFor.title}»{done !== "ok" && <> · رقم الطلب <b style={{ color: "var(--text)" }}>{done}</b></>}. سنتواصل معك على {form.phone}.</p>
                <a href={waHref()} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#25D366", color: "white", padding: "12px", borderRadius: "11px", fontWeight: 800, marginBottom: "10px" }}>أكمِل عبر واتساب 💬</a>
                <button onClick={() => setEnrollFor(null)} style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "11px", borderRadius: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>تم</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
function chip(active: boolean): React.CSSProperties {
  return { background: active ? "var(--mid)" : "var(--surface)", color: active ? "white" : "var(--text)", border: active ? "2px solid var(--mid)" : "1px solid var(--border)", borderRadius: "22px", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" };
}
