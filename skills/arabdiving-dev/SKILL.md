---
name: arabdiving-dev
description: دليل التطوير الكامل لمشروع ArabDiving — المعمارية، أنماط كتابة الكود، طريقة إضافة صفحة/نموذج/قسم CMS، انضباط التحقق، والأخطاء الشائعة التي يجب تجنّبها (بعضها وقع سابقًا). استشر هذا الـ skill قبل كتابة أي كود في المشروع، أو عند إضافة ميزة/إصلاح خطأ/نشر. Use this whenever writing or modifying ArabDiving code so changes match the project's conventions and avoid known pitfalls.
metadata:
  type: reference
  scope: ArabDiving (Next.js 16 + Express + MongoDB)
---

# ArabDiving — دليل التطوير (للذكاء المُكمِّل، بما فيه Sonnet)

> اقرأ هذا قبل أي تعديل. الهدف: نفس النمط بالضبط + تجنّب الأخطاء التي وقعت سابقًا.

## 0) القاعدة الذهبية للتحقق (إلزامية بعد أي تعديل)
- **Frontend:** `cd frontend && rm -rf .next && npx tsc --noEmit` ← يجب أن يكون **exit 0**. لا تعتبر العمل منتهيًا قبل ذلك.
- **Backend:** `cd backend/src && node -e "require('./models/X.js'); require('./controllers/Y.js'); require('./routes/Z.js'); console.log('OK')"`.
- **الملفات الكبيرة:** اكتبها عبر `bash heredoc` (`cat > file <<'EOF' ... EOF`) لا عبر تعديلات صغيرة متتابعة، لأن mount الـsandbox قد يتأخّر ويقتطع الملف. بعد الكتابة تحقّق بـ `wc -l` و`tail`.
- **تعارض المحرّرات:** لا تلصق/تعدّل نفس الملف من أداة خارجية أثناء العمل هنا — حدث سابقًا تلف ملفات (`forceupdate` و«تعليق غير مغلق») كسر البناء كله. كل التعديلات من مكان واحد.

## 1) Stack والبنية
- **Frontend:** Next.js 16 App Router + TypeScript. **أنماط inline + متغيّرات CSS للهوية**. خط Cairo. اتجاه **RTL** عربي. يُنشر على **Vercel**.
- **Backend:** Express 5 + Mongoose + MongoDB Atlas + JWT + bcryptjs + Cloudinary (multer-storage-cloudinary لرفع صور/فيديو). يُنشر على **Render** (مجاني، لا Shell، ينام فأول طلب بطيء).
- المسارات: `frontend/app/...`، `backend/src/{models,controllers,routes,middleware,config}` + `server.js`.

## 2) النشر (Workflow)
1. Commit + Push من **GitHub Desktop**.
2. **Vercel** ينشر الواجهة تلقائيًا.
3. **أي تعديل backend ⇒ Manual Deploy يدوي على Render** (Deploy latest commit). انسَه = الميزة لا تعمل.

## 3) عنوان الـ API (درس مهم — سبب أعطال سابقة)
- ملف `frontend/app/lib/api.ts` يحسم `API_BASE`. **يجب أن يبقى محصّنًا**: في الخادم (SSR) والمتصفح، إذا كان `NEXT_PUBLIC_API_URL` فارغًا أو يشير لدومين الموقع نفسه (`arabdiving.com`/`*.vercel.app`) ⇒ استخدم backend الثابت `https://arabdiving-api.onrender.com`. سبب أعطال «المنشور غير موجود» و«تعذّر الاتصال» كان عنوانًا خاطئًا يضرب الواجهة بدل Render. لا تُرجِع هذا الملف إلى fallback = localhost فقط.

## 4) أنماط كتابة الكود (اتبعها حرفيًا)
### ألوان الهوية — استخدم المتغيّرات لا ألوانًا ثابتة
الموقع يدعم **تخصيص ألوان من الأدمن** عبر متغيّرات CSS. استخدم دائمًا:
`var(--navy)`، `var(--mid)`، `var(--gold)`، `var(--background)` (خلفية الصفحة)، `var(--surface)` (سطح البطاقات)، `var(--text)` (نص أساسي)، `var(--muted)` (نص ثانوي)، `var(--border)`، `var(--hero)`.
- **البطاقات:** خلفيتها `var(--surface)` ونصها `var(--text)`/`var(--muted)` — **لا** `var(--background)` (وإلا تنقلب داكنة والنص يصير باهتًا — خطأ تكرّر).
- لا تكتب `#0d2c54` أو `white` يدويًا لعنصر يُفترض أن يتلوّن.

### Backend — نمط النموذج/الكنترولر/المسار
- نموذج Mongoose بمفاتيح **إنجليزية** (Arabic في الـlabels على الواجهة فقط). أضِف `timestamps: true`.
- كنترولر: دوال `get/create/update/delete`، كل دالة `try/catch` ترجع `{ success, ... }` أو `{ success:false, message }`.
- مسار عام: `router.get(...)`؛ كتابة بصلاحية: `protect, adminOnly`.
- **سجّل المسار في `server.js`** (require + `app.use("/api/x", xRoutes)`).
- **الإعدادات (Settings):** أي حقل جديد في الموديل **يجب** أن يُقرأ في `readSettings` **ويُحفظ في `updateSettings`** وإلا «التغيير لا يؤثر» (خطأ تكرّر مع homeBlocks/theme). استخدم `s.markModified("theme")` للحقول المتداخلة (Mixed/nested).

### Frontend — نمط الصفحة
- صفحة محتوى ثابت: `"use client"` + `useContent("pageKey")` + بيانات افتراضية في `app/lib/content-defaults.ts` (تُحرَّر من `/admin/content`؛ المحرّر عام تعاودي ويدعم نصوص/صور/فيديو/مصفوفات).
- صفحة ببيانات: `fetch(\`${API_BASE}/api/...\`)`. للحجز/الأدمن استعمل `authHeaders()` من `lib/adminFetch`.
- صفحة أدمن جديدة: ملف تحت `app/admin/x/page.tsx` + رابط في `app/admin/layout.tsx`.
- صفحة عامة جديدة: أضِف الرابط في `Navbar.tsx` **و** قائمة `/admin/pages` (الظهور) — والـCMS إن كانت محتوى.

## 5) أنظمة قابلة للتوسعة موجودة (لا تعد اختراعها)
- **CMS:** `Content` model + `content-defaults.ts` + `useContent` + محرّر عام `/admin/content`.
- **ظهور الصفحات:** `Settings.hiddenPages` ← `/admin/pages` ← Navbar يُخفي.
- **القائمة:** `Settings.navStyle` (buttons/dropdown/sidebar) + `Settings.navGroups` (تجميع منسدل) ← `/admin/menu`.
- **الألوان + صباحي/مسائي:** `Settings.theme` (9 ألوان) + `Settings.dayNight` ← `/admin/theme` + مكوّن `ThemeStyle`.
- **بطاقات الرئيسية:** `Settings.homeCards` ← `/admin/home-cards`؛ وبلوكات الهوم `Settings.homeBlocks` ← `/admin/homepage`.
- **العملات:** `lib/currency.ts` (قائمة + أسعار صرف حيّة open.er-api + convert/format).
- **الحرارة:** `lib/cityWeather.ts` (Open-Meteo) + `SiteClimate`/`YearlyTempChart`.
- **DISC:** `lib/disc.ts` (مشترك بين /quiz والبروفايل والمجتمعات).
- **متجر/شركاء/دورات/حجز:** نماذج Product/PartnerCenter/Course/Booking + لوحات أدمن.

## 6) ISR / الكاش (درس من أعطال سابقة)
- الصفحة الرئيسية تستخدم `revalidate` (ISR). أي تغيير في الأدمن قد لا يظهر فورًا. يوجد `app/api/revalidate/route.ts` يجب استدعاؤه بعد الحفظ، **ولا تنسَ أن SSR يجلب من backend الصحيح (راجع البند 3)** — أكثر «التغيير لا يظهر» سببه عنوان API أو ISR.
- الـ **Service Worker (PWA):** `public/sw.js` يجب أن يبقى: network-first، لا يخزّن أخطاء، لا يعترض `/api`، ويمسح الكاش القديم. وإلا يعرض نسخة قديمة.

## 7) أخطاء يجب تجنّبها (وقعت فعلًا)
1. **عنوان API يشير للواجهة** ⇒ 404 لكل شيء. (حصّن api.ts.)
2. **حقل Settings جديد بلا معالجة في الكنترولر** ⇒ لا يُحفظ.
3. **بطاقات تستخدم `--background`** ⇒ نص باهت على داكن. استخدم `--surface`/`--text`.
4. **ألوان ثابتة بدل المتغيّرات** ⇒ لا تتبع تخصيص الأدمن.
5. **تعديل خارجي/لصق فوق الملفات** ⇒ تلف وكسر البناء. وحّد مصدر التعديل وتحقّق بـ tsc.
6. **`useEffect(load, [])`** حيث `load` async ⇒ خطأ TS. استخدم `useEffect(() => { load(); }, [])`.
7. **نسيان Manual Deploy على Render** بعد تعديل backend.
8. **كتابة عربي مباشر في heredoc لملف JS** عمومًا آمن مع `<<'EOF'`، لكن تجنّب مفاتيح Mongoose عربية — اجعل المفاتيح إنجليزية.

## 8) كيف تضيف ميزة (وصفة سريعة)
1. backend: model → controller → route → mount in server.js → `node -e require` تحقّق.
2. (إن إعداد) أضِف الحقل في Settings + readSettings + updateSettings.
3. frontend: صفحة/مكوّن بأنماط الهوية (متغيّرات CSS) → اربط API.
4. روابط: Navbar + /admin/pages (+ CMS/admin إن لزم).
5. `rm -rf .next && npx tsc --noEmit` = 0، وتحقّق من عدم اقتطاع الملفات.
6. أبلغ المستخدم: Commit+Push ← Manual Deploy لـ Render (إن backend) ← Vercel.

## 9) المراجع داخل المشروع
- `سياق_المشروع_للمتابعة.md` و`HANDOFF_ARABDIVING.md`: لقطة الميزات.
- `skills/competitor-insights/SKILL.md`: تحليل المنافسين + خطة الفجوات.
- `STRATEGY_الجمهور_والتسويق.md`، `SOP_اعتماد_مراكز_الغوص.md`: استراتيجية/معايير.
