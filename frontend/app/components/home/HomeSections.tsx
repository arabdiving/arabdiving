"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { DEFAULT_SECTIONS, Section } from "@/app/lib/sections";

/* بلوك الأقسام على الرئيسية — كروت ملوّنة تودّي لصفحات الهَب. */

export default function HomeSections() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => { const s = d.settings?.sections; if (Array.isArray(s) && s.length > 0) setSections(s); })
      .catch(() => {});
  }, []);

  if (sections.length === 0) return null;

  return (
    <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "60px 20px" }}>
      <h2 style={{ color: "var(--text)", fontSize: "clamp(24px,4vw,34px)", fontWeight: 900, textAlign: "center", marginBottom: "6px" }}>استكشف <span className="hero-grad">الأقسام</span></h2>
      <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: "32px" }}>كل ما تحتاجه منظّم في مكان واحد</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "18px" }}>
        {sections.map((sec) => (
          <Link key={sec.slug} href={`/section/${sec.slug}`} style={{ background: `linear-gradient(135deg, ${sec.color}22, rgba(8,20,48,0.6))`, border: `1px solid ${sec.color}44`, borderRadius: "20px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: `0 8px 22px ${sec.color}55` }}>{sec.icon}</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "20px" }}>{sec.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px" }}>{sec.pages.length} صفحات</div>
            <div style={{ color: sec.color, fontWeight: 700, fontSize: "14px", marginTop: "auto" }}>استكشف القسم ←</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
