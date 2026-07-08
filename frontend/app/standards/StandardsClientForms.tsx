"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

/* ────────────────────────────────────────────────────────── */

type FormMode = null | "diver" | "partner";

interface Center { _id: string; name: string; city?: string; }

/* shared field style */
const F: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px",
  boxSizing: "border-box", background: "#f8fafc", color: "#1e293b",
};
const TA: React.CSSProperties = { ...F, minHeight: "100px", resize: "vertical" };

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "5px", fontWeight: 600 }}>{children}</label>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: "14px" }}><Label>{label}</Label>{children}</div>;
}

/* ─── Diver / Booking Inquiry Form ──────────────────────── */
function DiverForm({ centers }: { centers: Center[] }) {
  const [form, setForm] = useState({
    name: "", contact: "", centerChoice: "", otherName: "", otherWebsite: "", otherCity: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const centerLabel = form.centerChoice === "other"
      ? `مركز آخر: ${form.otherName} | ${form.otherWebsite} | ${form.otherCity}`
      : centers.find((c) => c._id === form.centerChoice)?.name || form.centerChoice;

    const body = {
      page: "/standards",
      name: form.name,
      contact: form.contact,
      message: `[استفسار حجز]\nالمركز: ${centerLabel}\n\n${form.message}`,
    };
    try {
      const r = await fetch(`${API_BASE}/api/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      setStatus(r.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  if (status === "done") return (
    <div style={{ textAlign: "center", padding: "28px 0", color: "#16a34a" }}>
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
      <div style={{ fontWeight: 800, fontSize: "16px" }}>وصلت رسالتك!</div>
      <div style={{ color: "#555", fontSize: "14px", marginTop: "6px" }}>سنرد عليك خلال 24 ساعة على أقصى تقدير.</div>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ padding: "4px 0" }}>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13.5px", color: "#15803d", lineHeight: 1.8 }}>
        💡 كلما أضفت تفاصيل أكثر — التاريخ المناسب، عدد الأشخاص، مستواك — كلما قلّت الرسائل بيننا وأسرعنا في تجهيز ترشيح مناسب.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Field label="اسمك الكريم *">
          <input style={F} required value={form.name} onChange={set("name")} placeholder="محمد العمري" />
        </Field>
        <Field label="واتساب أو بريد إلكتروني *">
          <input style={F} required value={form.contact} onChange={set("contact")} placeholder="+966 5xx xxx xxx" />
        </Field>
      </div>

      <Field label="المركز الذي تريد الاستفسار عنه *">
        <select style={F} required value={form.centerChoice} onChange={set("centerChoice")}>
          <option value="">— اختر —</option>
          <optgroup label="شركاؤنا المعتمدون">
            {centers.map((c) => (
              <option key={c._id} value={c._id}>{c.name}{c.city ? ` — ${c.city}` : ""}</option>
            ))}
          </optgroup>
          <option value="other">مركز آخر (غير مدرج)</option>
        </select>
      </Field>

      {form.centerChoice === "other" && (
        <div style={{ background: "#fafafa", border: "1px dashed #cbd5e1", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px" }}>أخبرنا بتفاصيل المركز حتى نتحقق منه لك:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Field label="اسم المركز">
              <input style={F} value={form.otherName} onChange={set("otherName")} placeholder="Dive Center Name" />
            </Field>
            <Field label="المدينة / الدولة">
              <input style={F} value={form.otherCity} onChange={set("otherCity")} placeholder="الغردقة، مصر" />
            </Field>
          </div>
          <Field label="الموقع الإلكتروني للمركز">
            <input style={F} value={form.otherWebsite} onChange={set("otherWebsite")} placeholder="https://..." type="url" />
          </Field>
        </div>
      )}

      <Field label="ما الذي تريد أن تسأل عنه؟ *">
        <textarea
          style={TA} required value={form.message} onChange={set("message")}
          placeholder="مثال: أريد رحلة مع عائلتي (4 أشخاص، طفلان) في أغسطس. مستواي Open Water ومضى عليه سنة. أريد رحلة هادئة مع مرشد عربي وخصوصية للزوجة..."
        />
      </Field>

      <button
        type="submit" disabled={status === "sending"}
        style={{ width: "100%", background: "var(--navy,#0B2C59)", color: "white", border: "none", borderRadius: "12px", padding: "13px", fontFamily: "inherit", fontWeight: 800, fontSize: "15px", cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? "جارٍ الإرسال..." : "إرسال الاستفسار 📨"}
      </button>
      {status === "error" && <p style={{ color: "#b91c1c", marginTop: "8px", fontSize: "13px", textAlign: "center" }}>حدث خطأ — تأكد من اتصالك وحاول مجدداً</p>}
    </form>
  );
}

/* ─── Partner / Accreditation Form ──────────────────────── */
function PartnerForm() {
  const [form, setForm] = useState({
    centerName: "", contactName: "", phone: "", email: "", website: "", cityCountry: "", extra: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const msg = [
      `[طلب اعتماد شريك]`,
      `اسم المركز: ${form.centerName}`,
      `المسؤول: ${form.contactName}`,
      `الهاتف / واتساب: ${form.phone}`,
      `البريد: ${form.email}`,
      `الموقع: ${form.website}`,
      `المدينة والدولة: ${form.cityCountry}`,
      form.extra ? `ملاحظات إضافية:\n${form.extra}` : "",
    ].filter(Boolean).join("\n");

    try {
      const r = await fetch(`${API_BASE}/api/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "/standards", name: form.centerName, contact: form.phone || form.email, message: msg }),
      });
      setStatus(r.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };

  if (status === "done") return (
    <div style={{ textAlign: "center", padding: "28px 0", color: "#16a34a" }}>
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
      <div style={{ fontWeight: 800, fontSize: "16px" }}>وصل طلبك!</div>
      <div style={{ color: "#555", fontSize: "14px", marginTop: "6px" }}>سيتواصل معك فريقنا لإكمال إجراءات الاعتماد خلال 48 ساعة.</div>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ padding: "4px 0" }}>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13.5px", color: "#92400e", lineHeight: 1.8 }}>
        🏅 انضمامك لشبكة ArabDiving يعني الوصول لآلاف الغواصين العرب. سنراجع طلبك ونتواصل معك لترتيب الزيارة الميدانية.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Field label="اسم المركز *">
          <input style={F} required value={form.centerName} onChange={set("centerName")} placeholder="Blue Ocean Dive Center" />
        </Field>
        <Field label="اسم المسؤول *">
          <input style={F} required value={form.contactName} onChange={set("contactName")} placeholder="أحمد محمود" />
        </Field>
        <Field label="واتساب / هاتف *">
          <input style={F} required value={form.phone} onChange={set("phone")} placeholder="+20 1xx xxx xxxx" />
        </Field>
        <Field label="البريد الإلكتروني">
          <input style={F} type="email" value={form.email} onChange={set("email")} placeholder="info@divecenter.com" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Field label="الموقع الإلكتروني">
          <input style={F} type="url" value={form.website} onChange={set("website")} placeholder="https://..." />
        </Field>
        <Field label="المدينة والدولة *">
          <input style={F} required value={form.cityCountry} onChange={set("cityCountry")} placeholder="الغردقة، مصر" />
        </Field>
      </div>

      <Field label="أي معلومات إضافية تريد مشاركتها؟">
        <textarea
          style={TA} value={form.extra} onChange={set("extra")}
          placeholder="مثال: لدينا ترخيص CDWS رقم ... وتأمين ساري، وكادرنا عربي بالكامل. نرحب بالعائلات والسيدات ..."
        />
      </Field>

      <button
        type="submit" disabled={status === "sending"}
        style={{ width: "100%", background: "var(--gold,#c9952a)", color: "#0f172a", border: "none", borderRadius: "12px", padding: "13px", fontFamily: "inherit", fontWeight: 800, fontSize: "15px", cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? "جارٍ الإرسال..." : "إرسال طلب الاعتماد 🏅"}
      </button>
      {status === "error" && <p style={{ color: "#b91c1c", marginTop: "8px", fontSize: "13px", textAlign: "center" }}>حدث خطأ — تأكد من اتصالك وحاول مجدداً</p>}
    </form>
  );
}

/* ─── Main export ────────────────────────────────────────── */
export default function StandardsClientForms() {
  const [mode, setMode] = useState<FormMode>(null);
  const [centers, setCenters] = useState<Center[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/partner-centers`)
      .then((r) => r.json())
      .then((d) => setCenters((d.centers || d).filter((c: any) => c.active !== false)))
      .catch(() => {});
  }, []);

  const cardBase: React.CSSProperties = {
    background: "white", borderRadius: "16px", padding: "24px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>

      {/* Card 1 — Diver */}
      <div style={{ ...cardBase, ...(mode === "diver" ? { boxShadow: "0 8px 28px rgba(11,44,89,0.15)", outline: "2px solid var(--navy,#0B2C59)" } : {}) }}>
        {mode !== "diver" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🤿</div>
            <div style={{ fontWeight: 800, color: "var(--navy)", marginBottom: "8px" }}>غواص أو مقبل على التجربة؟</div>
            <p style={{ color: "#666", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "14px" }}>
              لا تحجز قبل أن تسأل: هل المركز يلتزم بهذه المعايير؟ أو اطلب منا ترشيحًا معتمدًا.
            </p>
            <button
              onClick={() => setMode("diver")}
              style={{ background: "var(--navy,#0B2C59)", color: "white", border: "none", borderRadius: "10px", padding: "11px 26px", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}
            >
              اسألنا قبل ما تحجز
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, color: "var(--navy)", fontSize: "16px" }}>🤿 استفسار قبل الحجز</h3>
              <button onClick={() => setMode(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
            </div>
            <DiverForm centers={centers} />
          </>
        )}
      </div>

      {/* Card 2 — Partner */}
      <div style={{ ...cardBase, ...(mode === "partner" ? { boxShadow: "0 8px 28px rgba(201,149,42,0.2)", outline: "2px solid var(--gold,#c9952a)" } : {}) }}>
        {mode !== "partner" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏢</div>
            <div style={{ fontWeight: 800, color: "var(--navy)", marginBottom: "8px" }}>مركز غوص وتؤمن بهذه المعايير؟</div>
            <p style={{ color: "#666", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "14px" }}>
              انضم لشبكة المراكز المعتمدة واكسب شريحة الغواصين العرب — الأعلى إنفاقًا والأكثر ولاءً.
            </p>
            <button
              onClick={() => setMode("partner")}
              style={{ background: "var(--gold,#c9952a)", color: "#0f172a", border: "none", borderRadius: "10px", padding: "11px 26px", fontWeight: 800, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}
            >
              اطلب الاعتماد
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, color: "var(--navy)", fontSize: "16px" }}>🏅 طلب انضمام للشبكة</h3>
              <button onClick={() => setMode(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
            </div>
            <PartnerForm />
          </>
        )}
      </div>

    </div>
  );
}
