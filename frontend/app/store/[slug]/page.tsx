"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { symbolOf } from "@/app/lib/currency";

const BADGES: { key: string; label: string; emoji: string }[] = [
  { key: "womenStaff", label: "طاقم نسائي", emoji: "🧕" },
  { key: "privateTrip", label: "رحلة خاصة", emoji: "🛥️" },
  { key: "family", label: "للعائلات", emoji: "👨‍👩‍👧‍👦" },
  { key: "separateFacilities", label: "مرافق مستقلة", emoji: "🚿" },
  { key: "sanitizedGear", label: "معدات معقّمة", emoji: "✨" },
  { key: "technical", label: "غوص تقني", emoji: "⚙️" },
  { key: "ecoFriendly", label: "صديق للبيئة", emoji: "🪸" },
];

const LEVELS: Record<string, string> = {
  try: "جرّب الغوص", open_water: "مبتدئ", advanced: "متقدّم", rescue: "إنقاذ",
  divemaster: "احترافي", specialty: "تخصص", freediving: "غوص حر", kids: "أطفال", scubility: "غوص تكيّفي (ذوي الهمم)",
};

const TIER: Record<string, { label: string; color: string }> = {
  platinum: { label: "💎 بلاتيني", color: "#22d3ee" },
  gold: { label: "🥇 ذهبي", color: "#e8a830" },
  silver: { label: "🥈 فضي", color: "#cbd5e1" },
};

export default function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [center, setCenter] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/store/${slug}`).then((r) => r.json()).then((d) => { setCenter(d.center || null); setProducts(d.products || []); setCourses(d.courses || []); }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>جارٍ التحميل...</div>;
  if (!center) return <div style={{ padding: "60px", textAlign: "center", color: "#f87171" }}>المتجر غير موجود.</div>;

  const img = siteImageSrc(center.images?.[0] || center.image);
  const wa = (center.whatsapp || "").replace(/[^0-9]/g, "");
  const order = (p: any) => `https://wa.me/${wa}?text=${encodeURIComponent(`طلب من ${center.name}: ${p.name} — ${p.price} ${symbolOf(p.currency)}`)}`;
  const tier = TIER[center.tier];

  const stats: { v: string; l: string; c: string }[] = [
    { v: String(center.rating ?? "—"), l: "متوسط التقييم", c: "#e8a830" },
    { v: String(center.reviewsCount ?? 0), l: "تقييم", c: "#22d3ee" },
    { v: String(courses.length), l: "دورة متاحة", c: "#a855f7" },
    { v: String(products.length), l: "منتج", c: "#34d399" },
  ];

  const glass: React.CSSProperties = { background: "var(--glass-bg, rgba(8,20,48,0.78))", border: "1px solid var(--glass-border, rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

  return (
    <main style={{ background: "var(--bg-deep, #040d1a)", minHeight: "100vh" }}>
      {/* HERO */}
      <section style={{ position: "relative", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 65%)", color: "#fff", padding: "60px 20px 40px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={center.name} style={{ width: "104px", height: "104px", borderRadius: "22px", objectFit: "cover", marginBottom: "16px", border: "2px solid rgba(255,255,255,0.15)" }} />
          ) : (
            <div style={{ width: "104px", height: "104px", borderRadius: "22px", margin: "0 auto 16px", background: "linear-gradient(135deg,#0891b2,#c9952a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🤿</div>
          )}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "12px" }}>
            <span style={{ ...glass, color: "#fff", fontSize: "13px", fontWeight: 700, padding: "6px 14px", borderRadius: "30px" }}>📍 {center.city}</span>
            <span style={{ ...glass, color: "#fff", fontSize: "13px", fontWeight: 700, padding: "6px 14px", borderRadius: "30px" }}>⭐ {center.rating} · {center.reviewsCount} تقييم</span>
            {tier && <span style={{ background: tier.color, color: "#04121f", fontSize: "13px", fontWeight: 800, padding: "6px 14px", borderRadius: "30px" }}>{tier.label}</span>}
          </div>
          <h1 style={{ fontSize: "clamp(30px,6vw,48px)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-1px" }}>{center.name}</h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "22px" }}>
            {BADGES.filter((b) => center.badges?.[b.key]).map((b) => <span key={b.key} style={{ ...glass, color: "rgba(255,255,255,0.9)", borderRadius: "10px", padding: "6px 12px", fontSize: "13px" }}>{b.emoji} {b.label}</span>)}
          </div>
          <Link href={`/family-booking/${center._id}`} style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", padding: "13px 32px", borderRadius: "12px", fontWeight: 800, fontSize: "16px", boxShadow: "0 8px 24px rgba(201,149,42,0.4)" }}>احجز رحلة معنا ←</Link>
        </div>
      </section>

      {/* STATS ROW */}
      <section style={{ maxWidth: "900px", margin: "-28px auto 0", padding: "0 18px", position: "relative", zIndex: 5 }}>
        <div style={{ ...glass, borderRadius: "18px", padding: "22px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ borderInlineEnd: i < 3 ? "1px solid var(--glass-border, rgba(255,255,255,0.08))" : "none" }}>
              <div style={{ color: s.c, fontSize: "clamp(22px,4vw,32px)", fontWeight: 900 }}>{s.v}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", marginTop: "2px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "44px 18px 70px" }}>
        {/* عن المركز */}
        {center.description && (
          <div style={{ ...glass, borderRadius: "18px", padding: "26px", marginBottom: "40px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>عن المركز</h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.9, fontSize: "15px" }}>{center.description}</p>
          </div>
        )}

        {/* الدورات */}
        {courses.length > 0 && (
          <>
            <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, marginBottom: "6px" }}>🎓 الدورات المتاحة لدينا</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13.5px", marginBottom: "20px" }}>محتوى الدورات معتمد من ArabDiving — والسعر والتنفيذ من {center.name}.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginBottom: "44px" }}>
              {courses.map((c) => {
                const ci = siteImageSrc(c.images?.[0] || c.image);
                const enrollWa = `https://wa.me/${wa}?text=${encodeURIComponent(`مرحبًا ${center.name}، أرغب في التسجيل بدورة: ${c.title} — ${c.price} ${symbolOf(c.currency)} (عبر ArabDiving)`)}`;
                return (
                  <div key={c._id} style={{ ...glass, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {ci && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ci} alt={c.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                    )}
                    <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                        <span style={{ background: "rgba(6,182,212,0.2)", color: "#22d3ee", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>{c.agency}</span>
                        <span style={{ background: "rgba(168,85,247,0.2)", color: "#c084fc", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>{LEVELS[c.level] || c.level}</span>
                        {c.duration && <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", alignSelf: "center" }}>⏱ {c.duration}</span>}
                      </div>
                      <Link href={`/courses/${c._id}`}><h3 style={{ color: "#fff", fontSize: "17px", marginBottom: "6px", lineHeight: 1.5 }}>{c.title}</h3></Link>
                      <div style={{ color: "#e8a830", fontWeight: 800, fontSize: "18px", marginBottom: "12px" }}>{c.price > 0 ? `${c.price} ${symbolOf(c.currency)}` : "اسأل عن السعر"}</div>
                      <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                        <Link href={`/courses/${c._id}`} style={{ flex: 1, textAlign: "center", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.5)", padding: "9px", borderRadius: "9px", fontWeight: 700, fontSize: "13.5px" }}>التفاصيل</Link>
                        <a href={enrollWa} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", background: "#25D366", color: "white", padding: "9px", borderRadius: "9px", fontWeight: 700, fontSize: "13.5px" }}>سجّل 💬</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* المنتجات */}
        <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>🛒 منتجات المتجر</h2>
        {products.length === 0 ? <p style={{ color: "rgba(255,255,255,0.5)" }}>لا توجد منتجات معروضة حاليًا.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {products.map((p) => {
              const pi = siteImageSrc(p.images?.[0] || p.image);
              return (
                <div key={p._id} style={{ ...glass, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "170px", background: "#0a1830" }}>
                    {pi ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pi} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>📦</div>}
                  </div>
                  <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ color: "#fff", fontSize: "17px" }}>{p.name}</h3>
                    <div style={{ color: "#e8a830", fontWeight: 800, margin: "6px 0" }}>{p.price} {symbolOf(p.currency)}</div>
                    {p.sizes?.length > 0 && <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>{p.sizes.map((s: string) => <span key={s} style={{ background: "rgba(6,182,212,0.18)", color: "#22d3ee", borderRadius: "6px", padding: "2px 8px", fontSize: "12px" }}>{s}</span>)}</div>}
                    <a href={order(p)} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto", background: "#25D366", color: "white", textAlign: "center", padding: "10px", borderRadius: "9px", fontWeight: 700, fontSize: "14px" }}>اطلب 💬</a>
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
