"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

/*
  استبيان التوافق التدريبي — طريقة عملية لمطابقة المدرب بالمتدرب.
  بدل تصنيف الشخصية، يقيس الاحتياجات الفعلية القابلة للتنفيذ:
  الطمأنينة في الماء، وتيرة التعلم، الأسلوب (نظري/تطبيقي)، ونمط الدعم.
*/

const OPTS = [
  { label: "أوافق بشدة", value: 4 },
  { label: "أوافق", value: 3 },
  { label: "لا أوافق", value: 2 },
  { label: "لا أوافق إطلاقًا", value: 1 },
];

type Dim = "comfort" | "pace" | "theory" | "support";

// reverse: true يعني السؤال معكوس (الموافقة العالية = درجة أقل في البعد)
const QUESTIONS: { text: string; dim: Dim; reverse: boolean }[] = [
  { text: "أشعر براحة تامة في الماء العميق حتى لو لم ألمس القاع.", dim: "comfort", reverse: false },
  { text: "تقلقني فكرة أن وجهي تحت الماء لفترة طويلة.", dim: "comfort", reverse: true },
  { text: "أفضّل إتقان كل مهارة تمامًا قبل الانتقال لما بعدها، حتى لو أخذ وقتًا أطول.", dim: "pace", reverse: false },
  { text: "أملّ بسرعة إذا كان التقدم في التعلم بطيئًا.", dim: "pace", reverse: true },
  { text: "أحب أن أفهم النظرية والسبب («ليش؟») قبل أن أجرّب بنفسي.", dim: "theory", reverse: false },
  { text: "أتعلم من التجربة المباشرة أكثر مما أتعلم من الشرح.", dim: "theory", reverse: true },
  { text: "التشجيع والكلمة الطيبة أثناء التعلم يحسّنان أدائي بشكل ملحوظ.", dim: "support", reverse: false },
  { text: "أفضّل الملاحظات الصريحة المباشرة حتى لو كانت جافة.", dim: "support", reverse: true },
];

const GOALS = [
  { k: "certification", icon: "🎓", l: "شهادة معتمدة", d: "أريد رخصة غوص دولية" },
  { k: "fun", icon: "🏝️", l: "متعة وتجربة", d: "أجرب وأستمتع بدون التزام" },
  { k: "pro", icon: "🚀", l: "طريق الاحتراف", d: "أطمح للعمل في مجال الغوص" },
  { k: "fear", icon: "💪", l: "تجاوز الخوف", d: "أريد كسر حاجز الخوف من الماء" },
];

const PREFS = [
  { k: "arabic", icon: "🗣️", l: "مدرب يتحدث العربية بطلاقة" },
  { k: "femaleInstructor", icon: "🧕", l: "أفضّل مدرِّبة (للسيدات)" },
  { k: "smallGroup", icon: "👥", l: "مجموعة صغيرة أو تدريب خاص" },
];

const GOAL_LABEL: Record<string, string> = {
  certification: "🎓 هدفه شهادة معتمدة — التزم بمعايير المنهج وتقدّمه خطوة خطوة.",
  fun: "🏝️ هدفه المتعة والتجربة — خفف النظري، وركّز على تجربة ممتعة وآمنة.",
  pro: "🚀 يطمح للاحتراف — أعطه تفاصيل أعمق ومسؤوليات صغيرة تدريجية.",
  fear: "💪 يريد تجاوز الخوف — الأولوية المطلقة لبناء الثقة، ولا تستعجل أي مهارة.",
};

export default function TrainingFitPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [goal, setGoal] = useState("");
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined) && !!goal;

  // كل بُعد = سؤالان (مباشر + معكوس) → مجموع من 2 إلى 8
  const scores = (): Record<Dim, number> => {
    const s: Record<Dim, number> = { comfort: 0, pace: 0, theory: 0, support: 0 };
    QUESTIONS.forEach((q, i) => {
      const v = answers[i] || 0;
      s[q.dim] += q.reverse ? 5 - v : v;
    });
    return s;
  };
  const sc = scores();
  const pct = (v: number) => Math.round(((v - 2) / 6) * 100);

  const dimInfo = (dim: Dim, v: number) => {
    const p = pct(v);
    switch (dim) {
      case "comfort":
        return { label: "الطمأنينة في الماء", icon: "🌊", pct: p,
          low: "يحتاج وقتًا في المياه الضحلة وبناء ثقة تدريجيًا", high: "مرتاح في الماء — يمكن التقدم بثقة",
          advice: p < 50 ? "ابدأ في مياه واقفة، وأطِل مرحلة التعوّد، ولا تنتقل للعمق قبل استقرار التنفس." : "مرتاح مائيًا — ركز على صقل المهارات بدل التطمين." };
      case "pace":
        return { label: "وتيرة التعلم", icon: "🐢", pct: p,
          low: "يفضّل الإيقاع السريع والتحدي", high: "يفضّل التدرج الهادئ وإتقان كل خطوة",
          advice: p >= 50 ? "قسّم المهارات لخطوات صغيرة وأكد إتقان كل واحدة قبل التالية." : "حافظ على إيقاع متجدد وتحديات صغيرة كي لا يفقد الحماس." };
      case "theory":
        return { label: "أسلوب الفهم", icon: "📖", pct: p,
          low: "يتعلم بالتجربة المباشرة", high: "يحتاج الشرح والسبب قبل التطبيق",
          advice: p >= 50 ? "اشرح «ليش» قبل «كيف» — بريفينج نظري وافٍ قبل كل مهارة." : "قلل الكلام وادخل الماء بسرعة — التجربة هي شرحه المفضل." };
      case "support":
        return { label: "نمط الدعم", icon: "🤝", pct: p,
          low: "يفضّل الملاحظات المباشرة الصريحة", high: "يزدهر مع التشجيع والدعم المستمر",
          advice: p >= 50 ? "أكثر من التشجيع والاحتفال بالتقدم الصغير — الكلمة الطيبة وقوده." : "كن مباشرًا وصريحًا في الملاحظات — المجاملة تضيّع وقته." };
    }
  };

  const dims: Dim[] = ["comfort", "pace", "theory", "support"];

  const saveResult = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/users/training-fit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ goal, scores: sc, prefs }),
      });
      setSaved(true);
    } catch {}
  };

  const instructorCard = () => {
    const lines = [
      GOAL_LABEL[goal] || "",
      ...dims.map((d) => { const i = dimInfo(d, sc[d]); return `${i.icon} ${i.label} (${i.pct}%): ${i.advice}`; }),
      ...PREFS.filter((p) => prefs[p.k]).map((p) => `${p.icon} تفضيل: ${p.l}`),
    ].filter(Boolean);
    return lines;
  };

  const copyCard = () => {
    const text = `🧭 بطاقة التوافق التدريبي (ArabDiving):\n${instructorCard().join("\n")}`;
    navigator.clipboard?.writeText(text).then(() => alert("✅ تم نسخ البطاقة — أرسلها لمدربك")).catch(() => {});
  };

  const card: React.CSSProperties = { background: "white", borderRadius: "18px", boxShadow: "0 10px 40px rgba(0,0,0,0.07)", padding: "clamp(20px,4vw,34px)", marginBottom: "20px" };
  const btn = (bg: string, color = "white"): React.CSSProperties => ({ background: bg, color, border: "none", padding: "13px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(16px,4vw,40px) 16px" }}>
      <h1 style={{ textAlign: "center", fontSize: "clamp(24px,5vw,34px)", color: "var(--navy)", marginBottom: "6px" }}>🧭 استبيان التوافق التدريبي</h1>
      <p style={{ textAlign: "center", color: "#64748b", marginBottom: "10px" }}>ماذا تحتاج فعلًا من مدربك؟ — احتياجات عملية، لا تصنيفات شخصية</p>
      <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginBottom: "26px", lineHeight: 1.7 }}>
        مكمّل لـ<Link href="/quiz" style={{ color: "var(--mid)" }}>اختبار الألوان</Link>: الألوان تصف طباعك، وهذا الاستبيان يحدد احتياجك التدريبي المباشر.
      </p>

      {step === "intro" && (
        <div style={card}>
          <h2 style={{ color: "var(--navy)", marginBottom: "14px" }}>كيف يعمل؟</h2>
          <div style={{ color: "#475569", lineHeight: 2, marginBottom: "22px" }}>
            <p style={{ margin: 0 }}>✅ 8 أسئلة سريعة + هدفك + تفضيلاتك (دقيقتان).</p>
            <p style={{ margin: 0 }}>✅ تحصل على «بطاقة توافق» تشاركها مع مدربك قبل أول حصة.</p>
            <p style={{ margin: 0 }}>✅ المدرب يعرف من أول دقيقة: وتيرتك، أسلوبك، وما يطمئنك.</p>
          </div>
          <button onClick={() => setStep("quiz")} style={{ ...btn("var(--navy)"), width: "100%" }}>ابدأ →</button>
        </div>
      )}

      {step === "quiz" && (
        <div style={card}>
          {QUESTIONS.map((q, i) => (
            <div key={i} style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "10px", fontSize: "16px", lineHeight: 1.6 }}>{i + 1}. {q.text}</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {OPTS.map((o) => (
                  <button key={o.value} onClick={() => setAnswers({ ...answers, [i]: o.value })}
                    style={{ flex: 1, minWidth: "70px", padding: "10px 12px", border: answers[i] === o.value ? "2px solid var(--navy)" : "2px solid #e2e8f0", borderRadius: "10px", background: answers[i] === o.value ? "#eef4fa" : "white", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: answers[i] === o.value ? 700 : 400 }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <h3 style={{ color: "var(--navy)", margin: "26px 0 12px" }}>🎯 ما هدفك من الغوص؟</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "22px" }}>
            {GOALS.map((g) => (
              <button key={g.k} onClick={() => setGoal(g.k)}
                style={{ flex: "1 1 150px", padding: "14px", borderRadius: "12px", border: goal === g.k ? "3px solid var(--navy)" : "3px solid #e2e8f0", background: goal === g.k ? "#eef4fa" : "white", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                <span style={{ fontSize: "26px", display: "block", marginBottom: "6px" }}>{g.icon}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--navy)" }}>{g.l}</span>
                <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginTop: "3px" }}>{g.d}</span>
              </button>
            ))}
          </div>

          <h3 style={{ color: "var(--navy)", margin: "0 0 12px" }}>⚙️ تفضيلات (اختياري)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {PREFS.map((p) => (
              <button key={p.k} onClick={() => setPrefs({ ...prefs, [p.k]: !prefs[p.k] })}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "10px", border: prefs[p.k] ? "2px solid var(--navy)" : "2px solid #e2e8f0", background: prefs[p.k] ? "#eef4fa" : "white", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: prefs[p.k] ? 700 : 400, color: "#334155" }}>
                <span>{prefs[p.k] ? "✅" : "⬜"}</span> {p.icon} {p.l}
              </button>
            ))}
          </div>

          <button onClick={() => { setStep("result"); saveResult(); window.scrollTo({ top: 0 }); }} disabled={!allAnswered}
            style={{ ...btn("var(--navy)"), width: "100%", opacity: allAnswered ? 1 : 0.4 }}>
            اعرض بطاقتي →
          </button>
        </div>
      )}

      {step === "result" && (
        <>
          <div style={card}>
            <h2 style={{ color: "var(--navy)", marginBottom: "18px" }}>🧭 ملفك التدريبي</h2>
            {dims.map((d) => {
              const i = dimInfo(d, sc[d]);
              return (
                <div key={d} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px" }}>
                    <span style={{ fontWeight: 700, color: "var(--navy)" }}>{i.icon} {i.label}</span>
                    <span style={{ color: "#64748b" }}>{i.pct}%</span>
                  </div>
                  <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden", marginBottom: "6px" }}>
                    <div style={{ height: "100%", width: `${i.pct}%`, background: "linear-gradient(90deg,#0B2C59,#0d9488)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8" }}>
                    <span>{i.low}</span><span>{i.high}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ ...card, background: "#f0fdfa", border: "1px solid #99f6e4" }}>
            <h3 style={{ color: "#134e4a", marginBottom: "12px" }}>📋 بطاقة مدربك — أرسلها له قبل أول حصة</h3>
            <div style={{ color: "#334155", lineHeight: 2, fontSize: "14.5px", marginBottom: "18px" }}>
              {instructorCard().map((l, i) => <p key={i} style={{ margin: 0 }}>{l}</p>)}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={copyCard} style={btn("#0d9488")}>📋 انسخ البطاقة</button>
              <button onClick={() => { setStep("intro"); setAnswers({}); setGoal(""); setPrefs({}); setSaved(false); }} style={btn("#64748b")}>↺ أعد الاستبيان</button>
            </div>
            {saved && <p style={{ color: "#0d9488", fontWeight: 700, marginTop: "12px", marginBottom: 0 }}>✅ حُفظت النتيجة في ملفك الشخصي</p>}
            {!saved && <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "12px", marginBottom: 0 }}>سجّل دخولك لحفظ النتيجة في ملفك الشخصي.</p>}
          </div>
        </>
      )}
    </div>
  );
}
