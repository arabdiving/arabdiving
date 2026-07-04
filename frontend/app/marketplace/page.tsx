"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { symbolOf } from "@/app/lib/currency";

/* المتجر (Marketplace Dark) — بطاقات منتجات داكنة زجاجية، بيانات حقيقية من /api/products. */

const TIER_LABEL: Record<string, string> = { silver: "🥈 معتمد", gold: "🥇 موصى به", platinum: "💎 سفير العرب" };
const GRADS = [
  "linear-gradient(135deg,#c2410c,#7c2d12)", "linear-gradient(135deg,#065f46,#064e3b)",
  "linear-gradient(135deg,#7e22ce,#4c1d95)", "linear-gradient(135deg,#0e7490,#164e63)",
  "linear-gradient(135deg,#1d4ed8,#1e3a8a)", "linear-gradient(135deg,#be185d,#831843)",
];

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("");
  const [centerId, setCenterId] = useState("");
  const [wa, setWa] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/products`).then((r) => r.json()).then((d) => setItems(d.data || [])).catch(() => {}).finally(() => setLoading(false));
    fetch(`${API_BASE}/api/partner-centers`).then((r) => r.json()).then((d) => setCenters((d.data || d.centers || []).filter((c: any) => c.active !== false))).catch(() => {});
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setWa(d.settings?.whatsappNumber || "")).catch(() => {});
  }, []);

  const cats = useMemo(() => Array.from(new Set(items.map((p) => p.category).filter(Boolean))), [items]);
  const centerOf = (p: any) => centers.find((c) => c._id === (p.center?._id || p.center));
  const shown = items.filter((p) => (!cat || p.category === cat) && (!centerId || (p.center?._id || p.center) === centerId));

  const orderHref = (p: any) => {
    const c = centerOf(p);
    const num = ((c?.whatsapp || wa) + "").replace(/[^0-9]/g, "");
    const text = `مرحبًا، أرغب في طلب المنتج: ${p.name} — السعر ${p.price} ${symbolOf(p.currency)} (عبر ArabDiving)`;
    return num ? `https://wa.me/${num}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "60px 20px 42px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ ...glass, display: "inline-block", color: "#34d399", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "14px" }}>🛒 المتجر</span>
          <h1 style={{ fontSize: "clamp(30px,6vw,46px)", fontWeight: 900, marginBottom: "10px", letterSpacing: "-1px" }}>معدات الغوص</h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(15px,3vw,18px)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
            معدات ودورات من مراكز معتمدة اجتازت <Link href="/standards" style={{ color: "var(--gold)", fontWeight: 700 }}>معاييرنا</Link> — اطلب مباشرة عبر واتساب.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "34px 18px 70px" }}>
        {/* المراكز الشريكة */}
        {centers.length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "14px" }}>🛡️ المراكز الشريكة المعتمدة</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "14px" }}>
              {centers.map((c) => {
                const ci = siteImageSrc(c.images?.[0] || c.image);
                return (
                  <Link key={c._id} href={c.slug ? `/store/${c.slug}` : "#"} style={{ ...glass, borderRadius: "14px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                    {ci ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ci} alt={c.name} style={{ width: "46px", height: "46px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "linear-gradient(135deg,#0891b2,#c9952a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🤿</div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "#fff", fontWeight: 800, fontSize: "14.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>📍 {c.city} · {TIER_LABEL[c.tier] || ""}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* فلاتر */}
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "14px" }}>🧰 المعدات والمنتجات</h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button onClick={() => setCat("")} style={chip(cat === "")}>الكل</button>
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>)}
          {centers.length > 0 && (
            <select value={centerId} onChange={(e) => setCenterId(e.target.value)} style={{ ...chip(false), padding: "8px 12px", cursor: "pointer" }}>
              <option value="">كل المراكز</option>
              {centers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
        </div>

        {loading ? <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", padding: "40px" }}>جارٍ التحميل...</p>
          : shown.length === 0 ? <div style={{ ...glass, textAlign: "center", color: "rgba(255,255,255,0.6)", padding: "50px", borderRadius: "16px" }}><p style={{ fontSize: "44px" }}>🤿</p><p>لا توجد منتجات مطابقة.</p></div>
          : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
            {shown.map((p, i) => {
              const img = siteImageSrc(p.images?.[0] || p.image);
              const c = centerOf(p);
              return (
                <div key={p._id} style={{ ...glass, borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "175px", background: img ? "#0a1830" : GRADS[i % GRADS.length], position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <span style={{ fontSize: "52px" }}>{p.emoji || "📦"}</span>}
                    {p.category && <span style={{ position: "absolute", top: "12px", insetInlineEnd: "12px", background: "rgba(4,8,18,0.7)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px", backdropFilter: "blur(6px)" }}>{p.category}</span>}
                    {!p.inStock && <span style={{ position: "absolute", top: "12px", insetInlineStart: "12px", background: "#b91c1c", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>نفد المخزون</span>}
                  </div>
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ color: "#fff", fontSize: "16.5px", fontWeight: 700, marginBottom: "4px", lineHeight: 1.5 }}>{p.name}</h3>
                    {c && c.slug && <Link href={`/store/${c.slug}`} style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>🛡️ {c.name}</Link>}
                    <div style={{ color: "var(--gold,#e8a830)", fontWeight: 800, fontSize: "19px", margin: "4px 0 8px" }}>{p.price} {symbolOf(p.currency)}</div>
                    {p.description && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.7, marginBottom: "8px" }}>{p.description}</p>}
                    {p.sizes?.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {p.sizes.map((s: string) => <span key={s} style={{ background: "rgba(6,182,212,0.18)", color: "#22d3ee", borderRadius: "7px", padding: "3px 10px", fontSize: "13px", fontWeight: 700 }}>{s}</span>)}
                      </div>
                    )}
                    <a href={orderHref(p)} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto", background: "#25D366", color: "white", textAlign: "center", padding: "11px", borderRadius: "11px", fontWeight: 700, fontSize: "14.5px" }}>💬 اطلب عبر واتساب</a>
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
  return { background: active ? "var(--mid)" : "rgba(255,255,255,0.05)", color: active ? "#04121f" : "#fff", border: active ? "2px solid var(--mid)" : "1px solid rgba(255,255,255,0.12)", borderRadius: "22px", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: 700 };
}
