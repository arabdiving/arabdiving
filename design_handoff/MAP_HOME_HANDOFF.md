# ArabDiving — Map Homepage Handoff
## وثيقة التسليم لصفحة الخريطة التفاعلية

---

## ما تم بناؤه

صفحة رئيسية بديلة لمنصة ArabDiving — بدلاً من الصفحة الكلاسيكية، الشاشة الكاملة عبارة عن **خريطة تفاعلية للبحر الأحمر** تعمل كـ navigation hub للمنصة.

**الملف الحالي:** `ArabDiving Map Home.dc.html`
**المرجع البصري:** افتح الملف في المتصفح مباشرة

---

## المفهوم التصميمي

```
[Navbar رفيع]
[شاشة كاملة — خريطة البحر الأحمر]
  ├── خليج السويس (يسار أعلى)
  ├── شبه جزيرة سيناء (وسط أعلى)
  ├── خليج العقبة (يمين أعلى)
  ├── جسم البحر الأحمر (يمتد للأسفل)
  ├── نقاط glowing على اليمين → روابط الصفحات
  ├── نقاط glowing على اليسار → روابط الصفحات
  └── بطاقة شرح تظهر عند hover على أي نقطة
```

---

## الخريطة SVG — المواصفات الدقيقة

### الأبعاد
- SVG: `360 × 680` viewBox
- مركزها: `position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)`

### الأجزاء الجغرافية

**1. خليج السويس (الذراع اليسرى)**
- لون: gradient من `#38bdf8` إلى `#0891b2`
- يتفرع من النقطة `(180, 230)` نحو اليسار ويصعد حتى `(100, 50)`
- ينتهي بخط منقط رأسي يشير إلى "قناة السويس"

**2. خليج العقبة (الذراع اليمنى)**
- لون: gradient من `#22d3ee` إلى `#06b6d4`
- يتفرع من `(180, 230)` نحو اليمين ويصعد حتى `(260, 45)`
- أضيق وأعمق لونياً من خليج السويس

**3. شبه جزيرة سيناء**
- مثلث بين الخليجين
- لون: `#1a3a2a` (لون أرضي داكن مخضر)
- حدود: `rgba(201,149,42,0.25)` — ذهبي خافت
- نص "سيناء" في المنتصف: `rgba(201,149,42,0.55)`

**4. جسم البحر الأحمر الرئيسي**
- يبدأ من `(180, 232)` وينزل حتى `(180, 558)`
- عرض تقريبي: 70–160px
- gradient رأسي: cyan → navy blue → dark navy

**5. Compass Rose**
- موضعها: `translate(180, 630)`
- نقطة مركزية ذهبية + 4 اتجاهات

---

## الخلفية والجو البصري

```css
/* خلفية البحر العميق */
background: radial-gradient(ellipse at 50% 30%, #0a2240 0%, #040d1a 65%);

/* طبقة الحركة المائية */
background: linear-gradient(135deg, transparent 0%, rgba(8,145,178,0.04) 30%, transparent 50%);
animation: waveFlow 8s linear infinite;

/* شبكة الخريطة البحرية */
background-image: linear-gradient(rgba(100,180,255,1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100,180,255,1) 1px, transparent 1px);
background-size: 60px 60px;
opacity: 0.04;

/* فقاعات عائمة — 7 عناصر */
@keyframes floatBubble {
  0%   { transform: translateY(0)     scale(1);   opacity: 0.4; }
  50%  { transform: translateY(-30px) scale(1.1); opacity: 0.15; }
  100% { transform: translateY(-65px) scale(0.8); opacity: 0; }
}
```

---

## نقاط الغوص (Site Dots)

### المواضع الحالية
| النقطة | الجانب | الموضع العمودي | اللون |
|---|---|---|---|
| احجز رحلة | يمين | 24% | `#c9952a` (ذهبي) |
| مواقع الغوص | يمين | 40% | `#06b6d4` |
| الدورات | يمين | 58% | `#f5c218` |
| للسيدات | يمين | 74% | `#a855f7` |
| المجتمع | يسار | 30% | `#22d3ee` |
| المتجر | يسار | 46% | `#34d399` |
| مراكز الغوص | يسار | 60% | `#f97316` |
| الدليل | يسار | 75% | `#e879f9` |

### X positions
- اليمين: `left: 72vw`
- اليسار: `left: 28vw`

### بنية كل نقطة (HTML)
```html
<div class="site-dot right-side" style="position:absolute; top:24%; left:72vw; transform:translate(-50%,-50%)">
  <div class="core" style="width:14px; height:14px; border-radius:50%; background:#c9952a; animation:dotGlow 2s infinite"></div>
  <div class="ring1" style="animation:pulseRing 2s infinite"></div>  <!-- ring يتمدد ويختفي -->
  <div class="ring2" style="animation:pulseRing2 2s 0.4s infinite"></div>
  <span class="label" style="position:absolute; right:calc(100% + 14px); white-space:nowrap">احجز رحلة</span>
</div>
```

### animations
```css
@keyframes pulseRing {
  0%  { transform: scale(1);   opacity: 0.8; }
  70% { transform: scale(2.4); opacity: 0; }
}
@keyframes pulseRing2 {
  0%  { transform: scale(1);   opacity: 0.5; }
  70% { transform: scale(3.2); opacity: 0; }
}
@keyframes dotGlow {
  0%,100% { box-shadow: 0 0 8px 2px currentColor; }
  50%      { box-shadow: 0 0 18px 6px currentColor; }
}
```

---

## بطاقة الشرح (Info Card)

### التفعيل
- تظهر عند `onMouseEnter` على أي نقطة
- تختفي عند `onMouseLeave`
- animation: `fadeInCard 0.22s ease`

### الموضع
- تظهر على نفس جانب النقطة مع offset افقي
- يمين: `left: calc(72vw + distance)`
- يسار: `left: calc(28vw - 300px - distance)`
- تُضبط رأسياً لتبقى داخل الشاشة

### المحتوى لكل نقطة
```js
{
  booking: {
    icon: '🗓️', color: '#c9952a', colorBg: 'rgba(201,149,42,0.2)',
    title: 'احجز رحلة غوص',
    subtitle: '65+ مركز معتمد في البحر الأحمر',
    desc: 'ابحث عن مركز غوص معتمد وتواصل مباشرة بدون دفع مسبق — مراكز للعائلات والسيدات والمبتدئين.',
    features: ['فلاتر بحث متقدمة', 'تواصل مباشر عبر واتساب', 'مراكز بطاقم نسائي 100%'],
    cta: 'احجز الآن',
    page: 'ArabDiving Booking Page.dc.html'
  },
  sites: {
    icon: '🪸', color: '#06b6d4',
    title: 'مواقع الغوص',
    subtitle: '180+ موقع موثّق في البحر الأحمر',
    desc: 'دليل شامل لأجمل مواقع الغوص — من البحيرة الزرقاء في دهب إلى حطام ثيستلجورم.',
    features: ['درجات الحرارة الموسمية', 'مستوى الصعوبة لكل موقع', 'خرائط تفصيلية'],
    cta: 'استكشف المواقع'
  },
  courses: {
    icon: '🎓', color: '#f5c218',
    title: 'الدورات والشهادات',
    subtitle: 'PADI · SSI · CMAS بالعربي',
    desc: 'تعلّم الغوص من الصفر مع معلمين معتمدين.',
    features: ['شهادات معترف بها دولياً', 'دورات باللغة العربية', 'للمبتدئين والمحترفين'],
    cta: 'ابدأ التعلم'
  },
  women: {
    icon: '🧕', color: '#a855f7',
    title: 'قسم السيدات',
    subtitle: 'تجربة غوص آمنة ومريحة للمرأة',
    desc: 'طاقم نسائي بالكامل، مرافق مستقلة، ومعدات معقّمة.',
    features: ['طاقم نسائي 100%', 'مرافق مستقلة', 'مناسب للمحجبات'],
    cta: 'اكتشفي'
  },
  community: {
    icon: '👥', color: '#22d3ee',
    title: 'مجتمع الغوّاصين',
    subtitle: '12,000+ عضو من 18 دولة عربية',
    desc: 'شارك تجاربك، تابع غوّاصين آخرين، واكتشف أجمل اللحظات.',
    features: ['منشورات وصور وفيديوهات', 'قصص Stories يومية', 'تابع واحصل على متابعين'],
    cta: 'انضم للمجتمع'
  },
  market: {
    icon: '🛒', color: '#34d399',
    title: 'سوق المعدات',
    subtitle: '127+ منتج — جديد ومستعمل',
    desc: 'تواصل مباشر مع البائع بدون عمولة.',
    features: ['Cressi · Mares · ScubaPro', 'بدلات للسيدات', 'توصيل للخليج'],
    cta: 'تصفّح المتجر'
  },
  centers: {
    icon: '🏢', color: '#f97316',
    title: 'مراكز الغوص',
    subtitle: '65 مركز · بلاتيني/ذهبي/فضي',
    desc: 'دليل المراكز المعتمدة مع تقييمات حقيقية.',
    features: ['تقييمات حقيقية', 'نظام تصنيف ثلاثي', 'عرض المرافق والخدمات'],
    cta: 'استعرض المراكز'
  },
  guide: {
    icon: '📖', color: '#e879f9',
    title: 'دليل الغوص',
    subtitle: 'كل ما تحتاجه قبل وأثناء الغوص',
    desc: 'معلومات طبية، نصائح للمبتدئين، دليل الأسماك والشعاب.',
    features: ['نصائح السلامة', 'دليل الأسماك والشعاب', 'التقويم الموسمي'],
    cta: 'اقرأ الدليل'
  }
}
```

### تصميم البطاقة
```
┌─────────────────────────────┐  ← border-radius: 20px
│▓▓▓▓ color bar 4px ▓▓▓▓▓▓▓▓│  ← شريط لوني أعلى البطاقة
│                             │
│  [icon 46px]  Title         │
│               subtitle      │
│                             │
│  وصف النص المبسط...         │
│                             │
│  ✦ ميزة 1                   │
│  ✦ ميزة 2                   │
│  ✦ ميزة 3                   │
│                             │
│  اضغط للانتقال  [CTA زر] ← │
└─────────────────────────────┘

background: rgba(6,14,36,0.97)
backdrop-filter: blur(24px)
box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)
width: 300px
```

---

## State المطلوب

```tsx
const [hovered, setHovered] = useState<string | null>(null)

// عند hover
onMouseEnter={() => setHovered('booking')}
onMouseLeave={() => setHovered(null)}

// عند click → navigation
onClick={() => router.push(sites[key].page)}

// الـ info card تظهر فقط عند وجود hovered
// العنوان السفلي يظهر فقط عند غياب hovered
```

---

## ما يمكن تحسينه في المرحلة القادمة

1. **إضافة نقاط جغرافية حقيقية** على الخريطة (دهب، شرم، الغردقة، مرسى علم) — نقاط صغيرة بأسماء
2. **خط رابط متحرك** من النقطة إلى البطاقة (animated SVG line)
3. **زوم إلى المنطقة** عند الضغط — scale up على جزء من الخريطة قبل الانتقال
4. **موبايل** — تحويل لـ vertical scroll بدلاً من side dots
5. **particle system** — جسيمات عائمة تحاكي الكائنات البحرية
6. **خريطة Mapbox/Leaflet** حقيقية كبديل للـ SVG المرسوم

---

## ملفات المشروع المرتبطة

| الملف | الصفحة |
|---|---|
| `ArabDiving Map Home.dc.html` | الصفحة الرئيسية (الخريطة) |
| `ArabDiving Home Redesign.dc.html` | الصفحة الرئيسية الكلاسيكية |
| `ArabDiving Booking Page.dc.html` | صفحة الحجز |
| `ArabDiving Community Page.dc.html` | صفحة المجتمع |
| `ArabDiving Marketplace Page.dc.html` | صفحة المتجر |
| `ArabDiving Design System.dc.html` | نظام التصميم والألوان |
| `design_handoff/README.md` | وثيقة التسليم الكاملة للمطور |

---

## كيفية الاستخدام مع Claude Code

أعطِ هذه الوثيقة لكلود آخر مع هذا الطلب:

> "لدي صفحة رئيسية لمنصة ArabDiving مبنية كخريطة تفاعلية للبحر الأحمر.
> اقرأ `MAP_HOME_HANDOFF.md` كاملاً ثم طبّق هذا التصميم في Next.js.
> الملف المرجعي البصري: `ArabDiving Map Home.dc.html` — افتحه في المتصفح أولاً.
> الكودبيس في `arabdiving/frontend/` باستخدام Next.js 16 + Tailwind CSS + RTL."
