"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/app/lib/api";

type Msg = { from: "bot" | "user"; text: string };

const STEP_PROMPTS = [
  "مرحبًا! 👋 أنا مساعد الغواصين العرب. ممكن أعرف اسمك؟",
  "تشرّفنا! 🌊 اترك رقم جوالك أو بريدك الإلكتروني لنتواصل معك.",
  "ممتاز. كيف نقدر نساعدك؟ اكتب رسالتك أو سؤالك.",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [chatEnabled, setChatEnabled] = useState(true);

  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: STEP_PROMPTS[0] }]);
  const [step, setStep] = useState(0); // 0 name, 1 contact, 2 message, 3 done
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState({ name: "", contact: "", message: "" });
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => { setWhatsapp(d.settings?.whatsappNumber || ""); setChatEnabled(d.settings?.chatEnabled !== false); })
      .catch(() => {});
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, open]);

  const submit = async (data: { name: string; contact: string; message: string }) => {
    setSending(true);
    try {
      await fetch(`${API_BASE}/api/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, page: typeof window !== "undefined" ? window.location.pathname : "" }),
      });
    } catch { /* ignore — still thank the user */ } finally { setSending(false); }
  };

  const send = () => {
    const val = input.trim();
    if (!val || step > 2) return;
    const newMsgs: Msg[] = [...msgs, { from: "user", text: val }];
    const next = { ...answers };
    if (step === 0) next.name = val;
    if (step === 1) next.contact = val;
    if (step === 2) next.message = val;
    setAnswers(next);
    setInput("");

    if (step < 2) {
      newMsgs.push({ from: "bot", text: STEP_PROMPTS[step + 1].replace("تشرّفنا!", `تشرّفنا يا ${next.name}!`) });
      setMsgs(newMsgs);
      setStep(step + 1);
    } else {
      newMsgs.push({ from: "bot", text: `شكرًا يا ${next.name}! ✅ استلمنا رسالتك وسنتواصل معك قريبًا عبر ${next.contact || "بيانات التواصل"}. 🌊` });
      setMsgs(newMsgs);
      setStep(3);
      submit(next);
    }
  };

  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("مرحبًا، لدي استفسار عن رحلات الغوص 🤿")}` : "";

  return (
    <>
      {/* Launcher */}
      <button onClick={() => setOpen((o) => !o)} aria-label="تواصل معنا"
        style={{ position: "fixed", bottom: "20px", insetInlineEnd: "20px", zIndex: 80, width: "60px", height: "60px", borderRadius: "50%", border: "none", background: "var(--mid, #2e75b6)", color: "white", fontSize: "28px", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div style={{ position: "fixed", bottom: "92px", insetInlineEnd: "20px", zIndex: 80, width: "min(360px, calc(100vw - 40px))", background: "white", borderRadius: "18px", boxShadow: "0 18px 50px rgba(0,0,0,0.3)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "70vh" }}>
          {/* Header */}
          <div style={{ background: "#0B2C59", color: "white", padding: "16px 18px" }}>
            <strong style={{ fontSize: "16px" }}>تواصل مع الغواصين العرب</strong>
            <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "2px" }}>نرد عليك في أقرب وقت 🌊</div>
          </div>

          {/* WhatsApp quick button */}
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#25D366", color: "white", padding: "12px", fontWeight: 700, fontSize: "15px" }}>
              💬 تواصل مباشرة عبر واتساب
            </a>
          )}

          {chatEnabled ? (
            <>
              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#f6f9fc", display: "flex", flexDirection: "column", gap: "10px", minHeight: "180px" }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.from === "bot" ? "flex-start" : "flex-end", maxWidth: "85%", background: m.from === "bot" ? "white" : "var(--mid, #2e75b6)", color: m.from === "bot" ? "#06324f" : "white", padding: "10px 14px", borderRadius: "14px", fontSize: "14px", lineHeight: 1.7, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Input */}
              {step <= 2 ? (
                <div style={{ display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid #eef2f6" }}>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder={step === 1 ? "رقم الجوال أو البريد..." : "اكتب هنا..."} type={step === 1 ? "text" : "text"}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px", color: "#0f172a", background: "white" }} />
                  <button onClick={send} disabled={sending} style={{ background: "var(--gold, #c9952a)", color: "white", border: "none", borderRadius: "10px", padding: "0 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>إرسال</button>
                </div>
              ) : (
                <div style={{ padding: "12px", borderTop: "1px solid #eef2f6", textAlign: "center" }}>
                  <button onClick={() => { setMsgs([{ from: "bot", text: STEP_PROMPTS[0] }]); setStep(0); setAnswers({ name: "", contact: "", message: "" }); }}
                    style={{ background: "#eef4fa", color: "#0d6cb0", border: "none", borderRadius: "10px", padding: "10px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>بدء محادثة جديدة</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#666", fontSize: "14px" }}>تواصل معنا عبر واتساب أعلاه 👆</div>
          )}
        </div>
      )}
    </>
  );
}
