"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/*
  VoiceAccessibilityIntro
  ───────────────────────
  • Shows an Arabic banner on first page load each session
  • Triple-click anywhere within 3 s → activates Arabic voice reading (Web Speech API)
  • While active: clicking any element reads its text aloud
  • Red pulsing "Stop" button + speaker cursor while active
*/

export default function VoiceAccessibilityIntro() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerFading, setBannerFading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  // Refs so click handler always sees current values without re-registering
  const voiceActiveRef = useRef(false);
  const clickTimesRef = useRef<number[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  /* ── Init ─────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;

    // Show banner only once per browser session
    if (!sessionStorage.getItem("voice-intro-seen")) {
      sessionStorage.setItem("voice-intro-seen", "1");
      setShowBanner(true);
    }
  }, []);

  /* ── Auto-dismiss banner after 5 s ───────────────────── */
  useEffect(() => {
    if (!showBanner) return;
    const fadeTimer = setTimeout(() => setBannerFading(true), 4400);
    const hideTimer = setTimeout(() => setShowBanner(false), 5200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [showBanner]);

  /* ── Keep ref in sync with state ─────────────────────── */
  useEffect(() => { voiceActiveRef.current = voiceActive; }, [voiceActive]);

  /* ── Speak helper ─────────────────────────────────────── */
  const speak = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth || !text.trim()) return;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text.trim().slice(0, 400));
    utt.lang = "ar-SA";
    utt.rate = 0.88;
    utt.pitch = 1;
    synth.speak(utt);
  }, []);

  /* ── Global click handler ─────────────────────────────── */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const now = Date.now();

      // Build rolling 3-second window of clicks
      clickTimesRef.current.push(now);
      clickTimesRef.current = clickTimesRef.current.filter(t => now - t <= 3000);

      // ── Triple-click activates voice reading ──
      if (clickTimesRef.current.length >= 3 && !voiceActiveRef.current) {
        clickTimesRef.current = [];
        setVoiceActive(true);
        setShowBanner(false);
        // slight delay so cancel() doesn't kill the announcement
        setTimeout(() => speak("تم تفعيل القراءة الصوتية. انقر على أي عنصر لسماعه."), 150);
        return;
      }

      // ── Voice active: read clicked element ──
      if (voiceActiveRef.current) {
        const target = e.target as HTMLElement;
        // Walk up to a meaningful text-bearing element
        const el: HTMLElement =
          target.closest<HTMLElement>(
            "button,a,p,h1,h2,h3,h4,h5,h6,li,label,td,th,span,div[role],input,textarea,select"
          ) || target;

        const text =
          el.getAttribute("aria-label") ||
          el.getAttribute("title") ||
          el.getAttribute("alt") ||
          (el as HTMLInputElement).placeholder ||
          el.innerText ||
          "";
        if (text.trim()) speak(text.trim());
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [speak]);

  /* ── Stop voice ───────────────────────────────────────── */
  const stopVoice = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    synthRef.current?.cancel();
    setVoiceActive(false);
    clickTimesRef.current = [];
  }, []);

  if (!showBanner && !voiceActive) return null;

  return (
    <>
      {/* ══ Intro banner ══ */}
      {showBanner && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
            background: "linear-gradient(135deg,#071a3e 0%,#0B2C59 55%,#1a5276 100%)",
            color: "white",
            padding: "14px 20px 14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px",
            boxShadow: "0 4px 28px rgba(0,0,0,0.45)",
            opacity: bannerFading ? 0 : 1,
            transition: "opacity 0.85s ease",
            fontFamily: "inherit",
          }}
        >
          {/* Icon + message */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "32px", flexShrink: 0, lineHeight: 1 }}>🔊</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "15px", marginBottom: "3px" }}>
                هل تجد صعوبة في القراءة؟
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.88)", lineHeight: 1.75 }}>
                انقر على الشاشة{" "}
                <strong style={{ color: "#f5c218" }}>٣ مرات بسرعة</strong>{" "}
                لتفعيل القراءة الصوتية بالعربية — وإلا ستُحمَّل الصفحة بشكل طبيعي
              </div>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={(e) => { e.stopPropagation(); setBannerFading(true); setTimeout(() => setShowBanner(false), 850); }}
            aria-label="تخطى وأغلق الرسالة"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.28)",
              color: "white", borderRadius: "9px",
              padding: "7px 18px", cursor: "pointer",
              fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
              flexShrink: 0, whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          >
            تخطى ✕
          </button>
        </div>
      )}

      {/* ══ Voice-active UI ══ */}
      {voiceActive && (
        <>
          <style>{`
            @keyframes voicePulse {
              0%,100% { box-shadow: 0 6px 20px rgba(220,38,38,0.55); }
              50%      { box-shadow: 0 6px 36px rgba(220,38,38,0.85), 0 0 0 8px rgba(220,38,38,0.12); }
            }
            /* Speaker cursor everywhere while voice mode is on */
            body, body * {
              cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><text y='26' font-size='26'>🔊</text></svg>") 15 15, auto !important;
            }
          `}</style>

          {/* Tooltip hint */}
          <div
            aria-live="polite"
            style={{
              position: "fixed",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9500,
              background: "rgba(7,26,62,0.92)",
              color: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
              padding: "9px 18px",
              fontSize: "13px",
              fontFamily: "inherit",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            🔊 وضع القراءة الصوتية مفعّل — انقر على أي نص لسماعه
          </div>

          {/* Stop button — centered bottom */}
          <button
            onClick={stopVoice}
            aria-label="إيقاف القراءة الصوتية"
            style={{
              position: "fixed",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9600,
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "32px",
              padding: "13px 28px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 800,
              fontSize: "15px",
              animation: "voicePulse 2s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              letterSpacing: "0.01em",
            }}
          >
            🔇 إيقاف القراءة الصوتية
          </button>
        </>
      )}
    </>
  );
}
