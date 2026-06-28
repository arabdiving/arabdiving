"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";
import { siteImageSrc } from "@/app/lib/image";

export default function TryDivingPage() {
  const c = useContent("tryDiving");
  const hero = c.hero || {};
  const reassure = c.reassure || [];
  const steps = c.steps || [];
  const faq = c.faq || [];
  const cta = c.cta || {};
  const heroImg = siteImageSrc(hero.image) || hero.image || "";

  return (
    <main style={{ background: "var(--background)" }}>
      <section style={{ minHeight: "70vh", background: `linear-gradient(rgba(8,35,62,0.66),rgba(11,44,84,0.74))${heroImg ? `, url('${heroImg}')` : `, linear-gradient(135deg,var(--hero),var(--mid))`}`, backgroundSize: "cover", backgroundPosition: "center", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 20px" }}>
        <span style={{ background: "rgba(255,255,255,0.18)", padding: "8px 20px", borderRadius: "30px", marginBottom: "16px", fontSize: "15px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "clamp(30px,7vw,52px)", marginBottom: "14px", maxWidth: "860px", lineHeight: 1.3 }}>{hero.title}</h1>
        <p style={{ fontSize: "clamp(17px,4vw,21px)", opacity: 0.95, maxWidth: "700px", lineHeight: 1.9, marginBottom: "30px" }}>{hero.subtitle}</p>
        <Link href={hero.primaryHref || "/courses"} style={{ background: "var(--gold)", color: "white", padding: "15px 34px", borderRadius: "10px", fontWeight: 800, fontSize: "18px" }}>{hero.primaryLabel}</Link>
      </section>

      <section style={{ padding: "70px 20px", background: "var(--surface)" }}>
        <h2 style={{ textAlign: "center", color: "var(--text)", fontSize: "clamp(24px,5vw,34px)", marginBottom: "44px" }}>{c.reassureTitle}</h2>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "22px" }}>
          {reassure.map((r: any, i: number) => (
            <div key={i} style={{ background: "var(--background)", borderRadius: "18px", padding: "30px 24px", textAlign: "center", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>{r.icon}</div>
              <h3 style={{ color: "var(--text)", fontSize: "20px", marginBottom: "8px" }}>{r.title}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "70px 20px", background: "var(--background)" }}>
        <h2 style={{ textAlign: "center", color: "var(--text)", fontSize: "clamp(24px,5vw,34px)", marginBottom: "44px" }}>{c.stepsTitle}</h2>
        <div style={{ maxWidth: "820px", margin: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
          {steps.map((s: any, i: number) => (
            <div key={i} style={{ background: "var(--surface)", borderRadius: "14px", padding: "18px 20px", display: "flex", gap: "16px", alignItems: "center", border: "1px solid var(--border)" }}>
              <div style={{ flex: "0 0 auto", width: "44px", height: "44px", borderRadius: "50%", background: "var(--mid)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px" }}>{s.n}</div>
              <div><h3 style={{ color: "var(--text)", fontSize: "18px", marginBottom: "2px" }}>{s.title}</h3><p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{s.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "70px 20px", background: "var(--surface)" }}>
        <h2 style={{ textAlign: "center", color: "var(--text)", fontSize: "clamp(24px,5vw,34px)", marginBottom: "34px" }}>{c.faqTitle}</h2>
        <div style={{ maxWidth: "760px", margin: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {faq.map((f: any, i: number) => (
            <div key={i} style={{ background: "var(--background)", borderRadius: "12px", padding: "18px 20px", border: "1px solid var(--border)" }}>
              <h3 style={{ color: "var(--text)", fontSize: "17px", marginBottom: "6px" }}>❓ {f.q}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {cta.title && (
        <section style={{ background: "linear-gradient(135deg,var(--hero),var(--mid))", color: "white", textAlign: "center", padding: "70px 20px" }}>
          <h2 style={{ fontSize: "clamp(24px,5vw,34px)", marginBottom: "12px" }}>{cta.title}</h2>
          <p style={{ opacity: 0.95, maxWidth: "620px", margin: "0 auto 26px", lineHeight: 1.9 }}>{cta.text}</p>
          <Link href={cta.href || "/courses"} style={{ background: "var(--gold)", color: "white", padding: "15px 36px", borderRadius: "10px", fontWeight: 800, fontSize: "17px" }}>{cta.label}</Link>
        </section>
      )}
    </main>
  );
}
