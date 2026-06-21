"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

type ColorKey = "red" | "yellow" | "green" | "blue";

const OPTS = [
  { label: "أوافق بشدة", value: 4 },
  { label: "أوافق", value: 3 },
  { label: "محايد", value: 2 },
  { label: "لا أوافق", value: 1 },
];

const Q = (text: string) => ({ text, options: OPTS });
const QUESTIONS = [
  Q("عندي موقف صعب، أتصرّف بسرعة وأحسم الأمور دون تردد."),
  Q("أفضّل العمل ضمن فريق والتواصل مع الآخرين."),
  Q("أتفادى الخلافات وأفضّل الأجواء الهادئة."),
  Q("أدقق في التفاصيل وأحب الدقة والتنظيم."),
  Q("أحب المنافسة وأسعى لأن أكون الأفضل."),
  Q("كثيرًا ما أبدأ محادثات مع الغرباء وأكوّن علاقات بسهولة."),
  Q("لما أحد يزعل مني، أحاول أرضيه عشان الهدوء يرجع."),
  Q("أفضّل أن يكون عندي خطة واضحة قبل ما أبدأ أي شيء."),
  Q("أتخذ القرارات بسرعة وأعتمد على حدسي."),
  Q("أحب أن أكون مركز الاهتمام وألفت الانتباه."),
  Q("أهتم بمشاعر الآخرين وأحاول فهم وجهة نظرهم."),
  Q("أحلّل الأمور بعقلانية قبل أن أتخذ قرارًا."),
  Q("أفضّل القيادة على التبعيّة."),
  Q("عندي طاقة عالية وأحب التجديد والتغيير."),
  Q("أفضّل الاستقرار والروتين ولا أحب المفاجآت."),
  Q("أقرأ التعليمات كلها قبل ما أبدأ في تشغيل أي جهاز."),
];
// q1..q16 → color (0-indexed)
const COLOR_OF = ["red", "yellow", "green", "blue", "red", "yellow", "green", "blue", "red", "yellow", "green", "blue", "red", "yellow", "green", "blue"] as ColorKey[];

const COLORS: Record<ColorKey, any> = {
  red: { key: "red", name: "الأحمر", english: "Red · القائد", main: "#b91c1c", light: "#fef2f2", emoji: "🔴",
    desc: "شخصية قيادية حاسمة مباشرة. تحب التحدي والنتائج السريعة، وتتخذ القرارات بثقة ولا تخاف المواجهة.",
    strengths: ["قيادة", "حسم", "شجاعة", "سرعة قرار", "وضوح"], weaknesses: ["قلة صبر", "تسلّط", "تجاهل المشاعر"],
    asTeacher: "أنت مدرّب قوي وحازم. متدرّبوك يحتاجون وضوحًا وحسمًا. قدّم لهم الأهداف والنتائج المتوقّعة، وكن مباشرًا في ملاحظاتك. اختصر المقدمات وقدّم تحديات تشعل حماسهم.",
    asStudent: "تتعلّم أفضل حين يكون الهدف واضحًا. تريد أن تعرف «أين سنصل؟» قبل «كيف؟». المدرّب المثالي لك: حازم، واضح، يعطيك مساحة للقيادة وأهدافًا واضحة.",
    teachAdvice: "كن مباشرًا وحاسمًا. أعطه هدفًا وتحديًا. ركّز على النتيجة دون إطالة.",
    studentMatch: "يناسبك مدرّب أحمر (مثلك) أو أصفر يخفّف الجو. الأخضر والأزرق قد يضايقانك ببطئهما." },
  yellow: { key: "yellow", name: "الأصفر", english: "Yellow · المبدع", main: "#b45309", light: "#fffbeb", emoji: "🟡",
    desc: "شخصية اجتماعية مبدعة مفعمة بالحيوية. تحب المرح والتواصل وتكوين العلاقات، وتفكّر خارج الصندوق.",
    strengths: ["إبداع", "حماس", "تواصل", "تفاؤل", "عفوية"], weaknesses: ["تشتّت", "قلة انضباط", "مبالغة عاطفية"],
    asTeacher: "أنت مدرّب ملهم ومبدع. جلساتك مليئة بالطاقة والقصص والأنشطة. انتبه ألا تشتّت متدرّبيك بكثرة الأفكار — نظّم المعلومة وقدّمها متسلسلة.",
    asStudent: "تتعلّم أفضل في جو مرح وتفاعلي. تحب النقاش والعمل الجماعي. المدرّب المثالي لك: حيوي، يستخدم وسائل متنوّعة، ويعطيك مساحة للتعبير.",
    teachAdvice: "استخدم القصص والأنشطة والوسائل البصرية. اخلق جوًّا من المرح وتجنّب المحاضرات الطويلة.",
    studentMatch: "يناسبك مدرّب أصفر (مثلك) أو أحمر ينظّم طاقتك. الأخضر حنون لكن قد يُملّك، والأزرق ثقيل قليلًا." },
  green: { key: "green", name: "الأخضر", english: "Green · المسالم", main: "#15803d", light: "#f0fdf4", emoji: "🟢",
    desc: "شخصية ودودة متعاونة صبورة. تقدّر العلاقات والانسجام، تستمع جيدًا وتتجنّب الخلافات وتفضّل الاستقرار.",
    strengths: ["صبر", "تعاون", "استماع", "وفاء", "هدوء"], weaknesses: ["تجنّب المواجهة", "خوف من التغيير", "صعوبة قول لا"],
    asTeacher: "أنت مدرّب صبور وحنون. تبني علاقات قوية وتفهم الاحتياجات الفردية وتوفّر بيئة آمنة. تحتاج أحيانًا حزمًا أكثر لدفع المتدرّبين للتميّز.",
    asStudent: "تتعلّم أفضل في بيئة آمنة وداعمة، وتحتاج أن تثق بمدرّبك. المدرّب المثالي لك: صبور، ودود، يشجّعك ويخلق جوًّا من الأمان.",
    teachAdvice: "كن صبورًا وداعمًا. استمع له وشجّعه وقدّر جهوده. وفّر بيئة آمنة ولا تضغط عليه.",
    studentMatch: "يناسبك مدرّب أخضر (مثلك) أو أزرق ينظّم لك. الأحمر قد يخيفك، والأصفر قد يرهقك." },
  blue: { key: "blue", name: "الأزرق", english: "Blue · المحلّل", main: "#1d4ed8", light: "#eef4fa", emoji: "🔵",
    desc: "شخصية تحليلية دقيقة منطقية. تحب البيانات الموثّقة وتفكّر بعمق قبل القرار، وتقدّر النظام والدقّة.",
    strengths: ["تحليل", "دقة", "منطق", "تنظيم", "صبر"], weaknesses: ["تردّد", "برود عاطفي", "كثرة أسئلة"],
    asTeacher: "أنت مدرّب دقيق ومنظّم. جلساتك مرتّبة ومخطّطة، تقدّم المعلومة منطقيًا بأدلّة. احذر كثرة التفاصيل التي تطغى على الصورة الكبيرة، وأضف لمسة مرح.",
    asStudent: "تتعلّم أفضل حين تفهم المنطق والقواعد. تريد أن تعرف «لماذا؟». المدرّب المثالي لك: دقيق، منطقي، يعطيك وقتًا للتحليل ويحترم حاجتك للمعرفة العميقة.",
    teachAdvice: "قدّم مصادر موثّقة وأدلّة منطقية. أعطه وقتًا للتحليل ونظّم المعلومة وتجنّب العشوائية.",
    studentMatch: "يناسبك مدرّب أزرق (مثلك) أو أحمر يختصر عليك. الأصفر مزعج لك، والأخضر مقبول." },
};
const ORDER: ColorKey[] = ["red", "yellow", "green", "blue"];

function pairCell(t1: ColorKey, t2: ColorKey) {
  const star = { label: "⭐", color: "#dcfce7", textColor: "#15803d", w: 700 };
  const ok = { label: "👍", color: "#eef4fa", textColor: "#1e40af", w: 400 };
  const spark = { label: "⚡", color: "#fef2f2", textColor: "#b91c1c", w: 400 };
  const hard = { label: "🔄", color: "#fef2f2", textColor: "#991b1b", w: 400 };
  const m: Record<string, any> = {
    "red-red": star, "red-yellow": ok, "red-green": spark, "red-blue": ok,
    "yellow-red": ok, "yellow-yellow": star, "yellow-green": ok, "yellow-blue": hard,
    "green-red": spark, "green-yellow": ok, "green-green": star, "green-blue": ok,
    "blue-red": ok, "blue-yellow": hard, "blue-green": ok, "blue-blue": star,
  };
  return m[`${t1}-${t2}`] || ok;
}

export default function QuizPage() {
  const [step, setStep] = useState<"role" | "quiz" | "result">("role");
  const [role, setRole] = useState<"teacher" | "student" | "both" | "">("");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [saved, setSaved] = useState(false);
  const PAGE = 4;

  const visible = QUESTIONS.map((q, i) => ({ q, i })).slice(qIndex, qIndex + PAGE);
  const progress = Math.min(100, ((qIndex + PAGE) / QUESTIONS.length) * 100);
  const isLast = qIndex + PAGE >= QUESTIONS.length;
  const allAnswered = visible.every((v) => answers[v.i] !== undefined);

  const scores = (): Record<ColorKey, number> => {
    const s: Record<ColorKey, number> = { red: 0, yellow: 0, green: 0, blue: 0 };
    Object.entries(answers).forEach(([i, v]) => { s[COLOR_OF[Number(i)]] += Number(v); });
    return s;
  };
  const sc = scores();
  const total = sc.red + sc.yellow + sc.green + sc.blue || 1;
  const dominant = ORDER.reduce((a, b) => (sc[b] > sc[a] ? b : a), "red");
  const info = COLORS[dominant];
  const pct = Math.round((sc[dominant] / total) * 100);

  const saveResult = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/users/personality`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role, dominant, scores: sc }),
      });
      setSaved(true);
    } catch {}
  };

  const next = () => { if (isLast) { setStep("result"); saveResult(); window.scrollTo({ top: 0 }); } else setQIndex(qIndex + PAGE); };
  const prev = () => setQIndex(Math.max(0, qIndex - PAGE));
  const restart = () => { setStep("role"); setRole(""); setQIndex(0); setAnswers({}); setSaved(false); };

  const copyResult = () => {
    const text = `🧠 نتيجتي في اختبار النمط الشخصي:\nنمطي: ${info.emoji} ${info.name} (${info.english}) — ${pct}%\n💪 القوة: ${info.strengths.join("، ")}\n🎯 التطوير: ${info.weaknesses.join("، ")}\nجرّبه على ArabDiving!`;
    navigator.clipboard?.writeText(text).then(() => alert("✅ تم نسخ النتيجة")).catch(() => {});
  };

  const card: React.CSSProperties = { background: "white", borderRadius: "18px", boxShadow: "0 10px 40px rgba(0,0,0,0.07)", padding: "clamp(20px,4vw,34px)", marginBottom: "20px" };
  const btn = (bg: string, color = "white"): React.CSSProperties => ({ background: bg, color, border: "none", padding: "13px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });
  const section = (bg: string): React.CSSProperties => ({ marginTop: "18px", padding: "18px", borderRadius: "14px", lineHeight: 1.9, background: bg });

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(16px,4vw,40px) 16px" }}>
      <h1 style={{ textAlign: "center", fontSize: "clamp(24px,5vw,34px)", color: "var(--navy)", marginBottom: "6px" }}>🧠 اكتشف نمطك الشخصي</h1>
      <p style={{ textAlign: "center", color: "#64748b", marginBottom: "26px" }}>نموذج الألوان (DISC) — لمطابقة المدرّب المناسب بالمتدرّب المناسب</p>

      {step === "role" && (
        <div style={card}>
          <h2 style={{ color: "var(--navy)", marginBottom: "16px" }}>من أنت؟</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "22px" }}>
            {[
              { k: "teacher", icon: "🧑‍🏫", l: "مدرّب غوص", d: "أدرّب وأريد فهم متدرّبيّ" },
              { k: "student", icon: "🤿", l: "متدرّب / غوّاص", d: "أتعلّم وأريد المدرّب المناسب لي" },
              { k: "both", icon: "🔄", l: "الاثنان معًا", d: "أدرّب وأتعلّم باستمرار" },
            ].map((r) => (
              <button key={r.k} onClick={() => setRole(r.k as any)} style={{ flex: "1 1 150px", padding: "18px", borderRadius: "14px", border: role === r.k ? "3px solid var(--navy)" : "3px solid #e2e8f0", background: role === r.k ? "#eef4fa" : "white", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>{r.icon}</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--navy)" }}>{r.l}</span>
                <span style={{ fontSize: "13px", color: "#64748b", display: "block", marginTop: "4px" }}>{r.d}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep("quiz")} disabled={!role} style={{ ...btn("var(--navy)"), width: "100%", opacity: role ? 1 : 0.4 }}>ابدأ الاختبار →</button>
        </div>
      )}

      {step === "quiz" && (
        <div style={card}>
          <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#0B2C59,#2e75b6)", transition: "width .4s" }} />
          </div>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>الأسئلة {qIndex + 1}–{Math.min(qIndex + PAGE, QUESTIONS.length)} من {QUESTIONS.length}</p>
          {visible.map(({ q, i }) => (
            <div key={i} style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "10px", fontSize: "16px", lineHeight: 1.6 }}>{q.text}</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {q.options.map((o) => (
                  <button key={o.value} onClick={() => setAnswers({ ...answers, [i]: o.value })}
                    style={{ flex: 1, minWidth: "70px", padding: "10px 12px", border: answers[i] === o.value ? "2px solid var(--navy)" : "2px solid #e2e8f0", borderRadius: "10px", background: answers[i] === o.value ? "#eef4fa" : "white", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: answers[i] === o.value ? 700 : 400 }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
            <button onClick={prev} disabled={qIndex === 0} style={{ ...btn("transparent", "var(--navy)"), border: "2px solid var(--navy)", flex: 1, opacity: qIndex === 0 ? 0.4 : 1 }}>→ السابق</button>
            <button onClick={next} disabled={!allAnswered} style={{ ...btn("var(--navy)"), flex: 1, opacity: allAnswered ? 1 : 0.4 }}>{isLast ? "عرض النتيجة" : "التالي ←"}</button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: info.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>{info.emoji}</div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--navy)" }}>نمطك: {info.name}</div>
              <div style={{ color: "#64748b", fontSize: "15px" }}>{info.english} · {pct}% من إجاباتك{saved ? " · ✅ حُفظ في حسابك" : ""}</div>
            </div>
          </div>

          <div style={section(info.light)}>
            <h3 style={{ marginBottom: "8px" }}>✨ شخصيتك</h3>
            <p>{info.desc}</p>
            <div style={{ marginTop: "10px" }}><strong>نقاط القوة: </strong>{info.strengths.map((s: string) => <span key={s} style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", margin: "3px", background: "white", color: info.main }}>{s}</span>)}</div>
            <div style={{ marginTop: "6px" }}><strong>نقاط التطوير: </strong>{info.weaknesses.map((w: string) => <span key={w} style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", margin: "3px", background: "#fef2f2", color: "#b91c1c" }}>{w}</span>)}</div>
          </div>

          {(role === "teacher" || role === "both") && (
            <div style={section("#eef4fa")}>
              <h3 style={{ marginBottom: "8px" }}>🧑‍🏫 كمدرّب — ماذا تفعل؟</h3>
              <p>{info.asTeacher}</p>
              {role === "teacher" && (
                <div style={{ marginTop: "14px", borderTop: "1px solid #d4dae3", paddingTop: "14px" }}>
                  <strong>كيف تتعامل مع كل نمط من متدرّبيك؟</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px", marginTop: "12px" }}>
                    {ORDER.map((k) => <div key={k} style={{ padding: "12px", borderRadius: "12px", background: COLORS[k].light }}><h4 style={{ color: COLORS[k].main, marginBottom: "4px" }}>{COLORS[k].emoji} {COLORS[k].name}</h4><p style={{ fontSize: "13px", lineHeight: 1.7 }}>{COLORS[k].teachAdvice}</p></div>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {(role === "student" || role === "both") && (
            <div style={section("#f0fdf4")}>
              <h3 style={{ marginBottom: "8px" }}>🤿 كمتدرّب — ما هو المدرّب المناسب لك؟</h3>
              <p>{info.asStudent}</p>
              {role === "student" && (
                <div style={{ marginTop: "14px", borderTop: "1px solid #d4dae3", paddingTop: "14px" }}>
                  <strong>أي مدرّب يناسبك؟</strong>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px", marginTop: "12px" }}>
                    {ORDER.map((k) => <div key={k} style={{ padding: "12px", borderRadius: "12px", background: COLORS[k].light }}><h4 style={{ color: COLORS[k].main, marginBottom: "4px" }}>{COLORS[k].emoji} {COLORS[k].name}</h4><p style={{ fontSize: "13px", lineHeight: 1.7 }}>{COLORS[k].studentMatch}</p></div>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {role === "both" && (
            <div style={section("#fffbeb")}>
              <h3 style={{ marginBottom: "8px" }}>🔄 أنت الاثنان — نصيحة ذهبية</h3>
              <p>كونك مدرّبًا ومتدرّبًا في آنٍ يمنحك ميزة: تفهم التعلّم من الجانبين. المفتاح هو <strong>المرونة</strong> — كلما زاد وعيك بنمطك ونمط من تدرّبهم، زادت فعاليتك. واستمع أكثر مما تتكلّم.</p>
            </div>
          )}

          <div style={section("#faf5ff")}>
            <h3 style={{ marginBottom: "8px" }}>🤝 جدول التوافق: المدرّب ← المتدرّب</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "360px" }}>
                <thead>
                  <tr style={{ background: "var(--navy)", color: "white" }}>
                    <th style={{ padding: "10px", textAlign: "right" }}>المدرّب ↓ \ المتدرّب →</th>
                    {ORDER.map((k) => <th key={k} style={{ padding: "10px", textAlign: "center" }}>{COLORS[k].emoji} {COLORS[k].name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ORDER.map((t1) => (
                    <tr key={t1} style={{ borderTop: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px", fontWeight: 700 }}>{COLORS[t1].emoji} {COLORS[t1].name}</td>
                      {ORDER.map((t2) => { const c = pairCell(t1, t2); return <td key={t2} style={{ padding: "10px", textAlign: "center", background: c.color, color: c.textColor, fontWeight: c.w }}>{c.label}</td>; })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "10px" }}>⭐ ممتاز · 👍 جيد · ⚡ يحتاج تفاهم · 🔄 تحدٍّ يحتاج جهدًا</p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
            <button onClick={restart} style={{ ...btn("var(--navy)"), flex: 1 }}>إعادة الاختبار 🔄</button>
            <button onClick={copyResult} style={{ ...btn("transparent", "var(--navy)"), border: "2px solid var(--navy)", flex: 1 }}>نسخ نتيجتي 📋</button>
          </div>
          {!saved && <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginTop: "12px" }}><Link href="/login" style={{ color: "var(--mid)" }}>سجّل الدخول</Link> لحفظ نتيجتك في حسابك ومطابقتك بالمدرّب المناسب.</p>}
        </div>
      )}
    </div>
  );
}
