"use client";

import { useEffect, useRef, useState } from "react";

/*
  القراءة الصوتية — نسخة الزر الاختياري (أُلغي تفعيل النقرات الثلاث والبانر بطلب المالك).
  • زر عائم 🔊 ثابت في طرف الشاشة — ضغطة واحدة تفعّل وضع القراءة.
  • أثناء التفعيل: الضغط على أي نص يقرؤه بالصوت العربي (والروابط لا تنتقل — قراءة فقط).
  • الزر يتحول لأحمر نابض ⏹ لإيقاف الوضع.
*/

export default function VoiceAccessibilityIntro() {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(true);
  const activeRef = useRef(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) { setSupported(false); return; }
    const synth = window.speechSynthesis;
    const loadVoices = () => { voicesRef.current = synth.getVoices(); };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
    return () => { synth.onvoiceschanged = null; };
  }, []);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (!synth || !text.trim()) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.slice(0, 500));
    const voices = voicesRef.current;
    const ar = voices.find((v) => v.lang === "ar-SA")
      || voices.find((v) => v.lang === "ar-EG")
      || voices.find((v) => v.lang && v.lang.startsWith("ar"));
    if (ar) u.voice = ar;
    u.lang = "ar-SA";
    u.rate = 0.95;
    synth.speak(u);
  };

  /* وضع القراءة: أي ضغطة تقرأ النص ولا تنفّذ الرابط */
  useEffect(() => {
    activeRef.current = active;
    if (typeof window === "undefined") return;
    if (!active) { window.speechSynthesis?.cancel(); return; }

    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el || el.closest("#voice-toggle-btn")) return; // زر الإيقاف نفسه
      e.preventDefault();
      e.stopPropagation();
      const block = el.closest("p,h1,h2,h3,h4,li,a,button,span,label,td,div") as HTMLElement | null;
      const text = (block?.innerText || el.innerText || "").trim();
      if (text) speak(text);
    };

    document.addEventListener("click", handler, true);
    document.body.style.cursor = "help";
    return () => {
      document.removeEventListener("click", handler, true);
      document.body.style.cursor = "";
    };
  }, [active]);

  if (!supported) return null;

  return (
    <button
      id="voice-toggle-btn"
      onClick={() => {
        const next = !activeRef.current;
        setActive(next);
        if (next) speak("تم تفعيل القراءة الصوتية. اضغط على أي نص لأقرأه لك. اضغط زر الإيقاف الأحمر للإنهاء.");
      }}
      title={active ? "إيقاف القراءة الصوتية" : "تفعيل القراءة الصوتية"}
      aria-label={active ? "إيقاف القراءة الصوتية" : "تفعيل القراءة الصوتية"}
      style={{
        position: "fixed",
        bottom: "22px",
        insetInlineStart: "18px",
        zIndex: 998,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.25)",
        cursor: "pointer",
        fontSize: "21px",
        lineHeight: 1,
        color: "white",
        background: active ? "#dc2626" : "rgba(8,20,48,0.85)",
        boxShadow: active ? "0 0 0 6px rgba(220,38,38,0.25), 0 6px 18px rgba(0,0,0,0.4)" : "0 6px 18px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {active ? "⏹" : "🔊"}
    </button>
  );
}
