"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";
import ShareButtons from "../components/ShareButtons";

export default function GuidePage() {
  const c = useContent("guide");
  const hero = c.hero || {};
  const seasons = c.seasons || [];
  const traveler = c.traveler || [];
  const safety = c.safety || [];
  const gear = c.gear || [];
  const marine = c.marine || [];
  const regions = c.regions || [];
  const hotels = c.hotels || [];
  const cta = c.cta || {};

  return (
    <main style={{ background: "var(--background)" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #08233e 0%, #0d2c54 45%, #2e75b6 100%)", color: "white", padding: "90px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "10px 22px", borderRadius: "30px", marginBottom: "22px", fontSize: "16px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "50px", lineHeight: 1.3, marginBottom: "20px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "20px", opacity: 0.92, lineHeight: 1.9, maxWidth: "720px", marginInline: "auto" }}>{hero.subtitle}</p>
      </section>

      {/* Seasons */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "34px", color: "var(--navy)", marginBottom: "10px" }}>{c.seasonsTitle}</h2>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "36px", lineHeight: 1.9 }}>{c.seasonsNote}</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
              <thead>
                <tr style={{ background: "var(--navy)", color: "white" }}>
                  <th style={th}>الموسم</th>
                  <th style={th}>حرارة المياه</th>
                  <th style={th}>الرؤية</th>
                  <th style={th}>أبرز ما يميّزه</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s: any, i: number) => (
                  <tr key={i} style={{ borderTop: "1px solid #eef2f7" }}>
                    <td style={{ ...td, fontWeight: 700, color: "var(--navy)" }}>{s.period}</td>
                    <td style={td}>{s.temp}</td>
                    <td style={td}>{s.visibility}</td>
                    <td style={td}>{s.highlights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Traveler info */}
      <section style={{ padding: "70px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "34px", color: "var(--navy)", marginBottom: "44px" }}>{c.travelerTitle}</h2>
        <div style={grid(260)}>
          {traveler.map((t: any, i: number) => (
            <div key={i} style={card}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>{t.icon}</div>
              <h3 style={cardTitle}>{t.title}</h3>
              <p style={cardText}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section style={{ padding: "70px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "34px", color: "var(--navy)", marginBottom: "44px" }}>{c.safetyTitle}</h2>
        <div style={grid(280)}>
          {safety.map((s: any, i: number) => (
            <div key={i} style={{ ...card, background: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", borderTop: "4px solid var(--mid)" }}>
              <div style={{ fontSize: "38px", marginBottom: "12px" }}>{s.icon}</div>
              <h3 style={cardTitle}>{s.title}</h3>
              <p style={cardText}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Network map */}
      <section style={{ padding: "70px 20px", background: "white" }}>
        <div style={{ maxWidth: "1150px", margin: "auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "34px", color: "var(--navy)", marginBottom: "10px" }}>{c.networkTitle}</h2>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "40px", maxWidth: "680px", marginInline: "auto", lineHeight: 1.9 }}>{c.networkNote}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", alignItems: "start" }}>
            <RedSeaMap />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {regions.map((r: any, i: number) => (
                <div key={i} style={{ background: "var(--background)", borderRadius: "14px", padding: "18px 20px", borderRight: "4px solid var(--mid)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <strong style={{ color: "var(--navy)", fontSize: "18px" }}>📍 {r.name}</strong>
                    <span style={{ color: "var(--mid)", fontSize: "14px" }}>{r.area}</span>
                  </div>
                  <p style={{ color: "#555", margin: "8px 0 4px", lineHeight: 1.8 }}>🤿 {r.sites}</p>
                  <p style={{ color: "#777", fontSize: "14px", lineHeight: 1.8 }}>{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hotels / services */}
      <section style={{ padding: "70px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "34px", color: "var(--navy)", marginBottom: "44px" }}>{c.hotelsTitle}</h2>
        <div style={grid(280)}>
          {hotels.map((h: any, i: number) => (
            <div key={i} style={{ ...card, background: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
              <h3 style={cardTitle}>🏨 {h.name}</h3>
              <span style={{ display: "inline-block", background: "rgba(46,117,182,0.12)", color: "var(--mid)", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", margin: "6px 0 10px" }}>{h.area}</span>
              <p style={cardText}>{h.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gear + Marine */}
      <section style={{ padding: "70px 20px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
          <div>
            <h2 style={{ fontSize: "30px", color: "var(--navy)", marginBottom: "22px" }}>{c.gearTitle}</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {gear.map((g: string, i: number) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #eef2f7", color: "#444", lineHeight: 1.7 }}>
                  <span style={{ color: "var(--mid)" }}>✔</span> {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={{ fontSize: "30px", color: "var(--navy)", marginBottom: "22px" }}>{c.marineTitle}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {marine.map((m: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", background: "var(--background)", borderRadius: "12px", padding: "12px 16px" }}>
                  <div style={{ fontSize: "30px" }}>{m.icon}</div>
                  <div>
                    <strong style={{ color: "var(--navy)" }}>{m.name}</strong>
                    <p style={{ color: "#777", fontSize: "14px" }}>{m.where}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--navy)", color: "white", padding: "70px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.9, fontSize: "18px", maxWidth: "640px", marginInline: "auto", marginBottom: "30px", lineHeight: 1.9 }}>{cta.text}</p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}><ShareButtons title="دليل الغوص في مصر" /></div>
        <Link href={cta.href || "/dive-sites"} style={{ background: "#c9952a", color: "white", padding: "15px 34px", borderRadius: "10px", fontSize: "17px" }}>{cta.label}</Link>
      </section>
    </main>
  );
}

const th: React.CSSProperties = { padding: "14px", textAlign: "right", fontSize: "15px" };
const td: React.CSSProperties = { padding: "14px", textAlign: "right", color: "#555", fontSize: "15px", lineHeight: 1.7 };
const card: React.CSSProperties = { background: "var(--background)", borderRadius: "16px", padding: "28px 24px", textAlign: "center" };
const cardTitle: React.CSSProperties = { color: "var(--navy)", fontSize: "20px", marginBottom: "8px" };
const cardText: React.CSSProperties = { color: "#555", lineHeight: 1.8 };
function grid(min: number): React.CSSProperties {
  return { maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: "22px" };
}

/* Stylized Red Sea coast map (illustrative, no external deps) */
function RedSeaMap() {
  const markers = [
    { x: 196, y: 70, label: "جنوب سيناء" },
    { x: 150, y: 150, label: "الغردقة وسفاجا" },
    { x: 168, y: 235, label: "مرسى علم" },
    { x: 150, y: 320, label: "أقصى الجنوب" },
    { x: 250, y: 200, label: "جزر عرض البحر" },
  ];
  return (
    <svg viewBox="0 0 340 380" style={{ width: "100%", height: "auto", background: "#eaf3fb", borderRadius: "16px" }} role="img" aria-label="خريطة توضيحية لشبكة الغوص في البحر الأحمر">
      {/* land (west) */}
      <path d="M0,0 L120,0 C110,90 70,160 95,250 C110,300 80,350 60,380 L0,380 Z" fill="#f3ede0" />
      {/* Sinai */}
      <path d="M150,0 L240,0 L210,95 C190,80 165,60 150,0 Z" fill="#f3ede0" />
      {/* sea label */}
      <text x="250" y="350" textAnchor="middle" fill="#9fc4e6" fontSize="13">البحر الأحمر</text>
      {/* markers */}
      {markers.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="8" fill="#c9952a" stroke="#fff" strokeWidth="2" />
          <text x={m.x - 12} y={m.y + 4} textAnchor="end" fill="#0d2c54" fontSize="12" fontWeight="700">{m.label}</text>
        </g>
      ))}
    </svg>
  );
}
