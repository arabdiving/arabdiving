"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";
import { siteImageSrc } from "@/app/lib/image";

export default function StoriesPage() {
  const c = useContent("stories");
  const hero = c.hero || {};
  const stories = c.stories || [];
  const contest = c.contest || {};
  const cta = c.cta || {};

  return (
    <main style={{ background: "var(--background)" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #08233e 0%, #0d2c54 45%, #2e75b6 100%)", color: "white", padding: "90px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "10px 22px", borderRadius: "30px", marginBottom: "22px", fontSize: "16px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "clamp(34px, 7vw, 54px)", lineHeight: 1.3, marginBottom: "20px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "clamp(17px, 4vw, 20px)", opacity: 0.92, lineHeight: 1.9, maxWidth: "700px", marginInline: "auto" }}>{hero.subtitle}</p>
      </section>

      {/* Stories grid */}
      <section style={{ padding: "80px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 6vw, 36px)", color: "var(--navy)", marginBottom: "50px" }}>{c.storiesTitle}</h2>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "26px" }}>
          {stories.map((s: any, i: number) => (
            <div key={i} style={{ background: "var(--background)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={siteImageSrc(s.image) || ""} alt={s.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0d2c54, #2e75b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "54px" }}>🤿</div>
              )}
              <div style={{ padding: "26px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ color: "#333", lineHeight: 1.9, fontSize: "17px", marginBottom: "18px", flex: 1 }}>“{s.quote}”</p>
                <div>
                  <strong style={{ color: "var(--navy)", fontSize: "17px" }}>{s.name}</strong>
                  <div style={{ color: "var(--mid)", fontSize: "14px", marginTop: "4px" }}>{s.country}</div>
                  <div style={{ color: "#777", fontSize: "13px", marginTop: "2px" }}>📍 {s.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contest */}
      <section style={{ padding: "80px 20px", background: "var(--background)" }}>
        <div style={{ maxWidth: "760px", margin: "auto", background: "white", borderRadius: "22px", padding: "clamp(28px, 5vw, 48px)", boxShadow: "0 14px 40px rgba(0,0,0,0.08)", borderTop: "5px solid var(--gold)", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(201,149,42,0.15)", color: "#9a6f14", padding: "8px 20px", borderRadius: "30px", marginBottom: "18px", fontSize: "15px" }}>{contest.badge}</span>
          <h2 style={{ fontSize: "clamp(24px, 5vw, 32px)", color: "var(--navy)", marginBottom: "14px" }}>{contest.title}</h2>
          <p style={{ color: "#555", lineHeight: 1.9, fontSize: "17px", marginBottom: "20px" }}>{contest.desc}</p>
          {contest.prize && <p style={{ color: "#9a6f14", fontWeight: 600, marginBottom: "22px" }}>🎁 {contest.prize}</p>}

          {(contest.howTo || []).length > 0 && (
            <div style={{ textAlign: "start", maxWidth: "520px", margin: "0 auto 24px" }}>
              {(contest.howTo || []).map((step: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ flex: "0 0 auto", width: "28px", height: "28px", borderRadius: "50%", background: "var(--mid)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{i + 1}</span>
                  <span style={{ color: "#444", lineHeight: 1.7 }}>{step}</span>
                </div>
              ))}
            </div>
          )}

          {contest.deadline && <p style={{ color: "#c0392b", fontWeight: 600, marginBottom: "24px" }}>⏰ {contest.deadline}</p>}
          <Link href={contest.ctaHref || "/community"} style={{ display: "inline-block", background: "var(--gold)", color: "white", padding: "14px 34px", borderRadius: "10px", fontSize: "17px", fontWeight: 600 }}>{contest.ctaLabel || "شارك الآن"}</Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--navy)", color: "white", padding: "70px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 32px)", marginBottom: "16px" }}>{cta.title}</h2>
        <p style={{ opacity: 0.9, fontSize: "18px", maxWidth: "620px", marginInline: "auto", marginBottom: "30px", lineHeight: 1.9 }}>{cta.text}</p>
        <Link href={cta.href || "/community"} style={{ background: "var(--gold)", color: "white", padding: "15px 34px", borderRadius: "10px", fontSize: "17px" }}>{cta.label}</Link>
      </section>
    </main>
  );
}
