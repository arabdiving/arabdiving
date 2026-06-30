"use client";

import { useState, useRef, useEffect } from "react";

/* ─── Data ─────────────────────────────────────────────── */
const QUESTIONS = [
  // Section 1 — Attention
  { id: 1, section: 1, text: "أجد صعوبة في إتمام المهام التي تتطلب تركيزًا مستمرًا (كقراءة تقرير أو إنجاز مشروع)" },
  { id: 2, section: 1, text: "يشرد ذهني بسرعة عند الاستماع إلى محاضرة أو تعليمات طويلة" },
  { id: 3, section: 1, text: "أؤجّل المهام حتى اللحظة الأخيرة حتى لو كانت مهمة" },
  { id: 4, section: 1, text: "أفقد الأشياء (الهاتف، المفاتيح، الأوراق) بشكل متكرر" },
  { id: 5, section: 1, text: "أنتقل من نشاط لآخر بسرعة دون إتمام الأول" },
  { id: 6, section: 1, text: "أشعر بالملل الشديد من الأنشطة المتكررة وأفقد الاهتمام بها بسرعة" },
  // Section 2 — Reading
  { id: 7,  section: 2, text: "أفقد مكاني أثناء القراءة وأعيد نفس السطر أو أتخطى أسطرًا دون قصد" },
  { id: 8,  section: 2, text: "أحتاج إلى إعادة قراءة الجملة أكثر من مرة لأفهم معناها" },
  { id: 9,  section: 2, text: "أعاني من صعوبة في تهجئة الكلمات أو الخلط بين حروف أو كلمات متشابهة المظهر" },
  { id: 10, section: 2, text: "أفضّل الاستماع إلى المحتوى (بودكاست، فيديو، شرح شفهي) على قراءته" },
  { id: 11, section: 2, text: "يستغرق مني الكتابة أو صياغة النصوص وقتًا أطول مما أتوقع" },
  { id: 12, section: 2, text: "أجد صعوبة في تنظيم أفكاري وكتابتها بشكل متسلسل حتى لو كانت واضحة في ذهني" },
  // Section 3 — Numbers
  { id: 13, section: 3, text: "أجد صعوبة في تذكّر تسلسل خطوات المسائل أو الإجراءات (مثل خطوات حل مسألة أو اتباع وصفة)" },
  { id: 14, section: 3, text: "أخلط بين أرقام أو تسلسلات متشابهة (مثل ٦ و٩، أو ١٣ و٣١)" },
  { id: 15, section: 3, text: "أجد صعوبة في تقدير الوقت أو المسافات أو الكميات بدقة معقولة" },
  { id: 16, section: 3, text: "أشعر بقلق أو توتر ملحوظ عند التعامل مع الأرقام أو الحسابات في الحياة اليومية" },
  { id: 17, section: 3, text: "أضيع في الخرائط أو التعليمات المكانية (يمين/يسار) حتى في أماكن أعرفها" },
];

const SCALE = ["لا أبدًا", "نادرًا", "أحيانًا", "غالبًا", "دائمًا"];

const RECS: Record<string, Record<string, { icon: string; text: string }[]>> = {
  attention: {
    low: [
      { icon: "✅", text: "أداؤك جيد في التركيز والتنظيم. استمر في استخدام قوائم المهام اليومية." },
      { icon: "🎯", text: "جرّب تقنية Pomodoro — 25 دقيقة عمل + 5 راحة — لتعزيز تركيزك." },
      { icon: "📱", text: "أبعد مصادر التشتيت (الهاتف) أثناء المهام الهامة." },
    ],
    mid: [
      { icon: "⏱️", text: "خصص 25 دقيقة للعمل المركّز ثم استرح 5 دقائق — الأهداف الصغيرة أسهل على الدماغ." },
      { icon: "📋", text: "قسّم المهام الكبيرة إلى خطوات صغيرة وحدّد موعدًا لكل خطوة." },
      { icon: "🎧", text: "جرّب موسيقى الفوكوس (بدون كلمات) أثناء الدراسة — تحسّن التركيز لدى كثيرين." },
      { icon: "🏃", text: "النشاط البدني المنتظم (20 دقيقة مشي) يحسّن التركيز بشكل ملحوظ وفق أبحاث 2024." },
      { icon: "🗂️", text: "خصّص مكانًا ثابتًا لأغراضك الأساسية وعوّد نفسك وضعها فيه دائمًا." },
      { icon: "👨‍⚕️", text: "إن كانت هذه الصعوبات تؤثر على حياتك اليومية، يُنصح باستشارة متخصص." },
    ],
    high: [
      { icon: "👨‍⚕️", text: "النتائج تشير إلى مؤشرات ملحوظة — يُنصح بشدة بمراجعة طبيب أو معالج نفسي متخصص." },
      { icon: "📝", text: "دوّن ملاحظاتك وقوائم مهامك فور التفكير فيها — الاعتماد على الذاكرة وحدها مجهد." },
      { icon: "⏰", text: "استخدم تنبيهات متعددة على الهاتف لكل موعد ومهمة، وتحقق منها صباحًا." },
      { icon: "🌿", text: "أنشئ بيئة دراسة هادئة ومنظمة بعيدة عن الشاشات والأصوات المشتتة." },
      { icon: "🤝", text: "اطلب من المدرب تقديم التعليمات كتابيًا إضافةً إلى الشفهي." },
      { icon: "💊", text: "إن أُشير إلى ADHD في التقييم المتخصص، تتوفر خيارات علاجية فعّالة جدًا." },
    ],
  },
  reading: {
    low: [
      { icon: "✅", text: "معالجتك للنصوص المكتوبة ضمن النطاق المعتاد — استمر في القراءة لتعزيز هذه المهارة." },
      { icon: "📚", text: "جرّب خلفية كريمية بدلاً من البيضاء لتقليل الإجهاد البصري." },
    ],
    mid: [
      { icon: "🎧", text: "استخدم ميزة Text-to-Speech لقراءة المواد الطويلة — تساعد كثيرًا في الاستيعاب." },
      { icon: "🖊️", text: "استخدم مسطرة أو إصبعك لتتبع السطور أثناء القراءة لتجنب فقدان مكانك." },
      { icon: "🎨", text: "جرّب خلفية صفراء فاتحة أو كريمية — أريح للعينين لكثيرين." },
      { icon: "📝", text: "لخّص ما تقرأه بكلماتك فور الانتهاء لتعزيز الفهم." },
      { icon: "🎬", text: "ابحث عن المحتوى في صيغة فيديو أو صوت إضافةً للنص، خاصةً للموضوعات المعقدة." },
      { icon: "👨‍⚕️", text: "إن كانت هذه الصعوبات تعيق تقدمك، يُنصح بتقييم من متخصص." },
    ],
    high: [
      { icon: "👨‍⚕️", text: "المؤشرات تستحق تقييمًا متخصصًا من أخصائي صعوبات تعلم — الكشف المبكر يفتح باب الدعم الفعّال." },
      { icon: "🎧", text: "اعتمد على المحتوى الصوتي والمرئي كأداة تعلم رئيسية — كثيرون يتعلمون هكذا بكفاءة أعلى." },
      { icon: "⏰", text: "اطلب وقتًا إضافيًا في الاختبارات — هذا حق مشروع لمن لديهم صعوبات في معالجة النص." },
      { icon: "🖊️", text: "استخدم الخرائط الذهنية بدلاً من النصوص الطولية لتنظيم الأفكار." },
      { icon: "💻", text: "استخدم برامج التدقيق الإملائي دائمًا واستعن بأدوات الذكاء الاصطناعي لمراجعة ما تكتب." },
      { icon: "🌟", text: "الديسلكسيا لا تعني انخفاض الذكاء — كثير من أصحاب الإنجازات العالمية يعيشون معها بنجاح." },
    ],
  },
  numbers: {
    low: [
      { icon: "✅", text: "راحتك مع الأرقام والتسلسل ضمن النطاق المعتاد." },
      { icon: "📊", text: "استخدم الجداول والمخططات البصرية عند تقديم البيانات — تُبسّط المعلومات للجميع." },
    ],
    mid: [
      { icon: "📱", text: "استخدم الآلة الحاسبة بلا تردد — إتقان المفاهيم أهم من الحساب الذهني." },
      { icon: "📅", text: "استخدم التقويم الرقمي مع تنبيهات للمواعيد بدلاً من الاعتماد على الذاكرة الزمنية." },
      { icon: "🗺️", text: "اعتمد على تطبيقات الخرائط دومًا ولا تتردد في ذلك." },
      { icon: "📊", text: "حوّل الأرقام إلى صور بصرية ومخططات — الدماغ يعالج الصور أسرع من الأرقام المجردة." },
      { icon: "✍️", text: "اكتب المعادلات والخطوات بصوت عالٍ أثناء حلّها لتفعيل معالجة مختلفة في الدماغ." },
    ],
    high: [
      { icon: "👨‍⚕️", text: "المؤشرات ملحوظة — يُنصح بتقييم من متخصص لاستكشاف إمكانية وجود صعوبات في الحساب (Dyscalculia)." },
      { icon: "📱", text: "استخدم التكنولوجيا بشكل ممنهج: تطبيقات الحاسبة، التقويم، الخرائط — هي أدوات دائمة لك." },
      { icon: "🎨", text: "استخدم الألوان لتمييز الخطوات والمعطيات في المسائل — يقلّل التشابه بين الأرقام." },
      { icon: "⏰", text: "اطلب وقتًا إضافيًا في التقييمات التي تشمل أرقامًا — هذا حق مشروع." },
      { icon: "🤝", text: "تحدّث مع المدرب عن احتياجاتك — وصف احتياجاتك يساعد الآخرين على دعمك." },
      { icon: "🌟", text: "صعوبات الأرقام لا تحدّ من قدرتك الإبداعية — كثيرون يمتلكون مهارات استثنائية في مجالات أخرى." },
    ],
  },
};

const SECTION_INFO = [
  { icon: "🎯", label: "الانتباه والتنظيم الذاتي",      color: "#e0f2fe", count: 6, max: 24 },
  { icon: "📖", label: "القراءة والمعالجة اللغوية",      color: "#fef3c7", count: 6, max: 24 },
  { icon: "🔢", label: "الأرقام والتوجه المكاني",        color: "#ede9fe", count: 5, max: 20 },
];

/* ─── Component ─────────────────────────────────────────── */
export default function SurveyPage() {
  const [screen, setScreen] = useState<"intro" | "survey" | "results">("intro");
  const [section, setSection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showError, setShowError] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollTop = () => setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const sectionQs = (s: number) => QUESTIONS.filter((q) => q.section === s);
  const allAnswered = (s: number) => sectionQs(s).every((q) => answers[q.id] !== undefined);

  const nextSection = () => {
    if (!allAnswered(section)) { setShowError(true); return; }
    setShowError(false);
    if (section < 3) { setSection(section + 1); scrollTop(); }
    else { setScreen("results"); scrollTop(); }
  };

  const prevSection = () => { setSection(section - 1); setShowError(false); scrollTop(); };

  const getScore = (s: number) => sectionQs(s).reduce((acc, q) => acc + (answers[q.id] ?? 0), 0);
  const getLevel = (score: number, max: number): "low" | "mid" | "high" => {
    const p = score / max;
    if (p < 0.35) return "low";
    if (p < 0.65) return "mid";
    return "high";
  };

  const levelLabel: Record<string, string> = { low: "مؤشرات منخفضة", mid: "مؤشرات متوسطة", high: "مؤشرات ملحوظة" };
  const levelColor: Record<string, string> = { low: "#16a34a", mid: "#d97706", high: "#dc2626" };
  const levelBg:    Record<string, string> = { low: "#dcfce7", mid: "#fef3c7", high: "#fee2e2" };
  const barColor:   Record<string, string> = {
    low:  "linear-gradient(90deg,#4ade80,#16a34a)",
    mid:  "linear-gradient(90deg,#fbbf24,#d97706)",
    high: "linear-gradient(90deg,#f87171,#dc2626)",
  };

  const progress = screen === "intro" ? 0 : screen === "results" ? 100 : Math.round((section - 1) / 3 * 100);

  /* restart */
  const restart = () => { setAnswers({}); setSection(1); setShowError(false); setScreen("intro"); scrollTop(); };

  return (
    <div ref={topRef} style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* Hero header */}
      <div style={{ background: "linear-gradient(135deg,#060e24 0%,#0d2c54 60%,#0891b2 100%)", padding: "48px 24px 70px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "30px", padding: "7px 20px", color: "rgba(255,255,255,0.9)", fontSize: "13px", marginBottom: "20px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
          أداة توعوية — ليست تشخيصًا طبيًا
        </div>
        <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, color: "white", marginBottom: "12px" }}>
          🧠 استبيان أسلوب التعلم والتركيز
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
          اكتشف نمط تعلّمك وتلقّ توصيات مخصصة تساعدك على تحقيق أفضل النتائج
        </p>
        {/* wave */}
        <div style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "40px", overflow: "hidden" }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="var(--background)" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Progress bar (survey + results) */}
        {screen !== "intro" && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }}>
              <span>{screen === "results" ? "مكتمل ✅" : `القسم ${section} من 3`}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: progress + "%", background: "linear-gradient(90deg,#0891b2,var(--gold))", borderRadius: "10px", transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* ── INTRO ── */}
        {screen === "intro" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "40px 36px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "var(--navy)", marginBottom: "14px" }}>مرحبًا بك 👋</h2>
            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.9, marginBottom: "24px" }}>
              هذا الاستبيان مستوحى من أدوات معتمدة دوليًا مثل <strong style={{ color: "var(--navy)" }}>ASRS (WHO)</strong> لتقييم الانتباه
              ومؤشرات <strong style={{ color: "var(--navy)" }}>DSM-5</strong> لصعوبات التعلم.
              يساعدك على التعرف على أسلوب تعلّمك وتلقّي توصيات عملية، <strong style={{ color: "var(--navy)" }}>وليس تشخيصًا طبيًا</strong>.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", margin: "20px 0 28px" }}>
              {[["⏱️","5 - 8 دقائق"],["🔒","سري وغير محفوظ"],["📋","17 سؤالاً فقط"],["💡","توصيات فورية"]].map(([icon, label]) => (
                <div key={label} style={{ background: "var(--background)", borderRadius: "12px", padding: "14px 18px", fontSize: "13px", color: "var(--navy)", fontWeight: 600, textAlign: "center", minWidth: "130px" }}>
                  <div style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</div>
                  {label}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px", lineHeight: 1.8 }}>
              أجب بصدق عن كيفية شعورك <strong style={{ color: "var(--navy)" }}>في الستة أشهر الماضية</strong> بشكل عام، وليس في يوم محدد.
            </p>
            <button onClick={() => { setScreen("survey"); scrollTop(); }}
              style={{ background: "linear-gradient(135deg,var(--gold),#f5c218)", color: "white", border: "none", borderRadius: "14px", padding: "15px 48px", fontSize: "17px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(201,149,42,0.35)" }}>
              ابدأ الاستبيان ◀
            </button>
          </div>
        )}

        {/* ── SURVEY ── */}
        {screen === "survey" && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: SECTION_INFO[section-1].color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>
                {SECTION_INFO[section-1].icon}
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--navy)" }}>{SECTION_INFO[section-1].label}</div>
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>القسم {section} من 3 — {SECTION_INFO[section-1].count} أسئلة</div>
              </div>
            </div>

            <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.8, margin: "14px 0 24px", padding: "14px 16px", background: "var(--background)", borderRadius: "10px" }}>
              {section === 1 && "هذه الأسئلة تستكشف أنماط التركيز والتنظيم الذاتي. الهدف فهم أسلوبك وليس الحكم عليك."}
              {section === 2 && "هذه الأسئلة تستكشف أسلوبك في معالجة النصوص. الكثيرون يعالجون المعلومات بصريًا أو سمعيًا — وهذا تنوع طبيعي."}
              {section === 3 && "بعض الأشخاص يعالجون المعلومات الرقمية بطريقة مختلفة — وهذا يؤثر على تعلّم الرياضيات أو مهام التسلسل والزمن."}
            </div>

            {/* Scale labels */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginBottom: "20px", padding: "0 2px" }}>
              <span>لا أبدًا ←</span><span>← دائمًا</span>
            </div>

            {/* Questions */}
            {sectionQs(section).map((q, qi) => (
              <div key={q.id} style={{ marginBottom: qi < sectionQs(section).length - 1 ? "26px" : "0", paddingBottom: qi < sectionQs(section).length - 1 ? "26px" : "0", borderBottom: qi < sectionQs(section).length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "14px", lineHeight: 1.7, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", background: "var(--navy)", color: "white", borderRadius: "50%", fontSize: "12px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>
                    {q.id}
                  </span>
                  {q.text}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {SCALE.map((label, val) => (
                    <label key={val} style={{ flex: 1, minWidth: "70px", cursor: "pointer" }}>
                      <input type="radio" name={"q" + q.id} value={val} checked={answers[q.id] === val} onChange={() => setAnswers({ ...answers, [q.id]: val })} style={{ display: "none" }} />
                      <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: "10px 6px", border: "2px solid", borderRadius: "12px", textAlign: "center",
                        fontSize: "12px", cursor: "pointer", minHeight: "60px", lineHeight: 1.4, transition: "all 0.15s",
                        borderColor: answers[q.id] === val ? "var(--navy)" : "var(--border)",
                        background: answers[q.id] === val ? "var(--navy)" : "white",
                        color: answers[q.id] === val ? "white" : "var(--muted)",
                        fontWeight: answers[q.id] === val ? 700 : 400,
                      }}>
                        {label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Error */}
            {showError && (
              <div style={{ color: "#dc2626", fontSize: "13px", marginTop: "16px" }}>
                ⚠️ يرجى الإجابة على جميع الأسئلة قبل المتابعة
              </div>
            )}

            {/* Nav */}
            <div style={{ display: "flex", gap: "12px", marginTop: "28px", justifyContent: "space-between" }}>
              <button onClick={nextSection}
                style={{ background: section === 3 ? "linear-gradient(135deg,var(--gold),#f5c218)" : "linear-gradient(135deg,var(--navy),#0891b2)", color: "white", border: "none", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
                {section === 3 ? "✅ عرض النتائج والتوصيات" : "التالي ◀"}
              </button>
              {section > 1 && (
                <button onClick={prevSection}
                  style={{ background: "var(--background)", color: "var(--navy)", border: "1px solid var(--border)", borderRadius: "12px", padding: "13px 28px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  ▶ السابق
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {screen === "results" && (
          <div>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#060e24,#0d2c54)", borderRadius: "20px", padding: "32px", textAlign: "center", color: "white", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "8px" }}>نتائجك وتوصياتك 🎯</h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>بناءً على إجاباتك — هذه توصيات لمساعدتك على التعلم بشكل أفضل</p>
            </div>

            {/* Result cards */}
            {(["attention","reading","numbers"] as const).map((key, idx) => {
              const score = getScore(idx + 1);
              const max = SECTION_INFO[idx].max;
              const level = getLevel(score, max);
              const pct = Math.round(score / max * 100);
              const recs = RECS[key][level];
              return (
                <div key={key} style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: SECTION_INFO[idx].color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                      {SECTION_INFO[idx].icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--navy)" }}>{SECTION_INFO[idx].label}</div>
                      <div style={{ fontSize: "13px", color: "var(--muted)" }}>النتيجة: {score} / {max} ({pct}%)</div>
                    </div>
                    <span style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, background: levelBg[level], color: levelColor[level] }}>
                      {levelLabel[level]}
                    </span>
                  </div>
                  <div style={{ height: "10px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                    <div style={{ height: "100%", width: pct + "%", background: barColor[level], borderRadius: "10px" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--navy)", marginBottom: "12px" }}>التوصيات:</div>
                    {recs.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px", fontSize: "14px", lineHeight: 1.7, color: "var(--text)" }}>
                        <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>{r.icon}</span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Disclaimer */}
            <div style={{ background: "#fef9ec", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#92400e", lineHeight: 1.9, marginBottom: "20px" }}>
              <strong>⚠️ تنبيه مهم:</strong> هذا الاستبيان أداة توعوية تعليمية مبنية على مؤشرات معتمدة دوليًا، وليس تشخيصًا طبيًا.
              لا يمكن لأي استبيان ذاتي أن يشخّص صعوبات التعلم أو اضطرابات الانتباه — تتطلب عملية التشخيص تقييمًا متخصصًا.
              إن كانت نتائجك في النطاق "الملحوظ"، يُنصح باستشارة متخصص للحصول على تقييم دقيق.
            </div>

            <button onClick={() => window.print()}
              style={{ display: "block", width: "100%", padding: "14px", borderRadius: "12px", border: "2px dashed var(--border)", background: "transparent", color: "var(--muted)", fontFamily: "inherit", fontSize: "14px", cursor: "pointer", marginBottom: "12px" }}>
              🖨️ طباعة النتائج أو حفظها كـ PDF
            </button>
            <button onClick={restart}
              style={{ display: "block", width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--navy)", fontFamily: "inherit", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              🔄 إعادة الاستبيان
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
