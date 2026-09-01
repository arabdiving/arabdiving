"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

/*
  صندوق «شاركنا تجربتك أو شكواك» — قابل لإعادة الاستخدام في أي صفحة.
  props: brand (العلامة المرتبطة — للفلترة والإرسال) + lang (لغة النصوص).
  الزائر يختار: منشور عام (بعد موافقة الإدارة) أو رسالة خاصة. يصل للأدمن بالبريد.
*/

export type BoxLang = "ar" | "en" | "de" | "es" | "zh";

const F: Record<BoxLang, { title: string; sub: string; name: string; contact: string; msg: string; pub: string; priv: string; send: string; sending: string; othersTitle: string }> = {
  ar: { title: "شاركنا تجربتك أو شكواك", sub: "مررت بتجربة مع منتج أو خدمة غوص؟ احكِها لنا.", name: "اسمك", contact: "إيميلك أو واتسابك (للرد — لا يُنشر)", msg: "اكتب تجربتك أو شكواك هنا...", pub: "🌍 انشرها للجميع (بعد مراجعتنا)", priv: "🔒 أرسلها لنا فقط (خاصة)", send: "إرسال", sending: "جارٍ الإرسال...", othersTitle: "تجارب غوّاصين آخرين" },
  en: { title: "Share your experience or complaint", sub: "Had an experience with a diving product or service? Tell us.", name: "Your name", contact: "Your email or WhatsApp (for reply — not published)", msg: "Write your experience or complaint here...", pub: "🌍 Publish it for everyone (after our review)", priv: "🔒 Send it to us only (private)", send: "Send", sending: "Sending...", othersTitle: "Other divers' experiences" },
  de: { title: "Teilen Sie Ihre Erfahrung oder Beschwerde", sub: "Erfahrung mit einem Tauchprodukt oder Service? Erzählen Sie uns davon.", name: "Ihr Name", contact: "E-Mail oder WhatsApp (für Antwort — nicht veröffentlicht)", msg: "Schreiben Sie hier Ihre Erfahrung oder Beschwerde...", pub: "🌍 Für alle veröffentlichen (nach Prüfung)", priv: "🔒 Nur an uns senden (privat)", send: "Senden", sending: "Wird gesendet...", othersTitle: "Erfahrungen anderer Taucher" },
  es: { title: "Comparte tu experiencia o queja", sub: "¿Tuviste una experiencia con un producto o servicio de buceo? Cuéntanos.", name: "Tu nombre", contact: "Tu email o WhatsApp (para responder — no se publica)", msg: "Escribe aquí tu experiencia o queja...", pub: "🌍 Publicarla para todos (tras revisión)", priv: "🔒 Enviárnosla solo a nosotros (privada)", send: "Enviar", sending: "Enviando...", othersTitle: "Experiencias de otros buceadores" },
  zh: { title: "分享你的经历或投诉", sub: "对潜水产品或服务有过经历？告诉我们。", name: "你的名字", contact: "你的邮箱或 WhatsApp（用于回复 — 不公开）", msg: "在此写下你的经历或投诉……", pub: "🌍 公开发布（经审核后）", priv: "🔒 仅发送给我们（私密）", send: "发送", sending: "发送中……", othersTitle: "其他潜水员的经历" },
};

const glass: React.CSSProperties = {
  background: "var(--glass-bg,rgba(8,20,48,0.78))",
  border: "1px solid var(--glass-border,rgba(255,255,255,0.08))",
  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
};

export default function TestimonialBox({ brand = "", lang = "ar", showOthers = true }: { brand?: string; lang?: BoxLang; showOthers?: boolean }) {
  const f = F[lang] || F.ar;
  const rtl = lang === "ar";
  const [form, setForm] = useState({ name: "", contact: "", message: "", wantsPublic: false });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!showOthers) return;
    const q = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    fetch(`${API_BASE}/api/testimonials${q}`).then((r) => r.json())
      .then((d) => setItems(d.testimonials || [])).catch(() => {});
  }, [brand, showOthers]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending"); setNote("");
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, brand, page: typeof window !== "undefined" ? window.location.pathname : "" }),
      });
      const d = await res.json();
      if (d.success) { setState("sent"); setNote(d.message); setForm({ name: "", contact: "", message: "", wantsPublic: false }); }
      else { setState("idle"); setNote(d.message || "تعذّر الإرسال"); }
    } catch { setState("idle"); setNote("تعذّر الاتصال بالخادم"); }
  };

  const fld: React.CSSProperties = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "11px", padding: "11px", fontFamily: "inherit", fontSize: "14px", width: "100%", boxSizing: "border-box" };

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ textAlign: rtl ? "right" : "left" }}>
      <div style={{ ...glass, borderRadius: "18px", padding: "24px", borderColor: "rgba(225,48,108,0.28)" }}>
        <h2 style={{ color: "#fff", fontSize: "19px", fontWeight: 900, marginBottom: "4px" }}>✍️ {f.title}</h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "16px" }}>{f.sub}</p>
        {state === "sent" ? (
          <p style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px", padding: "14px 16px", color: "#34d399", fontWeight: 700, fontSize: "14px", margin: 0 }}>✅ {note}</p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={f.name} style={fld} />
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder={f.contact} style={fld} dir="ltr" />
            </div>
            <textarea required rows={4} maxLength={3000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={f.msg} style={{ ...fld, resize: "vertical" }} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setForm({ ...form, wantsPublic: false })}
                style={{ flex: "1 1 200px", padding: "12px", borderRadius: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "13px", border: !form.wantsPublic ? "2px solid #22d3ee" : "1px solid rgba(255,255,255,0.15)", background: !form.wantsPublic ? "rgba(34,211,238,0.14)" : "rgba(255,255,255,0.05)", color: "#fff" }}>{f.priv}</button>
              <button type="button" onClick={() => setForm({ ...form, wantsPublic: true })}
                style={{ flex: "1 1 200px", padding: "12px", borderRadius: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "13px", border: form.wantsPublic ? "2px solid #E1306C" : "1px solid rgba(255,255,255,0.15)", background: form.wantsPublic ? "rgba(225,48,108,0.14)" : "rgba(255,255,255,0.05)", color: "#fff" }}>{f.pub}</button>
            </div>
            {note && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{note}</p>}
            <button type="submit" disabled={state === "sending"} style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", color: "#fff", border: "none", borderRadius: "12px", padding: "13px", fontWeight: 800, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", opacity: state === "sending" ? 0.6 : 1 }}>
              {state === "sending" ? f.sending : `📨 ${f.send}`}
            </button>
          </form>
        )}
      </div>

      {showOthers && items.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "14px" }}>💬 {f.othersTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((it) => (
              <div key={it._id} style={{ ...glass, borderRadius: "14px", padding: "16px 18px" }}>
                <div style={{ color: "#22d3ee", fontWeight: 800, fontSize: "14px", marginBottom: "6px" }}>{it.name}{it.brand ? ` · ${it.brand}` : ""}</div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>{it.message}</p>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11.5px", marginTop: "8px" }}>{new Date(it.createdAt).toLocaleDateString(rtl ? "ar-EG" : "en-GB")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
