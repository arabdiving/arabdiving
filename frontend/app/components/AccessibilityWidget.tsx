"use client";

import { useEffect, useRef, useState } from "react";

/* ─── persistence ─────────────────────────────────────────── */
function load<T>(key: string, def: T): T {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; } catch { return def; }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ─── Screen-reader guide modal ───────────────────────────── */
function SRGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog" aria-modal="true" aria-label="دليل قارئ الشاشة"
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} aria-hidden="true" />
      <div style={{ position: "relative", background: "white", borderRadius: "20px", padding: "28px", maxWidth: "520px", width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
        <button onClick={onClose} aria-label="إغلاق"
          style={{ position: "absolute", top: "16px", insetInlineEnd: "16px", background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", color: "#64748b" }}>✕</button>

        <h2 style={{ color: "#0B2C59", fontSize: "20px", marginBottom: "6px" }}>🔊 كيف تستخدم قارئ الشاشة مع ArabDiving؟</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "22px", lineHeight: 1.8 }}>
          هذا الموقع مُهيَّأ للعمل مع قرّاء الشاشة بالعربية. اتبع الخطوات التالية حسب جهازك:
        </p>

        {[
          {
            icon: "🤖", title: "أندرويد — TalkBack (مجاني ومدمج)",
            steps: [
              "افتح الإعدادات ← إمكانية الوصول",
              'فعّل "TalkBack"',
              "سيقرأ الجهاز كل ما على الشاشة بالعربية تلقائياً",
              "لإيقافه: اضغط مفتاح التشغيل ثلاث مرات متتالية",
            ],
            note: "TalkBack يدعم العربية الكاملة على جميع أجهزة أندرويد",
            link: null,
          },
          {
            icon: "🍎", title: "آيفون / آيباد — VoiceOver (مدمج)",
            steps: [
              "افتح الإعدادات ← إمكانية الوصول ← VoiceOver",
              "شغّل VoiceOver",
              "يمكن تفعيله بسرعة: اضغط زر التشغيل ثلاث مرات",
              "تحكّم باللمس: مرر لليمين/يسار للتنقل، ضغطة مزدوجة للتفعيل",
            ],
            note: "VoiceOver يدعم العربية بجودة ممتازة",
            link: null,
          },
          {
            icon: "💻", title: "ويندوز — NVDA (مجاني تماماً)",
            steps: [
              'حمّل NVDA من الموقع الرسمي: nvaccess.org',
              "ثبّته واضغط Ctrl+Alt+N لتشغيله",
              "اختر صوتاً عربياً: NVDA ← تفضيلات ← الكلام ← صوت Taha أو Hoda",
              "يعمل مع كروم وفايرفوكس وإيدج",
            ],
            note: "NVDA هو الأكثر شيوعاً عالمياً لمستخدمي الويب من المكفوفين",
            link: "https://www.nvaccess.org/download/",
          },
          {
            icon: "🪟", title: "ويندوز — Narrator (مدمج في ويندوز 10/11)",
            steps: [
              "اضغط Win + Ctrl + Enter لتشغيله",
              "أو ابحث في قائمة ابدأ عن «Narrator»",
              "لدعم العربية: اذهب لإعدادات ← الوقت واللغة ← الكلام وأضف العربية",
            ],
            note: "دعم العربية محدود نسبياً مقارنة بـ NVDA",
            link: null,
          },
        ].map((item) => (
          <div key={item.title} style={{ marginBottom: "20px", background: "#f8fafc", borderRadius: "12px", padding: "16px", borderRight: "4px solid #0B2C59" }}>
            <div style={{ fontWeight: 800, color: "#0B2C59", marginBottom: "10px", fontSize: "15px" }}>{item.icon} {item.title}</div>
            <ol style={{ margin: "0 0 8px 0", paddingRight: "18px", color: "#374151", fontSize: "13.5px", lineHeight: 2 }}>
              {item.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <p style={{ margin: "6px 0 0", color: "#0d9488", fontSize: "12.5px" }}>✓ {item.note}</p>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: "8px", color: "#0d6cb0", fontSize: "13px", fontWeight: 700 }}>
                ← تحميل NVDA مجاناً
              </a>
            )}
          </div>
        ))}

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#92400e", lineHeight: 1.8 }}>
          💡 <strong>نصيحة:</strong> جميع الصفحات في موقعنا تحتوي على نصوص بديلة للصور ومسميات للأزرار والروابط بالعربية — لتجربة أفضل مع قارئ الشاشة.
        </div>

        <button onClick={onClose}
          style={{ width: "100%", marginTop: "18px", background: "#0B2C59", color: "white", border: "none", borderRadius: "12px", padding: "12px", fontFamily: "inherit", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
          فهمت، شكراً ✓
        </button>
      </div>
    </div>
  );
}

/* ─── Main widget ─────────────────────────────────────────── */
export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [fontSize, setFontSize] = useState(() => load("a11y-font", 0));        // -1 | 0 | 1 | 2
  const [highContrast, setHighContrast] = useState(() => load("a11y-hc", false));
  const [colorBlind, setColorBlind] = useState(() => load("a11y-cb", false));
  const [dyslexia, setDyslexia] = useState(() => load("a11y-dx", false));
  const panelRef = useRef<HTMLDivElement>(null);

  /* Apply preferences to <html> ─────────────────────────── */
  useEffect(() => {
    const html = document.documentElement;
    const sizes = ["0.875rem", "1rem", "1.125rem", "1.25rem", "1.375rem"];
    html.style.fontSize = sizes[fontSize + 1] ?? "1rem";
    save("a11y-font", fontSize);
  }, [fontSize]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("a11y-high-contrast", highContrast);
    save("a11y-hc", highContrast);
  }, [highContrast]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("a11y-color-blind", colorBlind);
    save("a11y-cb", colorBlind);
  }, [colorBlind]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("a11y-dyslexia", dyslexia);
    save("a11y-dx", dyslexia);
  }, [dyslexia]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* ── any preference active? ── */
  const anyActive = fontSize !== 0 || highContrast || colorBlind || dyslexia;

  const toggleBtn = (label: string, active: boolean, onToggle: () => void, activeColor = "#0B2C59") => (
    <button
      onClick={onToggle}
      aria-pressed={active}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "10px 14px", borderRadius: "10px",
        border: active ? `2px solid ${activeColor}` : "2px solid #e2e8f0",
        background: active ? activeColor : "#f8fafc",
        color: active ? "white" : "#374151",
        cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: active ? 700 : 500,
        transition: "all 0.15s",
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: "12px", background: active ? "rgba(255,255,255,0.2)" : "#e2e8f0", color: active ? "white" : "#94a3b8", borderRadius: "6px", padding: "2px 8px", fontWeight: 700 }}>
        {active ? "مفعّل" : "معطّل"}
      </span>
    </button>
  );

  return (
    <>
      {/* ── CSS injected for modes ── */}
      <style>{`
        /* High contrast */
        .a11y-high-contrast { filter: contrast(1.6) brightness(1.1) !important; }

        /* Color-blind friendly — deuteranopia simulation fix (shift hues) */
        .a11y-color-blind {
          filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='d'><feColorMatrix type='matrix' values='0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0'/></filter></svg>#d") !important;
        }

        /* Dyslexia-friendly font (system fallback chain with wide spacing) */
        .a11y-dyslexia, .a11y-dyslexia * {
          font-family: "Arial", "Helvetica", "Tahoma", sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.15em !important;
          line-height: 1.9 !important;
        }

        /* Focus ring for keyboard users */
        :focus-visible { outline: 3px solid #f5c218 !important; outline-offset: 3px !important; }
      `}</style>

      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="إمكانية الوصول — اضغط لفتح خيارات الوصول"
        aria-expanded={open}
        style={{
          position: "fixed", bottom: "88px", insetInlineStart: "20px", zIndex: 80,
          width: "52px", height: "52px", borderRadius: "50%", border: "none",
          background: anyActive ? "#c9952a" : "#0B2C59",
          color: "white", fontSize: "22px", cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s",
        }}
      >
        ♿
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          ref={panelRef}
          role="region"
          aria-label="خيارات إمكانية الوصول"
          style={{
            position: "fixed", bottom: "152px", insetInlineStart: "20px", zIndex: 80,
            width: "min(300px, calc(100vw - 40px))",
            background: "white", borderRadius: "18px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ background: "#0B2C59", color: "white", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "15px" }}>♿ إمكانية الوصول</span>
            <button onClick={() => setOpen(false)} aria-label="إغلاق"
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>

          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Font size */}
            <div>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "7px" }}>حجم النص</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { label: "A−", val: -1 }, { label: "A", val: 0 },
                  { label: "A+", val: 1 },  { label: "A++", val: 2 },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    onClick={() => setFontSize(val)}
                    aria-pressed={fontSize === val}
                    aria-label={`حجم النص ${label}`}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                      background: fontSize === val ? "#0B2C59" : "#f1f5f9",
                      color: fontSize === val ? "white" : "#374151",
                      fontWeight: 800, fontFamily: "inherit",
                      fontSize: val === -1 ? "11px" : val === 0 ? "13px" : val === 1 ? "15px" : "17px",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            {toggleBtn("🌗 تباين عالٍ", highContrast, () => setHighContrast((v) => !v))}
            {toggleBtn("🎨 وضع عمى الألوان", colorBlind, () => setColorBlind((v) => !v), "#0891b2")}
            {toggleBtn("📖 خط القراءة السهل", dyslexia, () => setDyslexia((v) => !v), "#059669")}

            {/* Screen reader guide */}
            <button
              onClick={() => { setShowGuide(true); setOpen(false); }}
              style={{
                width: "100%", padding: "11px", borderRadius: "10px",
                background: "linear-gradient(135deg,#0B2C59,#1a4a8a)",
                color: "white", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontWeight: 700, fontSize: "13.5px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              🔊 دليل قارئ الشاشة للمكفوفين
            </button>

            {/* Reset */}
            {anyActive && (
              <button
                onClick={() => { setFontSize(0); setHighContrast(false); setColorBlind(false); setDyslexia(false); }}
                style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "transparent", color: "#94a3b8", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}
              >
                إعادة الضبط الافتراضي
              </button>
            )}
          </div>
        </div>
      )}

      {showGuide && <SRGuide onClose={() => setShowGuide(false)} />}
    </>
  );
}
