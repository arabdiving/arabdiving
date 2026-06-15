# 🤿 دليل تثبيت ArabDiving — خطوة بخطوة

> لا تحتاج أي خبرة برمجية. اتبع الخطوات بالترتيب.

---

## الخطوة 1 — إنشاء قاعدة البيانات المجانية (MongoDB Atlas)

1. افتح [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
2. سجّل حساباً مجانياً بالبريد الإلكتروني
3. اختر **Create a Free Cluster** (الخيار M0 المجاني)
4. اختر المنطقة الأقرب لك (مثلاً: Frankfurt أو Mumbai)
5. انقر **Create Cluster** وانتظر دقيقتين
6. في القائمة الجانبية، انقر **Database Access** ← **Add New Database User**
   - اكتب اسم مستخدم (مثلاً: `arabdiving-user`)
   - انقر **Autogenerate Secure Password** واحفظ الباسورد
   - انقر **Add User**
7. في القائمة الجانبية، انقر **Network Access** ← **Add IP Address**
   - انقر **Allow Access from Anywhere** ← **Confirm**
8. ارجع إلى **Database** ← انقر **Connect** ← **Connect your application**
   - اختر **Node.js** وانسخ الرابط — سيبدو هكذا:
   ```
   mongodb+srv://arabdiving-user:كلمة-المرور@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **مهم**: استبدل `<password>` بالباسورد الذي حفظته، وأضف `arabdiving` بعد `mongodb.net/` → `mongodb.net/arabdiving`

---

## الخطوة 2 — النشر على Render.com (مجاني)

1. افتح [render.com](https://render.com) وسجّل حساباً مجانياً
2. انقر **New** ← **Web Service**
3. اختر **Deploy an existing image or repository**
   - إذا أردت النشر من الملفات مباشرة: اختر **Upload files** أو استخدم GitHub (أنصح GitHub)

### النشر عبر GitHub (الطريقة الموصى بها):

1. افتح [github.com](https://github.com) وسجّل حساباً مجانياً
2. انقر **New Repository** ← سمّه `arabdiving` ← **Create Repository**
3. ارفع مجلد `arabdiving-fullstack` كاملاً إلى الـ Repository
   - الطريقة السهلة: انقر **uploading an existing file** ← اسحب المجلد كله
4. ارجع إلى Render ← **New** ← **Web Service**
5. وصّل حساب GitHub وابحث عن `arabdiving`
6. في الإعدادات:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

7. انقر **Advanced** ← **Add Environment Variable** وأضف هذه المتغيرات:

| الاسم | القيمة |
|-------|--------|
| `MONGODB_URI` | رابط MongoDB الذي نسخته في الخطوة 1 |
| `JWT_SECRET` | أي نص طويل عشوائي، مثلاً: `arabdiving-secret-2026-xyz` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | كلمة مرور قوية من اختيارك |
| `ADMIN_NAME` | اسمك أو لقبك |
| `PORT` | `3000` |

8. انقر **Create Web Service** وانتظر 3-5 دقائق

---

## الخطوة 3 — زرع البيانات الأولية

بعد أن يعمل الخادم على Render:

1. افتح Terminal على جهازك
2. انتقل إلى مجلد `arabdiving-fullstack`:
   ```
   cd "مسار المجلد"
   ```
3. انسخ ملف `.env.example` وسمّه `.env`:
   ```
   copy .env.example .env
   ```
4. افتح `.env` بـ Notepad وعدّل القيم (MongoDB URI + باسوردات)
5. ثبّت المكتبات:
   ```
   npm install
   ```
6. شغّل seed:
   ```
   npm run seed
   ```

---

## الخطوة 4 — رفع ملفات HTML

انسخ كل ملفات صفحات الموقع (`*.html` من `arabdiving-custom-pages-v8.zip`) إلى مجلد:
```
arabdiving-fullstack/public/pages/
```

---

## الخطوة 5 — الدخول إلى لوحة التحكم

بعد النشر، افتح:
```
https://اسم-مشروعك.onrender.com/admin-panel
```

- المستخدم: ما كتبته في `ADMIN_USERNAME`
- الباسورد: ما كتبته في `ADMIN_PASSWORD`

---

## هيكل المشروع (للمرجع)

```
arabdiving-fullstack/
├── server.js          ← نقطة البداية
├── package.json       ← تعريف المشروع
├── .env               ← كلمات السر والإعدادات (لا ترفعه على GitHub!)
├── config/
│   └── db.js          ← الاتصال بقاعدة البيانات
├── models/            ← هيكل البيانات
├── routes/            ← مسارات API
├── middleware/        ← التحقق من الهوية
├── scripts/
│   └── seed.js        ← زرع البيانات الأولية
└── public/
    ├── admin/
    │   └── index.html ← لوحة التحكم
    └── pages/         ← ضع هنا ملفات HTML للموقع
```

---

## ملاحظات مهمة

- 🔐 **لا ترفع ملف `.env` على GitHub أبداً** — فيه كلمات سر
- ⏱️ **Render Free Tier** ينام بعد 15 دقيقة عدم استخدام، أول طلب يستغرق 30 ثانية — طبيعي
- 💾 **MongoDB Atlas Free** يعطيك 512MB مجاناً — كافية للموقع لسنوات
- 🔄 عند أي تعديل في الكود، ارفعه على GitHub وسيتحدث Render تلقائياً

---

## مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| خطأ MongoDB connection | تأكد من MONGODB_URI والـ password |
| الخادم لا يبدأ | تأكد من أن PORT=3000 موجود في المتغيرات |
| لوحة التحكم تقول "خطأ في تسجيل الدخول" | شغّل `npm run seed` أولاً |
| الصفحات لا تظهر | تأكد من وجود ملفات HTML في `public/pages/` |
