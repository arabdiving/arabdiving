"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { CITY_COORDS, FIT_DISPLAY, distanceKm } from "@/app/lib/instructorFit";

/* دليل المدربين — بطاقات زجاجية بنقاط التميّز والخبرة، مع فلاتر المدينة والمنظمة والتخصص. */

const AXES: Record<string, { label: string; icon: string }> = {
  planning:        { label: "التخطيط والبريفينج",          icon: "🎯" },
  strategies:      { label: "استراتيجيات الشرح",           icon: "📚" },
  management:      { label: "إدارة المجموعة",              icon: "🛡️" },
  engagement:      { label: "التحفيز واحتواء الخوف",       icon: "❤️" },
  watermanship:    { label: "الإتقان المائي",              icon: "🌊" },
  professionalism: { label: "الاحترافية والتطوير",         icon: "📈" },
};

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

export default function InstructorsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [agency, setAgency] = useState("");
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoMsg, setGeoMsg] = useState("");

  // «الأقرب إليّ» — تحديد موقع المتدرب وترتيب المدربين بالمسافة
  const locateMe = () => {
    if (!("geolocation" in navigator)) { setGeoMsg("متصفحك لا يدعم تحديد الموقع"); return; }
    setGeoMsg("📡 نحدد موقعك...");
    navigator.geolocation.getCurrentPosition(
      (p) => { setMyPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setGeoMsg(""); setCity(""); },
      () => setGeoMsg("لم نستطع تحديد موقعك — اختر مدينة من الخريطة"),
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/instructors`)
      .then((r) => r.json())
      .then((d) => setList(d.instructors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => Array.from(new Set(list.map((i) => i.city).filter(Boolean))), [list]);
  const agencies = useMemo(() => Array.from(new Set(list.map((i) => i.agency).filter(Boolean))), [list]);

  // المسافة من موقع المتدرب لموقع تدريب المدرب
  const distOf = (ins: any): number | null => {
    if (!myPos) return null;
    const loc = ins.location || CITY_COORDS[ins.city];
    return loc ? distanceKm(myPos, loc) : null;
  };

  const shown = useMemo(() => {
    const f = list.filter((i) => (!city || i.city === city) && (!agency || i.agency === agency));
    if (!myPos) return f;
    return [...f].sort((a, b) => (distOf(a) ?? 1e9) - (distOf(b) ?? 1e9));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, city, agency, myPos]);

  // عدّاد المدربين لكل مدينة (لنقاط الخريطة)
  const cityCounts = useMemo(() => {
    const m: Record<string, number> = {};
    list.forEach((i) => { if (i.city) m[i.city] = (m[i.city] || 0) + 1; });
    return m;
  }, [list]);

  // مواقع المدن على الخريطة — مضبوطة يدويًا: مصر على الساحل الغربي (يسار/وسط)،
  // والسعودية على الساحل الشرقي للبحر الأحمر (يمين). الخليج العربي أسفل اليمين.
  const MAP_POS: Record<string, { x: number; y: number }> = {
    // 🇪🇬 مصر — سيناء (أعلى وسط) وساحل البر الرئيسي (نازل جنوبًا)
    "نويبع":     { x: 52, y: 10 },
    "دهب":       { x: 47, y: 22 },
    "شرم الشيخ": { x: 40, y: 34 },
    "الجونة":    { x: 20, y: 40 },
    "الغردقة":   { x: 24, y: 50 },
    "سفاجا":     { x: 29, y: 60 },
    "مرسى علم":  { x: 38, y: 80 },
    // 🇸🇦 السعودية — ساحل البحر الأحمر الشرقي (من الشمال للجنوب)
    "نيوم":      { x: 62, y: 12 },
    "ضبا":       { x: 68, y: 20 },
    "الوجه":     { x: 73, y: 32 },
    "أملج":      { x: 72, y: 44 },
    "ينبع":      { x: 70, y: 55 },
    "جدة":       { x: 66, y: 72 },
    "الليث":     { x: 70, y: 84 },
    "جزر فرسان": { x: 60, y: 93 },
    // 🇸🇦 الخليج العربي (أسفل اليمين)
    "الخبر":     { x: 92, y: 84 },
    "الجبيل":    { x: 94, y: 76 },
  };
  const project = (name: string, c: { lat: number; lng: number }) =>
    MAP_POS[name] || { x: ((c.lng - 33) / 2.5) * 100, y: ((29.5 - c.lat) / 5) * 100 };

  const chip = (active: boolean): React.CSSProperties => ({
    background: active ? "#0891b2" : "rgba(255,255,255,0.07)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "7px 15px",
    fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 700 : 400,
  });

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "56px 20px 42px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ ...glass, display: "inline-block", color: "#22d3ee", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "14px" }}>🧑‍🏫 دليل المدربين</span>
          <h1 style={{ fontSize: "clamp(28px,6vw,44px)", fontWeight: 900, marginBottom: "10px", letterSpacing: "-1px" }}>اعرف مدربك قبل أول غطسة</h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(14px,3vw,17px)", maxWidth: "640px", margin: "0 auto 22px", lineHeight: 1.9 }}>
            كل مدرب هنا له «بصمة تدريبية» تُظهر نقاط تميّزه — مبنية على مقاييس تقييم علمية، لا كلام دعائي.
          </p>
          <Link href="/instructors/join" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", padding: "12px 28px", borderRadius: "12px", fontWeight: 800, boxShadow: "0 4px 16px rgba(201,149,42,0.5)" }}>
            أنا مدرب — أنشئ بروفايلي 🧬
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 18px 70px" }}>

        {/* 🗺️ خريطة مواقع التدريب + الأقرب إليّ */}
        <div style={{ ...glass, borderRadius: "18px", padding: "20px", marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
            <h2 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: 0 }}>🗺️ أين يدرّبون؟ اختر مدينة — أو حدد موقعك</h2>
            <button onClick={locateMe}
              style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "white", border: "none", borderRadius: "11px", padding: "10px 20px", fontWeight: 800, fontSize: "13.5px", cursor: "pointer", fontFamily: "inherit" }}>
              📍 الأقرب إليّ
            </button>
          </div>
          {geoMsg && <p style={{ color: "#fbbf24", fontSize: "12.5px", marginBottom: "10px" }}>{geoMsg}</p>}
          {myPos && <p style={{ color: "#34d399", fontSize: "12.5px", marginBottom: "10px" }}>✅ تم تحديد موقعك — المدربون مرتبون من الأقرب للأبعد</p>}

          <div style={{ position: "relative", height: "260px", borderRadius: "14px", overflow: "hidden", background: "radial-gradient(ellipse at 60% 40%, #0a2a4a 0%, #040d1a 75%)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {/* شبكة ملاحية */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px", opacity: 0.05 }} />
            <span style={{ position: "absolute", top: "8px", insetInlineStart: "12px", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>البحر الأحمر — مصر 🇪🇬 والسعودية 🇸🇦</span>
            {Object.entries(CITY_COORDS).map(([name, c]) => {
              const p = project(name, c);
              const count = cityCounts[name] || 0;
              const active = city === name;
              return (
                <button key={name} onClick={() => { setCity(active ? "" : name); setMyPos(null); }}
                  title={`${name} — ${count} مدرب`}
                  style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", zIndex: 5 }}>
                  <span style={{ display: "block", width: active ? "18px" : "13px", height: active ? "18px" : "13px", borderRadius: "50%", margin: "0 auto",
                    background: count > 0 ? "#22d3ee" : "rgba(255,255,255,0.25)",
                    boxShadow: count > 0 ? "0 0 14px rgba(34,211,238,0.8)" : "none",
                    border: active ? "3px solid #fbbf24" : "none",
                    animation: count > 0 ? "pulseGlow 2s ease-in-out infinite" : "none" }} />
                  <span style={{ display: "block", color: active ? "#fbbf24" : "rgba(255,255,255,0.75)", fontSize: "11px", fontWeight: active ? 800 : 600, marginTop: "4px", whiteSpace: "nowrap", textShadow: "0 0 8px rgba(0,0,0,0.9)" }}>
                    {name}{count > 0 ? ` (${count})` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* فلاتر */}
        {(cities.length > 0 || agencies.length > 0) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "22px" }}>
            <button onClick={() => setCity("")} style={chip(city === "")}>كل المدن</button>
            {cities.map((c) => <button key={c} onClick={() => setCity(c)} style={chip(city === c)}>📍 {c}</button>)}
            <span style={{ width: "1px", background: "rgba(255,255,255,0.15)", margin: "0 4px" }} />
            <button onClick={() => setAgency("")} style={chip(agency === "")}>كل المنظمات</button>
            {agencies.map((a) => <button key={a} onClick={() => setAgency(a)} style={chip(agency === a)}>{a}</button>)}
          </div>
        )}

        {loading ? <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px" }}>جارٍ التحميل...</p>
          : shown.length === 0 ? (
            <div style={{ ...glass, textAlign: "center", padding: "50px", borderRadius: "18px" }}>
              <p style={{ fontSize: "44px", margin: "0 0 10px" }}>🧑‍🏫</p>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>لا مدربون بعد بهذه الفلاتر — <Link href="/instructors/join" style={{ color: "#22d3ee" }}>كن أول مدرب ينضم</Link>.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "18px" }}>
              {shown.map((ins) => {
                const img = siteImageSrc(ins.user?.profileImage);
                const d = distOf(ins);
                // سطر «يناسبه» المختصر: المستوى + العمر من استبيان الملاءمة
                const fitBits = ins.fit
                  ? [FIT_DISPLAY.level[ins.fit.level]?.suits, FIT_DISPLAY.age[ins.fit.age]?.suits].filter(Boolean)
                  : [];
                return (
                  <Link key={ins._id} href={`/instructors/${ins.slug || ins._id}`}
                    style={{ ...glass, borderRadius: "18px", padding: "20px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "12px", transition: "transform .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" style={{ width: "54px", height: "54px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(34,211,238,0.4)" }} />
                      ) : (
                        <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg,#0891b2,#c9952a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🧑‍🏫</div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: "15.5px", display: "flex", alignItems: "center", gap: "5px" }}>
                          {ins.user?.name || "مدرب"} {ins.verified && <span title="موثق">✅</span>}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px" }}>
                          {ins.agency} · {ins.rank}{ins.yearsExp ? ` · خبرة ${ins.yearsExp}+ سنة` : ""}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
                          📍 {ins.city}{d !== null && <span style={{ color: "#34d399", fontWeight: 700 }}> · على بُعد ~{d} كم</span>}
                        </div>
                      </div>
                    </div>

                    {/* من يناسبه؟ — من استبيان الملاءمة الصادق */}
                    {fitBits.length > 0 && (
                      <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "9px", padding: "6px 11px", color: "#6ee7b7", fontSize: "12px", fontWeight: 600 }}>
                        🤝 يناسب: {fitBits.join(" · ")}
                      </div>
                    )}

                    {/* نقاط التميّز */}
                    {ins.strengths?.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {ins.strengths.map((s: string) => AXES[s] && (
                          <span key={s} style={{ background: "rgba(201,149,42,0.18)", border: "1px solid rgba(201,149,42,0.35)", color: "#fbbf24", borderRadius: "20px", padding: "4px 11px", fontSize: "11.5px", fontWeight: 700 }}>
                            ⭐ {AXES[s].icon} {AXES[s].label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* التخصصات */}
                    {ins.specialties?.length > 0 && (
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {ins.specialties.slice(0, 4).map((s: string) => (
                          <span key={s} style={{ background: "rgba(6,182,212,0.14)", color: "#22d3ee", borderRadius: "7px", padding: "3px 9px", fontSize: "11.5px" }}>{s}</span>
                        ))}
                        {ins.specialties.length > 4 && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11.5px" }}>+{ins.specialties.length - 4}</span>}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}
