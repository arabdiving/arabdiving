"use client";

import { useEffect, useState } from "react";

export default function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed (running as standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Already dismissed this session
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Also handle successful install
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShow(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setShow(false);
  };

  const dismiss = () => {
    sessionStorage.setItem("pwa-dismissed", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: "90px", insetInlineStart: "16px",
      zIndex: 90, maxWidth: "320px",
      background: "linear-gradient(135deg,#0B2C59,#1a4a8a)",
      color: "white", borderRadius: "16px",
      padding: "16px 18px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      display: "flex", flexDirection: "column", gap: "10px",
      animation: "slideUp 0.35s ease",
    }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="ArabDiving" style={{ width: "44px", height: "44px", borderRadius: "10px" }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: "14px" }}>ثبّت تطبيق ArabDiving</div>
          <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>يعمل بدون إنترنت • أسرع • مثل التطبيق تماماً</div>
        </div>
        <button onClick={dismiss} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "18px", lineHeight: 1, marginInlineStart: "auto", padding: "0 4px" }}>✕</button>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={install}
          style={{
            flex: 1, background: "#c9952a", color: "white",
            border: "none", borderRadius: "10px", padding: "10px",
            fontFamily: "inherit", fontWeight: 700, fontSize: "13px", cursor: "pointer",
          }}
        >
          📲 تثبيت الآن
        </button>
        <button
          onClick={dismiss}
          style={{
            background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
            border: "none", borderRadius: "10px", padding: "10px 14px",
            fontFamily: "inherit", fontSize: "13px", cursor: "pointer",
          }}
        >
          لاحقاً
        </button>
      </div>
    </div>
  );
}
