import Link from "next/link";

export const metadata = {
  title: "ماذا يقول المعيار الدولي عن كورسك؟ | ArabDiving",
  description: "الحد الأدنى الملزم لكورس الأوبن ووتر حسب ISO 24801-2 — النظري والمياه المحصورة والمفتوحة — وموقع الأدفانس من المعايير الدولية.",
};

/*
  معايير الكورسات — صفحة «الناصح الأمين» المرجعية:
  1) الأوبن ووتر: الحد الأدنى الملزم حرفيًا من ISO 24801-2:2014 (نظري + مياه محصورة + مياه مفتوحة + تقييم).
  2) الأدفانس: الحقيقة الصريحة — ليس مستوى أيزو مستقلًا، بل برنامج خبرة بين المستويين 2 و3.
  المصدر الأساسي: نص المعيار ISO 24801-2:2014 (النسخة المعتمدة لدى غرفة الغوص المصرية CDWS).
*/

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

const THEORY = [
  { icon: "🎽", t: "المعدات", d: "من الماسك للكمبيوتر: خصائص كل قطعة، مبدأ عملها، صيانتها واستخدامها — قائمة المعيار تشمل ~20 بندًا" },
  { icon: "⚛️", t: "فيزياء الغوص", d: "الضغط وقوانين الغازات، الطفو، الصوت والضوء والحرارة تحت الماء" },
  { icon: "🧮", t: "إدارة إزالة الضغط", d: "الجداول والكمبيوتر: تخطيط غطسات بلا توقفات ديكو (فردية ومتكررة)" },
  { icon: "🗺️", t: "تخطيط الغطسة", d: "منع نفاد الهواء، إجراءات الطوارئ، التواصل تحت الماء وفوقه، مساعدة الرفيق، الغوص من القوارب" },
  { icon: "🩺", t: "المشاكل الطبية", d: "إصابات الضغط صعودًا ونزولًا، مرض تخفيف الضغط، تخدير النيتروجين، الإسعافات وأكسجين الطوارئ" },
  { icon: "🧠", t: "الجانب النفسي", d: "المعيار ينص صراحة: التوتر، الهلع، والثقة الزائدة — أسبابها والوقاية منها" },
  { icon: "🪸", t: "بيئة الغوص", d: "التيارات والرؤية والحرارة، الكائنات البحرية، والسلوك الحافظ للبيئة" },
  { icon: "🫧", t: "غازات غير الهواء", d: "إن استُخدم غاز غير الهواء في الكورس: حدود العمق وإدارة الأكسجين" },
];

const CONFINED = [
  "تجهيز وفك المعدات وفحص ما قبل الغطسة وفحوصات الرفيق",
  "الوزن الصحيح والدخول والخروج من الماء",
  "تفريغ الماسك من الماء — ثم نزعه وإعادته والتنفس بدونه بهدوء",
  "استرجاع الرجيوليتر وحل المشكلات تحت الماء",
  "التحكم الكامل في الطفو تحت الماء وعلى السطح",
  "مشاركة الهواء في الطوارئ — مانحًا ومستقبلًا",
  "فك وإعادة تركيب حزام الأثقال وجهاز السكوبا",
  "إشارات اليد ومراقبة الرفيق ومراقبة الأجهزة",
];

const OPEN_WATER_RULES = [
  { n: "4+", l: "غطسات تأهيلية كحد أدنى", d: "في نطاق عمق 4–20 مترًا بإشراف مباشر من المدرب" },
  { n: "15", l: "دقيقة على الأقل لكل غطسة", d: "تحت الماء فعليًا — البريفينج والتجهيز لا يُحسبان" },
  { n: "80", l: "دقيقة إجمالي زمن تحت الماء", d: "الحد الأدنى المسجل قبل منح الشهادة" },
  { n: "3", l: "غطسات كحد أقصى في اليوم", d: "المعيار يمنع حشر الكورس في يوم واحد" },
  { n: "50", l: "مترًا سباحة سطح بالمعدات", d: "على الأقل — للعودة الآمنة لنقطة الخروج" },
  { n: "⬆️", l: "وصول رأسي مباشر للسطح", d: "ممنوع التدريب في الكهوف أو داخل الحطام أو تحت الجليد" },
];

const ADV_DIVES = [
  { icon: "🔽", t: "غطسة العمق", d: "التعود التدريجي على نطاق 18–30م وأثر التخدير النيتروجيني", core: true },
  { icon: "🧭", t: "الملاحة تحت الماء", d: "البوصلة والمعالم الطبيعية — ألا تتوه ولا تستهلك هواءك في البحث", core: true },
  { icon: "🌙", t: "اختيارية: ليلي / رؤية محدودة", d: "" },
  { icon: "🪶", t: "اختيارية: إتقان الطفو", d: "" },
  { icon: "🚢", t: "اختيارية: حطام من الخارج / قارب / تيارات / تصوير...", d: "" },
];

export default function CourseStandardsPage() {
  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      {/* الهيرو */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "60px 20px 44px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "780px", margin: "0 auto" }}>
          <span style={{ ...glass, display: "inline-block", color: "#22d3ee", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "14px" }}>📏 المرجع الدولي — لا كلام مدارس</span>
          <h1 style={{ fontSize: "clamp(26px,5.5vw,42px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "12px", lineHeight: 1.5 }}>
            ماذا يقول المعيار الدولي<br />عن كورس الغوص الذي ستدفع فيه؟
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(14px,3vw,17px)", lineHeight: 2, maxWidth: "640px", margin: "0 auto 20px" }}>
            هذا ليس رأينا ولا رأي أي مدرسة — هذا الحد الأدنى <b style={{ color: "#fff" }}>الملزم</b> الذي نصّت عليه
            منظمة المعايير الدولية، وتلتزم به كل المدارس المعتمدة (CMAS، NAUI، PADI، RAID، SDI، SSI...).
            اعرف حقك قبل أن تدفع — وقارن به أي عرض يُقدَّم لك.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#open-water" style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "white", padding: "11px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "13.5px" }}>🤿 الأوبن ووتر</a>
            <a href="#advanced" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", padding: "11px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "13.5px" }}>🚀 الأدفانس</a>
            <a href="#rescue" style={{ background: "linear-gradient(135deg,#dc2626,#f87171)", color: "white", padding: "11px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "13.5px" }}>🛟 الريسكيو</a>
            <a href="#divemaster" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", padding: "11px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "13.5px" }}>🎖️ الدايف ماستر</a>
            <a href="#instructor" style={{ background: "linear-gradient(135deg,#059669,#34d399)", color: "white", padding: "11px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "13.5px" }}>🧑‍🏫 المدرب</a>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "36px 18px 70px", display: "flex", flexDirection: "column", gap: "40px" }}>

        {/* ════ الأوبن ووتر ════ */}
        <section id="open-water" style={{ scrollMarginTop: "90px" }}>
          <p style={{ color: "#22d3ee", fontWeight: 800, fontSize: "13px", letterSpacing: "1px", marginBottom: "6px" }}>ISO 24801-2:2014 — المستوى 2 «الغواص المستقل»</p>
          <h2 style={{ color: "var(--ink,#fff)", fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 900, marginBottom: "10px" }}>🤿 كورس الأوبن ووتر — الحد الأدنى الملزم</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14.5px", lineHeight: 2, marginBottom: "22px" }}>
            بنهاية الكورس يشهد المعيار أنك قادر على الغوص <b style={{ color: "#fff" }}>باستقلال — دون إشراف مدرب</b> — مع
            رفيق من نفس مستواك، حتى عمق موصى به <b style={{ color: "#22d3ee" }}>20 مترًا</b>، في غطسات لا تتطلب توقفات
            إزالة ضغط، وبظروف مماثلة أو أفضل من ظروف تدريبك.
          </p>

          {/* قبل أن تبدأ */}
          <div style={{ ...glass, borderRadius: "16px", padding: "20px", marginBottom: "18px" }}>
            <h3 style={{ color: "#fff", fontSize: "16.5px", fontWeight: 800, marginBottom: "10px" }}>✋ قبل أول نفس تحت الماء — المعيار يشترط:</h3>
            <ul style={{ margin: 0, paddingInlineStart: "20px", color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: 2.1 }}>
              <li><b style={{ color: "#fff" }}>إقرار طبي موثق</b> (استبيان أو كشف طبيب) — وموافقة ولي الأمر للقُصّر.</li>
              <li><b style={{ color: "#fff" }}>اختبار مائي:</b> طفو/بقاء 5 دقائق بلا أي أدوات + سباحة 200م بلا أدوات <i>أو</i> 300م بالماسك والزعانف والسنوركل.</li>
              <li>لا تنزل المياه المفتوحة إلا بعد إثبات كفاية النظري ومهارات المياه المحصورة.</li>
            </ul>
          </div>

          {/* النظري */}
          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>📚 العلوم النظرية — 8 محاور إلزامية</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "12px", marginBottom: "22px" }}>
            {THEORY.map((x) => (
              <div key={x.t} style={{ ...glass, borderRadius: "14px", padding: "16px" }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{x.icon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", marginBottom: "4px" }}>{x.t}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.8 }}>{x.d}</div>
              </div>
            ))}
          </div>

          {/* المياه المحصورة */}
          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 6px" }}>🏊 المياه المحصورة (الحوض) — أتقِن قبل البحر</h3>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13.5px", lineHeight: 1.9, marginBottom: "12px" }}>
            المعيار يلزم بإتقان <b style={{ color: "#fff" }}>أكثر من 20 مهارة</b> في مياه محصورة قبل أداء أيٍّ منها في البحر،
            والمدرب <b style={{ color: "#22d3ee" }}>داخل الماء</b> في كل جلسة — لا يدرّب من على الشاطئ. أبرزها:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "8px", marginBottom: "22px" }}>
            {CONFINED.map((s) => (
              <div key={s} style={{ ...glass, borderRadius: "10px", padding: "10px 14px", color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: 1.7 }}>✅ {s}</div>
            ))}
          </div>

          {/* المياه المفتوحة — الأرقام الملزمة */}
          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>🌊 المياه المفتوحة — الأرقام التي لا يجوز النزول عنها</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "14px" }}>
            {OPEN_WATER_RULES.map((r) => (
              <div key={r.l} style={{ ...glass, borderRadius: "14px", padding: "18px 14px", textAlign: "center" }}>
                <div style={{ color: "#22d3ee", fontSize: "30px", fontWeight: 900 }}>{r.n}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "13px", margin: "4px 0" }}>{r.l}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11.5px", lineHeight: 1.7 }}>{r.d}</div>
              </div>
            ))}
          </div>
          <ul style={{ margin: "0 0 18px", paddingInlineStart: "20px", color: "rgba(255,255,255,0.65)", fontSize: "13.5px", lineHeight: 2.1 }}>
            <li>المدرب داخل الماء ومسؤول عن كل غطسة، ويلغيها فورًا إن ساءت الظروف أو حالة المتدرب.</li>
            <li>بعد أول غطستين يصبح وجود وسيلة قياس العمق والوقت (كمبيوتر الغوص) <b style={{ color: "#fff" }}>إلزاميًا</b> على المتدرب.</li>
            <li>التقييم النهائي: امتحان نظري (كتابي أو شفهي) + أداء كل المهارات أمام المدرب بشكل مريح ومتزن.</li>
          </ul>

          {/* سؤال الناصح */}
          <div style={{ background: "rgba(201,149,42,0.1)", border: "1px solid rgba(201,149,42,0.3)", borderRadius: "14px", padding: "18px 20px", color: "#fbbf24", fontSize: "14px", lineHeight: 2 }}>
            💡 <b>سؤال الناصح الأمين قبل أن تدفع:</b> «كم غطسة مياه مفتوحة؟ كم دقيقة تحت الماء فعليًا؟ هل المدرب داخل
            الماء معي؟» — لو عُرض عليك «أوبن ووتر في يوم واحد» فتذكّر: 4 غطسات × 15 دقيقة بحد أقصى 3 غطسات
            يوميًا... <b>الحساب لا يكذب</b>. السرعة الزائدة ليست كرمًا — بل اقتطاعًا من حقك.
          </div>
        </section>

        {/* ════ الأدفانس ════ */}
        <section id="advanced" style={{ scrollMarginTop: "90px" }}>
          <p style={{ color: "#e8a830", fontWeight: 800, fontSize: "13px", letterSpacing: "1px", marginBottom: "6px" }}>بين المستوى 2 والمستوى 3 (ISO 24801-3 قائد الغوص)</p>
          <h2 style={{ color: "var(--ink,#fff)", fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 900, marginBottom: "10px" }}>🚀 كورس الأدفانس — الحقيقة كاملة</h2>

          <div style={{ ...glass, borderRadius: "16px", padding: "20px", marginBottom: "18px", borderColor: "rgba(232,168,48,0.3)" }}>
            <h3 style={{ color: "#fbbf24", fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>🔍 مصارحة لا تسمعها كثيرًا:</h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 2.1, margin: 0 }}>
              «الأدفانس» <b style={{ color: "#fff" }}>ليس مستوى أيزو مستقلًا</b>. سلّم الأيزو الرسمي: المستوى 1 (غواص تحت
              إشراف) ← المستوى 2 (غواص مستقل = الأوبن ووتر) ← المستوى 3 (قائد غوص، ISO 24801-3). الأدفانس برنامج
              <b style={{ color: "#fff" }}> خبرة موجّهة</b> صممته المدارس بين المستويين: غطسات تدريبية متنوعة مع مدرب
              لتوسيع حدودك بأمان — وأشهر أثر له: رفع العمق الموصى به من 18–20م إلى <b style={{ color: "#e8a830" }}>30م</b>.
              وهو مفيد فعلًا — لكن قيمته كلها في <b style={{ color: "#fff" }}>كيف يُدرَّس</b>، لا في الاسم.
            </p>
          </div>

          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>🧩 مكوناته المتعارف عليها لدى المدارس (عادة 4–5 غطسات مغامرة)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px", marginBottom: "18px" }}>
            {ADV_DIVES.map((d) => (
              <div key={d.t} style={{ ...glass, borderRadius: "14px", padding: "16px", borderTop: d.core ? "3px solid #e8a830" : undefined }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{d.icon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "13.5px", marginBottom: d.d ? "4px" : 0 }}>
                  {d.t} {d.core && <span style={{ color: "#e8a830", fontSize: "11px" }}>· أساسية</span>}
                </div>
                {d.d && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.8 }}>{d.d}</div>}
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(201,149,42,0.1)", border: "1px solid rgba(201,149,42,0.3)", borderRadius: "14px", padding: "18px 20px", color: "#fbbf24", fontSize: "14px", lineHeight: 2, marginBottom: "18px" }}>
            💡 <b>نصيحة الناصح الأمين:</b> لا تسأل «هل أحتاج الأدفانس؟» بل «ماذا أريد أن أغوص؟». مواقع البحر الأحمر
            الأسطورية (الثيسلجورم، بلو هول من الخارج، حوائط الأخوين) تحتاج عمق 30م وملاحة وثقة — هنا قيمة الأدفانس
            الحقيقية. واختر غطساتك الاختيارية بهدف، ومدربًا <b>يدرّس</b> كل غطسة ببريفينج وأهداف ودي-بريفينج — لا
            مرافقًا يختم البطاقات. وبعده، المستوى الدولي التالي الحقيقي في السلّم: الإنقاذ ثم قائد الغوص (ISO 24801-3).
          </div>

        </section>

        {/* ════ الريسكيو ════ */}
        <section id="rescue" style={{ scrollMarginTop: "90px" }}>
          <p style={{ color: "#f87171", fontWeight: 800, fontSize: "13px", letterSpacing: "1px", marginBottom: "6px" }}>مدمج في ISO 24801-3 — بوابة الاحتراف</p>
          <h2 style={{ color: "var(--ink,#fff)", fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 900, marginBottom: "10px" }}>🛟 كورس الريسكيو (الإنقاذ) — نقطة التحول</h2>

          <div style={{ ...glass, borderRadius: "16px", padding: "20px", marginBottom: "18px", borderColor: "rgba(248,113,113,0.3)" }}>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 2.1, margin: 0 }}>
              مثل الأدفانس، الريسكيو <b style={{ color: "#fff" }}>ليس مستوى أيزو مستقلًا</b> — لكن الأيزو لم يتجاهله:
              أدمج كفاءات الإنقاذ كاملة <b style={{ color: "#f87171" }}>كشرط إلزامي داخل المستوى 3 (قائد الغوص)</b>.
              أي أن المدارس حين صممت «كورس الريسكيو» المستقل كانت تفصل هذا الجزء الإلزامي لتدرّسه مبكرًا —
              وهو بإجماع المدربين الكورس الذي يحوّلك من غواص يهتم بنفسه إلى غواص ينتبه لكل من حوله.
            </p>
          </div>

          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>ما الذي ينص عليه المعيار في مهارات الإنقاذ؟ (البند 9.3–9.5)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "8px", marginBottom: "16px" }}>
            {[
              "التعرف على حالات الطوارئ (نفاد الهواء، فقدان الاستجابة)",
              "تقنيات البحث الأساسية تحت الماء عن غواص مفقود",
              "انتشال مصاب من العمق بشكل محكوم (دون إيذائه بالصعود)",
              "إجراءات السطح الفعالة وإخراج المصاب من الماء",
              "إدارة موقف الطوارئ والتنسيق مع خدمات الإسعاف",
              "تنفيذ إنقاذ كامل واحد على الأقل في مياه مفتوحة أمام المقيّم",
            ].map((s) => (
              <div key={s} style={{ ...glass, borderRadius: "10px", padding: "10px 14px", color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: 1.7 }}>🛟 {s}</div>
            ))}
          </div>
          <ul style={{ margin: "0 0 18px", paddingInlineStart: "20px", color: "rgba(255,255,255,0.65)", fontSize: "13.5px", lineHeight: 2.1 }}>
            <li>ويُلزم المعيار معه: شهادة <b style={{ color: "#fff" }}>إسعافات أولية وإنعاش قلبي رئوي (CPR)</b> سارية.</li>
            <li>وتدريبًا نظريًا وعمليًا على <b style={{ color: "#fff" }}>إعطاء الأكسجين في الطوارئ</b>.</li>
          </ul>
          <div style={{ background: "rgba(201,149,42,0.1)", border: "1px solid rgba(201,149,42,0.3)", borderRadius: "14px", padding: "18px 20px", color: "#fbbf24", fontSize: "14px", lineHeight: 2 }}>
            💡 <b>نصيحة الناصح الأمين:</b> الريسكيو أفضل استثمار في سلّم الغوص كله — حتى لو لم تنوِ الاحتراف أبدًا.
            ستغوص مع أصدقائك وعائلتك، والكورس الجيد <b>مرهق عمدًا</b>: سيناريوهات هلع حقيقية وبحث وسحب —
            فاحذر «ريسكيو مريحًا» يُنهى في نصف يوم.
          </div>
        </section>

        {/* ════ الدايف ماستر ════ */}
        <section id="divemaster" style={{ scrollMarginTop: "90px" }}>
          <p style={{ color: "#a78bfa", fontWeight: 800, fontSize: "13px", letterSpacing: "1px", marginBottom: "6px" }}>ISO 24801-3:2014 — المستوى 3 «قائد الغوص»</p>
          <h2 style={{ color: "var(--ink,#fff)", fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 900, marginBottom: "10px" }}>🎖️ الدايف ماستر — أول درجات الاحتراف</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14.5px", lineHeight: 2, marginBottom: "18px" }}>
            هنا نعود لمستوى أيزو رسمي كامل. «قائد الغوص» مؤهل ليخطط وينظم ويقود غواصين مؤهلين في المياه المفتوحة —
            و<b style={{ color: "#fff" }}>الحد الأدنى لسن القيادة 18 عامًا</b>. وانتبه لنقطة ينص عليها المعيار حرفيًا:
            قائد الغوص <b style={{ color: "#a78bfa" }}>يساعد في ضبط الطلاب ورفع الأمان، لكن لا يجوز له تدريس أو تقييم
            أي مهارة</b> — التدريس حصريًا للمدرب المؤهل بمعيار 24802.
          </p>

          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>🔢 أرقام الخبرة الملزمة قبل الشهادة</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "18px" }}>
            {[
              { n: "60", l: "غطسة مسجلة كحد أدنى", d: "أو 50 غطسة بإجمالي 25 ساعة تحت الماء" },
              { n: "40", l: "غطسة بعد الأوبن ووتر", d: "على الأقل — الخبرة الحديثة لا القديمة" },
              { n: "30", l: "غطسة بظروف متنوعة", d: "رؤية ضعيفة، تيارات، مياه باردة — تنويع إلزامي" },
              { n: "18", l: "عامًا حد أدنى للقيادة", d: "ولا قيادة قبل استيفاء كل الكفاءات" },
            ].map((r) => (
              <div key={r.l} style={{ ...glass, borderRadius: "14px", padding: "18px 14px", textAlign: "center" }}>
                <div style={{ color: "#a78bfa", fontSize: "30px", fontWeight: 900 }}>{r.n}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "13px", margin: "4px 0" }}>{r.l}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11.5px", lineHeight: 1.7 }}>{r.d}</div>
              </div>
            ))}
          </div>

          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>🧩 ما الذي يجب أن يتقنه؟</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "12px", marginBottom: "18px" }}>
            {[
              { icon: "📚", t: "نظري موسّع (19 محورًا)", d: "من إجراءات الغوص الليلي والعميق والتيارات حتى إجراءات الغواص المفقود والقوانين المحلية" },
              { icon: "🏅", t: "مهاراته الشخصية بدرجة «إتقان»", d: "كل مهارات الأوبن ووتر تُعاد بأعلى درجة تمكن وبهدوء تام — فهو القدوة تحت الماء" },
              { icon: "🔽", t: "إتقان العميق والملاحة", d: "تخطيط وتنفيذ غطسات عميقة (التخدير، الاستهلاك، توقفات الصعود) وملاحة بالأجهزة والمعالم" },
              { icon: "🧑‍✈️", t: "مهارات القيادة الكاملة", d: "اختيار الموقع، خطة الطوارئ، البريفينج، ضبط النزول والصعود، مراقبة هواء وتوتر المجموعة، الدي-بريفينج" },
              { icon: "🛟", t: "الإنقاذ والإسعاف والأكسجين", d: "كل قسم الريسكيو أعلاه شرط إلزامي داخل هذا المستوى" },
              { icon: "🤿", t: "قيادة التجارب الاستكشافية", d: "ملحق خاص: بعد تدريب إضافي يقود من جرّبوا الغوص التعريفي بنسبة 2:1 وحتى 12م فقط" },
            ].map((x) => (
              <div key={x.t} style={{ ...glass, borderRadius: "14px", padding: "16px" }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{x.icon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", marginBottom: "4px" }}>{x.t}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.8 }}>{x.d}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(201,149,42,0.1)", border: "1px solid rgba(201,149,42,0.3)", borderRadius: "14px", padding: "18px 20px", color: "#fbbf24", fontSize: "14px", lineHeight: 2 }}>
            💡 <b>سؤال الناصح الأمين:</b> قبل أي برنامج دايف ماستر اسأل: «كم غطسة في سجلي الآن؟ وهل البرنامج سيغطيني
            بغطسات ظروف متنوعة فعلًا؟» — دايف ماستر تخرّج كله في نفس الموقع الهادئ لم يستوفِ روح المعيار حتى لو استوفى عدّه.
          </div>
        </section>

        {/* ════ المدرب ════ */}
        <section id="instructor" style={{ scrollMarginTop: "90px" }}>
          <p style={{ color: "#34d399", fontWeight: 800, fontSize: "13px", letterSpacing: "1px", marginBottom: "6px" }}>ISO 24802-1 و ISO 24802-2 — معيارا المدربين</p>
          <h2 style={{ color: "var(--ink,#fff)", fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 900, marginBottom: "10px" }}>🧑‍🏫 المدرب — حين يصبح التعليم مسؤولية</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14.5px", lineHeight: 2, marginBottom: "18px" }}>
            للمدربين معياران مستقلان بمستويين: <b style={{ color: "#fff" }}>المستوى 1 (24802-1)</b> — مدرب مساعد يعلّم
            النظري ومهارات المياه المحصورة تحت إشراف مدرب كامل، و<b style={{ color: "#fff" }}>المستوى 2 (24802-2)</b> —
            المدرب الكامل (OWSI) المخوّل وحده بإدارة كورسات كاملة وتقييم الطلاب ومنح الشهادات. وفي مصر، تشترط غرفة
            الغوص CDWS أن قائد الغطسات التعريفية في المياه المفتوحة يكون مدرب مستوى 2 حصريًا.
          </p>

          <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 12px" }}>ما الذي يشترطه المعيار في المدرب الكامل؟</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "12px", marginBottom: "18px" }}>
            {[
              { icon: "🎖️", t: "أن يكون قائد غوص أولًا", d: "كل كفاءات المستوى 3 (بما فيها الإنقاذ والإسعاف والأكسجين) شرط مسبق — وخبرة عملية موثقة تشترط فيها المدارس عادة ما بين 60 و100 غطسة مسجلة" },
              { icon: "📖", t: "علوم نظرية بمستوى معلّم", d: "لا يكفي أن يعرف — يجب أن يشرح الفيزياء والفسيولوجيا والديكو بطرق يفهمها المبتدئ" },
              { icon: "🎓", t: "مهارات تدريس موثقة", d: "تحضير الدروس، العروض التوضيحية البطيئة المثالية تحت الماء، تصحيح الأخطاء، وإدارة صفوف حقيقية" },
              { icon: "🛡️", t: "إشراف وإدارة أمان", d: "نسب طلاب ملزمة، التحكم في المجموعة بالمياه المحصورة والمفتوحة، وقرار إلغاء الحصة بيده وحده" },
              { icon: "🛟", t: "طوارئ بمستوى محترف", d: "إنقاذ وإسعاف وأكسجين — تُختبر مجددًا في سياق تدريسي: إنقاذ طالبك أنت" },
              { icon: "⚖️", t: "تقييم مستقل", d: "الاعتماد النهائي عبر تقييم موثق لدى منظمته (ومدرّبو المدربين لهم اشتراطات أعلى) — ثم تدقيق خارجي على المنظمة نفسها عبر EUF/الأيزو" },
            ].map((x) => (
              <div key={x.t} style={{ ...glass, borderRadius: "14px", padding: "16px" }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{x.icon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", marginBottom: "4px" }}>{x.t}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.8 }}>{x.d}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "14px", padding: "18px 20px", color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 2, marginBottom: "18px" }}>
            🧬 <b style={{ color: "#34d399" }}>وهنا تبدأ رسالة موقعنا:</b> المعيار يضمن أن كل مدرب معتمد تجاوز
            <b style={{ color: "#fff" }}> الحد الأدنى</b> — لكنه لا يخبرك بأسلوبه: هل يصبر على الخائف؟ هل يبدع مع
            الأطفال؟ هل يحب التحدي مع المتقدمين؟ هذا بالضبط ما تكشفه «البصمة التدريبية» واستبيان «من يناسبه» لكل
            مدرب على منصتنا.
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/instructors" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", padding: "13px 26px", borderRadius: "12px", fontWeight: 800, fontSize: "14.5px" }}>🧬 اختر مدربك ببصمته التدريبية</Link>
            <Link href="/standards" style={{ ...glass, color: "#22d3ee", padding: "13px 26px", borderRadius: "12px", fontWeight: 800, fontSize: "14.5px" }}>🛡️ معايير اعتمادنا للمراكز</Link>
          </div>
        </section>

        {/* المصدر */}
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", lineHeight: 1.9, textAlign: "center", margin: 0 }}>
          المراجع: نصوص المعايير الدولية ISO 24801-2:2014 وISO 24801-3:2014 وسلسلة ISO 24802 (النسخ المعتمدة لدى
          غرفة الغوص المصرية CDWS) واشتراطات CDWS المحلية. الأرقام المذكورة هي الحد الأدنى —
          المدارس والمدربون الجيدون يقدمون أكثر منها، لا أقل.
        </p>
      </div>
    </main>
  );
}
