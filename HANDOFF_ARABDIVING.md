# ArabDiving — ملف التسليم الكامل (Handoff Document)
## لمشاركته مع الذكاء الاصطناعي المستمر في البناء

---

## معلومات المشروع

- **اسم الموقع:** ArabDiving — مجتمع الغوص العربي
- **الرابط:** https://arabdiving.com
- **Stack:** Next.js 16 (App Router) + Node.js/Express + MongoDB
- **المجلد:** `C:\Users\Paysky\arabdiving\`
  - `frontend/` — Next.js
  - `backend/` — Express API
- **Admin panel:** https://arabdiving.com/admin
- **صاحب المشروع:** إبراهيم المكاوي — ibrahim.elmekkawi@gmail.com

---

## كل ما تم بناؤه وتعديله (بالترتيب)

---

### 1. AR Filter Masks — أقنعة الفلاتر
**الملفات:** `C:\Users\Paysky\arabdiving\ar-masks\`
- `mask_kids.png` — كرتوني للأطفال
- `mask_women.png` — لؤلؤ وذهب للسيدات
- `mask_men.png` — كلاسيك أسود للرجال
- `mask_tech.png` — قناع غوص تقني كامل مع HUD

جميعها PNG شفافة 1080×1080 جاهزة لـ Snapchat/Instagram/TikTok AR filters.
تم إنشاؤها بـ Python PIL في sandbox.

---

### 2. Backend — نماذج البيانات

#### `backend/src/models/DiveSite.js`
أضيف:
```js
featuredOnHome: { type: Boolean, default: false }
```

#### `backend/src/models/PartnerCenter.js`
أضيف:
```js
featuredOnHome: { type: Boolean, default: false }
```

#### `backend/src/models/Settings.js` (أُعيد كتابته بالكامل)
homeBlocks defaults تشمل الآن 9 blocks:
```js
{ key: "hero",              visible: true,  order: 0 },
{ key: "community_feed",    visible: true,  order: 1 },
{ key: "gulf_focus",        visible: true,  order: 2 },
{ key: "stats",             visible: true,  order: 3 },
{ key: "segments",          visible: true,  order: 4 },
{ key: "dive_centers",      visible: true,  order: 5 },
{ key: "featured_sites",    visible: true,  order: 6 },
{ key: "weight_calculator", visible: false, order: 7 },
{ key: "community_survey",  visible: false, order: 8 },
```

---

### 3. Backend — Controllers

#### `backend/src/controllers/diveSiteController.js`
أضيف:
- `getDiveSites` — يدعم `?featured=true` query filter
- `updateDiveSite` — PUT /:id
- `deleteDiveSite` — DELETE /:id
- `toggleFeaturedDiveSite` — PATCH /:id/toggle-featured (يقلب featuredOnHome)

#### `backend/src/controllers/partnerCenterController.js`
أضيف:
- `getPartnerCenters` — يدعم `?featured=true` query filter
- `updatePartnerCenter` — PUT /:id
- `deletePartnerCenter` — DELETE /:id
- `toggleFeaturedPartnerCenter` — PATCH /:id/toggle-featured

---

### 4. Backend — Routes

#### `backend/src/routes/diveSiteRoutes.js`
```js
router.put("/:id", protect, adminOnly, updateDiveSite)
router.delete("/:id", protect, adminOnly, deleteDiveSite)
router.patch("/:id/toggle-featured", protect, adminOnly, toggleFeaturedDiveSite)
```

#### `backend/src/routes/partnerCenterRoutes.js`
```js
router.put("/:id", protect, adminOnly, updatePartnerCenter)
router.delete("/:id", protect, adminOnly, deletePartnerCenter)
router.patch("/:id/toggle-featured", protect, adminOnly, toggleFeaturedPartnerCenter)
```

---

### 5. Frontend — صفحة الهوم الرئيسية

#### `frontend/app/page.tsx` (أُعيد كتابته)
- نظام blocks كامل يقرأ من DB
- DEFAULT_BLOCKS يشمل كل 9 blocks
- Merge logic يمنع فقدان blocks عند DB قديم:
```tsx
const dbKeys = new Set(hb.map((b) => b.key));
const merged = [
  ...hb,
  ...DEFAULT_BLOCKS
    .filter((d) => !dbKeys.has(d.key))
    .map((d) => ({ ...d, order: hb.length + d.order })),
];
return merged.sort((a, b) => a.order - b.order);
```
- renderBlock يدعم: hero, community_feed, gulf_focus, stats, segments,
  dive_centers, featured_sites, weight_calculator, community_survey

---

### 6. Frontend — مكونات الهوم

#### `frontend/app/components/home/HomeCommunityFeed.tsx`
- Client Component
- صف أفقي horizontal scroll (flex + overflow-x: auto)
- `alignItems: "flex-start"` — كل كارت بارتفاعه الطبيعي فقط
- `renderTextWithLinks()` — يحول URLs في النص لـ <a> قابلة للضغط (نفس منطق صفحة المجتمع)
- يجلب 10 منشورات
- card: flex: "0 0 300px"

#### `frontend/app/components/home/FeaturedDiveSites.tsx`
- Server Component + ISR (revalidate: 60)
- يجلب `GET /api/dive-sites?featured=true` فقط
- صف أفقي 280px cards
- يرجع null إذا لا توجد مواقع مميزة

#### `frontend/app/components/home/HomeDiveCenters.tsx` (جديد)
- Server Component + ISR (revalidate: 60)
- يجلب `GET /api/partner-centers?featured=true` فقط
- صف أفقي مع tier badge, trust badges, price, rating
- يرجع null إذا لا توجد مراكز مميزة

#### `frontend/app/components/home/WeightCalculator.tsx` (جديد + مُصلح)
- Client Component
- خلفية underwater gradient داكنة
- الحسبة الصحيحة (مرجع: PADI + SSI standards):
```ts
// نقطة الصفر = بدلة 5mm + أسطوانة AL80 + مياه مالحة
const SUIT_ADJUSTMENT = {
  swimsuit: -3.5,  // بدون بدلة
  wetsuit3: -1.5,  // 3mm
  wetsuit5:  0,    // ◀ المرجع
  wetsuit7: +2.5,  // 7mm
  drysuit:  +5.0,  // جافة
};
const TANK_ADJUSTMENT = {
  al80:     0,    // ◀ المرجع
  steel12: -1.5,  // فولاذ 12L
  steel15: -2.0,  // فولاذ 15L
};
function calcLead(c) {
  const base  = c.bodyWeight * 0.10;  // قاعدة PADI 10%
  const suit  = SUIT_ADJUSTMENT[c.suitType];
  const tank  = TANK_ADJUSTMENT[c.tankType];
  const water = c.waterType === "fresh" ? -2 : 0;
  return Math.max(0, Math.round((base + suit + tank + water) * 2) / 2);
}
// مثال: 70kg + 5mm + AL80 + مالح = 7 كغ ✓
```
- خيارات select الـ option لها `style={{ background: "#0d2c54", color: "#fff" }}`
  لأن المتصفح كان يُظهر النص أبيض على أبيض عند فتح القائمة

#### `frontend/app/components/home/CommunitySurvey.tsx` (جديد)
- Client Component
- localStorage voting
- استطلاعان hardcoded مع تبديل بينهما
- progress bar بعد التصويت

---

### 7. Frontend — صفحة حاسبة الوزن المستقلة

#### `frontend/app/weight-calculator/page.tsx` (جديد)
```tsx
import WeightCalculator from "@/app/components/home/WeightCalculator";
export default function WeightCalculatorPage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0d2c54 0%,#0b3d2e 100%)" }}>
      <WeightCalculator />
    </main>
  );
}
```
URL: https://arabdiving.com/weight-calculator

---

### 8. Frontend — Admin Pages

#### `frontend/app/admin/homepage/page.tsx` (أُعيد كتابته)
- BLOCK_REGISTRY يشمل كل 9 blocks مع label, icon, desc
- merge logic: يضيف blocks مفقودة من DB كـ visible: false
- زر "＋ إضافة بلوك جديد" مع expandable panel
- زر ✕ لحذف block من القائمة
- بعد الحفظ: يستدعي `/api/revalidate` لكسر ISR cache فوراً

#### `frontend/app/admin/dive-sites/page.tsx`
- `featuredOnHome?: boolean` في interface Site
- `toggleFeatured()` يستدعي PATCH /:id/toggle-featured
- بعد toggle: يستدعي `/api/revalidate`
- كارت الموقع: border ذهبي عند featured، badge "🏠 هوم"
- عداد "🏠 الظاهرة في الهوم: X"

#### `frontend/app/admin/partner-centers/page.tsx`
- نفس pattern toggleFeatured مع /api/revalidate
- border ذهبي + featured badge + toggle button

---

### 9. Frontend — ISR Cache Invalidation

#### `frontend/app/api/revalidate/route.ts` (جديد)
```ts
import { revalidatePath } from "next/cache";
export async function POST() {
  revalidatePath("/");
  revalidatePath("/dive-sites");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
```
يُستدعى من:
- admin/homepage بعد الحفظ
- admin/dive-sites بعد toggle featured
- admin/partner-centers بعد toggle featured

---

### 10. ملف التسويق (خارج الكود)

#### `C:\Users\Paysky\arabdiving\ArabDiving_Partnership_Offer_2025.docx`
Word document كامل يحتوي على:
- شرح أزمة SSI/RSTC وتأثيرها على السوق الخليجي
- عرض زمالة ArabDiving + شراكة TDI/SDI
- خطة تسويق كاملة بجدول تنفيذ 4 مراحل
- 3 إيميلات جاهزة: للمراكز، للمتابعة، للمدربين المستقلين
- عرض الشراكة الرسمي

**نص الرسالة المحدّثة (للإيميل والواتساب):**
من: ArabDiving نيابة عن د. عبد الرحمن المكاوي — شريك مؤسس
المحتوى: كنا نعمل على تطوير الغوص في مصر وننوي التوسع للخليج،
فوجئنا مثلكم بأزمة SSI/RSTC. نقدم تحويل المدربين لـ SDI
بأقل تكلفة ممكنة + Divemaster بنص السعر + نأتي إليكم.

---

## البنية الحالية للمشروع (الملفات الجوهرية)

```
arabdiving/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── DiveSite.js          ← featuredOnHome ✓
│   │   │   ├── PartnerCenter.js     ← featuredOnHome ✓
│   │   │   ├── Settings.js          ← 9 homeBlocks ✓
│   │   │   └── Post.js              ← linkPreview ✓
│   │   ├── controllers/
│   │   │   ├── diveSiteController.js       ← toggle-featured ✓
│   │   │   └── partnerCenterController.js  ← toggle-featured ✓
│   │   └── routes/
│   │       ├── diveSiteRoutes.js    ← PATCH toggle-featured ✓
│   │       └── partnerCenterRoutes.js ← PATCH toggle-featured ✓
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 ← 9 blocks + merge logic ✓
│   │   ├── api/revalidate/route.ts  ← ISR invalidation ✓
│   │   ├── weight-calculator/
│   │   │   └── page.tsx             ← صفحة الحاسبة المستقلة ✓
│   │   ├── community/
│   │   │   └── page.tsx             ← renderTextWithLinks ✓
│   │   ├── admin/
│   │   │   ├── homepage/page.tsx    ← BLOCK_REGISTRY كامل ✓
│   │   │   ├── dive-sites/page.tsx  ← toggle featured ✓
│   │   │   └── partner-centers/page.tsx ← toggle featured ✓
│   │   └── components/
│   │       └── home/
│   │           ├── HomeCommunityFeed.tsx  ← horizontal scroll + links ✓
│   │           ├── FeaturedDiveSites.tsx  ← featured only ✓
│   │           ├── HomeDiveCenters.tsx    ← featured only ✓
│   │           ├── WeightCalculator.tsx   ← حسبة صحيحة ✓
│   │           └── CommunitySurvey.tsx    ← localStorage voting ✓
└── ar-masks/
    ├── mask_kids.png
    ├── mask_women.png
    ├── mask_men.png
    └── mask_tech.png
```

---

## نقاط مهمة يجب أن يعرفها الذكاء الاصطناعي القادم

### سلوك النظام
1. **ISR Cache:** الهوم بيج يستخدم `revalidate: 60`. أي تغيير في Admin يجب أن يستدعي `POST /api/revalidate` وإلا لن يظهر التغيير فوراً.
2. **Merge Logic:** Settings في DB قد لا تحتوي كل الـ blocks الجديدة. الـ merge logic في `page.tsx` و `admin/homepage/page.tsx` يضيف المفقودة تلقائياً.
3. **Arabic in bash heredocs:** لا تكتب عربي مباشرة في bash heredoc للملفات JS/TS — يسبب SyntaxError. استخدم English keys في Mongoose وArabic labels في frontend maps.
4. **RTL:** الواجهة كاملة RTL مع Cairo font.
5. **Auth:** admin routes تستخدم `protect` middleware + `adminOnly`. Token في localStorage.

### حسبة الوزن (WeightCalculator)
القاعدة: 10% من وزن الجسم = المرجع لـ (5mm + AL80 + مالح).
كل شيء آخر تعديل حوله. لا تعيد كتابة الحسبة — النسخة الحالية صحيحة وفق PADI/SSI.

### Featured System
- DiveSite و PartnerCenter لهما `featuredOnHome: Boolean`
- الهوم يجلب `?featured=true` فقط
- Admin يملك toggle button في صفحتي المواقع والمراكز

---

## المهام التي قد تحتاج إليها مستقبلاً

- [ ] صفحة `/dive-sites` العامة (قائمة كل المواقع للزوار)
- [ ] صفحة `/dive-centers` العامة (قائمة كل المراكز للزوار)
- [ ] نظام notifications للمجتمع
- [ ] تسجيل دخول بالجوال (OTP)
- [ ] نظام booking لمراكز الغوص الشريكة
- [ ] صفحة المدرب (Instructor Profile)
- [ ] ربط CommunitySurvey بـ backend (حالياً localStorage فقط)
- [ ] تحديث نصي الاستطلاع من Admin

---

## معلومات التواصل

- صاحب المشروع: إبراهيم المكاوي
- البريد: ibrahim.elmekkawi@gmail.com
- شريك مؤسس: د. عبد الرحمن المكاوي (مدرب المدربين — SDI/TDI)
- الموقع: https://arabdiving.com
- Admin: https://arabdiving.com/admin

