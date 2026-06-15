# دليل نشر ArabDiving (مع دومين Namecheap)

استضافة Namecheap المشتركة (cPanel) تشغّل PHP فقط ولا تناسب تطبيق Next.js + Node + MongoDB.
لذلك نستضيف التطبيق على منصّات مبنية له (مجانية للبداية)، ونستخدم **دومين Namecheap فقط** للربط:

| الجزء | المنصّة | التكلفة |
|---|---|---|
| قاعدة البيانات | MongoDB Atlas | مجاني (Free M0) |
| الـ backend (الـ API) | Render | مجاني |
| الواجهة (Next.js) | Vercel | مجاني |
| الدومين | Namecheap | ما عندك بالفعل |

> الترتيب مهم: قاعدة البيانات أولًا → الـ backend → الواجهة → ربط الدومين.

---

## ١) رفع الكود على GitHub

كل المنصّات تنشر من GitHub. من مجلد المشروع:

```bash
git init
git add .
git commit -m "ArabDiving"
```

أنشئ مستودعًا (repo) على GitHub وارفع عليه. تأكد أن ملف `backend/.gitignore` موجود (موجود بالفعل) حتى لا يُرفع ملف `.env`.

---

## ٢) قاعدة البيانات — MongoDB Atlas

1. أنشئ حسابًا على https://www.mongodb.com/atlas ثم Cluster مجاني (M0).
2. **Database Access** → أنشئ مستخدمًا بكلمة مرور (احفظهما).
3. **Network Access** → Add IP → اختر **Allow access from anywhere** (`0.0.0.0/0`).
4. **Connect → Drivers** → انسخ رابط الاتصال، وسيكون بالشكل:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/arabdiving
   ```
   (أضف `/arabdiving` قبل علامة الاستفهام كاسم لقاعدة البيانات.)

---

## ٣) الـ backend على Render

1. حساب على https://render.com → **New → Web Service** → اربط مستودع GitHub.
2. الإعدادات:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. **Environment Variables** (من تبويب Environment) — أضف:
   ```
   MONGO_URI      = رابط Atlas من الخطوة السابقة
   JWT_SECRET     = نص عشوائي طويل (مثلاً 40 حرفًا)
   CLOUDINARY_NAME   = من حساب Cloudinary
   CLOUDINARY_KEY    = من حساب Cloudinary
   CLOUDINARY_SECRET = من حساب Cloudinary
   CORS_ORIGIN    = https://YOURDOMAIN.com   (نضبطه نهائيًا بعد نشر الواجهة)
   NODE_ENV       = production
   ```
   > حساب Cloudinary مجاني من https://cloudinary.com (لرفع الصور من لوحة الأدمن).
4. انشر، وستحصل على رابط مثل: `https://arabdiving-api.onrender.com`. افتحه؛ يجب أن ترى `{"message":"ArabDiving API Running"}`.

> ملاحظة: الخطة المجانية في Render «تنام» بعد فترة خمول وتستيقظ خلال ثوانٍ عند أول طلب — طبيعي للبداية.

---

## ٤) الواجهة على Vercel

1. حساب على https://vercel.com → **Add New → Project** → اختر نفس المستودع.
2. الإعدادات:
   - **Root Directory:** `frontend`
   - Framework: Next.js (يُكتشف تلقائيًا)
3. **Environment Variables** — أضف:
   ```
   NEXT_PUBLIC_API_URL = https://arabdiving-api.onrender.com   (رابط Render من الخطوة ٣)
   ```
4. Deploy. ستحصل على رابط مثل `https://arabdiving.vercel.app`. افتحه للتأكد أن الموقع يعمل.

---

## ٥) ربط دومين Namecheap

### أ. على Vercel (للواجهة)
- Project → **Settings → Domains** → أضف دومينك (`yourdomain.com` و`www`).
- Vercel سيعطيك سجلات DNS مطلوبة (عادةً سجل `A` للجذر يشير إلى `76.76.21.21`، وسجل `CNAME` لـ `www` يشير إلى `cname.vercel-dns.com`).

### ب. على Namecheap
- Domain List → **Manage** → **Advanced DNS**.
- احذف أي سجلات Parking قديمة، وأضف السجلات التي طلبها Vercel:
  - `A` Record · Host `@` · Value `76.76.21.21`
  - `CNAME` Record · Host `www` · Value `cname.vercel-dns.com`
- انتظر انتشار الـ DNS (من دقائق إلى ساعات).

### ج. تحديث متغيّرات البيئة بعد الربط
- في **Render**: عدّل `CORS_ORIGIN` ليصبح `https://yourdomain.com,https://www.yourdomain.com` ثم أعد النشر (Manual Deploy).
- (الواجهة لا تحتاج تغييرًا لأن `NEXT_PUBLIC_API_URL` يشير لرابط Render الثابت.)

---

## ٦) بعد النشر — تعبئة البيانات وإنشاء أول مشرف

شغّل الأمرين التاليين **محليًا** من مجلد `backend`، لكن مع `MONGO_URI` الخاص بـ Atlas
(انسخ ملف `.env.example` إلى `.env` وضع فيه رابط Atlas ونفس المفاتيح):

```bash
cd backend
npm install
npm run seed                       # يرفع الـ 41 موقع غوص
npm run make-admin <بريدك>         # بعد ما تسجّل حسابًا من الموقع، رقّيه لمشرف
```

> بديل: يمكن تشغيلهما من **Render → Shell** مباشرة على السيرفر.

بعدها سجّل دخولك بحساب المشرف، وسيظهر رابط **«لوحة الإدارة»** في الأعلى، وتدخل على `/admin`.

---

## ملخص المتغيّرات المطلوبة

**Render (backend):** `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, `CORS_ORIGIN`, `NODE_ENV`

**Vercel (frontend):** `NEXT_PUBLIC_API_URL`

---

## أخطاء شائعة وحلولها

- **الموقع يفتح لكن لا تظهر بيانات / مواقع الغوص فارغة:** غالبًا `NEXT_PUBLIC_API_URL` خطأ في Vercel، أو لم تشغّل `npm run seed`.
- **خطأ CORS في الكونسول:** `CORS_ORIGIN` في Render لا يطابق رابط موقعك بالضبط (لاحظ `https://` وبدون `/` في النهاية).
- **رفع الصور لا يعمل:** تأكد من مفاتيح Cloudinary الثلاثة في Render.
- **تسجيل الدخول لا يحفظ الجلسة:** تأكد أن `JWT_SECRET` مضبوط في Render.
- **الدومين لا يفتح:** انتظر انتشار DNS، وتأكد من السجلات في Advanced DNS على Namecheap.

> إن أردت لاحقًا استضافة كل شيء على سيرفر Namecheap VPS بدل المنصّات، فهذا ممكن لكنه يتطلب إعدادًا يدويًا (Node + Nginx + PM2 + MongoDB) — أخبرني وأكتب لك دليلًا منفصلًا.
