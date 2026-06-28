"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { symbolOf } from "@/app/lib/currency";

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("");
  const [wa, setWa] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/products`).then((r) => r.json()).then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false));
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setWa(d.settings?.whatsappNumber || "")).catch(() => {});
  }, []);

  const cats = useMemo(() => Array.from(new Set(items.map((p) => p.category).filter(Boolean))), [items]);
  const shown = items.filter((p) => !cat || p.category === cat);

  const orderHref = (p: any, size?: string) => {
    const text = `مرحبًا، أرغب في طلب المنتج: ${p.name}${size ? ` (مقاس ${size})` : ""} — السعر ${p.price} ${symbolOf(p.currency)}`;
    return wa ? `https://wa.me/${wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      <section style={{ background: "linear-gradient(135deg,#08233e,#2e75b6)", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px,6vw,42px)", marginBottom: "10px" }}>🛒 متجر معدات الغوص</h1>
        <p style={{ opacity: 0.92, fontSize: "clamp(15px,4vw,18px)" }}>أحدث المعدات بمقاسات للكبار والصغار — اطلب مباشرة عبر واتساب.</p>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 18px 70px" }}>
        {cats.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "22px" }}>
            <button onClick={() => setCat("")} style={chip(cat === "")}>الكل</button>
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>)}
          </div>
        )}

        {loading ? <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>جارٍ التحميل...</p>
          : shown.length === 0 ? <div style={{ textAlign: "center", color: "#666", padding: "50px", background: "white", borderRadius: "16px" }}><p style={{ fontSize: "44px" }}>🤿</p><p>لا توجد منتجات بعد.</p></div>
          : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "22px" }}>
            {shown.map((p) => {
              const img = siteImageSrc(p.images?.[0] || p.image);
              return (
                <div key={p._id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "190px", background: "#f1f5f9" }}>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "46px" }}>📦</div>}
                  </div>
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ color: "var(--navy)", fontSize: "18px", marginBottom: "4px" }}>{p.name}</h3>
                    {p.category && <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px" }}>{p.category}</div>}
                    <div style={{ color: "var(--navy)", fontWeight: 800, fontSize: "19px", marginBottom: "8px" }}>{p.price} {symbolOf(p.currency)} {!p.inStock && <span style={{ color: "#b91c1c", fontSize: "13px", fontWeight: 400 }}>· نفد المخزون</span>}</div>
                    {p.description && <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.7, marginBottom: "8px" }}>{p.description}</p>}
                    {p.features?.length > 0 && (
                      <ul style={{ margin: "0 0 10px", paddingInlineStart: "18px", color: "#555", fontSize: "13px", lineHeight: 1.8 }}>
                        {p.features.slice(0, 4).map((f: string, i: number) => <li key={i}>{f}</li>)}
                      </ul>
                    )}
                    {p.sizes?.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {p.sizes.map((s: string) => <span key={s} style={{ background: "#eef4fa", color: "#0d6cb0", borderRadius: "7px", padding: "3px 10px", fontSize: "13px", fontWeight: 700 }}>{s}</span>)}
                      </div>
                    )}
                    <a href={orderHref(p)} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto", background: "#25D366", color: "white", textAlign: "center", padding: "11px", borderRadius: "10px", fontWeight: 700, fontSize: "15px" }}>اطلب عبر واتساب 💬</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
function chip(active: boolean): React.CSSProperties {
  return { background: active ? "var(--mid)" : "#f3f6f9", color: active ? "white" : "#06324f", border: active ? "2px solid var(--mid)" : "1px solid #d4dae3", borderRadius: "22px", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" };
}
