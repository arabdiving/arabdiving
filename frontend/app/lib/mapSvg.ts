// مكتبة خريطة الموقع المشتركة — الـSVG + النقاط الافتراضية + قائمة الصفحات.
// تُستخدم في مكوّن الخريطة (RedSeaMap) وفي إدارة الخريطة (/admin/map).

export type MapPoint = {
  n: number; x: number; y: number; label: string; href: string; color: string; icon: string;
  subtitle?: string; desc?: string; features?: string[]; cta?: string;
};

export const MAP_SVG = `<svg width="100%" height="100%" viewBox="0 0 360 680" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// النقاط الافتراضية (14) على ساحل البحر — تُستبدل بما يحفظه الأدمن.
export const DEFAULT_POINTS: MapPoint[] = [
  { n: 1,  x: 250, y: 108, color: "#c9952a", icon: "🗓️", label: "احجز رحلة", href: "/family-booking", subtitle: "65+ مركز معتمد", desc: "ابحث عن مركز غوص معتمد وتواصل مباشرة بدون دفع مسبق.", features: ["فلاتر بحث متقدمة", "تواصل عبر واتساب", "مراكز بطاقم نسائي"], cta: "احجز الآن" },
  { n: 2,  x: 258, y: 198, color: "#06b6d4", icon: "🪸", label: "مواقع الغوص", href: "/dive-sites", subtitle: "180+ موقع موثّق", desc: "دليل شامل لأجمل مواقع الغوص — من البحيرة الزرقاء إلى ثيستلجورم.", features: ["الحرارة الموسمية", "مستوى الصعوبة", "خرائط تفصيلية"], cta: "استكشف" },
  { n: 3,  x: 266, y: 272, color: "#f5c218", icon: "🎓", label: "الدورات", href: "/courses", subtitle: "PADI · SSI · CMAS بالعربي", desc: "تعلّم الغوص من الصفر مع معلمين معتمدين.", features: ["شهادات دولية", "دورات بالعربية", "للمبتدئين والمحترفين"], cta: "ابدأ التعلم" },
  { n: 4,  x: 264, y: 332, color: "#a855f7", icon: "🧕", label: "السيدات", href: "/women", subtitle: "تجربة آمنة للمرأة", desc: "طاقم نسائي بالكامل، مرافق مستقلة، ومعدات معقّمة.", features: ["طاقم نسائي 100%", "مرافق مستقلة", "مناسب للمحجبات"], cta: "اكتشفي" },
  { n: 5,  x: 254, y: 402, color: "#22d3ee", icon: "⚡", label: "الشباب", href: "/youth", subtitle: "مغامرات ومسابقات", desc: "برامج غوص ومغامرة مصمّمة لطاقة الشباب.", features: ["تحديات ومسابقات", "مجموعات شبابية", "أسعار خاصة"], cta: "انضم" },
  { n: 6,  x: 246, y: 462, color: "#34d399", icon: "👧", label: "الأطفال", href: "/kids", subtitle: "برامج آمنة للصغار", desc: "أنشطة سنوركل وغوص للأطفال بإشراف مدرّبين متخصصين.", features: ["إشراف متخصص", "معدات بمقاسات الأطفال", "لعبة تعليمية"], cta: "اكتشف" },
  { n: 7,  x: 228, y: 520, color: "#38bdf8", icon: "🚢", label: "الرحلات", href: "/trips", subtitle: "رحلات جماعية وسفاري", desc: "تصفّح كل الرحلات المتاحة — يومية، سفاري، ونهاية الأسبوع.", features: ["رحلات سفاري", "برامج متعددة الأيام", "مجموعات عربية"], cta: "تصفّح" },
  { n: 8,  x: 106, y: 112, color: "#e879f9", icon: "👥", label: "المجتمع", href: "/community", subtitle: "12,000+ عضو من 18 دولة", desc: "شارك تجاربك، تابع غوّاصين آخرين، واكتشف أجمل اللحظات.", features: ["منشورات وصور وفيديو", "قصص يومية", "تابع ومتابعين"], cta: "انضم" },
  { n: 9,  x: 100, y: 200, color: "#34d399", icon: "🛒", label: "المتجر", href: "/marketplace", subtitle: "127+ منتج", desc: "معدات من مراكز معتمدة — تواصل مباشر مع البائع.", features: ["Cressi · Mares · ScubaPro", "بدلات للسيدات", "توصيل للخليج"], cta: "تصفّح المتجر" },
  { n: 10, x: 96,  y: 275, color: "#f97316", icon: "🏢", label: "مراكز الغوص", href: "/family-booking", subtitle: "65 مركز معتمد", desc: "دليل المراكز المعتمدة مع تقييمات حقيقية.", features: ["تقييمات حقيقية", "تصنيف ثلاثي", "المرافق والخدمات"], cta: "استعرض" },
  { n: 11, x: 100, y: 335, color: "#22d3ee", icon: "📖", label: "الدليل", href: "/guide", subtitle: "كل ما تحتاجه للغوص", desc: "معلومات طبية، نصائح للمبتدئين، دليل الأسماك والشعاب.", features: ["نصائح السلامة", "دليل الأسماك", "التقويم الموسمي"], cta: "اقرأ الدليل" },
  { n: 12, x: 110, y: 405, color: "#f5c218", icon: "📝", label: "القصص", href: "/stories", subtitle: "تجارب حقيقية ومسابقات", desc: "اقرأ قصص أعضاء المجتمع وشارك قصتك للفوز بالمسابقة.", features: ["قصص ملهمة", "مسابقة شهرية", "شارك تجربتك"], cta: "اقرأ القصص" },
  { n: 13, x: 114, y: 465, color: "#06b6d4", icon: "🤝", label: "الأعضاء", href: "/members", subtitle: "تعرّف على الغوّاصين", desc: "تصفّح الأعضاء، أضِف أصدقاء، وتواصل مع غوّاصين قريبين منك.", features: ["ملفات الأعضاء", "أضف أصدقاء", "رسائل خاصة"], cta: "تصفّح" },
  { n: 14, x: 134, y: 522, color: "#c9952a", icon: "✨", label: "الباقات الفاخرة", href: "/retreats", subtitle: "تجارب غوص فاخرة", desc: "باقات إقامة وغوص فاخرة على البحر الأحمر.", features: ["منتجعات مختارة", "خدمة راقية", "تجارب حصرية"], cta: "اكتشف" },
];

// الصفحات المتاحة للربط بأي نقطة (تشمل الاستبيانات والأوزان).
export const PAGE_OPTIONS: { href: string; label: string; icon: string }[] = [
  { href: "/family-booking", label: "احجز رحلة", icon: "🗓️" },
  { href: "/dive-sites", label: "مواقع الغوص", icon: "🪸" },
  { href: "/courses", label: "الدورات والشهادات", icon: "🎓" },
  { href: "/women", label: "قسم السيدات", icon: "🧕" },
  { href: "/youth", label: "الشباب", icon: "⚡" },
  { href: "/kids", label: "الأطفال", icon: "👧" },
  { href: "/trips", label: "الرحلات", icon: "🚢" },
  { href: "/travel", label: "رحلتك: طيران وفنادق", icon: "✈️" },
  { href: "/community", label: "المجتمع", icon: "👥" },
  { href: "/marketplace", label: "المتجر", icon: "🛒" },
  { href: "/guide", label: "الدليل", icon: "📖" },
  { href: "/stories", label: "القصص", icon: "📝" },
  { href: "/members", label: "الأعضاء", icon: "🤝" },
  { href: "/retreats", label: "الباقات الفاخرة", icon: "✨" },
  { href: "/survey", label: "استبيان أسلوب التعلم", icon: "🧠" },
  { href: "/quiz", label: "اكتشف نمطك (DISC)", icon: "🧩" },
  { href: "/training-fit", label: "استبيان صعوبات/التوافق التعلّمي", icon: "🧭" },
  { href: "/weight-calculator", label: "حاسبة الأوزان", icon: "⚖️" },
  { href: "/temperatures", label: "حرارة المياه", icon: "🌡️" },
  { href: "/game", label: "لعبة أبطال البحر", icon: "🎮" },
  { href: "/communities", label: "المجتمعات المتخصصة", icon: "🌐" },
  { href: "/logbook", label: "اللوج بوك الرقمي", icon: "📒" },
  { href: "/sizes", label: "دليل المقاسات", icon: "📏" },
  { href: "/standards", label: "معايير الاعتماد", icon: "🛡️" },
  { href: "/try-diving", label: "جرّب الغوص", icon: "🤿" },
];

export const COLOR_SWATCHES = ["#c9952a", "#06b6d4", "#22d3ee", "#a855f7", "#34d399", "#f97316", "#e879f9", "#f5c218", "#38bdf8", "#ffffff"];
