# Handoff: ArabDiving Platform Redesign

## Overview

هذه حزمة التسليم لإعادة تصميم منصة **ArabDiving** — أكبر مجتمع عربي للغوص. المنصة تجمع بين:
- **مجمع مراكز الغوص** مع نظام حجز مباشر (بدون دفع مسبق)
- **مجتمع الغوّاصين** بأسلوب Instagram + Facebook
- **سوق المعدات** مع تواصل مباشر عبر واتساب
- **دليل مواقع الغوص** في البحر الأحمر

## About the Design Files

الملفات الموجودة في هذه الحزمة هي **نماذج تصميم عالية الدقة (High-Fidelity) مبنية بـ HTML** — هي مرجع بصري وتفاعلي يوضح الشكل والسلوك المطلوب، وليست كوداً جاهزاً للإنتاج.

**المهمة:** إعادة بناء هذه التصاميم بالكامل داخل الكودبيس الحالي (Next.js 16 + React 19 + Tailwind CSS) بنفس المستوى البصري والتفاعلي، مع الالتزام بالبنية الموجودة في `arabdiving/frontend/`.

## Fidelity

**High-Fidelity** — التصاميم نهائية بالكامل:
- ألوان دقيقة (hex values محددة)
- typography بأحجام وأوزان محددة
- animations و hover states
- تفاعلات مكتملة (فلاتر، لايكات، wishlist، إلخ)

على المطوّر إعادة إنتاج هذه التصاميم pixel-perfect قدر الإمكان باستخدام Tailwind + React components.

---

## Design Tokens

### Colors
```css
--navy:     #0d2c54   /* اللون الأساسي - الخلفيات الداكنة والنصوص */
--navy-dark:#060e24   /* الأداة + footer */
--sky:      #0891b2   /* الأزرق المائي - accent ثانوي */
--gold:     #c9952a   /* الذهبي - CTA + badges مميزة */
--gold-light:#e8a830  /* تدرج الذهبي */
--bg-light: #f1f5fb   /* خلفية الصفحات */
--text-main:#0f172a   /* النص الأساسي */
--text-muted:#64748b  /* النص الثانوي */
--text-faint:#94a3b8  /* النص الخافت */
--whatsapp: #25D366   /* زر واتساب */
--border:   #e2e8f0   /* الحدود */
```

### Gradients (الأكثر استخداماً)
```css
/* Hero / headers */
background: linear-gradient(165deg, #060e24 0%, #0d2c54 28%, #0e4a7a 58%, #0891b2 82%, #06b6d4 100%);

/* Gold CTA buttons */
background: linear-gradient(135deg, #c9952a, #e8a830);

/* Gold CTA section */
background: linear-gradient(135deg, #a86508, #c9952a 40%, #d4a117 70%, #e8a830 100%);
```

### Typography — خط Cairo فقط
```js
// next/font/google
import { Cairo } from 'next/font/google'
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
})
// في globals.css: font-family: 'Cairo', sans-serif;
// direction: rtl على html و body
```

| الاستخدام | الحجم | الوزن |
|---|---|---|
| H1 الرئيسي | clamp(40px, 6.5vw, 80px) | 900 |
| H2 الأقسام | clamp(24px, 3.5vw, 38px) | 900 |
| H3 البطاقات | 16–17px | 800 |
| نص المحتوى | 14px / 1.8lh | 400 |
| نص ثانوي | 12–13px | 400 |
| badges/chips | 11–12px | 600–700 |

### Spacing & Radius
```
border-radius البطاقات:  18–22px
border-radius الأزرار:   10–14px
border-radius الـ chips: 8–10px
border-radius الـ pills: 22–30px
padding البطاقات:        16–20px
gap الـ grid:            18–22px
max-width المحتوى:       1280px
```

### Shadows
```css
/* بطاقة عادية */
box-shadow: 0 6px 24px rgba(0,0,0,0.07);
/* بطاقة hover */
box-shadow: 0 18px 44px rgba(0,0,0,0.13);
/* CTA gold button */
box-shadow: 0 4px 12px rgba(201,149,42,0.35);
/* CTA gold hover */
box-shadow: 0 8px 24px rgba(201,149,42,0.55);
/* Navbar scrolled */
box-shadow: 0 4px 28px rgba(0,0,0,0.35);
```

---

## Screens / Views

---

### 1. الصفحة الرئيسية — `app/page.tsx`

**الملف المرجعي:** `ArabDiving Home Redesign.dc.html`

#### Layout
```
<Navbar sticky />          ← position:sticky top:0 z:100
<Hero />                   ← min-height:100vh
<StatsStrip />             ← 4 أعمدة
<CategoryQuicklinks />     ← grid 6 أعمدة
<DiveCenters />            ← horizontal scroll cards
<CommunityPreview />       ← stories + 3-col grid
<MarketplacePreview />     ← 4-col grid
<DiveSites />              ← bg:#060e24 dark section
<GulfCTA />                ← gold gradient
<Footer />
```

#### Navbar
- `position: sticky; top: 0; z-index: 100`
- في البداية: `background: rgba(6,14,36,0.72); backdrop-filter: blur(20px)`
- عند الـ scroll (>70px): `background: rgba(6,14,36,0.97)` مع `border-bottom: 1px solid rgba(255,255,255,0.07)`
- الانتقال: `transition: all 0.35s ease`
- اليمين: لوجو (38×38px، gradient، border-radius:10px) + اسم بالعربي
- الوسط: روابط nav بلون `rgba(255,255,255,0.82)`، hover: `background:rgba(255,255,255,0.1)`
- اليسار: "تسجيل الدخول" + زر "انضم الآن" بالذهبي

#### Hero Section
- `min-height: 100vh`
- خلفية: gradient عمودي من الداكن للأزرق (انظر Design Tokens)
- فقاعات متحركة: 8 عناصر `span` بـ `@keyframes bubbleFloat` — translateY(0) → translateY(-95px) مع تلاشي تدريجي
- **Search Bar** (أسلوب Airbnb):
  - خلفية بيضاء، `border-radius: 18px`، `max-width: 780px`
  - 3 حقول (الوجهة / التاريخ / الأشخاص) مفصولة بخط رمادي `1px #e2e8f0`
  - زر البحث: gold gradient، `border-radius: 13px`
- 3 أزرار quick actions أسفل الـ search bar
- wave transition SVG في أسفل الـ section

#### Stats Strip
- خلفية بيضاء، `border-radius: 22px`، shadow خفيف
- `display: grid; grid-template-columns: repeat(4, 1fr)`
- كل stat: رقم كبير (48px weight:900 navy) + وصف (14px muted)
- فصل بـ `border-inline-start: 1px solid #f1f5fb`

#### Category Quicklinks
- `grid-template-columns: repeat(6, 1fr); gap: 14px`
- كل بطاقة: أيقونة (54×54px bg ملوّن + border-radius:16px) + اسم
- hover: `translateY(-5px)` + shadow أقوى + تغيير لون الحدود

#### Dive Center Cards
- horizontal scroll مع `scroll-snap-type: x mandatory`
- كل بطاقة: `flex: 0 0 300px`
- صورة وهمية (gradient) بارتفاع 190px + overlay من الأسفل
- tier badge (بلاتيني/ذهبي/فضي) + rating badge
- tags الميزات + السعر + زر "احجز الآن"

#### Community Preview
- **Stories row**: دوائر بـ gradient border للمشاركين + "+" للإضافة
- **3-col grid**: كل بطاقة منشور فيها صورة + معلومات المؤلف + نص + reactions

#### Marketplace Preview
- `grid-template-columns: repeat(4, 1fr); gap: 18px`
- كل بطاقة: صورة emoji كبير على gradient + الاسم + السعر + زر واتساب أخضر

#### Dive Sites (dark section)
- `background: #060e24`
- 3 بطاقات بـ `height: 300px` عليها overlay تدريجي من أسفل
- hover: `scale(1.025)`

#### Gulf CTA
- Gold gradient خلفية
- 3 أرقام (ساعات السفر) + زر أبيض

#### Footer
- `background: #060e24`
- `grid-template-columns: 2fr 1fr 1fr 1fr`
- 4 أعمدة: About + Explore + Community + للمراكز

---

### 2. صفحة الحجز — `app/family-booking/page.tsx`

**الملف المرجعي:** `ArabDiving Booking Page.dc.html`

#### Layout
```
<Navbar />
<HeroWithSearch />          ← hero مصغر مع search bar
<TrustBadgesStrip />        ← filter chips تفاعلية
<ResultsSection>
  <ResultsHeader />         ← عداد + sort select
  <CentersGrid />           ← auto-fill grid بطاقات
  <LoadMoreButton />
</ResultsSection>
<HowItWorksSection />       ← 4 خطوات
<Footer />
```

#### Filter Chips (تفاعلية)
```tsx
// State
const [activeFilter, setActiveFilter] = useState('all')
const filters = ['all','women','family','eco','tech','private','facilities','sanitized']

// Active style: bg:#0d2c54, color:white, border:1.5px solid #0d2c54, fontWeight:700
// Inactive style: bg:#f8fafc, color:#475569, border:1.5px solid #e2e8f0
```

#### Center Card
```
height صورة: 200px (gradient)
badges المواقع: absolute top-right / top-left
city badge: absolute bottom-right
padding المحتوى: 20px
السعر: flex align-items:flex-start justify-content:space-between
الأزرار: flex gap:10px — "احجز الآن" (gold) + "التفاصيل" (f1f5f9)
```

#### How It Works
- `grid-template-columns: repeat(4, 1fr)`
- كل خطوة: أيقونة 64×64px على خلفية ملونة فاتحة + رقم + عنوان + وصف

---

### 3. صفحة المجتمع — `app/community/page.tsx`

**الملف المرجعي:** `ArabDiving Community Page.dc.html`

#### Layout
```
<Navbar />
<PageHeader />              ← stats + CTA
<MainLayout>
  <FeedColumn>              ← flex:1
    <StoriesRow />
    <TabsFilter />
    <PostComposer />
    <PostsList />
  </FeedColumn>
  <Sidebar width="320px">
    <MyProfileMini />
    <TrendingTopics />
    <SuggestedMembers />
    <NextTripCTA />
  </Sidebar>
</MainLayout>
```

#### Stories Row
- horizontal scroll، `scrollbar-width: none`
- كل story: دائرة 60×60px + border gradient ذهبي للمشاركين الجدد
- دائرة بـ gray border للقديمة / "+" للإضافة

#### Tab Filter
```tsx
const tabs = ['all','photos','experiences','tips','women']
// نفس style الـ filter chips
```

#### Post Card
```
Header: avatar (44×44 + online dot) + اسم + وقت + badge الفئة
Content: نص + hashtags
Image: 280px height gradient
Actions: ❤️ (تفاعلي) + 💬 + ↗️ + 🔖
Comment preview: avatar صغير + بلون background:#f8fafc
```

#### Like Button (تفاعلي)
```tsx
const [liked, setLiked] = useState(false)
const [count, setCount] = useState(47)
// عند الضغط: toggle liked + ±1 على count
// Active color: #e11d48
```

#### Sidebar - Trending Topics
- كل item: flex justify:space-between + أيقونة emoji
- background:#f8fafc، hover:#f1f5f9، border-radius:11px

---

### 4. صفحة المتجر — `app/marketplace/page.tsx`

**الملف المرجعي:** `ArabDiving Marketplace Page.dc.html`

#### Layout
```
<Navbar />
<HeroBanner />              ← search + product showcase
<CategoryPills />           ← horizontal scroll pills
<MainLayout>
  <SidebarFilters />        ← 260px sticky
  <ProductsArea>
    <Toolbar />             ← count + sort + grid/list toggle
    <FeaturedBanner />      ← gold gradient promo
    <ProductsGrid />        ← 3-col grid أو list
    <Pagination />
  </ProductsArea>
</MainLayout>
```

#### Category Pills
```tsx
const categories = ['all','masks','suits','fins','bcd','regulators','cameras','kids','women','used']
// horizontal scroll، scrollbar-width:none
// active: bg:#0d2c54 white text، inactive: white #475569
```

#### Sidebar Filters
```
position: sticky; top: 82px
4 بلوكات:
- 💰 نطاق السعر (radio buttons)
- ✨ الحالة (checkboxes)
- 🏷️ الماركة (checkboxes)
- 📦 الشحن من (checkboxes)
+ زر "تطبيق الفلاتر"
```

#### Product Card
```
height الصورة: 190px (gradient + emoji كبير 64px)
brand badge: absolute top-right
discount badge: absolute top-left (red أو category label)
wishlist button: absolute bottom-left (❤️ toggle)
السعر: font-size:22px weight:900
سعر قديم: text-decoration:line-through color:#94a3b8
زر واتساب: bg:#25D366 كامل العرض
```

#### Grid/List Toggle
```tsx
const [viewGrid, setViewGrid] = useState(true)
// grid: grid-template-columns: repeat(3,1fr); gap:20px
// list: grid-template-columns: 1fr; gap:14px
```

#### Wishlist
```tsx
const [wished, setWished] = useState(false)
// icon: wished ? '❤️' : '🤍'
```

---

## Interactions & Behavior

### Navbar Scroll Effect
```tsx
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 70)
  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}, [])
```

### Animations
```css
/* Bubble float في الـ Hero */
@keyframes bubbleFloat {
  0%   { transform: translateY(0px) scale(1);     opacity: 0.7; }
  50%  { transform: translateY(-45px) scale(1.1); opacity: 0.35; }
  100% { transform: translateY(-95px) scale(0.8); opacity: 0; }
}

/* Fade in up للعناصر */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Hover Transitions
- بطاقات: `transition: transform .22s, box-shadow .22s` + `translateY(-5px)` + shadow أقوى
- أزرار: `transition: all .2s` + shadow أقوى + `translateY(-1px)`
- links nav: `transition: background .15s`

### WhatsApp Links
```tsx
// نمط الرابط لكل منتج
<a href={`https://wa.me/${centerPhone}?text=أريد الحجز في ${centerName}`}>
```

---

## State Management

### Booking Page
```tsx
// في family-booking/page.tsx
const [activeFilter, setActiveFilter] = useState('all')
const filteredCenters = centers.filter(c => 
  activeFilter === 'all' || c.tags.includes(activeFilter)
)
```

### Community Page
```tsx
// Post likes
const [postLikes, setPostLikes] = useState<Record<string, {liked:boolean; count:number}>>({})
const toggleLike = (postId: string) => {
  setPostLikes(prev => ({
    ...prev,
    [postId]: {
      liked: !prev[postId]?.liked,
      count: prev[postId]?.liked ? (prev[postId].count - 1) : (prev[postId]?.count ?? 0) + 1
    }
  }))
}
```

### Marketplace Page
```tsx
const [category, setCategory] = useState('all')
const [viewGrid, setViewGrid] = useState(true)
const [wishlisted, setWishlisted] = useState<Set<string>>(new Set())
const [priceRange, setPriceRange] = useState('all')
const [condition, setCondition] = useState<string[]>(['new','used-excellent'])
```

---

## Implementation Priority

### المرحلة الأولى (الأهم)
1. **globals.css** — تحديث متغيرات الألوان + إضافة `@keyframes`
2. **layout.tsx** — تغيير الخط إلى Cairo
3. **components/layout/Navbar.tsx** — تطبيق التصميم الجديد مع scroll effect
4. **components/home/Hero.tsx** — إضافة search bar + bubbles animation

### المرحلة الثانية
5. **components/home/HomeDiveCenters.tsx** — horizontal scroll cards الجديدة
6. **components/home/HomeCommunityFeed.tsx** — stories + 3-col grid
7. **app/family-booking/page.tsx** — filter chips + cards جديدة
8. **app/community/page.tsx** — layout ثنائي العمود + تفاعلات

### المرحلة الثالثة
9. **app/marketplace/page.tsx** — sidebar filters + product grid
10. **components/home/Stats.tsx** — strip بالتصميم الجديد

---

## globals.css المقترح

```css
@import "tailwindcss";

:root {
  --navy:      #0d2c54;
  --navy-dark: #060e24;
  --sky:       #0891b2;
  --gold:      #c9952a;
  --gold-light:#e8a830;
  --bg:        #f1f5fb;
  --text:      #0f172a;
  --muted:     #64748b;
  --faint:     #94a3b8;
  --border:    #e2e8f0;
  --whatsapp:  #25D366;
}

html, body {
  direction: rtl;
  font-family: var(--font-cairo), 'Cairo', sans-serif;
  background: var(--bg);
  color: var(--text);
}

@keyframes bubbleFloat {
  0%   { transform: translateY(0) scale(1);     opacity: .7; }
  50%  { transform: translateY(-45px) scale(1.1); opacity: .35; }
  100% { transform: translateY(-95px) scale(.8);  opacity: 0; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Files in This Package

| الملف | الوصف |
|---|---|
| `ArabDiving Home Redesign.dc.html` | الصفحة الرئيسية الكاملة |
| `ArabDiving Booking Page.dc.html` | صفحة مراكز الغوص والحجز |
| `ArabDiving Community Page.dc.html` | صفحة المجتمع |
| `ArabDiving Marketplace Page.dc.html` | صفحة المتجر |
| `ArabDiving Design System.dc.html` | نظام التصميم ومكتبة المكونات |

**للمراجعة:** افتح كل ملف في المتصفح مباشرة لرؤية التصميم التفاعلي كاملاً.

---

## Notes for Claude Code

- الكودبيس الحالي في `arabdiving/frontend/` — Next.js 16، React 19، Tailwind CSS
- اتجاه النص RTL في كل شيء
- الـ API موجود في `arabdiving/backend/` — Express + MongoDB
- متغير `API_BASE` موجود في `app/lib/api.ts`
- الـ authentication موجود — استخدم `useAuth()` hook الموجود
- بعض الصفحات `"use client"` وبعضها server components — حافظ على النمط الحالي
