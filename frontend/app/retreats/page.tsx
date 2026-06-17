"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContent } from "@/app/lib/useContent";
import { siteImageSrc } from "@/app/lib/image";

const NAVY = "#0B1D3A";
const GOLD = "#C8A97E";

export default function RetreatsPage() {
  const c = useContent("retreats");
  const hero = c.hero || {};
  const destinations: string[] = c.destinations || [];
  const badges = c.badges || [];
  const packages = c.packages || [];
  const cta = c.cta || {};
  const router = useRouter();

  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");

  const startBooking = () => {
    const q = new URLSearchParams();
    if (dest) q.set("city", dest);
    if (date) q.set("date", date);
    if (guests) q.set("people", guests.replace(/[^0-9]/g, "") || "2");
    router.push(`/family-booking?${q.toString()}`);
  };

  const heroImg = siteImageSrc(hero.image) || hero.image || "";

  return (
    <main style={{ background: "#F8F9FA", color: "#333" }}>
      <style>{`
        .lux-booking { display:flex; gap:14px; flex-wrap:wrap; }
        .lux-field { flex:1 1 150px; display:flex; flex-direction:column; text-align:right; border-inline-start:1px solid #eee; padding-inline-start:15px; }
        .lux-field:first-child { border-inline-start:none; padding-inline-start:0; }
        @media (max-width:640px){ .lux-field{ border-inline-start:none; padding-inline-start:0; } }
        .lux-card{ transition:transform .3s ease, box-shadow .3s ease; }
        .lux-card:hover{ transform:translateY(-10px); box-shadow:0 22px 44px rgba(0,0,0,0.15); }
      `}</style>

      {/* Hero */}
      <section style={{ minHeight: "82vh", background: `linear-gradient(rgba(11,29,58,0.62), rgba(11,29,58,0.72))${heroImg ? `, url('${heroImg}')` : ""}`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "90px 20px 50px" }}>
        {hero.badge && <span style={{ color: GOLD, letterSpacing: "3px", fontSize: "15px", marginBottom: "16px" }}>{hero.badge}</span>}
        <h1 style={{ color: "#fff", fontSize: "clamp(32px, 7vw, 56px)", fontWeight: 800, marginBottom: "14px", maxWidth: "900px", textShadow: "2px 2px 8px rgba(0,0,0,0.4)", lineHeight: 1.3 }}>{hero.title}</h1>
        <p style={{ color: "#f3f3f3", fontSize: "clamp(17px, 4vw, 24px)", fontWeight: 300, marginBottom: "38px" }}>{hero.subtitle}</p>

        {/* Booking bar */}
        <div style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 16px 40px rgba(0,0,0,0.25)", width: "min(920px, 100%)" }}>
          <div className="lux-booking">
            <div className="lux-field">
              <label style={lbl}>📍 الوجهة</label>
              <select value={dest} onChange={(e) => setDest(e.target.value)} style={ctrl}>
                <option value="">اختر ملاذك...</option>
                {destinations.map((d: string) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="lux-field">
              <label style={lbl}>📅 تاريخ الرحلة</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={ctrl} />
            </div>
            <div className="lux-field">
              <label style={lbl}>👥 الضيوف</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)} style={ctrl}>
                <option value="1">1 بالغ</option>
                <option value="2">2 بالغين</option>
                <option value="4">عائلة (مع أطفال)</option>
              </select>
            </div>
            <button onClick={startBooking} style={{ background: NAVY, color: GOLD, border: "none", padding: "0 30px", borderRadius: "6px", fontWeight: 700, fontSize: "16px", cursor: "pointer", fontFamily: "inherit", minHeight: "52px", flex: "1 1 150px" }}>ابدأ المغامرة</button>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(20px, 5vw, 50px)", padding: "34px 20px", background: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
        {badges.map((b: any, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: NAVY, fontWeight: 700, fontSize: "16px" }}>
            <span style={{ fontSize: "24px" }}>{b.emoji}</span> {b.label}
          </div>
        ))}
      </section>

      {/* Packages */}
      <section style={{ padding: "clamp(50px, 8vw, 80px) 20px", textAlign: "center" }}>
        <h2 style={{ color: NAVY, fontSize: "clamp(26px, 5vw, 40px)", marginBottom: "10px" }}>{c.sectionTitle}</h2>
        <p style={{ color: "#666", fontSize: "clamp(15px, 3vw, 19px)", marginBottom: "48px" }}>{c.sectionSubtitle}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 350px))", gap: "30px", justifyContent: "center" }}>
          {packages.map((p: any, i: number) => {
            const img = siteImageSrc(p.image) || p.image || "";
            return (
              <div key={i} className="lux-card" style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", textAlign: "right", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "240px", backgroundImage: img ? `url('${img}')` : "linear-gradient(135deg,#0B1D3A,#2e75b6)", backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ color: NAVY, fontSize: "1.4rem", marginBottom: "10px" }}>{p.title}</h3>
                  <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "20px", flex: 1 }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                    <span style={{ color: NAVY, fontWeight: 800, fontSize: "1.15rem" }}>{p.price}</span>
                    <Link href={p.href || "/family-booking"} style={{ color: GOLD, fontWeight: 700 }}>استكشف الملاذ ←</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Custom CTA */}
      {cta.title && (
        <section style={{ background: NAVY, color: "#fff", textAlign: "center", padding: "clamp(50px, 8vw, 80px) 20px" }}>
          <h2 style={{ fontSize: "clamp(24px, 5vw, 34px)", marginBottom: "14px", color: "#fff" }}>{cta.title}</h2>
          <p style={{ opacity: 0.9, maxWidth: "620px", margin: "0 auto 30px", lineHeight: 1.9, fontSize: "clamp(15px, 3vw, 18px)" }}>{cta.text}</p>
          <Link href={cta.href || "/family-booking"} style={{ background: GOLD, color: NAVY, padding: "15px 36px", borderRadius: "6px", fontWeight: 800, fontSize: "17px", display: "inline-block" }}>{cta.label}</Link>
        </section>
      )}
    </main>
  );
}

const lbl: React.CSSProperties = { fontSize: "12px", color: "#777", fontWeight: 700, marginBottom: "5px" };
const ctrl: React.CSSProperties = { border: "none", outline: "none", fontFamily: "inherit", fontSize: "16px", color: "#0B1D3A", background: "transparent", padding: "4px 0" };
