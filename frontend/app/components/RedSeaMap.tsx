"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/app/lib/api";
import { MAP_SVG, DEFAULT_POINTS, MapPoint } from "@/app/lib/mapSvg";

/* خريطة الموقع — نقاط الصفحات على البحر الأحمر.
   النقاط تأتي من إعدادات الأدمن (Settings.mapPoints) أو الافتراضية.
   embedded=true عند الاستخدام كبلوك داخل الرئيسية (يُخفى الشريط العلوي). */

const BUBBLES = [
  { l: "12%", b: "18%", s: 8, d: 0 }, { l: "24%", b: "12%", s: 5, d: 1 }, { l: "40%", b: "9%", s: 10, d: 2 },
  { l: "58%", b: "14%", s: 6, d: 0.7 }, { l: "72%", b: "22%", s: 7, d: 1.5 }, { l: "85%", b: "16%", s: 5, d: 2.4 }, { l: "48%", b: "30%", s: 6, d: 1.1 },
];

export default function RedSeaMap({ embedded = false }: { embedded?: boolean }) {
  const [points, setPoints] = useState<MapPoint[]>(DEFAULT_POINTS);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const f = () => setMobile(window.innerWidth < 860);
    f();
    window.addEventListener("resize", f);
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const mp = d.settings?.mapPoints;
        if (Array.isArray(mp) && mp.length > 0) setPoints(mp);
      })
      .catch(() => {});
    return () => window.removeEventListener("resize", f);
  }, []);

  const keyOf = (p: MapPoint) => `${p.n}-${p.href}`;
  const sideOf = (p: MapPoint): "right" | "left" => (p.x > 180 ? "right" : "left");
  const active = points.find((p) => keyOf(p) === hovered) || null;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "radial-gradient(ellipse at 50% 30%, #0a2240 0%, #040d1a 65%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px", opacity: 0.04, pointerEvents: "none" }} />
      {BUBBLES.map((b, i) => (
        <span key={i} style={{ position: "absolute", left: b.l, bottom: b.b, width: b.s, height: b.s, borderRadius: "50%", background: "rgba(6,182,212,0.35)", animation: `mapBubble ${4 + b.d}s ${b.d}s ease-in infinite`, pointerEvents: "none" }} />
      ))}

      {!embedded && (
        <div style={{ position: "relative", zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 26px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/register" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#fff", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", boxShadow: "0 4px 14px rgba(201,149,42,0.4)" }}>انضم الآن</Link>
            <Link href="/" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, fontSize: "14px" }}>الصفحة الكلاسيكية</Link>
          </div>
          <div style={{ textAlign: "end" }}>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "20px" }}>ArabDiving</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>خريطة الموقع</div>
          </div>
        </div>
      )}

      {embedded && (
        <div style={{ position: "relative", zIndex: 20, textAlign: "center", padding: "34px 20px 4px", pointerEvents: "none" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900 }}>خريطة <span className="hero-grad">الموقع</span></h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginTop: "8px" }}>كل صفحات المنصة حول البحر — مرّر على أي نقطة واضغط للانتقال</p>
        </div>
      )}

      {mobile ? (
        <div style={{ position: "relative", zIndex: 10, padding: "14px 18px 60px", display: "grid", gap: "12px" }}>
          {!embedded && <h1 style={{ color: "#fff", textAlign: "center", fontSize: "25px", fontWeight: 900, margin: "8px 0 10px" }}>خريطة <span className="hero-grad">الموقع</span></h1>}
          {points.map((d) => (
            <Link key={keyOf(d)} href={d.href} style={{ display: "flex", gap: "14px", alignItems: "center", background: "rgba(6,14,36,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "14px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: (d.color || "#06b6d4") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "23px", flexShrink: 0 }}>{d.icon || "📍"}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "15.5px" }}>{d.label}</div>
                {d.subtitle && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>{d.subtitle}</div>}
              </div>
              <span style={{ color: d.color || "#06b6d4", fontSize: "20px" }}>←</span>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <div style={embedded
            ? { position: "relative", margin: "10px auto 40px", width: "360px", maxWidth: "82vw", zIndex: 5 }
            : { position: "absolute", top: "54%", left: "50%", transform: "translate(-50%,-50%)", width: "360px", maxWidth: "82vw", zIndex: 5 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "360 / 680" }}>
              <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 40px rgba(8,145,178,0.3))" }} dangerouslySetInnerHTML={{ __html: MAP_SVG }} />

              {points.map((d) => {
                const side = sideOf(d);
                return (
                  <div key={keyOf(d)}
                    onMouseEnter={() => setHovered(keyOf(d))} onMouseLeave={() => setHovered(null)} onClick={() => router.push(d.href)}
                    style={{ position: "absolute", left: `${(d.x / 360) * 100}%`, top: `${(d.y / 680) * 100}%`, transform: "translate(-50%,-50%)", width: "13px", height: "13px", zIndex: 15, cursor: "pointer" }}>
                    <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: d.color || "#06b6d4", color: d.color || "#06b6d4", animation: "dotGlow 2s infinite" }} />
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${d.color || "#06b6d4"}`, animation: "pulseRing 2s infinite" }} />
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${d.color || "#06b6d4"}`, animation: "pulseRing2 2s 0.4s infinite" }} />
                    <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", whiteSpace: "nowrap", color: hovered === keyOf(d) ? "#fff" : "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: "13.5px", textShadow: "0 2px 8px rgba(0,0,0,0.7)", ...(side === "right" ? { left: "20px" } : { right: "20px" }) }}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {active ? (
            <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [sideOf(active) === "right" ? "right" : "left"]: "4vw", width: "300px", maxWidth: "90vw", zIndex: 30, background: "rgba(6,14,36,0.97)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)", animation: "fadeInCard 0.22s ease", pointerEvents: "none" }}>
              <div style={{ height: "4px", background: active.color || "#06b6d4" }} />
              <div style={{ padding: "22px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "13px", background: (active.color || "#06b6d4") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{active.icon || "📍"}</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>{active.label}</div>
                    {active.subtitle && <div style={{ color: active.color || "#06b6d4", fontSize: "12.5px", fontWeight: 700 }}>{active.subtitle}</div>}
                  </div>
                </div>
                {active.desc && <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: 1.8, marginBottom: "14px" }}>{active.desc}</p>}
                {active.features && active.features.length > 0 && (
                  <div style={{ display: "grid", gap: "7px", marginBottom: "16px" }}>
                    {active.features.map((f, i) => (<div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", color: "rgba(255,255,255,0.8)", fontSize: "13px" }}><span style={{ color: active.color || "#06b6d4" }}>✦</span>{f}</div>))}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>اضغط للانتقال</span>
                  <span style={{ background: active.color || "#06b6d4", color: "#04121f", fontWeight: 800, fontSize: "13.5px", padding: "8px 16px", borderRadius: "10px" }}>{active.cta || "انتقل"} ←</span>
                </div>
              </div>
            </div>
          ) : (!embedded && (
            <div style={{ position: "absolute", bottom: "4%", left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 10, width: "90%" }}>
              <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: "8px" }}>خريطة <span className="hero-grad">الموقع</span></h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>مرّر على أي نقطة حول البحر لاستكشاف المنصة</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
