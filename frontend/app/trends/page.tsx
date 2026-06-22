"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";
import { siteImageSrc } from "@/app/lib/image";

export default function TrendsPage() {
  const c = useContent("trends");
  const hero = c.hero || {};
  const products = c.products || [];

  return (
    <main style={{ background: "#f8f9fa" }}>
      <section style={{ background: "linear-gradient(135deg,#0077b6,#023e8a)", color: "white", padding: "70px 20px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", padding: "8px 20px", borderRadius: "30px", marginBottom: "14px", fontSize: "15px" }}>{hero.badge}</span>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", marginBottom: "12px", maxWidth: "820px", marginInline: "auto" }}>{hero.title}</h1>
        <p style={{ fontSize: "clamp(16px,4vw,19px)", opacity: 0.93, maxWidth: "640px", margin: "0 auto", lineHeight: 1.8 }}>{hero.subtitle}</p>
      </section>

      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "clamp(30px,6vw,60px) 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "22px" }}>
          {products.map((p: any, i: number) => {
            const img = siteImageSrc(p.image) || p.image || "";
            return (
              <div key={i} style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={p.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg,#0077b6,#023e8a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "46px" }}>🤿</div>
                )}
                <div style={{ padding: "16px 18px" }}>
                  <h3 style={{ color: "#023e8a", fontSize: "19px", marginBottom: "8px" }}>{p.title}</h3>
                  <p style={{ color: "#0077b6", marginBottom: "12px" }}><strong>سبب الرواج: </strong>{p.trend_note}</p>
                  {(p.safety_comments || []).length > 0 && (
                    <div style={{ background: "#fff0f3", borderInlineStart: "4px solid #e63946", borderRadius: "8px", padding: "12px" }}>
                      <strong style={{ color: "#e63946", fontSize: "14px" }}>⚠️ تقييم الأمان:</strong>
                      <ul style={{ margin: "8px 0 0", paddingInlineStart: "20px", color: "#555", fontSize: "14px", lineHeight: 1.8 }}>
                        {(p.safety_comments || []).map((s: string, j: number) => <li key={j}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#e63946", color: "white", textAlign: "center", padding: "30px 20px", borderRadius: "14px", marginTop: "36px" }}>
          <h2 style={{ fontSize: "clamp(20px,4vw,28px)", marginBottom: "10px" }}>{c.ctaTitle}</h2>
          <p style={{ opacity: 0.95, marginBottom: "18px" }}>{c.ctaText}</p>
          <Link href={c.ctaHref || "/weight-calculator"} style={{ background: "white", color: "#e63946", padding: "13px 28px", borderRadius: "10px", fontWeight: 800, fontSize: "16px" }}>{c.ctaLabel}</Link>
        </div>
      </section>
    </main>
  );
}
