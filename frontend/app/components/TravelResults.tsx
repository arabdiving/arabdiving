"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import TravelLinks from "@/app/components/TravelLinks";

/*
  TravelResults — نتائج طيران وفنادق حية داخل الموقع حسب بحث الزائر (مدينة + تاريخ + أشخاص).
  الطيران: Travelpayouts Aviasales (رابط الحجز يحمل عمولة المنصة).
  الفنادق: Amadeus (المتاح فعليًا) — وزر الحجز يفتح Booking بروابط يحوّلها Drive لعمولة.
  + شريط «أرخص أيام الشهر» مثل سكاي سكانر.
  إن غاب المزودان كليًا → روابط بحث معبأة (TravelLinks).
*/

export const DEST: Record<string, { hotel: string; airport: string }> = {
  "شرم الشيخ": { hotel: "Sharm El Sheikh", airport: "SSH" },
  "دهب":       { hotel: "Dahab",           airport: "SSH" },
  "الغردقة":   { hotel: "Hurghada",        airport: "HRG" },
  "مرسى علم":  { hotel: "Marsa Alam",      airport: "RMF" },
  "الجونة":    { hotel: "El Gouna",        airport: "HRG" },
  "سفاجا":     { hotel: "Safaga",          airport: "HRG" },
  "نويبع":     { hotel: "Nuweiba",         airport: "SSH" },
};
export const ORIGINS = [
  { code: "RUH", label: "الرياض" }, { code: "JED", label: "جدة" },
  { code: "DMM", label: "الدمام" }, { code: "KWI", label: "الكويت" },
  { code: "DOH", label: "الدوحة" }, { code: "DXB", label: "دبي" },
  { code: "MCT", label: "مسقط" }, { code: "CAI", label: "القاهرة" },
];

const addDays = (iso: string, days: number) => {
  const d = new Date(iso); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const fmtTime = (iso: string) => (iso && iso.length >= 16 ? iso.slice(11, 16) : "");
const fmtDay = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : "");

interface Flight { id: string; price: string; currency: string; carrier: string; departure: string; arrival: string; duration: string; stops: number | null; bookUrl?: string | null }
interface Hotel { id: string; name: string; rating: string | null; price: string; currency: string; room: string }
interface CalDay { date: string; price: number; airline: string; bookUrl: string }

export default function TravelResults({ city, date, people = 2 }: { city?: string; date?: string; people?: number }) {
  const [origin, setOrigin] = useState("RUH");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [calDays, setCalDays] = useState<CalDay[]>([]);
  const [flightsOn, setFlightsOn] = useState(false);
  const [hotelsOn, setHotelsOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const dest = DEST[city || ""] || DEST["شرم الشيخ"];
  const destLabel = city && DEST[city] ? city : "شرم الشيخ";
  const checkout = date ? addDays(date, 4) : "";

  useEffect(() => {
    try { const o = localStorage.getItem("ad_origin"); if (o) setOrigin(o); } catch {}
  }, []);

  useEffect(() => {
    if (!date) { setChecked(true); setFlightsOn(false); setHotelsOn(false); return; }
    let alive = true;
    setLoading(true);
    const month = date.slice(0, 7);
    Promise.all([
      fetch(`${API_BASE}/api/travel/flights?origin=${origin}&dest=${dest.airport}&date=${date}&adults=${people || 2}`).then((r) => r.json()).catch(() => ({ enabled: false, offers: [] })),
      fetch(`${API_BASE}/api/travel/hotels?city=${encodeURIComponent(dest.hotel)}&checkin=${date}&checkout=${checkout}&adults=${people || 2}`).then((r) => r.json()).catch(() => ({ enabled: false, hotels: [] })),
      fetch(`${API_BASE}/api/travel/calendar?origin=${origin}&dest=${dest.airport}&month=${month}`).then((r) => r.json()).catch(() => ({ enabled: false, days: [] })),
    ]).then(([f, h, c]) => {
      if (!alive) return;
      setFlightsOn(Boolean(f.enabled)); setHotelsOn(Boolean(h.enabled));
      setFlights(f.offers || []); setHotels(h.hotels || []); setCalDays(c.days || []);
      setChecked(true);
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, date, people, origin]);

  const pickOrigin = (code: string) => {
    setOrigin(code);
    try { localStorage.setItem("ad_origin", code); } catch {}
  };

  /* روابط الحجز الاحتياطية المعبأة (Drive يحوّلها لعمولة) */
  const skyDate = date ? date.slice(2).replace(/-/g, "") : "";
  const flightFallback = `https://www.aviasales.com/search/${origin}${date ? date.slice(8, 10) + date.slice(5, 7) : ""}${dest.airport}${people || 1}`;
  const skyscanner = `https://www.skyscanner.com.sa/transport/flights/${origin.toLowerCase()}/${dest.airport.toLowerCase()}/${skyDate ? skyDate + "/" : ""}`;
  const bookingUrl = (name?: string) => {
    const p = new URLSearchParams({ ss: name ? `${name}, ${dest.hotel}` : dest.hotel, group_adults: String(people || 2), lang: "ar" });
    if (date) { p.set("checkin", date); p.set("checkout", checkout); }
    return `https://www.booking.com/searchresults.ar.html?${p.toString()}`;
  };
  const agodaUrl = (() => {
    const p = new URLSearchParams({ textToSearch: dest.hotel, adults: String(people || 2), rooms: "1", los: "4" });
    if (date) p.set("checkIn", date);
    return `https://www.agoda.com/ar-sa/Search?${p.toString()}`;
  })();

  const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };
  const lightGlass: React.CSSProperties = { background: "var(--glass-light-bg,rgba(255,255,255,0.07))", border: "1px solid var(--glass-light-border,rgba(255,255,255,0.1))" };

  // لا تاريخ أو لا مزودين إطلاقًا → الروابط المعبأة
  if (checked && !date) return <TravelLinks city={city} people={people} />;
  if (checked && !flightsOn && !hotelsOn) return <TravelLinks city={city} date={date} people={people} />;

  return (
    <section style={{ maxWidth: "1100px", margin: "30px auto 0" }}>
      <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
          <h2 style={{ color: "var(--text,#fff)", fontSize: "19px", fontWeight: 800, margin: 0 }}>
            ✈️ المتاح ليوم {date} — {destLabel}
          </h2>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "13px" }}>
            أطير من:
            <select value={origin} onChange={(e) => pickOrigin(e.target.value)}
              style={{ ...lightGlass, color: "var(--text,#fff)", borderRadius: "9px", padding: "7px 10px", fontFamily: "inherit", fontSize: "13px" }}>
              {ORIGINS.map((o) => <option key={o.code} value={o.code} style={{ color: "#0f172a" }}>{o.label}</option>)}
            </select>
          </label>
        </div>

        {/* أرخص أيام الشهر — مثل سكاي سكانر */}
        {calDays.length > 0 && (
          <div style={{ margin: "12px 0 4px" }}>
            <div style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "12.5px", marginBottom: "8px" }}>📅 أرخص أيام الشهر لنفس الوجهة:</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {calDays.map((d) => (
                <a key={d.date} href={d.bookUrl} target="_blank" rel="noopener noreferrer nofollow"
                  style={{ ...lightGlass, borderRadius: "20px", padding: "6px 14px", fontSize: "12.5px", textDecoration: "none", color: "var(--text,#fff)" }}>
                  {fmtDay(d.date)} — <b style={{ color: "#34d399" }}>{Math.round(d.price)} ر.س</b>
                </a>
              ))}
            </div>
          </div>
        )}

        {loading && <p style={{ color: "var(--muted,rgba(255,255,255,0.55))", padding: "18px 0 4px" }}>🔄 نبحث لك في الرحلات والفنادق المتاحة...</p>}

        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px", marginTop: "14px" }}>

            {/* الطيران */}
            <div>
              <h3 style={{ color: "var(--text,#fff)", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>✈️ رحلات الطيران</h3>
              {!flightsOn || flights.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a href={flightFallback} target="_blank" rel="noopener noreferrer nofollow" style={{ ...lightGlass, borderRadius: "12px", padding: "13px 14px", textDecoration: "none", color: "var(--text,#fff)", fontSize: "13.5px", fontWeight: 700 }}>
                    🔎 ابحث في Aviasales بتاريخك ↗
                  </a>
                  <a href={skyscanner} target="_blank" rel="noopener noreferrer nofollow" style={{ ...lightGlass, borderRadius: "12px", padding: "13px 14px", textDecoration: "none", color: "var(--text,#fff)", fontSize: "13.5px", fontWeight: 700 }}>
                    🔎 قارن في Skyscanner ↗
                  </a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {flights.slice(0, 5).map((f) => (
                    <a key={f.id} href={f.bookUrl || flightFallback} target="_blank" rel="noopener noreferrer nofollow"
                      style={{ ...lightGlass, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ color: "var(--text,#fff)", fontWeight: 700, fontSize: "13.5px" }}>{f.carrier || "طيران"}</div>
                        <div style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "12px" }}>
                          {fmtTime(f.departure) || fmtDay(f.departure)}{f.stops != null ? ` · ${f.stops === 0 ? "مباشر" : `${f.stops} توقف`}` : ""}{f.duration ? ` · ${f.duration}` : ""}
                        </div>
                      </div>
                      <div style={{ color: "#e8a830", fontWeight: 900, fontSize: "15px", whiteSpace: "nowrap" }}>{Math.round(Number(f.price))} ر.س</div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* الفنادق */}
            <div>
              <h3 style={{ color: "var(--text,#fff)", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>🏨 الفنادق ({date} → {checkout})</h3>
              {!hotelsOn || hotels.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a href={bookingUrl()} target="_blank" rel="noopener noreferrer nofollow" style={{ ...lightGlass, borderRadius: "12px", padding: "13px 14px", textDecoration: "none", color: "var(--text,#fff)", fontSize: "13.5px", fontWeight: 700 }}>
                    🏨 فنادق {destLabel} بتواريخك في Booking ↗
                  </a>
                  <a href={agodaUrl} target="_blank" rel="noopener noreferrer nofollow" style={{ ...lightGlass, borderRadius: "12px", padding: "13px 14px", textDecoration: "none", color: "var(--text,#fff)", fontSize: "13.5px", fontWeight: 700 }}>
                    🏝️ قارن في Agoda ↗
                  </a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {hotels.slice(0, 5).map((h) => (
                    <a key={h.id} href={bookingUrl(h.name)} target="_blank" rel="noopener noreferrer nofollow"
                      style={{ ...lightGlass, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ color: "var(--text,#fff)", fontWeight: 700, fontSize: "13.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {h.name} {h.rating ? `· ${"⭐".repeat(Math.min(5, Number(h.rating)))}` : ""}
                        </div>
                        <div style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "12px" }}>{h.room || "غرفة"} · إجمالي الإقامة</div>
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
          الضغط على أي نتيجة يفتح إتمام الحجز الآمن لدى المزود العالمي — قد نحصل على عمولة لا تؤثر على سعرك.
          💡 لا تحجز طيران العودة قبل مرور 24 ساعة على آخر غطسة.
        </p>
      </div>
    </section>
  );
}
