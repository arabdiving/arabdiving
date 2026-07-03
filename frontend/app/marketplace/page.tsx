"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { symbolOf } from "@/app/lib/currency";

/*
  السوق — أعيد بناؤه ليكون بوابة الشركاء الكاملة:
  1) شريط المراكز الشريكة (كل مركز له صفحته: دورات + منتجات + حجز).
  2) شبكة المنتجات مع فلترة بالفئة والمركز، وكل منتج يرتبط بصفحة مركزه.
*/

const TIER_LABEL: Record<string, string> = { silver: "🥈 معتمد", gold: "🥇 موصى به", platinum: "💎 سفير العرب" };

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

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      <section style={{ background: "linear-gradient(135deg, var(--hero), var(--mid))", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px,6vw,42px)", marginBottom: "10px" }}>🛒 السوق</h1>
        <p style={{ opacity: 0.92, fontSize: "clamp(15px,4vw,18px)", maxWidth: "620px", margin: "0 auto", lineHeight: 1.8 }}>
          معدات ودورات من مراكز معتمدة اجتازت <Link href="/standards" style={{ color: "var(--gold)", fontWeight: 700 }}>معاييرنا</Link> — اطلب مباشرة عبر واتساب.
        </p>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 18px 70px" }}>

        {/* المراكز الشريكة */}
        {centers.length > 0 && (
          <div style={{ marginBottom: "34px" }}>
            <h2 style={{ color: "var(--ink, var(--navy))", fontSize: "22px", marginBottom: "14px" }}>🛡️ المراكز الشريكة المعتمدة</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "14px" }}>
              {centers.map((c) => {
                const ci = siteImageSrc(c.images?.[0] || c.image);
                return (
                  <Link key={c._id} href={c.slug ? `/store/${c.slug}` : "#"}
                    style={{ background: "var(--surface)", borderRadius: "14px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
                    {ci ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ci} alt={c.name} style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#0891b2,#c9952a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🤿</div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "var(--ink, var(--navy))", fontWeight: 800, fontSize: "14.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "12px" }}>📍 {c.city} · {TIER_LABEL[c.tier] || ""}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* فلاتر المنتجات */}
        <h2 style={{ color: "var(--ink, var(--navy))", fontSize: "22px", marginBottom: "14px" }}>🧰 المعدات والمنتجات</h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "22px" }}>
          <button onClick={() => setCat("")} style={chip(cat === "")}>الكل</button>
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>)}
          {centers.length > 0 && (
            <select value={centerId} onChange={(e) => setCenterId(e.target.value)}
              style={{ ...chip(false), padding: "8px 12px", cursor: "pointer" }}>
              <option value="">كل المراكز</option>
              {centers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
        </div>

        {loading ? <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>جارٍ التحميل...</p>
          : shown.length === 0 ? <div style={{ textAlign: "center", color: "var(--muted)", padding: "50px", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)" }}><p style={{ fontSize: "44px" }}>🤿</p><p>لا توجد منتجات مطابقة.</p></div>
          : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "22px" }}>
            {shown.map((p) => {
              const img = siteImageSrc(p.images?.[0] || p.image);
              const c = centerOf(p);
              return (
                <div key={p._id} style={{ background: "var(--surface)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", border: "1px solid var(--border)" }}>
                  <div style={{ height: "190px", background: "var(--background)" }}>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "46px" }}>📦</div>}
                  </div>
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ color: "var(--ink, var(--navy))", fontSize: "18px", marginBottom: "4px" }}>{p.name}</h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "6px" }}>
                      {p.category && <span style={{ color: "var(--faint, #94a3b8)", fontSize: "12px" }}>{p.category}</span>}
                      {c && c.slug && <Link href={`/store/${c.slug}`} style={{ color: "var(--mid)", fontSize: "12px", fontWeight: 700 }}>🛡️ {c.name}</Link>}
                    </div>
                    <div style={{ color: "var(--ink, var(--navy))", fontWeight: 800, fontSize: "19px", marginBottom: "8px" }}>
                      {p.price} {symbolOf(p.currency)} {!p.inStock && <span style={{ color: "#b91c1c", fontSize: "13px", fontWeight: 400 }}>· نفد المخزون</span>}
                    </div>
                    {p.description && <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "8px" }}>{p.description}</p>}
                    {p.features?.length > 0 && (
                      <ul style={{ margin: "0 0 10px", paddingInlineStart: "18px", color: "var(--muted)", fontSize: "13px", lineHeight: 1.8 }}>
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
  return { background: active ? "var(--mid)" : "var(--surface)", color: active ? "white" : "var(--text)", border: active ? "2px solid var(--mid)" : "1px solid var(--border)", borderRadius: "22px", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" };
}
