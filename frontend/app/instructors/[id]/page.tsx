"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import { FIT_DISPLAY, FIT_QUESTIONS } from "@/app/lib/instructorFit";
import { youtubeId, isDirectVideo } from "@/app/lib/video";

/* البروفايل العام للمدرب — البصمة كاملة، نقاط التميّز، التخصصات، وتواصل مباشر. */

const AXES: Record<string, { label: string; icon: string; desc: string }> = {
  planning:        { label: "التخطيط والبريفينج", icon: "🎯", desc: "تحضير الحصص وبريفينج يفهمه المبتدئ" },
  strategies:      { label: "استراتيجيات الشرح", icon: "📚", desc: "تبسيط النظري وتقديم المهارة من زوايا متعددة" },
  management:      { label: "إدارة المجموعة والوعي الظرفي", icon: "🛡️", desc: "سيطرة تحت الماء ومنع المشكلة قبل حدوثها" },
  engagement:      { label: "التحفيز واحتواء الخوف", icon: "❤️", desc: "تهدئة الخائف وإعادة الثقة للمتعثر" },
  watermanship:    { label: "الإتقان المائي والعرض", icon: "🌊", desc: "عروض توضيحية مثالية وثبات في الماء" },
  professionalism: { label: "الاحترافية والتطوير", icon: "📈", desc: "الالتزام بالمعايير والتطور المستمر" },
};

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

export default function InstructorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  // الرابط قد يكون اسمًا عربيًا مُرمّزًا (٪..) — نفكه ثم نعيد ترميزه عند الطلب من الخادم
  const id = (() => { try { return decodeURIComponent(rawId); } catch { return rawId; } })();
  const [ins, setIns] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // نموذج «راسلني عبر الموقع»
  const [cForm, setCForm] = useState({ name: "", contact: "", message: "" });
  const [cState, setCState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [cMsg, setCMsg] = useState("");

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setCState("sending"); setCMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/instructors/${encodeURIComponent(id)}/message`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cForm),
      });
      const d = await res.json();
      if (d.success) { setCState("sent"); setCMsg(d.message || "وصلت رسالتك ✅"); setCForm({ name: "", contact: "", message: "" }); }
      else { setCState("error"); setCMsg(d.message || "تعذّر الإرسال"); }
    } catch { setCState("error"); setCMsg("تعذّر الاتصال بالخادم"); }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/instructors/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => {
        setIns(d.instructor || null);
        // لو وصل الزائر بالرابط الرقمي القديم والمدرب له اسم — نستبدل العنوان بالاسم تلقائيًا
        const slug = d.instructor?.slug;
        if (slug && slug !== id) {
          try { window.history.replaceState(null, "", `/instructors/${encodeURIComponent(slug)}`); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ background: "var(--bg-deep,#040d1a)", minHeight: "60vh", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>جارٍ التحميل...</div>;
  if (!ins) return (
    <div style={{ background: "var(--bg-deep,#040d1a)", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
      <p style={{ color: "rgba(255,255,255,0.6)" }}>المدرب غير موجود.</p>
      <Link href="/instructors" style={{ color: "#22d3ee", fontWeight: 700 }}>← دليل المدربين</Link>
    </div>
  );

  const img = siteImageSrc(ins.user?.profileImage);
  const wa = (ins.whatsapp || "").replace(/[^0-9]/g, "");
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(`مرحبًا كابتن ${ins.user?.name || ""}، وصلتك من بروفايلك على ArabDiving وأرغب بالتدرب معك 🤿`)}` : "";

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      {/* الهيدر */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "48px 20px 36px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "860px", margin: "0 auto" }}>
          <Link href="/instructors" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px" }}>← دليل المدربين</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "16px", flexWrap: "wrap" }}>
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" style={{ width: "86px", height: "86px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(34,211,238,0.5)" }} />
            ) : (
              <div style={{ width: "86px", height: "86px", borderRadius: "50%", background: "linear-gradient(135deg,#0891b2,#c9952a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "38px" }}>🧑‍🏫</div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                {ins.user?.name || "مدرب"} {ins.verified && <span title="موثق من المنصة" style={{ fontSize: "20px" }}>✅</span>}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: "6px 0 0", fontSize: "14.5px" }}>
                {ins.agency} · {ins.rank}{ins.yearsExp ? ` · مدرب منذ ${ins.sinceYear} (خبرة ${ins.yearsExp}+ سنة)` : ""} · 📍 {ins.city}
              </p>
              {ins.languages?.length > 0 && (
                <p style={{ color: "rgba(255,255,255,0.45)", margin: "4px 0 0", fontSize: "13px" }}>🗣️ {ins.languages.join(" · ")}</p>
              )}
              {/* 🌐 السوشيال ميديا + الإيميل */}
              {(ins.email || Object.values(ins.social || {}).some(Boolean)) && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  {[
                    { k: "facebook", icon: "📘", label: "فيسبوك" },
                    { k: "instagram", icon: "📸", label: "انستجرام" },
                    { k: "tiktok", icon: "🎵", label: "تيك توك" },
                    { k: "youtube", icon: "▶️", label: "يوتيوب" },
                    { k: "x", icon: "𝕏", label: "إكس" },
                    { k: "linkedin", icon: "💼", label: "لينكدإن" },
                  ].filter((s) => ins.social?.[s.k]).map((s) => (
                    <a key={s.k} href={ins.social[s.k]} target="_blank" rel="noopener noreferrer"
                      title={s.label}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: "10px", padding: "7px 12px", fontSize: "14px", textDecoration: "none" }}>
                      {s.icon}
                    </a>
                  ))}
                  {ins.email && (
                    <a href={`mailto:${ins.email}`} title="إيميل"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: "10px", padding: "7px 12px", fontSize: "14px", textDecoration: "none" }}>
                      ✉️
                    </a>
                  )}
                </div>
              )}
            </div>
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                style={{ background: "#25D366", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
                تدرّب معي 💬
              </a>
            )}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "26px 18px 70px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* النبذة */}
        {ins.bio && (
          <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
            <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 2, fontSize: "15px", margin: 0 }}>{ins.bio}</p>
          </div>
        )}

        {/* 🎬 الفيديو التعريفي */}
        {ins.video && (() => {
          const yt = youtubeId(ins.video);
          return (
            <div style={{ ...glass, borderRadius: "18px", padding: "16px", overflow: "hidden" }}>
              {yt ? (
                <iframe src={`https://www.youtube.com/embed/${yt}`} title="فيديو تعريفي"
                  style={{ width: "100%", aspectRatio: "16/9", border: "none", borderRadius: "12px", display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : isDirectVideo(ins.video) ? (
                <video src={ins.video} controls style={{ width: "100%", borderRadius: "12px", display: "block" }} />
              ) : (
                <a href={ins.video} target="_blank" rel="noopener noreferrer" style={{ color: "#22d3ee", fontWeight: 700, fontSize: "14px" }}>
                  🎬 شاهد الفيديو التعريفي للمدرب
                </a>
              )}
            </div>
          );
        })()}

        {/* 🏛️ يعمل مع مراكز (بموافقة الطرفين) */}
        {ins.centers?.length > 0 && (
          <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "12px" }}>🏛️ يعمل مع</h2>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {ins.centers.map((c: any) => (
                <Link key={c._id} href={`/family-booking/${c._id}`}
                  style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#22d3ee", borderRadius: "12px", padding: "10px 18px", fontSize: "13.5px", fontWeight: 700, textDecoration: "none" }}>
                  🏛️ {c.name} — {c.city}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* البصمة */}
        {ins.hasFingerprint && ins.fingerprint && (
          <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "4px" }}>🧬 البصمة التدريبية</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", marginBottom: "16px" }}>
              تقييم ذاتي مبني على مقاييس علمية (TSES + Danielson + معايير تقييم مدربي الغوص) — ⭐ = نقطة تميّز
            </p>
            {Object.entries(AXES).map(([a, meta]) => {
              const v = ins.fingerprint[a] || 0;
              if (!v) return null;
              const pct = Math.round(((v - 1) / 4) * 100);
              const isStrength = ins.strengths?.includes(a);
              return (
                <div key={a} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "5px" }}>
                    <span style={{ color: "#fff", fontWeight: 700 }}>
                      {meta.icon} {meta.label} {isStrength && <span style={{ color: "#fbbf24" }}>⭐</span>}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{v}/5</span>
                  </div>
                  <div style={{ height: "9px", background: "rgba(255,255,255,0.08)", borderRadius: "5px", overflow: "hidden", marginBottom: "3px" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: isStrength ? "linear-gradient(90deg,#c9952a,#e8a830)" : "linear-gradient(90deg,#0891b2,#22d3ee)" }} />
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11.5px" }}>{meta.desc}</div>
                </div>
              );
            })}
            {ins.weakness && AXES[ins.weakness] && (
              <p style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "10px", padding: "12px 14px", color: "#fbbf24", fontSize: "13px", lineHeight: 1.8, margin: "10px 0 0" }}>
                💛 شفافية يُحترم عليها: يشارك المدرب علنًا أن مجال تطويره الحالي هو «{AXES[ins.weakness].label}» ويعمل عليه.
              </p>
            )}
          </div>
        )}

        {/* 🤝 من يناسبه؟ — نتائج استبيان الملاءمة القسري */}
        {ins.fit && (() => {
          const suits: string[] = [];
          const redirects: string[] = [];
          FIT_QUESTIONS.forEach((q) => {
            const v = ins.fit[q.key];
            const d = FIT_DISPLAY[q.key]?.[v];
            if (!d) return;
            const icon = q.a.value === v ? q.a.icon : q.b.icon;
            suits.push(`${icon} ${d.suits}`);
            if (d.redirect) redirects.push(d.redirect);
          });
          if (suits.length === 0) return null;
          return (
            <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
              <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "4px" }}>🤝 من يناسبه هذا المدرب؟</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", marginBottom: "16px" }}>
                إجابات صادقة بنظام «اختر واحدًا» — كل اختيار له ثمن، فلا مجال للتجميل. المدرب الذي يحدد من لا يناسبه مدرب يعرف نفسه.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: redirects.length ? "16px" : 0 }}>
                {suits.map((s) => (
                  <div key={s} style={{ background: "rgba(52,211,153,0.09)", border: "1px solid rgba(52,211,153,0.22)", borderRadius: "10px", padding: "9px 14px", color: "#6ee7b7", fontSize: "13.5px", fontWeight: 600 }}>
                    ✅ يناسبه: {s}
                  </div>
                ))}
              </div>
              {redirects.length > 0 && (
                <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: "12px", padding: "14px 16px" }}>
                  <p style={{ color: "#fbbf24", fontSize: "13px", fontWeight: 800, margin: "0 0 8px" }}>💛 بصراحة الناصح الأمين — قد يكون مدرب آخر أنسب لك إذا كنت:</p>
                  <ul style={{ margin: 0, paddingInlineStart: "18px", color: "rgba(255,255,255,0.7)", fontSize: "12.5px", lineHeight: 2 }}>
                    {redirects.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11.5px", margin: "8px 0 0" }}>
                    هذا ليس ضعفًا — بل احترام لوقتك ومالك. <Link href="/instructors" style={{ color: "#22d3ee" }}>تصفح بقية المدربين</Link> لتجد الأنسب لك.
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* التخصصات */}
        {ins.specialties?.length > 0 && (
          <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>🤿 يدرّب تخصصات</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ins.specialties.map((s: string) => (
                <span key={s} style={{ background: "rgba(6,182,212,0.14)", border: "1px solid rgba(6,182,212,0.25)", color: "#22d3ee", borderRadius: "20px", padding: "7px 16px", fontSize: "13.5px", fontWeight: 700 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* 📬 راسلني عبر الموقع — يصل لصندوق وارد المدرب دائمًا (حتى لو أخفى وسائل تواصله) */}
        <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "4px" }}>📬 راسل المدرب عبر الموقع</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", marginBottom: "16px" }}>
            تصل رسالتك لصندوق وارد المدرب مباشرة — اترك وسيلة تواصل ليرد عليك.
          </p>
          {cState === "sent" ? (
            <p style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px", padding: "14px 16px", color: "#34d399", fontWeight: 700, fontSize: "14px", margin: 0 }}>
              ✅ {cMsg}
            </p>
          ) : (
            <form onSubmit={sendMessage} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                <input required value={cForm.name} onChange={(e) => setCForm({ ...cForm, name: e.target.value })} placeholder="اسمك *"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "11px", padding: "11px", fontFamily: "inherit", fontSize: "14px" }} />
                <input value={cForm.contact} onChange={(e) => setCForm({ ...cForm, contact: e.target.value })} placeholder="إيميلك أو واتسابك (للرد عليك)" dir="ltr"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "11px", padding: "11px", fontFamily: "inherit", fontSize: "14px" }} />
              </div>
              <textarea required rows={3} maxLength={1500} value={cForm.message} onChange={(e) => setCForm({ ...cForm, message: e.target.value })} placeholder="رسالتك للمدرب... *"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "11px", padding: "11px", fontFamily: "inherit", fontSize: "14px", resize: "vertical" }} />
              {cState === "error" && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{cMsg}</p>}
              <button type="submit" disabled={cState === "sending"}
                style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "#fff", border: "none", borderRadius: "12px", padding: "13px", fontWeight: 800, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", opacity: cState === "sending" ? 0.6 : 1 }}>
                {cState === "sending" ? "جارٍ الإرسال..." : "أرسل الرسالة 📨"}
              </button>
            </form>
          )}
        </div>

        {/* CTA للطالب: بطاقاتك */}
        <div style={{ ...glass, borderRadius: "18px", padding: "22px", borderColor: "rgba(201,149,42,0.3)" }}>
          <h3 style={{ color: "#fbbf24", fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>💡 قبل أول حصة معه</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: 1.9, marginBottom: "12px" }}>
            اعمل <Link href="/quiz" style={{ color: "#22d3ee" }}>اختبار الألوان</Link> و<Link href="/training-fit" style={{ color: "#22d3ee" }}>استبيان التوافق</Link> وأرسل له بطاقاتك —
            فيعرف أسلوبك من الدقيقة الأولى ويوفّر عليك أسابيع.
          </p>
        </div>
      </section>
    </main>
  );
}
