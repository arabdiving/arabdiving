"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

/* ─── كل صفحات الموقع ─────────────────────────────────── */
const ALL_PAGES = [
  // رحلات وحجز
  { href: "/family-booking",    label: "احجز رحلة",        icon: "🏖️", desc: "رحلات للعائلات والسيدات والشباب مع مراكز معتمدة",  cat: "رحلات وحجز" },
  { href: "/trips",             label: "الرحلات",           icon: "🚢", desc: "استعرض كل الرحلات المتاحة واختر ما يناسبك",         cat: "رحلات وحجز" },
  { href: "/retreats",          label: "باقات خاصة",       icon: "✨", desc: "باقات مميزة وتجارب غوص استثنائية",                  cat: "رحلات وحجز" },
  { href: "/try-diving",        label: "جرّب الغوص",       icon: "🤿", desc: "أول تجربة غوص لك بإشراف مدربين معتمدين",            cat: "رحلات وحجز" },
  // مواقع ومراكز
  { href: "/dive-sites",        label: "مواقع الغوص",      icon: "📍", desc: "أفضل مواقع الغوص في البحر الأحمر وخليج العقبة",     cat: "مواقع ومراكز" },
  { href: "/marketplace",       label: "المتجر",            icon: "🛍️", desc: "معدات ومستلزمات الغوص من مراكز موثوقة",             cat: "مواقع ومراكز" },
  { href: "/my-store",          label: "متجري",             icon: "🏪", desc: "أدر منتجاتك وعروضك في متجرك الخاص",                 cat: "مواقع ومراكز" },
  // تعلم واكتشف
  { href: "/courses",           label: "الدورات",           icon: "🎓", desc: "دورات PADI وSSI وشهادات الغوص المعتمدة",            cat: "تعلم واكتشف" },
  { href: "/guide",             label: "الدليل",            icon: "📖", desc: "دليل شامل لكل ما يحتاجه الغوّاص العربي",            cat: "تعلم واكتشف" },
  { href: "/quiz",              label: "اكتشف نمطك",       icon: "🧩", desc: "اختبر معلوماتك واكتشف نمط غوصك المناسب",           cat: "تعلم واكتشف" },
  { href: "/survey",            label: "استبيان التعلم",   icon: "🧠", desc: "تعرّف على أسلوب تعلّمك وتلقّ توصيات مخصصة",         cat: "تعلم واكتشف" },
  { href: "/weight-calculator", label: "حاسبة الأوزان",    icon: "⚖️", desc: "احسب الوزن المناسب لحزامك بدقة",                   cat: "تعلم واكتشف" },
  { href: "/trends",            label: "الصيحات والأمان",  icon: "🛡️", desc: "أحدث توجهات الغوص ونصائح السلامة",                 cat: "تعلم واكتشف" },
  { href: "/temperatures",      label: "حرارة المياه",     icon: "🌡️", desc: "درجات حرارة المياه في مواقع الغوص العربية",          cat: "تعلم واكتشف" },
  // المجتمع
  { href: "/community",         label: "المجتمع",           icon: "💬", desc: "شارك تجاربك وصورك مع آلاف الغوّاصين العرب",         cat: "المجتمع" },
  { href: "/communities",       label: "المجتمعات",         icon: "🌐", desc: "مجتمعات متخصصة حسب الاهتمام والمنطقة",              cat: "المجتمع" },
  { href: "/stories",           label: "القصص",             icon: "📝", desc: "قصص ملهمة من رحلات الغوّاصين العرب",                cat: "المجتمع" },
  { href: "/members",           label: "الأعضاء",           icon: "👥", desc: "تعرف على أعضاء مجتمع ArabDiving",                   cat: "المجتمع" },
  { href: "/messages",          label: "الرسائل",           icon: "✉️", desc: "راسل الغوّاصين والمراكز مباشرةً",                   cat: "المجتمع" },
  // للفئات
  { href: "/women",             label: "النساء",            icon: "🧕", desc: "رحلات نسائية بالكامل مع طاقم مدربات",               cat: "للفئات" },
  { href: "/youth",             label: "الشباب",            icon: "⚡", desc: "برامج وتحديات مصممة للشباب العربي",                 cat: "للفئات" },
  { href: "/kids",              label: "الأطفال",           icon: "👧", desc: "غوص آمن ومسلٍّ للأطفال من 8 سنوات",               cat: "للفئات" },
  // شخصي
  { href: "/logbook",           label: "اللوج بوك",        icon: "📒", desc: "سجّل غطساتك وتتبع تقدمك تلقائياً",                 cat: "شخصي" },
  { href: "/profile",           label: "ملفي الشخصي",      icon: "👤", desc: "أدر حسابك وإنجازاتك ومعداتك",                      cat: "شخصي" },
];

const CAT_COLORS: Record<string, string> = {
  "رحلات وحجز":   "#0891b2",
  "مواقع ومراكز": "#2e75b6",
  "تعلم واكتشف":  "#c9952a",
  "المجتمع":       "#7c3aed",
  "للفئات":        "#db2777",
  "شخصي":         "#0d2c54",
};

/* ─── بطاقة صفحة ─────────────────────────────────────── */
function PageCard({ href, icon, label, desc, color }: {
  href: string; icon: string; label: string; desc?: string; color: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block", textDecoration: "none",
        background: hov ? "#0d2c54" : "white",
        borderRadius: "16px", padding: "22px 16px", textAlign: "center",
        border: "1px solid", borderColor: hov ? "#0d2c54" : "#e2e8f0",
        boxShadow: hov ? "0 10px 30px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        transform: hov ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{ fontSize: "30px", marginBottom: "10px", lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: hov ? "white" : "#0d2c54", marginBottom: "6px" }}>
        {label}
      </div>
      {desc && (
        <div style={{ fontSize: "11px", color: hov ? "rgba(255,255,255,0.65)" : "#64748b", lineHeight: 1.6 }}>
          {desc}
        </div>
      )}
      <div style={{ marginTop: "10px", fontSize: "12px", fontWeight: 700, color: hov ? color : color }}>
        اذهب →
      </div>
    </Link>
  );
}

/* ─── المكوّن الرئيسي ─────────────────────────────────── */
export default function HomePageCards() {
  const [hidden,     setHidden]     = useState<string[]>([]);
  const [adminCards, setAdminCards] = useState<any[] | null>(null);
  const [loaded,     setLoaded]     = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        setHidden(d.settings?.hiddenPages || []);
        const ac = d.settings?.homeCards;
        if (ac && ac.length > 0) setAdminCards(ac);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  /* ── إن ضبط الأدمن بطاقات خاصة ── */
  if (adminCards) {
    const visible = adminCards.filter((c: any) => !hidden.includes(c.href));
    return (
      <section style={{ padding: "70px 20px", background: "#f1f5fb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeader />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "14px" }}>
            {visible.map((c: any, i: number) => (
              <PageCard key={i} href={c.href} icon={c.icon} label={c.label} desc={c.desc} color="#2e75b6" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── الافتراضي: كل الصفحات بتصنيفات ── */
  const cats = Array.from(new Set(ALL_PAGES.map((p) => p.cat)));
  return (
    <section style={{ padding: "80px 20px", background: "#f1f5fb" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeader />
        {cats.map((cat) => {
          const pages = ALL_PAGES.filter((p) => p.cat === cat && !hidden.includes(p.href));
          if (!pages.length) return null;
          const color = CAT_COLORS[cat] || "#2e75b6";
          return (
            <div key={cat} style={{ marginBottom: "44px" }}>
              {/* Category label */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <div style={{ height: "2px", flex: 1, background: "#e2e8f0" }} />
                <span style={{
                  fontSize: "13px", fontWeight: 700, color,
                  padding: "5px 16px",
                  background: color + "12",
                  borderRadius: "20px",
                  border: "1px solid " + color + "30",
                  whiteSpace: "nowrap",
                }}>
                  {cat}
                </span>
                <div style={{ height: "2px", flex: 1, background: "#e2e8f0" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: "12px" }}>
                {pages.map((p) => (
                  <PageCard key={p.href} href={p.href} icon={p.icon} label={p.label} desc={p.desc} color={color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: "52px" }}>
      <span style={{ display: "inline-block", background: "rgba(13,44,84,0.08)", color: "#0d2c54", padding: "7px 20px", borderRadius: "30px", fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
        استكشف الموقع
      </span>
      <h2 style={{ fontSize: "clamp(26px,4.5vw,38px)", fontWeight: 900, color: "#0d2c54", marginBottom: "12px" }}>
        كل ما تحتاجه في مكان واحد
      </h2>
      <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
        أكبر منصة عربية للغوص — رحلات، تعلم، مجتمع، وأدوات في متناول يدك
      </p>
    </div>
  );
}
