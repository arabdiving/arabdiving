"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import TravelLinks from "@/app/components/TravelLinks";

/*
  TravelResults — نتائج طيران وفنادق حية داخل الموقع (Amadeus).
  عندما يبحث المستخدم بتاريخ: تُجلب العروض المتاحة فعليًا بأسعارها وتُعرض هنا.
  إن لم تكن مفاتيح Amadeus مضبوطة في الباك إند، يتحول تلقائيًا للروابط العميقة (TravelLinks).
*/

const DEST: Record<string, { hotel: string; airport: string }> = {
  "شرم الشيخ": { hotel: "Sharm El Sheikh", airport: "SSH" },
  "دهب":       { hotel: "Dahab",           airport: "SSH" },
  "الغردقة":   { hotel: "Hurghada",        airport: "HRG" },
  "مرسى علم":  { hotel: "Marsa Alam",      airport: "RMF" },
  "الجونة":    { hotel: "El Gouna",        airport: "HRG" },
  "سفاجا":     { hotel: "Safaga",          airport: "HRG" },
  "نويبع":     { hotel: "Nuweiba",         airport: "SSH" },
};
const ORIGINS = [
  { code: "RUH", label: "الرياض" }, { code: "JED", label: "جدة" },
  { code: "DMM", label: "الدمام" }, { code: "KWI", label: "الكويت" },
  { code: "DOH", label: "الدوحة" }, { code: "DXB", label: "دبي" },
  { code: "MCT", label: "مسقط" },
];

const addDays = (iso: string, days: number) => {
  const d = new Date(iso); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const fmtTime = (iso: string) => (iso ? iso.slice(11, 16) : "--:--");

interface Flight { id: string; price: string; currency: string; carrier: string; departure: string; arrival: string; duration: string; stops: number }
interface Hotel { id: string; name: string; rating: string | null; price: string; currency: string; room: string }

export default function TravelResults({ city, date, people = 2 }: { city?: string; date?: string; people?: number }) {
  const [origin, setOrigin] = useState("RUH");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [enabled, setEnabled] = useState<boolean | null>(null); // null = جارٍ الفحص
  const [loading, setLoading] = useState(false);
  const [env, setEnv] = useState("");

  const dest = DEST[city || ""] || DEST["شرم الشيخ"];
  const destLabel = city && DEST[city] ? city : "شرم الشيخ";
  const checkout = date ? addDays(date, 4) : "";

  useEffect(() => {
    try { const o = localStorage.getItem("ad_origin"); if (o) setOrigin(o); } catch {}
  }, []);

  useEffect(() => {
    // بدون تاريخ لا توجد «إتاحة» — نكتفي بالروابط العميقة
    if (!date) { setEnabled(false); return; }
    let alive = true;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/api/travel/flights?origin=${origin}&dest=${dest.airport}&date=${date}&adults=${people || 2}`).then((r) => r.json()).catch(() => ({ enabled: false, offers: [] })),
      fetch(`${API_BASE}/api/travel/hotels?city=${dest.airport}&checkin=${date}&checkout=${checkout}&adults=${people || 2}`).then((r) => r.json()).catch(() => ({ enabled: false, hotels: [] })),
    ]).then(([f, h]) => {
      if (!alive) return;
      const on = Boolean(f.enabled || h.enabled);
      setEnabled(on);
      setFlights(f.offers || []);
      setHotels(h.hotels || []);
      setEnv(f.env || h.env || "");
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, date, people, origin]);

  const pickOrigin = (code: string) => {
    setOrigin(code);
    try { localStorage.setItem("ad_origin", code); } catch {}
  };

  // روابط إتمام الحجز (معبأة) — العرض عندنا والدفع عند المزود
  const bookFlight = `https://www.skyscanner.com.sa/transport/flights/${origin.toLowerCase()}/${dest.airport.toLowerCase()}/${date ? date.slice(2).replace(/-/g, "") + "/" : ""}`;
  const bookHotel = (name?: string) => {
    const p = new URLSearchParams({ ss: name ? `${name}, ${dest.hotel}` : dest.hotel, group_adults: String(people || 2), lang: "ar" });
    if (date) { p.set("checkin", date); p.set("checkout", checkout); }
    return `https://www.booking.com/searchresults.ar.html?${p.toString()}`;
  };

  const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };
  const lightGlass: React.CSSProperties = { background: "var(--glass-light-bg,rgba(255,255,255,0.07))", border: "1px solid var(--glass-light-border,rgba(255,255,255,0.1))" };

  // الفحص جارٍ أو التكامل غير مفعّل → الروابط العميقة
  if (enabled === false) return <TravelLinks city={city} date={date} people={people} />;

  return (
    <section style={{ maxWidth: "1100px", margin: "30px auto 0" }}>
      <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
          <h2 style={{ color: "var(--text,#fff)", fontSize: "19px", fontWeight: 800, margin: 0 }}>
            ✈️ المتاح فعليًا ليوم {date} — {destLabel}
          </h2>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "13px" }}>
            أطير من:
            <select value={origin} onChange={(e) => pickOrigin(e.target.value)}
              style={{ ...lightGlass, color: "var(--text,#fff)", borderRadius: "9px", padding: "7px 10px", fontFamily: "inherit", fontSize: "13px" }}>
              {ORIGINS.map((o) => <option key={o.code} value={o.code} style={{ color: "#0f172a" }}>{o.label}</option>)}
            </select>
          </label>
        </div>
        {env === "test" && (
          <p style={{ color: "#fbbf24", fontSize: "11.5px", marginBottom: "10px" }}>⚠️ بيئة Amadeus التجريبية — أسعار للعرض فقط حتى الترقية لـ production.</p>
        )}

        {loading && <p style={{ color: "var(--muted,rgba(255,255,255,0.55))", padding: "20px 0" }}>🔄 نبحث لك في الرحلات والفنادق المتاحة...</p>}

        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px", marginTop: "12px" }}>

            {/* الطيران */}
            <div>
              <h3 style={{ color: "var(--text,#fff)", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>✈️ رحلات الطيران المتاحة</h3>
              {flights.length === 0 ? (
                <p style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "13.5px" }}>لا رحلات مباشرة متاحة بهذا التاريخ — <a href={bookFlight} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "#22d3ee" }}>ابحث بتواريخ مرنة ↗</a></p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {flights.slice(0, 5).map((f) => (
                    <a key={f.id} href={bookFlight} target="_blank" rel="noopener noreferrer nofollow"
                      style={{ ...lightGlass, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ color: "var(--text,#fff)", fontWeight: 700, fontSize: "13.5px" }}>{f.carrier}</div>
                        <div style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "12px" }}>
                          {fmtTime(f.departure)} ← {fmtTime(f.arrival)} · {f.stops === 0 ? "مباشر" : `${f.stops} توقف`} · {f.duration}
                        </div>
                      </div>
                      <div style={{ color: "#e8a830", fontWeight: 900, fontSize: "15px", whiteSpace: "nowrap" }}>{Math.round(Number(f.price))} {f.currency === "SAR" ? "ر.س" : f.currency}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* الفنادق */}
            <div>
              <h3 style={{ color: "var(--text,#fff)", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>🏨 فنادق متاحة ({date} → {checkout})</h3>
              {hotels.length === 0 ? (
                <p style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "13.5px" }}>لا نتائج متاحة الآن — <a href={bookHotel()} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "#22d3ee" }}>ابحث في Booking مباشرة ↗</a></p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {hotels.slice(0, 5).map((h) => (
                    <a key={h.id} href={bookHotel(h.name)} target="_blank" rel="noopener noreferrer nofollow"
                      style={{ ...lightGlass, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ color: "var(--text,#fff)", fontWeight: 700, fontSize: "13.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {h.name} {h.rating ? `· ${"⭐".repeat(Math.min(5, Number(h.rating)))}` : ""}
                        </div>
                        <div style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "12px" }}>{h.room || "غرفة قياسية"} · إجمالي الإقامة</div>
                      </div>
                      <div style={{ color: "#34d399", fontWeight: 900, fontSize: "15px", whiteSpace: "nowrap" }}>{Math.round(Number(h.price))} {h.currency === "SAR" ? "ر.س" : h.currency}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <p style={{ color: "var(--faint,rgba(255,255,255,0.35))", fontSize: "11.5px", marginTop: "14px", marginBottom: 0, lineHeight: 1.7 }}>
          الأسعار من Amadeus (محرك بيانات وكالات السفر العالمي) وتتحدث كل 15 دقيقة. الضغط على أي نتيجة يفتح إتمام الحجز لدى المزود —
          💡 ولا تحجز طيران العودة قبل مرور 24 ساعة على آخر غطسة.
        </p>
      </div>
    </section>
  );
}
