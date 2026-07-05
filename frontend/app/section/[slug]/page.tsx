"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { DEFAULT_SECTIONS, Section, pageMeta } from "@/app/lib/sections";

export default function SectionHub({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings?.sections;
        if (Array.isArray(s) && s.length > 0) setSections(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sec = sections.find((s) => s.slug === slug);

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>جارٍ التحميل...</div>;
  if (!sec) return (
    <div style={{ padding: "70px 20px", textAlign: "center" }}>
      <p style={{ color: "#f87171", marginBottom: "12px", fontSize: "18px" }}>القسم غير موجود.</p>
      <Link href="/" style={{ color: "#22d3ee", fontWeight: 700 }}>← الرئيسية</Link>
    </div>
  );

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      <section style={{ position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 70% 0%, ${sec.color}44 0%, #040d1a 60%)`, padding: "56px 20px 44px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ width: "76px", height: "76px", borderRadius: "20px", margin: "0 auto 16px", background: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "38px", boxShadow: `0 12px 34px ${sec.color}66` }}>{sec.icon}</div>
          <h1 style={{ color: "#fff", fontSize: "clamp(28px,6vw,44px)", fontWeight: 900, letterSpacing: "-1px" }}>{sec.name}</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", marginTop: "8px" }}>كل ما تحتاجه في «{sec.name}» — اختر ما يناسبك</p>
        </div>
      </section>

      <section style={{ maxWidth: "1080px", margin: "0 auto", padding: "36px 18px 70px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "18px" }}>
        {sec.pages.map((href) => {
          const m = pageMeta(href);
          return (
            <Link key={href} href={href} style={{ background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", borderRadius: "18px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: sec.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{m.icon}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "17px" }}>{m.label}</div>
              {m.sub && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13.5px", lineHeight: 1.6 }}>{m.sub}</div>}
              <div style={{ color: sec.color, fontSize: "14px", fontWeight: 700, marginTop: "auto" }}>افتح ←</div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
