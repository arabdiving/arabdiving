"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";

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

  useEffect(() => {
    fetch(`${API_BASE}/api/instructors`)
      .then((r) => r.json())
      .then((d) => setList(d.instructors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => Array.from(new Set(list.map((i) => i.city).filter(Boolean))), [list]);
  const agencies = useMemo(() => Array.from(new Set(list.map((i) => i.agency).filter(Boolean))), [list]);
  const shown = list.filter((i) => (!city || i.city === city) && (!agency || i.agency === agency));

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
                return (
                  <Link key={ins._id} href={`/instructors/${ins._id}`}
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
                        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>📍 {ins.city}</div>
                      </div>
                    </div>

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
