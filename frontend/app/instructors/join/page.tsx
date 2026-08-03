"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { FIT_QUESTIONS, FIT_DISPLAY, FitKey, COUNTRIES, CITIES_BY_COUNTRY } from "@/app/lib/instructorFit";

/*
  انضمام المدرب — خطوتان:
  1) بيانات الاعتماد: المنظمة، الرقم، الرتبة، منذ متى، التخصصات، اللغات، المدينة.
  2) استبيان «بصمة المدرب»: 18 سؤالًا (6 محاور × 3) بصيغة TSES العلمية
     «إلى أي مدى تستطيع...؟» — النتيجة: رادار، نقطتا تميّز علنيتان، ومجال تطوير خاص.
*/

const AXES: Record<string, { label: string; icon: string }> = {
  planning:        { label: "التخطيط والبريفينج",          icon: "🎯" },
  strategies:      { label: "استراتيجيات الشرح",           icon: "📚" },
  management:      { label: "إدارة المجموعة والوعي الظرفي", icon: "🛡️" },
  engagement:      { label: "التحفيز واحتواء الخوف",       icon: "❤️" },
  watermanship:    { label: "الإتقان المائي والعرض",       icon: "🌊" },
  professionalism: { label: "الاحترافية والتطوير",         icon: "📈" },
};

const QUESTIONS: { axis: string; text: string }[] = [
  // 🎯 التخطيط والبريفينج (Danielson-1)
  { axis: "planning", text: "التحضير لكل حصة بخطة واضحة الأهداف قبل الوصول للمركز؟" },
  { axis: "planning", text: "تقديم بريفينج مختصر يفهمه المبتدئ تمامًا من المرة الأولى؟" },
  { axis: "planning", text: "تقدير مستوى الطالب الحقيقي قبل النزول وتعديل خطتك عليه؟" },
  // 📚 استراتيجيات الشرح (TSES-IS + PADI)
  { axis: "strategies", text: "شرح نظرية معقدة (كالضغط والتشبع) بلغة يفهمها شخص عادي؟" },
  { axis: "strategies", text: "تقديم نفس المهارة بطريقة مختلفة تمامًا عندما يتعثر الطالب؟" },
  { axis: "strategies", text: "استخدام تشبيهات وقصص وأمثلة من حياة الطالب لتثبيت المعلومة؟" },
  // 🛡️ إدارة المجموعة (TSES-CM + PADI IE)
  { axis: "management", text: "السيطرة على مجموعة كاملة تحت الماء دون فقدان أحد من نظرك؟" },
  { axis: "management", text: "ملاحظة مشكلة تتكوّن عند طالب قبل أن تتفاقم (وعي ظرفي)؟" },
  { axis: "management", text: "اتخاذ قرار إلغاء أو تعديل الغطسة بحزم عند الشك — مهما كان الضغط؟" },
  // ❤️ التحفيز واحتواء الخوف (TSES-SE)
  { axis: "engagement", text: "تهدئة طالب خائف قبل النزول وتحويل خوفه لثقة؟" },
  { axis: "engagement", text: "إعادة بناء ثقة طالب فشل في مهارة أمام زملائه؟" },
  { axis: "engagement", text: "جعل الطالب الفاتر غير المتحمس يقع في حب الغوص؟" },
  // 🌊 الإتقان المائي (PADI IE)
  { axis: "watermanship", text: "أداء عرض توضيحي مثالي وبطيء لأي مهارة يفهمه الطالب بالنظر فقط؟" },
  { axis: "watermanship", text: "الحفاظ على ثبات وطفو مثالي أثناء التدريس (أنت المثال الحي)؟" },
  { axis: "watermanship", text: "التعامل بهدوء تام مع موقف طارئ حقيقي تحت الماء؟" },
  // 📈 الاحترافية (Danielson-4)
  { axis: "professionalism", text: "الالتزام الكامل بمعايير منظمتك حتى تحت ضغط الوقت والموسم؟" },
  { axis: "professionalism", text: "طلب تغذية راجعة صادقة من طلابك والتعلّم منها فعلًا؟" },
  { axis: "professionalism", text: "تطوير نفسك سنويًا بدورات وتخصصات ومهارات جديدة؟" },
];

const SCALE = [
  { v: 1, l: "لا أستطيع" }, { v: 2, l: "بالكاد" }, { v: 3, l: "إلى حد ما" },
  { v: 4, l: "أستطيع جيدًا" }, { v: 5, l: "أستطيع بامتياز" },
];

// ترتيب أبجدي محايد — الناصح الأمين لا يقدّم منظمة على أخرى
const AGENCIES = ["CMAS", "NAUI", "PADI", "RAID", "SDI", "SSI", "TDI", "أخرى"];
const RANKS = ["مساعد مدرب (AI)", "مدرب (OWSI / Instructor)", "MSDT", "IDC Staff", "Master Instructor", "Course Director / IT"];
const SPECIALTIES = ["نيتروكس", "غوص عميق", "حطام", "ليلي", "ملاحة", "إتقان الطفو", "تصوير تحت الماء", "إنقاذ وEFR", "أطفال", "ذوو الهمم (تكيّفي)", "سايد ماونت", "غوص تقني", "غوص حر"];
const LANGS = ["العربية", "الإنجليزية", "الفرنسية", "الألمانية", "الروسية", "الإيطالية"];

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };
const field: React.CSSProperties = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "11px", padding: "11px", fontFamily: "inherit", fontSize: "14px", width: "100%", boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12.5px", fontWeight: 700, marginBottom: "5px" };

export default function InstructorJoinPage() {
  const [step, setStep] = useState<"info" | "survey" | "fit" | "result">("info");
  const [fitAnswers, setFitAnswers] = useState<Partial<Record<FitKey, string>>>({});
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [form, setForm] = useState<any>({ agency: "", instructorNumber: "", rank: RANKS[1], sinceYear: "", specialties: [] as string[], languages: ["العربية"], country: "مصر", city: "شرم الشيخ", localAccreditation: { cdwsNumber: "", saudiLicense: "", hasLocalLicense: false }, bio: "", whatsapp: "", email: "", social: {}, video: "", showWeakness: false, showContact: true });
  // حالة اكتمال بروفايلي (لشريط الخطوات) + صندوق الوارد + الموافقة المبدئية
  const [done, setDone] = useState({ info: false, fingerprint: false, fit: false });
  const [inbox, setInbox] = useState<any[]>([]);
  const [appStatus, setAppStatus] = useState<string>(""); // pending | approved | rejected | "" (قديم = معتمد)
  const [uploading, setUploading] = useState(false);

  // رفع صور الكارنيه (وش وضهر — أكثر من كارنيه)
  const uploadCards = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append("image", file);
        const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
        const d = await res.json();
        if (d.success && d.url) setForm((f: any) => ({ ...f, cardImages: [...(f.cardImages || []), d.url].slice(0, 8) }));
        else setMsg(d.message || "تعذّر رفع الصورة");
      }
    } finally { setUploading(false); }
  };
  // عضويتي في مراكز الغوص (بموافقة الطرفين)
  const [centers, setCenters] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [centerPick, setCenterPick] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ strengths: string[]; weakness: string | null; scores: Record<string, number> } | null>(null);
  const [msg, setMsg] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const H: any = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  useEffect(() => {
    if (!token) { setAuthed(false); return; }
    setAuthed(true);
    // تحميل البروفايل الحالي إن وجد
    fetch(`${API_BASE}/api/instructors/me`, { headers: H }).then((r) => r.json()).then((d) => {
      if (d.profile) {
        setForm((f: any) => ({ ...f, ...d.profile, sinceYear: d.profile.sinceYear || "" }));
        setDone({
          info: true,
          fingerprint: Boolean(d.profile.fingerprint?.takenAt),
          fit: Boolean(d.profile.fit?.takenAt),
        });
        setAppStatus(d.profile.applicationStatus || "");
      }
    }).catch(() => {});
    fetch(`${API_BASE}/api/instructors/me/messages`, { headers: H }).then((r) => r.json())
      .then((d) => setInbox(d.messages || [])).catch(() => {});
    loadMemberships();
    fetch(`${API_BASE}/api/partner-centers`).then((r) => r.json()).then((d) => setCenters(d.data || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMemberships = () =>
    fetch(`${API_BASE}/api/instructors/me/centers`, { headers: H }).then((r) => r.json())
      .then((d) => setMemberships(d.memberships || [])).catch(() => {});

  const requestJoin = async () => {
    if (!centerPick) return;
    const res = await fetch(`${API_BASE}/api/instructors/me/centers/${centerPick}/request`, { method: "POST", headers: H });
    const d = await res.json();
    setMsg(d.message || (d.success ? "" : "تعذّر إرسال الطلب"));
    if (d.success) { setCenterPick(""); loadMemberships(); }
  };

  const respondCenter = async (centerId: string, accept: boolean) => {
    const res = await fetch(`${API_BASE}/api/instructors/me/centers/${centerId}/respond`, { method: "POST", headers: H, body: JSON.stringify({ accept }) });
    const d = await res.json();
    if (d.success) loadMemberships(); else setMsg(d.message || "تعذّر التنفيذ");
  };

  const toggle = (key: "specialties" | "languages", v: string) =>
    setForm((f: any) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x: string) => x !== v) : [...f[key], v] }));

  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    // صور الكارنيه مطلوبة للموافقة المبدئية (إلا للمعتمدين بالفعل)
    const needsCards = !done.info || appStatus === "pending" || appStatus === "rejected";
    if (needsCards && !(form.cardImages || []).length) {
      setMsg("🪪 أضف صور كارنيه المدرب (وش وضهر) — مطلوبة للموافقة المبدئية");
      window.scrollTo({ top: 0 });
      return;
    }
    const res = await fetch(`${API_BASE}/api/instructors/me`, { method: "PUT", headers: H, body: JSON.stringify({ ...form, sinceYear: Number(form.sinceYear) || null }) });
    const d = await res.json();
    if (d.success) { setDone((x) => ({ ...x, info: true })); setStep(done.fingerprint ? "info" : "survey"); if (!done.fingerprint) window.scrollTo({ top: 0 }); setMsg(done.fingerprint ? "تم حفظ بياناتك ✅" : ""); } else setMsg(d.message || "تعذّر الحفظ");
  };

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);

  const submitSurvey = async () => {
    // متوسط كل محور
    const sums: Record<string, { t: number; n: number }> = {};
    QUESTIONS.forEach((q, i) => {
      sums[q.axis] = sums[q.axis] || { t: 0, n: 0 };
      sums[q.axis].t += answers[i] || 0; sums[q.axis].n += 1;
    });
    const scores: Record<string, number> = {};
    Object.entries(sums).forEach(([a, { t, n }]) => { scores[a] = Math.round((t / n) * 10) / 10; });

    const res = await fetch(`${API_BASE}/api/instructors/me/fingerprint`, { method: "PUT", headers: H, body: JSON.stringify({ scores }) });
    const d = await res.json();
    if (d.success) { setResult({ strengths: d.strengths || [], weakness: d.weakness || null, scores }); setDone((x) => ({ ...x, fingerprint: true })); setStep("fit"); window.scrollTo({ top: 0 }); }
    else setMsg(d.message || "تعذّر الحفظ");
  };

  const allFitAnswered = FIT_QUESTIONS.every((q) => fitAnswers[q.key]);

  const submitFit = async () => {
    const res = await fetch(`${API_BASE}/api/instructors/me/fit`, { method: "PUT", headers: H, body: JSON.stringify(fitAnswers) });
    const d = await res.json();
    if (d.success) { setDone((x) => ({ ...x, fit: true })); setStep("result"); window.scrollTo({ top: 0 }); }
    else setMsg(d.message || "تعذّر الحفظ");
  };

  const markRead = async (id: string) => {
    await fetch(`${API_BASE}/api/instructors/me/messages/${id}/read`, { method: "PATCH", headers: H });
    setInbox((m) => m.map((x) => (x._id === id ? { ...x, status: "read" } : x)));
  };

  if (authed === false) return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...glass, borderRadius: "18px", padding: "34px", textAlign: "center", maxWidth: "440px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>🧑‍🏫</div>
        <h1 style={{ color: "#fff", fontSize: "22px", marginBottom: "10px" }}>انضم كمدرب</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "18px" }}>سجّل دخولك أولًا لإنشاء بروفايلك كمدرب غوص.</p>
        <Link href="/login" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", padding: "12px 28px", borderRadius: "11px", fontWeight: 800 }}>تسجيل الدخول</Link>
      </div>
    </main>
  );

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh", padding: "40px 16px 70px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(24px,5vw,34px)", fontWeight: 900, textAlign: "center", marginBottom: "6px" }}>🧑‍🏫 بروفايل المدرب</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", textAlign: "center", marginBottom: "26px", lineHeight: 1.8 }}>
          {step === "info" ? "الخطوة 1 من 3 — بيانات اعتمادك وتخصصاتك" : step === "survey" ? "الخطوة 2 من 3 — بصمة المدرب (تقييم ذاتي علمي)" : step === "fit" ? "الخطوة 3 من 3 — من يناسبك؟ (اختيارات صريحة)" : "بروفايلك جاهز 🎉"}
        </p>
        {msg && <p style={{ color: "#f87171", textAlign: "center", marginBottom: "14px" }}>{msg}</p>}

        {/* 🪪 حالة الموافقة المبدئية */}
        {authed && done.info && step === "info" && (
          appStatus === "pending" ? (
            <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "14px", padding: "14px 18px", marginBottom: "16px", color: "#fbbf24", fontSize: "13.5px", lineHeight: 1.8 }}>
              ⏳ <b>طلبك قيد المراجعة</b> — الإدارة تتحقق من صور الكارنيه. أكمل الاستبيانات في الأثناء،
              وسيظهر بروفايلك في الدليل فور الموافقة المبدئية.
            </div>
          ) : appStatus === "rejected" ? (
            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "14px", padding: "14px 18px", marginBottom: "16px", color: "#f87171", fontSize: "13.5px", lineHeight: 1.8 }}>
              ✋ لم تتم الموافقة على طلبك — راجع وضوح صور الكارنيه وأعد رفعها ثم احفظ، أو تواصل مع الإدارة.
            </div>
          ) : null
        )}

        {/* 🧭 شريط حالة بروفايلي — يوصلك مباشرة لأي خطوة ناقصة */}
        {authed && done.info && step === "info" && (
          <div style={{ ...glass, borderRadius: "16px", padding: "16px 18px", marginBottom: "18px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 700 }}>حالة بروفايلك:</span>
            <span style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", borderRadius: "20px", padding: "6px 14px", fontSize: "12.5px", fontWeight: 700 }}>✅ البيانات</span>
            {done.fingerprint ? (
              <button onClick={() => { setStep("survey"); window.scrollTo({ top: 0 }); }} style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", borderRadius: "20px", padding: "6px 14px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✅ البصمة (إعادة)</button>
            ) : (
              <button onClick={() => { setStep("survey"); window.scrollTo({ top: 0 }); }} style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", border: "none", color: "#fff", borderRadius: "20px", padding: "7px 16px", fontSize: "12.5px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(201,149,42,0.4)" }}>🧬 ناقصة: استبيان البصمة — ابدأ الآن</button>
            )}
            {done.fit ? (
              <button onClick={() => { setStep("fit"); window.scrollTo({ top: 0 }); }} style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", borderRadius: "20px", padding: "6px 14px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✅ من يناسبني (إعادة)</button>
            ) : (
              <button onClick={() => { setStep("fit"); window.scrollTo({ top: 0 }); }} style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", border: "none", color: "#fff", borderRadius: "20px", padding: "7px 16px", fontSize: "12.5px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(8,145,178,0.4)" }}>🤝 ناقص: استبيان «من يناسبني» — ابدأ الآن</button>
            )}
          </div>
        )}

        {/* ═══ الخطوة 1: البيانات ═══ */}
        {step === "info" && (
          <form onSubmit={saveInfo} style={{ ...glass, borderRadius: "18px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px" }}>
              <div>
                <label style={lbl}>المنظمة</label>
                <select required value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} style={field}>
                  <option value="" style={{ color: "#0f172a" }}>اختر منظمتك...</option>
                  {AGENCIES.map((a) => <option key={a} value={a} style={{ color: "#0f172a" }}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>رقم المدرب</label>
                <input value={form.instructorNumber} onChange={(e) => setForm({ ...form, instructorNumber: e.target.value })} placeholder="مثال: 345678" style={field} dir="ltr" />
              </div>
              <div>
                <label style={lbl}>الرتبة</label>
                <select value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} style={field}>
                  {RANKS.map((r) => <option key={r} value={r} style={{ color: "#0f172a" }}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>مدرب منذ سنة</label>
                <input type="number" min={1960} max={new Date().getFullYear()} value={form.sinceYear} onChange={(e) => setForm({ ...form, sinceYear: e.target.value })} placeholder="2006" style={field} dir="ltr" required />
              </div>
              <div>
                <label style={lbl}>الدولة</label>
                <select value={form.country} onChange={(e) => { const c = e.target.value; setForm({ ...form, country: c, city: (CITIES_BY_COUNTRY[c] || [])[0] || "" }); }} style={field}>
                  {COUNTRIES.map((c) => <option key={c} value={c} style={{ color: "#0f172a" }}>{c === "مصر" ? "🇪🇬 مصر" : "🇸🇦 السعودية"}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>مدينة الغوص</label>
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={field}>
                  {(CITIES_BY_COUNTRY[form.country] || []).map((c) => <option key={c} value={c} style={{ color: "#0f172a" }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>واتساب (للطلاب)</label>
                <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+20..." style={field} dir="ltr" />
              </div>
              <div>
                <label style={lbl}>الإيميل (للتواصل)</label>
                <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={field} dir="ltr" />
              </div>
            </div>

            {/* 🪪 الاعتماد المحلي حسب الدولة */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px" }}>
              <label style={{ ...lbl, marginBottom: "8px" }}>
                {form.country === "السعودية"
                  ? "🇸🇦 الترخيص الوطني — الاتحاد السعودي للرياضات البحرية والغوص"
                  : "🇪🇬 عضوية غرفة الغوص المصرية (CDWS)"}
              </label>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11.5px", lineHeight: 1.7, margin: "0 0 10px" }}>
                {form.country === "السعودية"
                  ? "التدريب الاحترافي في السعودية يتطلب ترخيصًا وطنيًا. أدخل رقمه إن وُجد."
                  : "التدريب في مصر يتطلب عضوية CDWS سارية. أدخل رقم بطاقتك إن وُجد."}
              </p>
              {form.country === "السعودية" ? (
                <input value={form.localAccreditation?.saudiLicense || ""} dir="ltr" placeholder="رقم الترخيص الوطني (اختياري)" style={field}
                  onChange={(e) => setForm({ ...form, localAccreditation: { ...form.localAccreditation, saudiLicense: e.target.value } })} />
              ) : (
                <input value={form.localAccreditation?.cdwsNumber || ""} dir="ltr" placeholder="رقم بطاقة CDWS (اختياري)" style={field}
                  onChange={(e) => setForm({ ...form, localAccreditation: { ...form.localAccreditation, cdwsNumber: e.target.value } })} />
              )}
              <label style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", marginTop: "10px", color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 400 }}>
                <input type="checkbox" checked={!!form.localAccreditation?.hasLocalLicense} style={{ width: "16px", height: "16px", accentColor: "#22d3ee" }}
                  onChange={(e) => setForm({ ...form, localAccreditation: { ...form.localAccreditation, hasLocalLicense: e.target.checked } })} />
                <span>{form.country === "السعودية" ? "أؤكد أن لديّ ترخيصًا وطنيًا ساريًا للتدريب" : "أؤكد أن لديّ عضوية CDWS سارية"}</span>
              </label>
            </div>

            <div>
              <label style={lbl}>🌐 حساباتك على السوشيال ميديا (اختياري — تظهر في بروفايلك)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px" }}>
                {[
                  { k: "facebook", ph: "فيسبوك: https://facebook.com/..." },
                  { k: "instagram", ph: "انستجرام: https://instagram.com/..." },
                  { k: "tiktok", ph: "تيك توك: https://tiktok.com/@..." },
                  { k: "youtube", ph: "يوتيوب: https://youtube.com/@..." },
                  { k: "x", ph: "إكس/تويتر: https://x.com/..." },
                  { k: "linkedin", ph: "لينكدإن: https://linkedin.com/in/..." },
                ].map((s) => (
                  <input key={s.k} value={form.social?.[s.k] || ""} placeholder={s.ph} style={field} dir="ltr"
                    onChange={(e) => setForm({ ...form, social: { ...(form.social || {}), [s.k]: e.target.value } })} />
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>التخصصات التي تدرّبها</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SPECIALTIES.map((s) => (
                  <button type="button" key={s} onClick={() => toggle("specialties", s)}
                    style={{ background: form.specialties.includes(s) ? "linear-gradient(135deg,#0891b2,#06b6d4)" : "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "7px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: form.specialties.includes(s) ? 700 : 400 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>اللغات</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {LANGS.map((l) => (
                  <button type="button" key={l} onClick={() => toggle("languages", l)}
                    style={{ background: form.languages.includes(l) ? "linear-gradient(135deg,#c9952a,#e8a830)" : "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "7px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: form.languages.includes(l) ? 700 : 400 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>نبذة قصيرة عنك (تظهر في بروفايلك)</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={600} placeholder="من أنت كمدرب؟ ما فلسفتك في التعليم؟" style={{ ...field, resize: "vertical" }} />
            </div>

            <div>
              <label style={lbl}>🪪 صور كارنيه المدرب — وش وضهر (مطلوبة للموافقة المبدئية، حتى 8 صور لأكثر من كارنيه)</label>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", lineHeight: 1.7, margin: "0 0 10px" }}>
                تظهر للإدارة فقط للتحقق — لا تُعرض في بروفايلك العام أبدًا.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {(form.cardImages || []).map((u: string, i: number) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={/^https?:\/\//.test(u) ? u : `/images/${u}`} alt="" style={{ width: "92px", height: "60px", objectFit: "cover", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.2)" }} />
                    <button type="button" onClick={() => setForm((f: any) => ({ ...f, cardImages: f.cardImages.filter((_: string, j: number) => j !== i) }))}
                      style={{ position: "absolute", top: "-7px", insetInlineEnd: "-7px", background: "#e11d48", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", cursor: "pointer", lineHeight: 1 }}>✕</button>
                  </div>
                ))}
                <label style={{ background: "rgba(255,255,255,0.07)", border: "1px dashed rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", borderRadius: "11px", padding: "18px 20px", fontSize: "13px", cursor: "pointer", fontWeight: 700 }}>
                  📷 أضف صور الكارنيه
                  <input type="file" accept="image/*" multiple hidden onChange={(e) => uploadCards(e.target.files)} />
                </label>
                {uploading && <span style={{ color: "#fbbf24", fontSize: "12.5px" }}>جارٍ الرفع...</span>}
              </div>
            </div>

            <div>
              <label style={lbl}>🎬 فيديو تعريفي (رابط يوتيوب أو فيديو مباشر — اختياري)</label>
              <input value={form.video || ""} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={field} dir="ltr" />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "11px", padding: "12px 14px" }}>
              <input type="checkbox" checked={form.showContact !== false} onChange={(e) => setForm({ ...form, showContact: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "#22d3ee" }} />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13.5px", lineHeight: 1.7 }}>
                📞 إظهار وسائل التواصل (واتساب) في بروفايلي العام — يمكنك إخفاؤها في أي وقت
              </span>
            </label>

            <button type="submit" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              {done.fingerprint ? "💾 حفظ بياناتي" : "💾 احفظ وتابع: بصمة المدرب ←"}
            </button>
          </form>
        )}

        {/* ═══ 🤝 مراكزي — عضوية بموافقة الطرفين ═══ */}
        {step === "info" && authed && (
          <div style={{ ...glass, borderRadius: "18px", padding: "24px", marginTop: "18px" }}>
            <h2 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, marginBottom: "4px" }}>🤝 مراكز الغوص التي أعمل معها</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", lineHeight: 1.8, marginBottom: "16px" }}>
              اطلب الانضمام لمركز — يظهر اسمك في صفحته بعد موافقته، وتظهر مراكزك في بروفايلك. (احفظ بياناتك أولًا إن كنت جديدًا)
            </p>

            {/* عضوياتي الحالية */}
            {memberships.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {memberships.map((m) => (
                  <div key={m.center._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 14px" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>🏛️ {m.center.name}</div>
                      <div style={{ fontSize: "12px", marginTop: "3px", color: m.status === "approved" ? "#34d399" : "#fbbf24" }}>
                        {m.status === "approved" ? "✅ معتمد — تظهر في صفحة المركز" : m.status === "pending_center" ? "⏳ بانتظار موافقة المركز" : "📨 المركز دعاك — بانتظار ردك"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {m.status === "pending_instructor" && (
                        <button onClick={() => respondCenter(m.center._id, true)}
                          style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "9px", padding: "8px 16px", fontWeight: 800, fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit" }}>
                          أقبل الدعوة ✅
                        </button>
                      )}
                      <button onClick={() => respondCenter(m.center._id, false)}
                        style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "9px", padding: "8px 14px", fontWeight: 700, fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit" }}>
                        {m.status === "approved" ? "مغادرة" : m.status === "pending_center" ? "إلغاء الطلب" : "رفض"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* طلب انضمام جديد */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <select value={centerPick} onChange={(e) => setCenterPick(e.target.value)} style={{ ...field, flex: 1, minWidth: "200px", width: "auto" }}>
                <option value="" style={{ color: "#0f172a" }}>اختر مركزًا للانضمام...</option>
                {centers
                  .filter((c) => !memberships.some((m) => m.center._id === c._id))
                  .map((c) => <option key={c._id} value={c._id} style={{ color: "#0f172a" }}>{c.name} — {c.city}</option>)}
              </select>
              <button onClick={requestJoin} disabled={!centerPick}
                style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "#fff", border: "none", borderRadius: "11px", padding: "11px 22px", fontWeight: 800, fontSize: "13.5px", cursor: "pointer", fontFamily: "inherit", opacity: centerPick ? 1 : 0.4 }}>
                أرسل طلب الانضمام
              </button>
            </div>
          </div>
        )}

        {/* ═══ 📬 رسائلي — من زوار بروفايلي ═══ */}
        {step === "info" && authed && done.info && (
          <div style={{ ...glass, borderRadius: "18px", padding: "24px", marginTop: "18px" }}>
            <h2 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, marginBottom: "4px" }}>
              📬 رسائلي {inbox.filter((m) => m.status === "new").length > 0 && (
                <span style={{ background: "#e11d48", color: "#fff", borderRadius: "20px", fontSize: "12px", padding: "2px 10px", marginInlineStart: "6px" }}>
                  {inbox.filter((m) => m.status === "new").length} جديدة
                </span>
              )}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", marginBottom: "14px" }}>رسائل يرسلها الزوار من بروفايلك عبر الموقع — رد عليهم بوسيلة التواصل التي تركوها.</p>
            {inbox.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13.5px", margin: 0 }}>لا رسائل بعد — حين يراسلك زائر من بروفايلك ستجد رسالته هنا.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {inbox.map((m) => (
                  <div key={m._id} style={{ background: m.status === "new" ? "rgba(34,211,238,0.07)" : "rgba(255,255,255,0.04)", border: `1px solid ${m.status === "new" ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", padding: "13px 15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <strong style={{ color: "#fff", fontSize: "14px" }}>
                        {m.status === "new" ? "🔵 " : ""}{m.name}
                        {m.contact && <span style={{ color: "#22d3ee", fontWeight: 400, fontSize: "12.5px", marginInlineStart: "8px" }} dir="ltr">{m.contact}</span>}
                      </strong>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "11.5px" }}>{new Date(m.createdAt).toLocaleString("ar-EG")}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{m.message}</p>
                    {m.status === "new" && (
                      <button onClick={() => markRead(m._id)} style={{ background: "transparent", border: "none", color: "#22d3ee", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", padding: "6px 0 0", fontWeight: 700 }}>
                        ✓ تمت القراءة
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ الخطوة 2: الاستبيان ═══ */}
        {step === "survey" && (
          <div style={{ ...glass, borderRadius: "18px", padding: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.9, marginBottom: "20px" }}>
              مبني على مقاييس علمية (TSES وإطار Danielson ومعايير تقييم مدربي الغوص). أجب بصدق —
              <b style={{ color: "#fbbf24" }}> أقوى محورين يظهران علنًا كنقاط تميّزك، وأضعف محور يبقى لك وحدك</b> كمجال تطوير.
              السؤال دائمًا: «إلى أي مدى تستطيع…؟»
            </p>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: i < QUESTIONS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ color: "#fff", fontSize: "14.5px", fontWeight: 600, lineHeight: 1.7, marginBottom: "10px" }}>
                  <span style={{ color: "#22d3ee", marginInlineEnd: "6px" }}>{AXES[q.axis].icon}</span>
                  {i + 1}. {q.text}
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {SCALE.map((o) => (
                    <button key={o.v} onClick={() => setAnswers({ ...answers, [i]: o.v })}
                      style={{ flex: 1, minWidth: "76px", padding: "9px 6px", borderRadius: "9px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit",
                        border: answers[i] === o.v ? "2px solid #22d3ee" : "1px solid rgba(255,255,255,0.15)",
                        background: answers[i] === o.v ? "rgba(34,211,238,0.18)" : "rgba(255,255,255,0.05)",
                        color: "#fff", fontWeight: answers[i] === o.v ? 800 : 400 }}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={submitSurvey} disabled={!allAnswered}
              style={{ width: "100%", background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", opacity: allAnswered ? 1 : 0.4 }}>
              اعرض بصمتي 🧬
            </button>
          </div>
        )}

        {/* ═══ الخطوة 3: من يناسبني؟ (اختيار قسري) ═══ */}
        {step === "fit" && (
          <div style={{ ...glass, borderRadius: "18px", padding: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.9, marginBottom: "8px" }}>
              لا توجد إجابة «أفضل» هنا — <b style={{ color: "#fbbf24" }}>كل اختيار له ثمن، وهذا سرّ صدقه</b>.
              اختر ما يشبهك فعلًا، لا ما يبدو أجمل.
            </p>
            <p style={{ color: "#22d3ee", fontSize: "13px", lineHeight: 1.8, marginBottom: "20px" }}>
              💡 لماذا مصلحتك أن تصدق؟ إجاباتك تحدد من يصلك من الطلاب — الصادق يحصل على طلاب يناسبونه
              فيستمتع ويُبدع وتعلو تقييماته. المتجمّل يحصل على طلاب لا يطيقهم.
            </p>
            {FIT_QUESTIONS.map((q, i) => (
              <div key={q.key} style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: i < FIT_QUESTIONS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ color: "#fff", fontSize: "14.5px", fontWeight: 700, marginBottom: "10px" }}>{i + 1}. {q.question}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[q.a, q.b].map((opt) => (
                    <button key={opt.value} onClick={() => setFitAnswers({ ...fitAnswers, [q.key]: opt.value })}
                      style={{ padding: "14px 12px", borderRadius: "12px", fontSize: "13px", lineHeight: 1.7, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
                        border: fitAnswers[q.key] === opt.value ? "2px solid #fbbf24" : "1px solid rgba(255,255,255,0.15)",
                        background: fitAnswers[q.key] === opt.value ? "rgba(251,191,36,0.14)" : "rgba(255,255,255,0.05)",
                        color: "#fff", fontWeight: fitAnswers[q.key] === opt.value ? 800 : 400 }}>
                      <span style={{ fontSize: "24px", display: "block", marginBottom: "6px" }}>{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={submitFit} disabled={!allFitAnswered}
              style={{ width: "100%", background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", opacity: allFitAnswered ? 1 : 0.4 }}>
              احفظ واعرض بروفايلي 🎉
            </button>
          </div>
        )}

        {/* ═══ النتيجة ═══ */}
        {step === "result" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ ...glass, borderRadius: "18px", padding: "24px" }}>
              <h2 style={{ color: "#fff", fontSize: "19px", fontWeight: 800, marginBottom: "16px" }}>🧬 بصمتك التدريبية</h2>
              {Object.entries(AXES).map(([a, meta]) => {
                const v = result.scores[a] || 0;
                const pct = Math.round(((v - 1) / 4) * 100);
                const isStrength = result.strengths.includes(a);
                return (
                  <div key={a} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "5px" }}>
                      <span style={{ color: "#fff", fontWeight: 700 }}>{meta.icon} {meta.label} {isStrength && <span style={{ color: "#fbbf24" }}>⭐ تميّز</span>}</span>
                      <span style={{ color: "rgba(255,255,255,0.55)" }}>{v}/5</span>
                    </div>
                    <div style={{ height: "9px", background: "rgba(255,255,255,0.08)", borderRadius: "5px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: isStrength ? "linear-gradient(90deg,#c9952a,#e8a830)" : "linear-gradient(90deg,#0891b2,#22d3ee)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {result.weakness && (
              <div style={{ ...glass, borderRadius: "18px", padding: "22px", borderColor: "rgba(251,191,36,0.3)" }}>
                <h3 style={{ color: "#fbbf24", fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>🔒 لك وحدك — مجال تطويرك</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.9, fontSize: "14px", margin: 0 }}>
                  أدنى محاورك: <b>{AXES[result.weakness].icon} {AXES[result.weakness].label}</b>.
                  هذا لا يظهر لأحد — إلا إذا فعّلت «إظهار مجال تطويري» من بروفايلك (شفافية يقدّرها الطلاب كثيرًا).
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/instructors" style={{ flex: 1, textAlign: "center", background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", borderRadius: "12px", padding: "13px", fontWeight: 800, textDecoration: "none" }}>
                شاهد دليل المدربين ←
              </Link>
              <button onClick={() => { setStep("survey"); setAnswers({}); }} style={{ flex: 1, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ↺ أعد الاستبيان
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
