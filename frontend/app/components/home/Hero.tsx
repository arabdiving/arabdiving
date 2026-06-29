"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

export default function Hero() {
  const c = useContent("home").hero || {};

  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(175deg,#06101f 0%,#0d2c54 28%,#0e4a7a 58%,#0891b2 82%,#06b6d4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "100px 24px 90px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Light cone */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "900px", height: "100%", background: "radial-gradient(ellipse at 50% 0%,rgba(8,145,178,0.18) 0%,transparent 65%)", pointerEvents: "none" }} />

      {/* Decorative rings */}
      <div style={{ position: "absolute", top: "12%", right: "7%", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "18%", left: "6%", width: "260px", height: "260px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

      {/* Animated bubbles */}
      <span style={{ position: "absolute", left: "11%", bottom: "24%", width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,0.32)", animation: "bubbleFloat 4.2s 0s ease-in-out infinite" }} />
      <span style={{ position: "absolute", left: "23%", bottom: "16%", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.22)", animation: "bubbleFloat 5.1s 1.1s ease-in-out infinite" }} />
      <span style={{ position: "absolute", left: "39%", bottom: "11%", width: "11px", height: "11px", borderRadius: "50%", background: "rgba(255,255,255,0.16)", animation: "bubbleFloat 6.3s 2.2s ease-in-out infinite" }} />
      <span style={{ position: "absolute", left: "56%", bottom: "8%", width: "7px", height: "7px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", animation: "bubbleFloat 4.8s 0.7s ease-in-out infinite" }} />
      <span style={{ position: "absolute", right: "17%", bottom: "26%", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.28)", animation: "bubbleFloat 4.5s 1.5s ease-in-out infinite" }} />
      <span style={{ position: "absolute", right: "33%", bottom: "14%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.18)", animation: "bubbleFloat 5.6s 2.8s ease-in-out infinite" }} />
      <span style={{ position: "absolute", right: "47%", bottom: "9%", width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.14)", animation: "bubbleFloat 5.0s 0.4s ease-in-out infinite" }} />
      <span style={{ position: "absolute", left: "68%", bottom: "21%", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.24)", animation: "bubbleFloat 4.6s 3.2s ease-in-out infinite" }} />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "920px", width: "100%" }}>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", padding: "8px 22px", borderRadius: "40px", marginBottom: "30px", animation: "fadeInUp 0.8s 0.1s ease both" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: 500 }}>
            {c.badge || "البحر الأحمر — وجهة الغوص العربية الأولى"}
          </span>
        </div>

        {/* H1 */}
        <h1 style={{ fontSize: "clamp(40px,6.5vw,80px)", fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: "22px", letterSpacing: "-1.5px", animation: "fadeInUp 0.8s 0.25s ease both" }}>
          {c.title ? (
            String(c.title).split("\n").map((line: string, i: number, arr: string[]) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))
          ) : (
            <>
              اكتشف عالم الغوص<br />
              <span style={{ background: "linear-gradient(90deg,#c9952a 0%,#f5c218 50%,#e8a830 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                في البحر الأحمر
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: "clamp(16px,2.2vw,20px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, marginBottom: "42px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", animation: "fadeInUp 0.8s 0.4s ease both" }}>
          {c.subtitle || "أكبر مجتمع عربي للغوص — رحلات للعائلات والسيدات والشباب\nمع مراكز معتمدة وطاقم نسائي ومعدات معقّمة"}
        </p>

        {/* Airbnb-style search bar — كل الحقول تفتح صفحة الحجز */}
        <Link href="/family-booking" style={{ textDecoration: "none", display: "block", maxWidth: "780px", margin: "0 auto 32px", animation: "fadeInUp 0.8s 0.55s ease both" }}>
          <div style={{ background: "white", borderRadius: "18px", padding: "6px", display: "flex", alignItems: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.32)", cursor: "pointer" }}>
            <div style={{ flex: 1, padding: "12px 20px", textAlign: "start", borderRadius: "12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted)", marginBottom: "3px", letterSpacing: "0.6px" }}>الوجهة</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>شرم الشيخ، دهب...</div>
            </div>
            <div style={{ width: "1px", height: "38px", background: "var(--border)", flexShrink: 0 }} />
            <div style={{ flex: 1, padding: "12px 20px", textAlign: "start", borderRadius: "12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted)", marginBottom: "3px", letterSpacing: "0.6px" }}>التاريخ</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--faint)" }}>اختر التاريخ</div>
            </div>
            <div style={{ width: "1px", height: "38px", background: "var(--border)", flexShrink: 0 }} />
            <div style={{ flex: 1, padding: "12px 20px", textAlign: "start", borderRadius: "12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted)", marginBottom: "3px", letterSpacing: "0.6px" }}>الأشخاص</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--faint)" }}>أضف أشخاصاً</div>
            </div>
            <div style={{ background: "linear-gradient(135deg,var(--gold),var(--gold-light))", color: "white", padding: "15px 26px", borderRadius: "13px", fontSize: "16px", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(201,149,42,0.4)", margin: "2px", flexShrink: 0 }}>
              🔍 ابحث
            </div>
          </div>
        </Link>

        {/* Quick action buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", animation: "fadeInUp 0.8s 0.7s ease both" }}>
          <Link href="/family-booking" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white", padding: "11px 22px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", transition: "all .2s" }}>
            👨‍👩‍👧‍👦 احجز رحلة عائلية
          </Link>
          <Link href="/women" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white", padding: "11px 22px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", transition: "all .2s" }}>
            🧕 للسيدات
          </Link>
          <Link href="/community" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white", padding: "11px 22px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", transition: "all .2s" }}>
            🤿 انضم للمجتمع
          </Link>
        </div>
      </div>

      {/* Wave transition at bottom */}
      <div style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "80px", overflow: "hidden" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <path d="M0,50 C200,15 400,75 600,42 C800,12 1000,72 1200,44 C1320,26 1400,58 1440,38 L1440,80 L0,80 Z" fill="var(--background)" />
        </svg>
      </div>
    </section>
  );
}
