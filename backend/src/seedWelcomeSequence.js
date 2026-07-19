require("dotenv").config();
const mongoose = require("mongoose");
const EmailSequence = require("./models/EmailSequence");

// تسلسل ترحيب جاهز من 4 خطوات (يمكن تعديله لاحقاً من لوحة التحكم).
const steps = [
  {
    order: 1,
    delayHours: 0, // فوراً بعد التأكيد
    role: "all",
    subject: "أهلاً بك في مجتمع ArabDiving 🌊",
    html: `<h2 style="color:#0b6ea8;">أهلاً {{name}} 👋</h2>
      <p>سعداء بانضمامك لمجتمع الغوص في البحر الأحمر. كل أسبوع سنرسل لك أفضل مواقع الغوص، نصائح الأمان، وعروض شركائنا.</p>
      <p>ابدأ بإخبارنا عن مستواك لنقترح لك الأنسب — وردّ على هذه الرسالة بأي سؤال عن الغوص!</p>`,
  },
  {
    order: 2,
    delayHours: 48, // بعد يومين
    role: "all",
    subject: "3 أخطاء يقع فيها كل مبتدئ في الغوص",
    html: `<h2 style="color:#0b6ea8;">تجنّب هذه الأخطاء 🤿</h2>
      <p>مرحباً {{name}}، إليك أكثر 3 أخطاء شيوعاً:</p>
      <ol>
        <li>عدم موازنة الضغط مبكراً وببطء أثناء النزول.</li>
        <li>استهلاك الهواء بسرعة بسبب التوتر — تنفّس بعمق وهدوء.</li>
        <li>إهمال فحص المعدات قبل الغطسة مع الشريك (Buddy Check).</li>
      </ol>
      <p>مدرّب جيد يصنع الفرق. منصتنا تطابقك مع المدرّب الأنسب لأسلوبك.</p>`,
  },
  {
    order: 3,
    delayHours: 96, // بعد 4 أيام
    role: "all",
    subject: "أفضل مواقع الغوص حسب مستواك 🗺️",
    html: `<h2 style="color:#0b6ea8;">إلى أين تغوص بعد ذلك؟</h2>
      <p>{{name}}، اخترنا لك مواقع مميزة في البحر الأحمر:</p>
      <ul>
        <li><b>مبتدئ:</b> شرم أبحر (جدة) — دهب Lighthouse (مصر).</li>
        <li><b>متوسط:</b> جزيرة أبو طير / حطام Stavronikita (جدة).</li>
        <li><b>متقدّم:</b> Blue Hole (دهب) — جزر الأخوين (الغردقة).</li>
      </ul>`,
  },
  {
    order: 4,
    delayHours: 168, // بعد أسبوع
    role: "all",
    subject: "جاهز لرحلتك القادمة؟ عروض الأعضاء 🎁",
    html: `<h2 style="color:#0b6ea8;">عرض خاص لأعضاء المجتمع</h2>
      <p>مرحباً {{name}}، شركاؤنا من مراكز الغوص المعتمدة يقدّمون خصومات حصرية لأعضاء ArabDiving.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="#" style="background:#0b6ea8;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-weight:bold;">استعرض العروض</a>
      </p>
      <p style="color:#7a8a99;font-size:13px;">استبدل الرابط بصفحة عروضك الفعلية.</p>`,
  },
];

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI غير مضبوط في backend/.env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ متصل بقاعدة البيانات");
    const seq = await EmailSequence.findOneAndUpdate(
      { key: "welcome" },
      { key: "welcome", name: "تسلسل الترحيب", enabled: true, steps },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ تم تثبيت تسلسل الترحيب (${seq.steps.length} خطوات).`);
    process.exit(0);
  } catch (e) {
    console.error("❌", e.message);
    process.exit(1);
  }
})();
