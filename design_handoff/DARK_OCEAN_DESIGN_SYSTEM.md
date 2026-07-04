# Dark Ocean Design System — ArabDiving
## تعليمات المطور الشاملة للأسلوب المظلم

---

## الفلسفة التصميمية

الأسلوب المظلم مستوحى من **أعماق البحر** — خلفية داكنة تحاكي قاع المحيط، عناصر زجاجية (glass morphism) تعطي إحساساً بالعمق والشفافية، ونقاط ضوئية ملونة تشبه الكائنات البيولومضيئة.

---

## 1. متغيرات الألوان الأساسية

```css
/* globals.css */
:root {
  /* الخلفيات */
  --bg-deep:    #040d1a;   /* الخلفية الرئيسية — أعمق */
  --bg-dark:    #060e24;   /* بديل أفتح قليلاً */
  --bg-nav:     rgba(4, 8, 18, 0.94);  /* الـ navbar */

  /* الزجاج (Glass Morphism) */
  --glass-bg:   rgba(8, 20, 48, 0.78);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-light-bg: rgba(255, 255, 255, 0.07);
  --glass-light-border: rgba(255, 255, 255, 0.10);

  /* النصوص */
  --text-white:  #ffffff;
  --text-muted:  rgba(255, 255, 255, 0.55);
  --text-faint:  rgba(255, 255, 255, 0.35);

  /* الألوان المضيئة */
  --cyan:     #06b6d4;   /* أساسي — مواقع الغوص */
  --cyan-light: #22d3ee;
  --gold:     #c9952a;   /* الذهبي — CTA */
  --gold-light: #e8a830;
  --purple:   #a855f7;   /* بنفسجي — السيدات */
  --purple-light: #c084fc;
  --green:    #34d399;   /* أخضر — المتجر */
  --green-light: #6ee7b7;
  --orange:   #f97316;   /* برتقالي — الحجز */
  --pink:     #e879f9;   /* وردي — الدليل */
  --whatsapp: #25D366;
}
```

---

## 2. Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'deep':    '#040d1a',
        'dark':    '#060e24',
        'navy':    '#0d2c54',
        'cyan':    '#06b6d4',
        'gold':    '#c9952a',
        'purple':  '#a855f7',
        'emerald': '#34d399',
        'wa':      '#25D366',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glow-cyan':   '0 0 24px rgba(6,182,212,0.35)',
        'glow-gold':   '0 0 24px rgba(201,149,42,0.4)',
        'glow-purple': '0 0 24px rgba(168,85,247,0.35)',
        'glow-green':  '0 0 24px rgba(52,211,153,0.3)',
        'card-hover':  '0 20px 50px rgba(0,0,0,0.5)',
      },
    },
  },
}
```

---

## 3. Utility Classes

```css
/* في globals.css — أضف هذه الكلاسات */

.glass {
  background: rgba(8, 20, 48, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-light {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.10);
}

.glow-dot {
  animation: pulseGlow 2s ease-in-out infinite;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(6, 182, 212, 0.28);
  animation: floatUp ease-in infinite;
  pointer-events: none;
}
```

---

## 4. Keyframe Animations

```css
/* في globals.css */

/* فقاعات عائمة للأعلى */
@keyframes floatUp {
  0%   { transform: translateY(0) scale(1);    opacity: 0.4; }
  100% { transform: translateY(-120px) scale(0.7); opacity: 0; }
}

/* وميض الألوان */
@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

/* النص المتدرج المتحرك */
@keyframes waveShift {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* fadeInUp للعناصر */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* pulse للنقاط الصغيرة */
@keyframes pulseRing {
  0%  { transform: scale(1);   opacity: 0.8; }
  70% { transform: scale(2.4); opacity: 0; }
}
```

---

## 5. Gradient Text (النص المتدرج)

```tsx
// H1 متحرك
<h1 style={{
  background: 'linear-gradient(90deg, #06b6d4, #c9952a, #a855f7)',
  backgroundSize: '200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'waveShift 4s linear infinite',
}}>
  في البحر الأحمر
</h1>

// Tailwind: bg-gradient-to-r from-cyan via-gold to-purple bg-clip-text text-transparent
```

---

## 6. Glass Card Component

```tsx
// components/ui/GlassCard.tsx
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'gold' | 'purple' | 'green' | 'orange';
  hover?: boolean;
}

export const GlassCard = ({ children, className, glow, hover = true }: GlassCardProps) => {
  const glowColors = {
    cyan:   'hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_28px_rgba(6,182,212,0.15)]',
    gold:   'hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_28px_rgba(201,149,42,0.2)]',
    purple: 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_28px_rgba(168,85,247,0.15)]',
    green:  'hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_28px_rgba(52,211,153,0.12)]',
    orange: 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_28px_rgba(249,115,22,0.12)]',
  };

  return (
    <div className={`
      glass rounded-[18px] overflow-hidden
      ${hover ? 'transition-transform duration-200 hover:-translate-y-1' : ''}
      ${glow ? glowColors[glow] : ''}
      ${className || ''}
    `}>
      {children}
    </div>
  );
};
```

---

## 7. Glowing Dot Component

```tsx
// components/ui/GlowDot.tsx
interface GlowDotProps {
  color: string;       // hex أو CSS color
  size?: number;       // px، default 14
  label?: string;
  side?: 'left' | 'right';
  onClick?: () => void;
  onHover?: () => void;
}

export const GlowDot = ({ color, size = 14, label, side, onClick, onHover }: GlowDotProps) => (
  <div
    className="absolute cursor-pointer z-20 -translate-x-1/2 -translate-y-1/2"
    onClick={onClick}
    onMouseEnter={onHover}
  >
    {/* Core */}
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      animation: 'pulseGlow 2s ease-in-out infinite',
    }} />
    {/* Pulse ring 1 */}
    <div style={{
      position: 'absolute', inset: 0,
      borderRadius: '50%',
      border: `2px solid ${color}`,
      animation: 'pulseRing 2s ease-out infinite',
    }} />
    {/* Label */}
    {label && (
      <span style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [side === 'right' ? 'right' : 'left']: 'calc(100% + 14px)',
        whiteSpace: 'nowrap', fontSize: 11.5, fontWeight: 700, color: 'white',
        textShadow: '0 0 10px rgba(0,0,0,0.8)',
      }}>
        {label}
      </span>
    )}
  </div>
);
```

---

## 8. Bubble Background Component

```tsx
// components/ui/BubbleBackground.tsx
const bubbles = [
  { size: 7,  left: '8%',  bottom: '20%', delay: 0,    duration: 6   },
  { size: 4,  left: '18%', bottom: '12%', delay: 1.4,  duration: 5.2 },
  { size: 9,  left: '32%', bottom: '8%',  delay: 0.6,  duration: 7.1 },
  { size: 5,  left: '51%', bottom: '16%', delay: 2.1,  duration: 5.8 },
  { size: 6,  right: '12%', bottom: '22%', delay: 0.9, duration: 6.4 },
  { size: 4,  right: '26%', bottom: '10%', delay: 1.8, duration: 5.5 },
  { size: 8,  right: '41%', bottom: '7%',  delay: 0.3, duration: 6.8 },
];

export const BubbleBackground = ({ color = 'rgba(6,182,212,0.3)' }) => (
  <>
    {bubbles.map((b, i) => (
      <div key={i} className="bubble" style={{
        width: b.size, height: b.size,
        left: b.left, right: b.right, bottom: b.bottom,
        background: color,
        animationDuration: `${b.duration}s`,
        animationDelay: `${b.delay}s`,
      }} />
    ))}
  </>
);
```

---

## 9. Tier Badge (بطاقة المستوى)

```tsx
// components/ui/TierBadge.tsx
type Tier = 'platinum' | 'gold' | 'silver';

const tierConfig: Record<Tier, { label: string; style: React.CSSProperties }> = {
  platinum: {
    label: '💎 بلاتيني',
    style: { background: 'linear-gradient(135deg, #c9952a, #e8a830)', color: 'white' },
  },
  gold: {
    label: '🥇 ذهبي',
    style: { background: 'linear-gradient(135deg, #d4a017, #f5c218)', color: 'white' },
  },
  silver: {
    label: '🥈 فضي',
    style: { background: 'rgba(148,163,184,0.85)', color: 'white' },
  },
};

export const TierBadge = ({ tier }: { tier: Tier }) => (
  <span style={{
    ...tierConfig[tier].style,
    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
  }}>
    {tierConfig[tier].label}
  </span>
);
```

---

## 10. Feature Badge Colors (ألوان الشارات)

```tsx
// constants/badges.ts
export const BADGE_STYLES = {
  women:     { bg: 'rgba(168,85,247,0.18)',  color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  family:    { bg: 'rgba(6,182,212,0.15)',   color: '#22d3ee', border: 'rgba(6,182,212,0.2)'   },
  eco:       { bg: 'rgba(52,211,153,0.15)',  color: '#6ee7b7', border: 'rgba(52,211,153,0.2)'  },
  tech:      { bg: 'rgba(249,115,22,0.18)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)'  },
  padi:      { bg: 'rgba(245,194,24,0.15)',  color: '#fde047', border: 'rgba(245,194,24,0.2)'  },
  sanitized: { bg: 'rgba(236,72,153,0.15)',  color: '#f9a8d4', border: 'rgba(236,72,153,0.2)'  },
  private:   { bg: 'rgba(6,182,212,0.15)',   color: '#22d3ee', border: 'rgba(6,182,212,0.2)'   },
  discount:  { bg: 'rgba(239,68,68,0.3)',    color: '#fca5a5', border: 'transparent'            },
  used:      { bg: 'rgba(245,194,24,0.15)',  color: '#fde047', border: 'rgba(245,194,24,0.2)'  },
};

// استخدام:
// <span style={{ background: BADGE_STYLES.women.bg, color: BADGE_STYLES.women.color, ... }}>
//   🧕 طاقم نسائي
// </span>
```

---

## 11. الـ Navbar مع Scroll Effect

```tsx
// components/layout/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(4,8,18,0.97)' : 'rgba(4,8,18,0.85)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      transition: 'background 0.35s ease',
    }}>
      {/* ... محتوى الـ navbar ... */}
    </nav>
  );
};
```

---

## 12. الـ Hero Section

```tsx
// app/page.tsx أو components/home/Hero.tsx
export const Hero = () => (
  <section style={{
    minHeight: '100vh',
    position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
    padding: '100px 24px 80px',
    overflow: 'hidden',
  }}>
    {/* Deep ocean bg */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 20%, #0a2a4a 0%, #040d1a 60%)',
    }} />

    {/* Nautical grid */}
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.04,
      backgroundImage: 'linear-gradient(rgba(100,180,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,1) 1px, transparent 1px)',
      backgroundSize: '55px 55px',
      pointerEvents: 'none',
    }} />

    {/* Light cone */}
    <div style={{
      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: 800, height: '100%',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 60%)',
      pointerEvents: 'none',
    }} />

    <BubbleBackground />

    {/* Content */}
    <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, width: '100%' }}>
      {/* ... */}
    </div>
  </section>
);
```

---

## 13. الـ Glass Search Bar

```tsx
// components/home/SearchBar.tsx
export const SearchBar = () => (
  <div style={{
    display: 'flex', alignItems: 'center',
    background: 'rgba(8,20,48,0.78)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18, padding: 6,
    maxWidth: 800, margin: '0 auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  }}>
    <SearchField label="الوجهة" placeholder="شرم الشيخ، دهب..." />
    <Divider />
    <SearchField label="التاريخ" placeholder="اختر التاريخ" />
    <Divider />
    <SearchField label="الأشخاص" placeholder="أضف أشخاصاً" />
    <button style={{
      background: 'linear-gradient(135deg, #c9952a, #e8a830)',
      color: 'white', border: 'none',
      padding: '14px 22px', borderRadius: 13,
      fontSize: 15, fontWeight: 700, cursor: 'pointer',
      margin: 2, flexShrink: 0,
      boxShadow: '0 4px 16px rgba(201,149,42,0.5)',
    }}>
      🔍 ابحث
    </button>
  </div>
);
```

---

## 14. Mobile Responsiveness

### المبادئ
1. **الـ Navbar**: فوق 768px → full nav | أقل → مخفي (hamburger أو simplified)
2. **الـ Grids**: Desktop 3-4 columns → Tablet 2 → Mobile 1
3. **الـ Sidebar**: تختفي على موبايل (يمكن وضعها في bottom sheet)
4. **الـ Hero Search Bar**: flex-direction: column على موبايل
5. **الـ Horizontal Scroll**: يبقى كما هو على الموبايل (scroll snap)

### CSS Breakpoints

```css
/* Mobile first */
@media (max-width: 767px) {
  .nav-desktop   { display: none; }
  .hero-search   { flex-direction: column; }
  .stats-grid    { grid-template-columns: repeat(2, 1fr); }
  .cat-grid      { grid-template-columns: repeat(3, 1fr); }
  .community-grid{ grid-template-columns: 1fr; }
  .market-grid   { grid-template-columns: repeat(2, 1fr); }
  .sites-grid    { grid-template-columns: 1fr; }
  .page-sidebar  { display: none; }
  .results-grid  { grid-template-columns: 1fr; }
  .footer-grid   { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .market-grid   { grid-template-columns: 1fr; }
  .footer-grid   { grid-template-columns: 1fr; }
  .cat-grid      { grid-template-columns: repeat(2, 1fr); }
}
```

### Mobile Navigation (مقترح)
```tsx
// Bottom tab bar على الموبايل
<nav className="fixed bottom-0 left-0 right-0 md:hidden glass border-t border-white/10 z-50">
  <div className="flex justify-around items-center h-16 px-4">
    <TabItem icon="🏠" label="الرئيسية" href="/" />
    <TabItem icon="🗓️" label="احجز" href="/booking" />
    <TabItem icon="👥" label="المجتمع" href="/community" />
    <TabItem icon="🛒" label="المتجر" href="/marketplace" />
    <TabItem icon="👤" label="حسابي" href="/profile" />
  </div>
</nav>
```

---

## 15. أولويات التطبيق على Next.js

### المرحلة 1 — الأساسيات (يوم واحد)
```
1. globals.css → أضف المتغيرات + .glass + .glass-light + @keyframes
2. layout.tsx → background: #040d1a على body
3. Navbar.tsx → طبّق التصميم الجديد + scroll effect
4. Hero.tsx → خلفية المحيط + grid + light cone + bubbles + search bar
```

### المرحلة 2 — الصفحة الرئيسية (يومان)
```
5. Stats.tsx → glass card 4 أعمدة + gradient numbers
6. CategoryQuicklinks.tsx → glass cards ملونة مع glow
7. HomeDiveCenters.tsx → horizontal scroll + glass cards + glow per tier
8. HomeCommunityFeed.tsx → dark cards + glowing avatars
9. HomeMarketplace.tsx → dark product cards
10. DiveSites.tsx → dark section مع colored overlay per site
```

### المرحلة 3 — الصفحات الداخلية (ثلاثة أيام)
```
11. family-booking/page.tsx → glass filter chips + dark center cards
12. community/page.tsx → dark feed + glass stories + glowing likes
13. marketplace/page.tsx → glass sidebar + dark product grid
```

### المرحلة 4 — الموبايل (يومان)
```
14. إضافة mobile bottom navigation
15. اختبار كل الـ breakpoints
16. تعديل أي grid ينكسر
17. اختبار الـ touch interactions
```

---

## 16. الملفات المرجعية

| الملف | الوصف |
|---|---|
| `ArabDiving Map Home.dc.html` | صفحة الخريطة التفاعلية |
| `ArabDiving Home Dark.dc.html` | الصفحة الرئيسية المظلمة |
| `ArabDiving Booking Dark.dc.html` | صفحة الحجز المظلمة |
| `ArabDiving Community Dark.dc.html` | صفحة المجتمع المظلمة |
| `ArabDiving Marketplace Dark.dc.html` | صفحة المتجر المظلمة |

**ملاحظة:** افتح كل ملف في المتصفح مباشرة لرؤية التصميم التفاعلي.

---

## 17. ما تقوله لكلود كود

```
"اقرأ ملف DARK_OCEAN_DESIGN_SYSTEM.md كاملاً أولاً.
ثم افتح ArabDiving Home Dark.dc.html في المتصفح لترى التصميم المرجعي.
طبّق هذا التصميم على الكودبيس في arabdiving/frontend/ بدءاً من المرحلة 1.
الكودبيس: Next.js 16 + React 19 + Tailwind CSS + RTL.
المبادئ الأساسية: glass morphism + dark ocean bg + colored glows + floating bubbles."
```
