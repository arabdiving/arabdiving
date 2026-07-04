"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* خريطة الموقع — كل صفحات المنصة كنقاط على ساحل البحر الأحمر (يمينًا ويسارًا).
   المرجع: design_handoff/ArabDiving Map Home.dc.html + MAP_HOME_HANDOFF.md
   الإحداثيات x,y بمقياس الـSVG (360×680) لتقع النقاط على حدود البحر تمامًا.
   embedded=true عند الاستخدام كبلوك داخل الرئيسية (يُخفى الشريط العلوي). */

const MAP_SVG = `<svg width="100%" height="100%" viewBox="0 0 360 680" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#06b6d4" stop-opacity="0.95"/>
          <stop offset="35%"  stop-color="#0891b2" stop-opacity="0.95"/>
          <stop offset="70%"  stop-color="#0e4a7a" stop-opacity="1"/>
          <stop offset="100%" stop-color="#0d2c54" stop-opacity="1"/>
        </linearGradient>
        <linearGradient id="seaGradAqaba" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stop-color="#06b6d4" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.7"/>
        </linearGradient>
        <linearGradient id="seaGradSuez" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stop-color="#0891b2" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.65"/>
        </linearGradient>
        <linearGradient id="sinaiFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#1a3a2a" stop-opacity="1"/>
          <stop offset="100%" stop-color="#0f2218" stop-opacity="1"/>
        </linearGradient>
        <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#0e2818" stop-opacity="1"/>
          <stop offset="100%" stop-color="#152e1e" stop-opacity="1"/>
        </linearGradient>
        <filter id="seaGlow">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="landGlow">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>

      <!-- Background glow -->
      <ellipse cx="180" cy="400" rx="130" ry="280" fill="#0891b2" opacity="0.07" filter="url(#softGlow)"/>
      <ellipse cx="100" cy="120" rx="45" ry="80"  fill="#06b6d4"  opacity="0.06" filter="url(#softGlow)"/>
      <ellipse cx="260" cy="120" rx="45" ry="80"  fill="#06b6d4"  opacity="0.06" filter="url(#softGlow)"/>

      <!-- ═══════════════════════════════════════
           GULF OF SUEZ — خليج السويس (left arm)
      ═══════════════════════════════════════ -->
      <path d="
        M 180 230
        C 168 215, 148 200, 132 182
        C 116 164, 104 145, 96 125
        C 90 110, 88 95, 90 80
        C 92 68, 96 58, 100 50
        C 104 58, 108 68, 110 80
        C 112 95, 112 110, 116 126
        C 120 142, 128 158, 140 172
        C 152 186, 164 200, 172 218
        Z
      " fill="url(#seaGradSuez)" stroke="rgba(56,189,248,0.45)" stroke-width="1.2" filter="url(#seaGlow)"/>

      <!-- ═══════════════════════════════════════
           GULF OF AQABA — خليج العقبة (right arm)
      ═══════════════════════════════════════ -->
      <path d="
        M 180 230
        C 192 215, 212 200, 228 182
        C 244 164, 256 145, 264 125
        C 270 110, 272 95, 270 80
        C 268 68, 264 55, 260 45
        C 256 55, 252 68, 250 80
        C 248 95, 248 110, 244 126
        C 240 142, 232 158, 220 172
        C 208 186, 196 200, 188 218
        Z
      " fill="url(#seaGradAqaba)" stroke="rgba(34,211,238,0.45)" stroke-width="1.2" filter="url(#seaGlow)"/>

      <!-- ═══════════════════════════════════════
           SINAI PENINSULA — شبه جزيرة سيناء
      ═══════════════════════════════════════ -->
      <path d="
        M 110 78
        C 120 72, 140 65, 152 60
        C 162 56, 170 52, 180 48
        C 190 52, 198 56, 208 60
        C 220 65, 240 72, 250 78
        C 248 95, 244 115, 238 132
        C 232 150, 220 165, 210 178
        C 200 190, 190 210, 180 228
        C 170 210, 160 190, 150 178
        C 140 165, 128 150, 122 132
        C 116 115, 112 95, 110 78
        Z
      " fill="url(#sinaiFill)" stroke="rgba(201,149,42,0.25)" stroke-width="1"/>

      <!-- Sinai label -->
      <text x="180" y="155" font-size="7.5" fill="rgba(201,149,42,0.55)" text-anchor="middle" font-family="Cairo" font-weight="700">سيناء</text>

      <!-- ═══════════════════════════════════════
           MAIN RED SEA BODY
      ═══════════════════════════════════════ -->
      <path d="
        M 180 232
        C 168 226, 152 222, 142 225
        C 130 228, 118 238, 110 252
        C 102 266, 98 282, 96 300
        C 94 318, 96 336, 100 354
        C 104 372, 110 388, 114 406
        C 118 424, 118 442, 116 460
        C 114 476, 108 490, 104 505
        C 110 518, 124 530, 140 540
        C 154 550, 168 555, 180 558
        C 192 555, 206 550, 220 540
        C 236 530, 250 518, 256 505
        C 252 490, 246 476, 244 460
        C 242 442, 242 424, 246 406
        C 250 388, 256 372, 260 354
        C 264 336, 266 318, 264 300
        C 262 282, 258 266, 250 252
        C 242 238, 230 228, 218 225
        C 208 222, 192 226, 180 232
        Z
      " fill="url(#seaGrad)" stroke="rgba(8,145,178,0.5)" stroke-width="1.5" filter="url(#seaGlow)"/>

      <!-- Inner shimmer lines (main body) -->
      <path d="M 165 270 C 168 290, 166 315, 170 338" stroke="rgba(255,255,255,0.07)" stroke-width="9" stroke-linecap="round"/>
      <path d="M 195 310 C 198 335, 196 360, 192 385" stroke="rgba(255,255,255,0.05)" stroke-width="7" stroke-linecap="round"/>
      <path d="M 170 400 C 174 425, 172 448, 168 470" stroke="rgba(255,255,255,0.06)" stroke-width="8" stroke-linecap="round"/>

      <!-- Suez canal hint -->
      <line x1="100" y1="50" x2="100" y2="28" stroke="rgba(201,149,42,0.4)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="100" y="22" font-size="6.5" fill="rgba(201,149,42,0.5)" text-anchor="middle" font-family="Cairo">قناة السويس</text>

      <!-- ═══════════════════════════════════════
           LABELS
      ═══════════════════════════════════════ -->
      <!-- Gulf of Suez label -->
      <text x="100" y="145" font-size="7" fill="rgba(56,189,248,0.65)" text-anchor="middle" font-family="Cairo" font-weight="700" transform="rotate(-68 100 145)">خليج السويس</text>

      <!-- Gulf of Aqaba label -->
      <text x="260" y="145" font-size="7" fill="rgba(34,211,238,0.65)" text-anchor="middle" font-family="Cairo" font-weight="700" transform="rotate(68 260 145)">خليج العقبة</text>

      <!-- Red Sea main label -->
      <text x="180" y="390" font-size="9" fill="rgba(255,255,255,0.22)" text-anchor="middle" font-family="Cairo" font-weight="600">البحر الأحمر</text>

      <!-- Bab el-Mandeb -->
      <text x="180" y="545" font-size="7.5" fill="rgba(255,255,255,0.2)" text-anchor="middle" font-family="Cairo">باب المندب</text>

      <!-- depth contour lines -->
      <ellipse cx="180" cy="340" rx="38" ry="62" fill="none" stroke="rgba(8,145,178,0.12)" stroke-width="1" stroke-dasharray="4 6"/>
      <ellipse cx="180" cy="430" rx="34" ry="52" fill="none" stroke="rgba(8,145,178,0.1)"  stroke-width="1" stroke-dasharray="4 6"/>

      <!-- ═══════════════════════════════════════
           COMPASS ROSE
      ═══════════════════════════════════════ -->
      <g transform="translate(180,630)">
        <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <circle cx="0" cy="0" r="3.5" fill="rgba(201,149,42,0.85)"/>
        <path d="M 0 -17 L 3.5 -7 L 0 -10 L -3.5 -7 Z" fill="rgba(255,255,255,0.75)"/>
        <path d="M 0 17  L 3.5 7  L 0 10  L -3.5 7  Z" fill="rgba(255,255,255,0.3)"/>
        <path d="M -17 0 L -7 -3.5 L -10 0 L -7 3.5 Z" fill="rgba(255,255,255,0.3)"/>
        <path d="M 17 0  L 7 -3.5  L 10 0  L 7 3.5  Z" fill="rgba(255,255,255,0.3)"/>
        <text x="0" y="-26" font-size="7.5" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="Cairo">N</text>
        <text x="0" y="32"  font-size="7"   fill="rgba(255,255,255,0.3)" text-anchor="middle" font-family="Cairo">S</text>
        <text x="-28" y="4" font-size="7"   fill="rgba(255,255,255,0.3)" text-anchor="middle" font-family="Cairo">W</text>
        <text x="28"  y="4" font-size="7"   fill="rgba(255,255,255,0.3)" text-anchor="middle" font-family="Cairo">E</text>
      </g>

      <!-- Nautical mile scale -->
      <g transform="translate(130, 610)">
        <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="50" y1="-3" x2="50" y2="3" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="100" y1="-4" x2="100" y2="4" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <text x="0"   y="-8" font-size="5.5" fill="rgba(255,255,255,0.3)" text-anchor="middle" font-family="Cairo">0</text>
        <text x="50"  y="-8" font-size="5.5" fill="rgba(255,255,255,0.3)" text-anchor="middle" font-family="Cairo">250</text>
        <text x="100" y="-8" font-size="5.5" fill="rgba(255,255,255,0.3)" text-anchor="middle" font-family="Cairo">500km</text>
      </g>
    </svg>`;

type Pt = {
  key: string; side: "right" | "left"; x: number; y: number; color: string; icon: string;
  label: string; title: string; subtitle: string; desc: string; features: string[]; cta: string; href: string;
};

// x,y على ساحل البحر (يمين = الساحل الشرقي، يسار = الساحل الغربي)
const DATA: Pt[] = [
  { key: "booking",  side: "right", x: 250, y: 108, color: "#c9952a", icon: "🗓️", label: "احجز رحلة", title: "احجز رحلة غوص", subtitle: "65+ مركز معتمد", desc: "ابحث عن مركز غوص معتمد وتواصل مباشرة بدون دفع مسبق.", features: ["فلاتر بحث متقدمة", "تواصل عبر واتساب", "مراكز بطاقم نسائي"], cta: "احجز الآن", href: "/family-booking" },
  { key: "sites",    side: "right", x: 258, y: 198, color: "#06b6d4", icon: "🪸", label: "مواقع الغوص", title: "مواقع الغوص", subtitle: "180+ موقع موثّق", desc: "دليل شامل لأجمل مواقع الغوص — من البحيرة الزرقاء إلى ثيستلجورم.", features: ["الحرارة الموسمية", "مستوى الصعوبة", "خرائط تفصيلية"], cta: "استكشف", href: "/dive-sites" },
  { key: "courses",  side: "right", x: 266, y: 272, color: "#f5c218", icon: "🎓", label: "الدورات", title: "الدورات والشهادات", subtitle: "PADI · SSI · CMAS بالعربي", desc: "تعلّم الغوص من الصفر مع معلمين معتمدين.", features: ["شهادات دولية", "دورات بالعربية", "للمبتدئين والمحترفين"], cta: "ابدأ التعلم", href: "/courses" },
  { key: "women",    side: "right", x: 264, y: 332, color: "#a855f7", icon: "🧕", label: "السيدات", title: "قسم السيدات", subtitle: "تجربة آمنة للمرأة", desc: "طاقم نسائي بالكامل، مرافق مستقلة، ومعدات معقّمة.", features: ["طاقم نسائي 100%", "مرافق مستقلة", "مناسب للمحجبات"], cta: "اكتشفي", href: "/women" },
  { key: "youth",    side: "right", x: 254, y: 402, color: "#22d3ee", icon: "⚡", label: "الشباب", title: "برامج الشباب", subtitle: "مغامرات ومسابقات", desc: "برامج غوص ومغامرة مصمّمة لطاقة الشباب وحبّ الاكتشاف.", features: ["تحديات ومسابقات", "مجموعات شبابية", "أسعار خاصة"], cta: "انضم", href: "/youth" },
  { key: "kids",     side: "right", x: 246, y: 462, color: "#34d399", icon: "👧", label: "الأطفال", title: "غوص الأطفال", subtitle: "برامج آمنة للصغار", desc: "أنشطة سنوركل وغوص للأطفال بإشراف مدرّبين متخصصين.", features: ["إشراف متخصص", "معدات بمقاسات الأطفال", "لعبة تعليمية"], cta: "اكتشف", href: "/kids" },
  { key: "trips",    side: "right", x: 228, y: 520, color: "#38bdf8", icon: "🚢", label: "الرحلات", title: "جميع الرحلات", subtitle: "رحلات جماعية وسفاري", desc: "تصفّح كل الرحلات المتاحة — يومية، سفاري، ونهاية الأسبوع.", features: ["رحلات سفاري", "برامج متعددة الأيام", "مجموعات عربية"], cta: "تصفّح", href: "/trips" },

  { key: "community",side: "left",  x: 106, y: 112, color: "#e879f9", icon: "👥", label: "المجتمع", title: "مجتمع الغوّاصين", subtitle: "12,000+ عضو من 18 دولة", desc: "شارك تجاربك، تابع غوّاصين آخرين، واكتشف أجمل اللحظات.", features: ["منشورات وصور وفيديو", "قصص يومية", "تابع ومتابعين"], cta: "انضم", href: "/community" },
  { key: "market",   side: "left",  x: 100, y: 200, color: "#34d399", icon: "🛒", label: "المتجر", title: "سوق المعدات", subtitle: "127+ منتج", desc: "معدات من مراكز معتمدة — تواصل مباشر مع البائع.", features: ["Cressi · Mares · ScubaPro", "بدلات للسيدات", "توصيل للخليج"], cta: "تصفّح المتجر", href: "/marketplace" },
  { key: "centers",  side: "left",  x: 96,  y: 275, color: "#f97316", icon: "🏢", label: "مراكز الغوص", title: "مراكز الغوص", subtitle: "65 مركز معتمد", desc: "دليل المراكز المعتمدة مع تقييمات حقيقية.", features: ["تقييمات حقيقية", "تصنيف ثلاثي", "المرافق والخدمات"], cta: "استعرض", href: "/family-booking" },
  { key: "guide",    side: "left",  x: 100, y: 335, color: "#22d3ee", icon: "📖", label: "الدليل", title: "دليل الغوص", subtitle: "كل ما تحتاجه للغوص", desc: "معلومات طبية، نصائح للمبتدئين، دليل الأسماك والشعاب.", features: ["نصائح السلامة", "دليل الأسماك", "التقويم الموسمي"], cta: "اقرأ الدليل", href: "/guide" },
  { key: "stories",  side: "left",  x: 110, y: 405, color: "#f5c218", icon: "📝", label: "القصص", title: "قصص الغوّاصين", subtitle: "تجارب حقيقية ومسابقات", desc: "اقرأ قصص أعضاء المجتمع وشارك قصتك للفوز بالمسابقة.", features: ["قصص ملهمة", "مسابقة شهرية", "شارك تجربتك"], cta: "اقرأ القصص", href: "/stories" },
  { key: "members",  side: "left",  x: 114, y: 465, color: "#06b6d4", icon: "🤝", label: "الأعضاء", title: "دليل الأعضاء", subtitle: "تعرّف على الغوّاصين", desc: "تصفّح الأعضاء، أضِف أصدقاء، وتواصل مع غوّاصين قريبين منك.", features: ["ملفات الأعضاء", "أضف أصدقاء", "رسائل خاصة"], cta: "تصفّح", href: "/members" },
  { key: "retreats", side: "left",  x: 134, y: 522, color: "#c9952a", icon: "✨", label: "الباقات الفاخرة", title: "الباقات الخاصة", subtitle: "تجارب غوص فاخرة", desc: "باقات إقامة وغوص فاخرة على البحر الأحمر لتجربة استثنائية.", features: ["منتجعات مختارة", "خدمة راقية", "تجارب حصرية"], cta: "اكتشف", href: "/retreats" },
];

const BUBBLES = [
  { l: "12%", b: "18%", s: 8, d: 0 }, { l: "24%", b: "12%", s: 5, d: 1 }, { l: "40%", b: "9%", s: 10, d: 2 },
  { l: "58%", b: "14%", s: 6, d: 0.7 }, { l: "72%", b: "22%", s: 7, d: 1.5 }, { l: "85%", b: "16%", s: 5, d: 2.4 }, { l: "48%", b: "30%", s: 6, d: 1.1 },
];

export default function RedSeaMap({ embedded = false }: { embedded?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const f = () => setMobile(window.innerWidth < 860);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const active = DATA.find((d) => d.key === hovered) || null;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "radial-gradient(ellipse at 50% 30%, #0a2240 0%, #040d1a 65%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px", opacity: 0.04, pointerEvents: "none" }} />
      {BUBBLES.map((b, i) => (
        <span key={i} style={{ position: "absolute", left: b.l, bottom: b.b, width: b.s, height: b.s, borderRadius: "50%", background: "rgba(6,182,212,0.35)", animation: `mapBubble ${4 + b.d}s ${b.d}s ease-in infinite`, pointerEvents: "none" }} />
      ))}

      {!embedded && (
        <div style={{ position: "relative", zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 26px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/register" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#fff", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", boxShadow: "0 4px 14px rgba(201,149,42,0.4)" }}>انضم الآن</Link>
            <Link href="/" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, fontSize: "14px" }}>الصفحة الكلاسيكية</Link>
          </div>
          <div style={{ textAlign: "end" }}>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "20px" }}>ArabDiving</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>خريطة الموقع</div>
          </div>
        </div>
      )}

      {embedded && (
        <div style={{ position: "relative", zIndex: 20, textAlign: "center", padding: "34px 20px 0" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900 }}>خريطة <span className="hero-grad">الموقع</span></h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginTop: "8px" }}>كل صفحات المنصة حول البحر — مرّر على أي نقطة واضغط للانتقال</p>
        </div>
      )}

      {mobile ? (
        <div style={{ position: "relative", zIndex: 10, padding: "14px 18px 60px", display: "grid", gap: "12px" }}>
          {!embedded && <h1 style={{ color: "#fff", textAlign: "center", fontSize: "25px", fontWeight: 900, margin: "8px 0 10px" }}>خريطة <span className="hero-grad">الموقع</span></h1>}
          {DATA.map((d) => (
            <Link key={d.key} href={d.href} style={{ display: "flex", gap: "14px", alignItems: "center", background: "rgba(6,14,36,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "14px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: d.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "23px", flexShrink: 0 }}>{d.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "15.5px" }}>{d.title}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>{d.subtitle}</div>
              </div>
              <span style={{ color: d.color, fontSize: "20px" }}>←</span>
            </Link>
          ))}
        </div>
      ) : (
        <>
          {/* حاوية الخريطة — النقاط أبناؤها وتتموضع بإحداثيات الساحل */}
          <div style={{ position: "absolute", top: "54%", left: "50%", transform: "translate(-50%,-50%)", width: "360px", maxWidth: "82vw", zIndex: 5 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "360 / 680" }}>
              <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 40px rgba(8,145,178,0.3))" }} dangerouslySetInnerHTML={{ __html: MAP_SVG }} />

              {DATA.map((d) => (
                <div key={d.key}
                  onMouseEnter={() => setHovered(d.key)} onMouseLeave={() => setHovered(null)} onClick={() => router.push(d.href)}
                  style={{ position: "absolute", left: `${(d.x / 360) * 100}%`, top: `${(d.y / 680) * 100}%`, transform: "translate(-50%,-50%)", width: "13px", height: "13px", zIndex: 15, cursor: "pointer" }}>
                  <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: d.color, color: d.color, animation: "dotGlow 2s infinite" }} />
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${d.color}`, animation: "pulseRing 2s infinite" }} />
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${d.color}`, animation: "pulseRing2 2s 0.4s infinite" }} />
                  <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", whiteSpace: "nowrap", color: hovered === d.key ? "#fff" : "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: "13.5px", textShadow: "0 2px 8px rgba(0,0,0,0.7)", ...(d.side === "right" ? { left: "20px" } : { right: "20px" }) }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {active ? (
            <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [active.side === "right" ? "right" : "left"]: "4vw", width: "300px", maxWidth: "90vw", zIndex: 30, background: "rgba(6,14,36,0.97)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)", animation: "fadeInCard 0.22s ease", pointerEvents: "none" }}>
              <div style={{ height: "4px", background: active.color }} />
              <div style={{ padding: "22px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "13px", background: active.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{active.icon}</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>{active.title}</div>
                    <div style={{ color: active.color, fontSize: "12.5px", fontWeight: 700 }}>{active.subtitle}</div>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "14px" }}>{active.desc}</p>
                <div style={{ display: "grid", gap: "7px", marginBottom: "16px" }}>
                  {active.features.map((f, i) => (<div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", color: "rgba(255,255,255,0.8)", fontSize: "13px" }}><span style={{ color: active.color }}>✦</span>{f}</div>))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>اضغط للانتقال</span>
                  <span style={{ background: active.color, color: "#04121f", fontWeight: 800, fontSize: "13.5px", padding: "8px 16px", borderRadius: "10px" }}>{active.cta} ←</span>
                </div>
              </div>
            </div>
          ) : (!embedded && (
            <div style={{ position: "absolute", bottom: "4%", left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 10, width: "90%" }}>
              <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: "8px" }}>خريطة <span className="hero-grad">الموقع</span></h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>مرّر على أي نقطة حول البحر لاستكشاف المنصة</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
