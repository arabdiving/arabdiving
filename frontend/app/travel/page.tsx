"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import WidgetEmbed from "@/app/components/WidgetEmbed";
import TravelResults, { DEST } from "@/app/components/TravelResults";

/*
  «رحلتك» /travel — محرك البحث الكامل داخل الموقع:
  الزائر يختار الوجهة والتاريخ وعدد الأشخاص → تظهر رحلات الطيران والفنادق
  المتاحة لنفس المدة ونفس المدينة فورًا داخل الصفحة (TravelResults)،
  مع «أرخص أيام الشهر». الحجز يتم لدى المزود العالمي — بعمولة المنصة.
  + قسم اختياري لويدجت Travelpayouts الإضافية (تُدار من لوحة التحكم).
*/

const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };
const field: React.CSSProperties = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "11px", padding: "12px", fontFamily: "inherit", fontSize: "14.5px", width: "100%", boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 700, marginBottom: "5px" };

export default function TravelPage() {
  const [city, setCity] = useState("شرم الشيخ");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const [searched, setSearched] = useState<{ city: string; date: string; people: number } | null>(null);
  const [widgets, setWidgets] = useState<Array<{ title: string; code: string }>>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setWidgets((d.settings?.travelWidgets || []).filter((w: any) => w?.code)))
      .catch(() => {});
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSearched({ city, date, people });
  };

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh" }}>
      {/* Hero + محرك البحث */}
      <section style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, #0a2a4a 0%, #040d1a 62%)", color: "#fff", padding: "52px 20px 46px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(100,180,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,180,255,1) 1px,transparent 1px)", backgroundSize: "55px 55px", opacity: 0.04, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "860px", margin: "0 auto" }}>
          <span style={{ ...glass, display: "inline-block", color: "#22d3ee", fontSize: "13px", fontWeight: 700, padding: "6px 16px", borderRadius: "30px", marginBottom: "14px" }}>✈️ رحلتك</span>
          <h1 style={{ fontSize: "clamp(26px,6vw,42px)", fontWeight: 900, marginBottom: "8px", letterSpacing: "-1px" }}>اختر تاريخك… ونعرض لك المتاح</h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(14px,3vw,16.5px)", maxWidth: "600px", margin: "0 auto 26px", lineHeight: 1.9 }}>
            طيران وفنادق لنفس المدينة ونفس المدة — داخل الصفحة، وبأرخص أيام الشهر.
          </p>

          {/* محرك البحث */}
          <form onSubmit={search} style={{ ...glass, borderRadius: "18px", padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", alignItems: "end", textAlign: "start" }}>
            <div>
              <label style={lbl}>الوجهة</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} style={field}>
                {Object.keys(DEST).map((c) => <option key={c} value={c} style={{ color: "#0f172a" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>تاريخ الوصول</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={{ ...field, colorScheme: "dark" }} />
            </div>
            <div>
              <label style={lbl}>الأشخاص</label>
              <select value={people} onChange={(e) => setPeople(Number(e.target.value))} style={field}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n} style={{ color: "#0f172a" }}>{n}</option>)}
              </select>
            </div>
            <button type="submit"
              style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", border: "none", borderRadius: "12px", padding: "13px 22px", fontSize: "15px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(201,149,42,0.5)", whiteSpace: "nowrap" }}>
              🔍 اعرض المتاح
            </button>
          </form>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "8px 18px 70px" }}>
        {/* النتائج الحية حسب البحث */}
        {searched && <TravelResults city={searched.city} date={searched.date} people={searched.people} />}

        {!searched && (
          <p style={{ color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "34px 0 10px", fontSize: "14.5px" }}>
            👆 اختر وجهتك وتاريخك واضغط «اعرض المتاح»
          </p>
        )}

        {/* ويدجت إضافية اختيارية من لوحة التحكم */}
        {widgets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "26px", marginTop: "30px" }}>
            {widgets.map((w, i) => (
              <div key={i} style={{ ...glass, borderRadius: "18px", padding: "20px", overflow: "hidden" }}>
                {w.title && <h2 style={{ color: "var(--text,#fff)", fontSize: "19px", fontWeight: 800, marginBottom: "14px" }}>{w.title}</h2>}
                <WidgetEmbed code={w.code} />
              </div>
            ))}
          </div>
        )}

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11.5px", marginTop: "26px", lineHeight: 1.8, textAlign: "center" }}>
          الأسعار من محركات عالمية (Aviasales / Amadeus) والحجز الآمن لدى المزود — قد نحصل على عمولة لا تؤثر على سعرك،
          وهي التي تُبقي نصيحتنا مجانية. 💡 نصيحة الغواص: لا تحجز طيران العودة قبل مرور 24 ساعة على آخر غطسة.
        </p>
      </section>
    </main>
  );
}
