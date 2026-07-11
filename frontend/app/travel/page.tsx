"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import WidgetEmbed from "@/app/components/WidgetEmbed";
import TravelLinks from "@/app/components/TravelLinks";

/*
  «رحلتك» /travel — تجربة سكاي سكانر داخل ArabDiving:
  بحث طيران، أرخص شهر/يوم، وعروض فنادق مقسمة — عبر ويدجت Travelpayouts
  الرسمية (بعمولة marker المالك تلقائيًا). الحجز والدفع يتمان عند المزود —
  المنصة لا تتدخل في أي تفاصيل حجز.
  الويدجت تُدار من لوحة التحكم ← هوية الموقع ← ويدجت صفحة رحلتك (لصق كود التضمين فقط).
*/

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };

export default function TravelPage() {
  const [widgets, setWidgets] = useState<Array<{ title: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setWidgets((d.settings?.travelWidgets || []).filter((w: any) => w?.code)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "56px 20px 40px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ ...glass, display: "inline-block", color: "#22d3ee", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "14px" }}>✈️ رحلتك</span>
          <h1 style={{ fontSize: "clamp(28px,6vw,44px)", fontWeight: 900, marginBottom: "10px", letterSpacing: "-1px" }}>طيران وفنادق رحلة غوصك — في مكان واحد</h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(14px,3vw,17px)", maxWidth: "640px", margin: "0 auto", lineHeight: 1.9 }}>
            قارن الأسعار، اكتشف أرخص شهر للسفر، واحجز مباشرة لدى المزوّد العالمي —
            نحن نرشّح ونسهّل فقط، ولا نتدخل في حجزك أو بياناتك.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 18px 70px" }}>
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px" }}>جارٍ التحميل...</p>
        ) : widgets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
            {widgets.map((w, i) => (
              <div key={i} style={{ ...glass, borderRadius: "18px", padding: "20px", overflow: "hidden" }}>
                {w.title && <h2 style={{ color: "var(--text,#fff)", fontSize: "19px", fontWeight: 800, marginBottom: "14px" }}>{w.title}</h2>}
                <WidgetEmbed code={w.code} />
              </div>
            ))}
          </div>
        ) : (
          /* لم تُضف ويدجت بعد → روابط البحث العميقة كبديل */
          <TravelLinks />
        )}

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11.5px", marginTop: "24px", lineHeight: 1.8, textAlign: "center" }}>
          الأسعار والحجز عبر شركاء عالميين (Aviasales / Hotellook عبر Travelpayouts). قد نحصل على عمولة لا تؤثر على سعرك —
          وهي التي تُبقي نصيحتنا مجانية. 💡 نصيحة الغواص: لا تحجز طيران العودة قبل مرور 24 ساعة على آخر غطسة.
        </p>
      </section>
    </main>
  );
}
