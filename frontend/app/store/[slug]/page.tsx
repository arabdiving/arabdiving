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
  divemaster: "احترافي", specialty: "تخصص", freediving: "غوص حر", kids: "أطفال",
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

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ التحميل...</div>;
  if (!center) return <div style={{ padding: "60px", textAlign: "center", color: "#c0392b" }}>المتجر غير موجود.</div>;

  const img = siteImageSrc(center.images?.[0] || center.image);
  const wa = (center.whatsapp || "").replace(/[^0-9]/g, "");
  const order = (p: any) => `https://wa.me/${wa}?text=${encodeURIComponent(`طلب من ${center.name}: ${p.name} — ${p.price} ${symbolOf(p.currency)}`)}`;

  return (
    <main style={{ background: "var(--background)" }}>
      <section style={{ background: "linear-gradient(135deg,#08233e,#2e75b6)", color: "white", padding: "60px 20px", textAlign: "center" }}>
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={center.name} style={{ width: "110px", height: "110px", borderRadius: "20px", objectFit: "cover", marginBottom: "14px" }} />
        )}
        <h1 style={{ fontSize: "clamp(28px,6vw,42px)", marginBottom: "8px" }}>{center.name}</h1>
        <p style={{ opacity: 0.92 }}>📍 {center.city}، {center.country} · ⭐ {center.rating} ({center.reviewsCount})</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "14px" }}>
          {BADGES.filter((b) => center.badges?.[b.key]).map((b) => <span key={b.key} style={{ background: "rgba(255,255,255,0.18)", borderRadius: "8px", padding: "5px 11px", fontSize: "13px" }}>{b.emoji} {b.label}</span>)}
        </div>
        <div style={{ marginTop: "20px" }}>
          <Link href={`/family-booking/${center._id}`} style={{ background: "var(--gold)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: 700 }}>احجز رحلة معنا</Link>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 18px 70px" }}>
        {center.description && <p style={{ textAlign: "center", color: "#444", lineHeight: 1.9, maxWidth: "720px", margin: "0 auto 36px" }}>{center.description}</p>}

        {/* دورات المركز — من كتالوج المنصة المعتمد بأسعار المركز */}
        {courses.length > 0 && (
          <>
            <h2 style={{ color: "var(--navy)", fontSize: "26px", marginBottom: "6px" }}>🎓 الدورات المتاحة لدينا</h2>
            <p style={{ color: "#666", fontSize: "13.5px", marginBottom: "20px" }}>محتوى الدورات معتمد وموحّد من ArabDiving — والسعر والتنفيذ من {center.name}.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginBottom: "44px" }}>
              {courses.map((c) => {
                const ci = siteImageSrc(c.images?.[0] || c.image);
                const enrollWa = `https://wa.me/${wa}?text=${encodeURIComponent(`مرحبًا ${center.name}، أرغب في التسجيل بدورة: ${c.title} — ${c.price} ${symbolOf(c.currency)} (عبر ArabDiving)`)}`;
                return (
                  <div key={c._id} style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                    {ci && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ci} alt={c.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                    )}
                    <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                        <span style={{ background: "var(--navy)", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{c.agency}</span>
                        <span style={{ background: "#eef4fa", color: "#0d6cb0", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>{LEVELS[c.level] || c.level}</span>
                        {c.duration && <span style={{ color: "#94a3b8", fontSize: "12px", alignSelf: "center" }}>⏱ {c.duration}</span>}
                      </div>
                      <Link href={`/courses/${c._id}`}><h3 style={{ color: "var(--navy)", fontSize: "17px", marginBottom: "6px", lineHeight: 1.5 }}>{c.title}</h3></Link>
                      <div style={{ color: "var(--navy)", fontWeight: 800, fontSize: "18px", marginBottom: "12px" }}>{c.price > 0 ? `${c.price} ${symbolOf(c.currency)}` : "اسأل عن السعر"}</div>
                      <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                        <Link href={`/courses/${c._id}`} style={{ flex: 1, textAlign: "center", color: "var(--mid)", border: "1px solid var(--mid)", padding: "9px", borderRadius: "9px", fontWeight: 700, fontSize: "13.5px" }}>التفاصيل</Link>
                        <a href={enrollWa} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", background: "#25D366", color: "white", padding: "9px", borderRadius: "9px", fontWeight: 700, fontSize: "13.5px" }}>سجّل 💬</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <h2 style={{ color: "var(--navy)", fontSize: "26px", marginBottom: "20px" }}>🛒 منتجات المتجر</h2>
        {products.length === 0 ? <p style={{ color: "#888" }}>لا توجد منتجات معروضة حاليًا.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {products.map((p) => {
              const pi = siteImageSrc(p.images?.[0] || p.image);
              return (
                <div key={p._id} style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "170px", background: "#f1f5f9" }}>
                    {pi ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pi} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>📦</div>}
                  </div>
                  <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ color: "var(--navy)", fontSize: "17px" }}>{p.name}</h3>
                    <div style={{ color: "var(--navy)", fontWeight: 800, margin: "6px 0" }}>{p.price} {symbolOf(p.currency)}</div>
                    {p.sizes?.length > 0 && <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>{p.sizes.map((s: string) => <span key={s} style={{ background: "#eef4fa", color: "#0d6cb0", borderRadius: "6px", padding: "2px 8px", fontSize: "12px" }}>{s}</span>)}</div>}
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
