"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { symbolOf } from "@/app/lib/currency";

/* قسم «معدات الغوص» على الصفحة الرئيسية — شبكة منتجات بأسلوب Dark Ocean
   (مطابق لتصميم design_handoff/ArabDiving Home Dark). يعرض أول 4 منتجات. */

const GRADS = [
  "linear-gradient(135deg,#c2410c,#7c2d12)",
  "linear-gradient(135deg,#065f46,#064e3b)",
  "linear-gradient(135deg,#7e22ce,#4c1d95)",
  "linear-gradient(135deg,#0e7490,#164e63)",
];

export default function HomeMarketplace() {
  const [items, setItems] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [wa, setWa] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/products`).then((r) => r.json()).then((d) => setItems((d.data || []).slice(0, 4))).catch(() => {});
    fetch(`${API_BASE}/api/partner-centers`).then((r) => r.json()).then((d) => setCenters(d.data || d.centers || [])).catch(() => {});
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setWa(d.settings?.whatsappNumber || "")).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const centerOf = (p: any) => centers.find((c) => c._id === (p.center?._id || p.center));
  const orderHref = (p: any) => {
    const c = centerOf(p);
    const num = ((c?.whatsapp || wa) + "").replace(/[^0-9]/g, "");
    const text = `مرحبًا، أرغب في طلب المنتج: ${p.name} — السعر ${p.price} ${symbolOf(p.currency)} (عبر ArabDiving)`;
    return num ? `https://wa.me/${num}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "70px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <span style={{ display: "inline-block", background: "var(--glass-light-bg)", border: "1px solid var(--glass-light-border)", color: "var(--green, #34d399)", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "12px" }}>المتجر</span>
          <h2 style={{ color: "var(--text)", fontSize: "clamp(26px,5vw,38px)", fontWeight: 900, letterSpacing: "-0.5px" }}>معدات الغوص</h2>
        </div>
        <Link href="/marketplace" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text)", padding: "12px 22px", borderRadius: "12px", fontWeight: 700, fontSize: "15px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>تصفّح المتجر ←</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "20px" }}>
        {items.map((p, i) => {
          const img = siteImageSrc(p.images?.[0] || p.image);
          const c = centerOf(p);
          return (
            <div key={p._id} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div style={{ height: "170px", background: img ? "#0a1830" : GRADS[i % GRADS.length], position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "52px" }}>{p.emoji || "📦"}</span>
                )}
                {c?.name && (
                  <span style={{ position: "absolute", top: "12px", insetInlineEnd: "12px", background: "rgba(4,8,18,0.7)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>{String(c.name).split(" ")[0]}</span>
                )}
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ color: "var(--text)", fontSize: "16px", fontWeight: 700, marginBottom: "8px", lineHeight: 1.5 }}>{p.name}</h3>
                <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "18px", marginBottom: "14px" }}>{p.price} {symbolOf(p.currency)}</div>
                <a href={orderHref(p)} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto", background: "#25D366", color: "#fff", textAlign: "center", padding: "11px", borderRadius: "11px", fontWeight: 700, fontSize: "14.5px" }}>💬 واتساب</a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
