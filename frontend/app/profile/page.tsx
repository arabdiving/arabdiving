"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { DISC, DISC_ORDER } from "@/app/lib/disc";

interface DiveEntry {
  _id: string;
  depth: number;
  duration: number;
  date: string;
  diveSite?: { name?: string; city?: string };
}

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [sizeProfile, setSizeProfile] = useState<any>(null);
  const [entries, setEntries] = useState<DiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE}/api/users/profile`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/logbook/my`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/size-profiles/me`, { headers }).then((r) => r.json()).catch(() => ({})),
    ])
      .then(([profile, logbook, sp]) => {
        if (profile?.user) setUser(profile.user); else setError("تعذّر تحميل الملف الشخصي.");
        setEntries(logbook?.entries || []);
        if (sp?.profile) setSizeProfile(sp.profile);
      })
      .catch(() => setError("تعذّر الاتصال بالخادم."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>جارٍ التحميل...</div>;
  if (error || !user) return <div style={{ padding: "60px", textAlign: "center", color: "#f87171" }}>{error || "تعذّر تحميل الملف الشخصي."}</div>;

  const maxDepth = entries.length > 0 ? Math.max(...entries.map((e) => e.depth)) : 0;
  const totalBottomTime = entries.reduce((sum, e) => sum + e.duration, 0);
  const avatar = siteImageSrc(user.profileImage);

  const stats: { label: string; value: string | number; color: string }[] = [
    { label: "الغوصات المسجلة", value: entries.length, color: "#22d3ee" },
    { label: "أقصى عمق", value: `${maxDepth} م`, color: "#e8a830" },
    { label: "إجمالي زمن القاع", value: `${totalBottomTime} د`, color: "#34d399" },
    { label: "الدور", value: user.role === "admin" ? "مدير" : "عضو", color: "#a855f7" },
  ];

  const chip: React.CSSProperties = { ...glass, color: "rgba(255,255,255,0.85)", fontSize: "13.5px", fontWeight: 600, padding: "6px 14px", borderRadius: "30px" };

  return (
    <div style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      {/* COVER + HEADER */}
      <div style={{ position: "relative", background: "radial-gradient(ellipse at 70% 0%, #17325e 0%, #040d1a 62%)", padding: "50px 20px 40px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={user.name} style={{ width: "116px", height: "116px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.15)" }} />
          ) : (
            <div style={{ width: "116px", height: "116px", borderRadius: "50%", background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", fontWeight: 900 }}>{(user.name || "؟").trim().charAt(0)}</div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ color: "#fff", fontSize: "clamp(24px,5vw,34px)", fontWeight: 900, margin: 0 }}>{user.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: "4px 0 14px", fontSize: "14px" }}>{user.email}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={chip}>📍 {user.city || "غير محدد"}، {user.country || "غير محدد"}</span>
              <span style={chip}>🎓 {user.certificationLevel || "Open Water"}</span>
              <span style={chip}>🌊 {user.divesCount || 0} غوصة</span>
              {user.personality?.dominant && <span style={chip}>🧠 {({ red: "🔴 قائد", yellow: "🟡 مبدع", green: "🟢 مسالم", blue: "🔵 محلّل" } as any)[user.personality.dominant]}</span>}
            </div>
          </div>
          <Link href="/profile/edit" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "11px 22px", borderRadius: "11px", fontWeight: 700, height: "fit-content" }}>✏️ تعديل الملف</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px 60px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "38px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ ...glass, padding: "22px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ color: s.color, fontSize: "30px", fontWeight: 900 }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* DISC */}
        {user.personality?.dominant && DISC[user.personality.dominant as keyof typeof DISC] && (() => {
          const d = DISC[user.personality.dominant as keyof typeof DISC];
          const roleAr = user.personality.role === "teacher" ? "مدرّب" : user.personality.role === "student" ? "متدرّب" : user.personality.role === "both" ? "مدرّب ومتدرّب" : "";
          return (
            <>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>🧠 نتيجتك في اختبار النمط</h2>
              <div style={{ ...glass, borderInlineStart: `5px solid ${d.main}`, borderRadius: "16px", padding: "20px", marginBottom: "38px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <span style={{ fontSize: "34px" }}>{d.emoji}</span>
                  <strong style={{ color: d.main, fontSize: "20px" }}>{d.name}</strong>
                  {roleAr && <span style={{ background: d.light, color: d.main, padding: "3px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: 700 }}>{roleAr}</span>}
                </div>
                <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.9, marginBottom: "12px" }}>{d.desc}</p>
                <div style={{ marginBottom: "8px", color: "rgba(255,255,255,0.7)" }}><strong style={{ color: "#fff" }}>القوة: </strong>{d.strengths.map((x) => <span key={x} style={{ display: "inline-block", background: d.light, color: d.main, borderRadius: "20px", padding: "3px 11px", fontSize: "13px", margin: "2px", fontWeight: 700 }}>{x}</span>)}</div>
                <div style={{ marginBottom: "16px", color: "rgba(255,255,255,0.7)" }}><strong style={{ color: "#fff" }}>التطوير: </strong>{d.weaknesses.map((x) => <span key={x} style={{ display: "inline-block", background: "rgba(248,113,113,0.15)", color: "#fca5a5", borderRadius: "20px", padding: "3px 11px", fontSize: "13px", margin: "2px", fontWeight: 700 }}>{x}</span>)}</div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "14px" }}>
                  <strong style={{ color: "#fff" }}>🧑‍🏫 توصيات تعاملك مع كل نمط:</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px", marginTop: "10px" }}>
                    {DISC_ORDER.map((k) => <div key={k} style={{ background: DISC[k].light, borderRadius: "10px", padding: "10px" }}><div style={{ color: DISC[k].main, fontWeight: 700, marginBottom: "3px" }}>{DISC[k].emoji} {DISC[k].name}</div><p style={{ fontSize: "13px", lineHeight: 1.7, color: "#334155" }}>{DISC[k].teachAdvice}</p></div>)}
                  </div>
                </div>
                <div style={{ marginTop: "10px", fontSize: "14px", color: "#34d399" }}>🤿 كمتدرّب: {d.asStudent}</div>
                <div style={{ marginTop: "10px" }}><Link href="/quiz" style={{ color: "#22d3ee", fontWeight: 700 }}>إعادة الاختبار</Link> · <Link href="/communities" style={{ color: "#22d3ee", fontWeight: 700 }}>مجتمعك اللوني</Link></div>
              </div>
            </>
          );
        })()}

        {/* SIZES */}
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>📏 مقاساتي</h2>
        <div style={{ ...glass, borderRadius: "16px", padding: "20px", marginBottom: "38px" }}>
          {sizeProfile ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                <span style={chip}>👤 {sizeProfile.group === "women" ? "الشابات" : "الشباب"}</span>
                <span style={chip}>📐 الطول: {sizeProfile.sizes?.height || "—"} سم</span>
                <span style={chip}>⚖️ الوزن: {sizeProfile.sizes?.weight || "—"} كجم</span>
                <span style={chip}>👟 الحذاء: {sizeProfile.sizes?.shoe || "—"}</span>
                <span style={chip}>🤿 البدلة: {sizeProfile.sizes?.wetsuit || "—"}</span>
                <span style={chip}>🥽 النظارة: {sizeProfile.sizes?.mask || "—"}</span>
                {sizeProfile.group === "women" && sizeProfile.womenExtras?.hoodie && <span style={chip}>🧥 الهودي: {sizeProfile.womenExtras.hoodie}</span>}
                {sizeProfile.group === "women" && sizeProfile.womenExtras?.swimCover && <span style={chip}>🩱 كاش مايوه: {sizeProfile.womenExtras.swimCover}</span>}
              </div>
              <Link href={`/sizes/${sizeProfile.group === "women" ? "women" : "men"}`} style={{ background: "var(--mid)", color: "#04121f", padding: "9px 18px", borderRadius: "9px", fontSize: "14px", fontWeight: 700 }}>تعديل المقاسات</Link>
            </>
          ) : (
            <div>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>لم تسجّل مقاساتك بعد — سجّلها لنجهّز معداتك مسبقًا.</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link href="/sizes/men" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", padding: "9px 18px", borderRadius: "9px", fontSize: "14px", fontWeight: 700 }}>مقاسات الشباب</Link>
                <Link href="/sizes/women" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", padding: "9px 18px", borderRadius: "9px", fontSize: "14px", fontWeight: 700 }}>مقاسات الشابات</Link>
              </div>
            </div>
          )}
        </div>

        {/* RECENT DIVES */}
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>أحدث الغوصات</h2>
        {entries.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)" }}>لم تسجّل أي غوصات بعد.</p>
        ) : (
          entries.slice(0, 5).map((entry) => (
            <div key={entry._id} style={{ ...glass, borderRadius: "14px", padding: "16px", marginBottom: "14px" }}>
              <h3 style={{ color: "#fff", fontSize: "17px", marginBottom: "6px" }}>{entry.diveSite?.name || "موقع غير معروف"}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>
                <span>📍 {entry.diveSite?.city || "—"}</span>
                <span>🌊 العمق: {entry.depth} م</span>
                <span>⏱ المدة: {entry.duration} د</span>
                <span>📅 {new Date(entry.date).toLocaleDateString("ar-EG")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
