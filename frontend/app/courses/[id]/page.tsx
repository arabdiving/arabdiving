"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { symbolOf } from "@/app/lib/currency";

const LEVELS: Record<string, string> = {
  try: "جرّب الغوص", open_water: "مبتدئ", advanced: "متقدّم", rescue: "إنقاذ",
  divemaster: "احترافي", specialty: "تخصص", freediving: "غوص حر", kids: "أطفال",
};

const TIER_LABEL: Record<string, string> = { silver: "🥈 معتمد", gold: "🥇 موصى به", platinum: "💎 سفير العرب" };

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [offeredBy, setOfferedBy] = useState<any[]>([]);
  const [wa, setWa] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/courses/${id}`)
      .then((r) => r.json())
      .then((d) => { setCourse(d.course || null); setOfferedBy(d.offeredBy || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setWa(d.settings?.whatsappNumber || "")).catch(() => {});
  }, [id]);

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>جارٍ التحميل...</div>;
  if (!course) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <p style={{ color: "var(--muted)", marginBottom: "16px" }}>الدورة غير موجودة.</p>
      <Link href="/courses" style={{ color: "var(--mid)", fontWeight: 700 }}>← كل الدورات</Link>
    </div>
  );

  const img = siteImageSrc(course.images?.[0] || course.image);
  const centerWa = (course.center?.whatsapp || "").replace(/[^0-9]/g, "");
  const platformWa = wa.replace(/[^0-9]/g, "");
  const enrollNumber = centerWa || platformWa;
  const enrollText = encodeURIComponent(
    `مرحبًا، أرغب في التسجيل بدورة: ${course.title}${course.center ? ` لدى ${course.center.name}` : ""}${course.price ? ` — السعر ${course.price} ${symbolOf(course.currency)}` : ""} (عبر ArabDiving)`
  );
  const enrollHref = enrollNumber ? `https://wa.me/${enrollNumber}?text=${enrollText}` : `https://wa.me/?text=${enrollText}`;

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, var(--hero), var(--mid))", color: "white", padding: "0 0 0" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "44px 20px 40px" }}>
          <Link href="/courses" style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>← كل الدورات</Link>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "14px 0 10px" }}>
            <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: "20px", padding: "4px 14px", fontSize: "13px", fontWeight: 700 }}>{course.agency}</span>
            <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: "20px", padding: "4px 14px", fontSize: "13px" }}>{LEVELS[course.level] || course.level}</span>
            {course.duration && <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: "20px", padding: "4px 14px", fontSize: "13px" }}>⏱ {course.duration}</span>}
          </div>
          <h1 style={{ fontSize: "clamp(24px,5vw,38px)", lineHeight: 1.4, marginBottom: "10px" }}>{course.title}</h1>
          {course.center && (
            <p style={{ fontSize: "15px", opacity: 0.9 }}>
              يقدمها: <Link href={`/store/${course.center.slug}`} style={{ color: "var(--gold)", fontWeight: 800 }}>{course.center.name}</Link>
              {" "}· 📍 {course.center.city} {course.center.tier && <span style={{ marginInlineStart: "6px" }}>{TIER_LABEL[course.center.tier]}</span>}
            </p>
          )}
        </div>
      </section>

      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "28px 18px 70px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "22px" }}>

          {/* الصورة */}
          {img && (
            <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", maxHeight: "420px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* الوصف */}
          {course.description && (
            <div style={{ background: "var(--surface)", borderRadius: "16px", padding: "24px", border: "1px solid var(--border)" }}>
              <h2 style={{ color: "var(--ink, var(--navy))", fontSize: "20px", marginBottom: "10px" }}>عن الدورة</h2>
              <p style={{ color: "var(--text)", lineHeight: 2, fontSize: "15.5px", margin: 0 }}>{course.description}</p>
            </div>
          )}

          {/* ماذا تتضمن + ماذا تتوقع */}
          {course.includes?.length > 0 && (
            <div style={{ background: "var(--surface)", borderRadius: "16px", padding: "24px", border: "1px solid var(--border)" }}>
              <h2 style={{ color: "var(--ink, var(--navy))", fontSize: "20px", marginBottom: "14px" }}>ماذا تتضمن وماذا تتوقع؟</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {course.includes.map((x: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", lineHeight: 1.9, color: "var(--text)" }}>
                    <span style={{ color: "#0d9488", fontWeight: 900, flexShrink: 0, marginTop: "2px" }}>✓</span>
                    {x}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* المراكز المعتمدة التي تقدم هذه الدورة */}
          {offeredBy.filter((o) => o.center).length > 0 && (
            <div style={{ background: "var(--surface)", borderRadius: "16px", padding: "24px", border: "1px solid var(--border)" }}>
              <h2 style={{ color: "var(--ink, var(--navy))", fontSize: "20px", marginBottom: "6px" }}>🛡️ مراكز معتمدة تقدم هذه الدورة</h2>
              <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "14px" }}>كل مركز هنا اجتاز <Link href="/standards" style={{ color: "var(--mid)" }}>معايير الاعتماد</Link> — قارن الأسعار واختر.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {offeredBy.filter((o) => o.center).map((o) => (
                  <Link key={o._id} href={`/store/${o.center.slug}`}
                    style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--background)", borderRadius: "12px", padding: "14px 16px", border: "1px solid var(--border)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "var(--ink, var(--navy))", fontWeight: 800, fontSize: "15px" }}>{o.center.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "12.5px" }}>📍 {o.center.city} · {TIER_LABEL[o.center.tier] || ""}</div>
                    </div>
                    <div style={{ color: "var(--ink, var(--navy))", fontWeight: 900, fontSize: "17px" }}>{o.price} {symbolOf(o.currency)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* شريط التسجيل */}
          <div style={{ background: "linear-gradient(135deg,#134e4a,#0d9488)", borderRadius: "16px", padding: "24px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: "20px", marginBottom: "4px" }}>
                {course.price > 0 ? `${course.price} ${symbolOf(course.currency)}` : "السعر حسب المركز"}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.85 }}>استفسر أو سجّل عبر واتساب — نرد بالعربي</div>
            </div>
            <a href={enrollHref} target="_blank" rel="noopener noreferrer"
              style={{ background: "#25D366", color: "white", padding: "13px 30px", borderRadius: "12px", fontWeight: 800, fontSize: "15px" }}>
              سجّل الآن 💬
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
