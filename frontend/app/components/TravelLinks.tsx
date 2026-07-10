"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

/*
  TravelLinks — «أكمل رحلتك»: فنادق وطيران بروابط عميقة معبأة مسبقًا.
  يفتح Booking/Agoda/Skyscanner بنتائج جاهزة للوجهة والتاريخ وعدد الأشخاص.
  معرفات العمولة (aid/cid) تُقرأ من إعدادات الأدمن — عند الانضمام لبرامج
  الشراكة تبدأ نفس الروابط باحتساب العمولة دون تغيير الكود.
*/

// الوجهات: اسم الحجز الفندقي + أقرب مطار
const DEST: Record<string, { hotel: string; airport: string }> = {
  "شرم الشيخ": { hotel: "Sharm El Sheikh", airport: "SSH" },
  "دهب":       { hotel: "Dahab",           airport: "SSH" },
  "الغردقة":   { hotel: "Hurghada",        airport: "HRG" },
  "مرسى علم":  { hotel: "Marsa Alam",      airport: "RMF" },
  "الجونة":    { hotel: "El Gouna",        airport: "HRG" },
  "سفاجا":     { hotel: "Safaga",          airport: "HRG" },
  "نويبع":     { hotel: "Nuweiba",         airport: "SSH" },
};

// مدن انطلاق الجمهور الخليجي
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

export default function TravelLinks({ city, date, people = 2 }: { city?: string; date?: string; people?: number }) {
  const [origin, setOrigin] = useState("RUH");
  const [aff, setAff] = useState<{ bookingAid?: string; agodaCid?: string }>({});

  useEffect(() => {
    try { const o = localStorage.getItem("ad_origin"); if (o) setOrigin(o); } catch {}
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => setAff(d.settings?.affiliates || {})).catch(() => {});
  }, []);

  const pickOrigin = (code: string) => {
    setOrigin(code);
    try { localStorage.setItem("ad_origin", code); } catch {}
  };

  const dest = DEST[city || ""] || DEST["شرم الشيخ"];
  const destLabel = city && DEST[city] ? city : "شرم الشيخ";
  const checkin = date || "";
  const checkout = date ? addDays(date, 4) : "";

  // ── الفنادق ──
  const bookingUrl = (() => {
    const p = new URLSearchParams({ ss: dest.hotel, group_adults: String(people || 2), no_rooms: "1", lang: "ar" });
    if (checkin) { p.set("checkin", checkin); p.set("checkout", checkout); }
    if (aff.bookingAid) p.set("aid", aff.bookingAid);
    return `https://www.booking.com/searchresults.ar.html?${p.toString()}`;
  })();

  const agodaUrl = (() => {
    const p = new URLSearchParams({ textToSearch: dest.hotel, adults: String(people || 2), rooms: "1", los: "4" });
    if (checkin) p.set("checkIn", checkin);
    if (aff.agodaCid) p.set("cid", aff.agodaCid);
    return `https://www.agoda.com/ar-sa/Search?${p.toString()}`;
  })();

  // ── الطيران ──
  const skyDate = checkin ? checkin.slice(2).replace(/-/g, "") : ""; // yymmdd
  const skyscannerUrl = `https://www.skyscanner.com.sa/transport/flights/${origin.toLowerCase()}/${dest.airport.toLowerCase()}/${skyDate ? skyDate + "/" : ""}`;
  const gflightsUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${origin} to ${dest.airport}${checkin ? ` on ${checkin}` : ""}`)}`;

  const glass: React.CSSProperties = { background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" };
  const linkCard = (emoji: string, title: string, desc: string, href: string, accent: string): React.ReactElement => (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow"
      style={{ ...glass, borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", transition: "transform .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
      <span style={{ fontSize: "28px", flexShrink: 0 }}>{emoji}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", color: "var(--text,#fff)", fontWeight: 800, fontSize: "14.5px" }}>{title}</span>
        <span style={{ display: "block", color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "12px" }}>{desc}</span>
      </span>
      <span style={{ marginInlineStart: "auto", color: accent, fontWeight: 900, flexShrink: 0 }}>↗</span>
    </a>
  );

  return (
    <section style={{ maxWidth: "1100px", margin: "30px auto 0", padding: "0 0 10px" }}>
      <div style={{ ...glass, borderRadius: "18px", padding: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
          <h2 style={{ color: "var(--text,#fff)", fontSize: "19px", fontWeight: 800, margin: 0 }}>
            ✈️ أكمل رحلتك إلى {destLabel}
          </h2>
          {/* اختيار مدينة الانطلاق */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "13px" }}>
            أطير من:
            <select value={origin} onChange={(e) => pickOrigin(e.target.value)}
              style={{ background: "var(--glass-light-bg,rgba(255,255,255,0.07))", color: "var(--text,#fff)", border: "1px solid var(--glass-light-border,rgba(255,255,255,0.1))", borderRadius: "9px", padding: "7px 10px", fontFamily: "inherit", fontSize: "13px" }}>
              {ORIGINS.map((o) => <option key={o.code} value={o.code} style={{ color: "#0f172a" }}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <p style={{ color: "var(--muted,rgba(255,255,255,0.55))", fontSize: "13px", lineHeight: 1.8, marginBottom: "16px" }}>
          روابط تفتح البحث جاهزًا بوجهتك{checkin ? " وتاريخك" : ""} — قارن بنفسك واحجز حيث يناسبك. نحن لا نبيع فنادق ولا طيرانًا، فقط نوفر عليك البحث.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {linkCard("🏨", "فنادق Booking", `${dest.hotel}${checkin ? ` · ${checkin}` : ""} · ${people || 2} أشخاص`, bookingUrl, "#22d3ee")}
          {linkCard("🏝️", "فنادق Agoda", "أسعار آسيوية منافسة أحيانًا — قارن دائمًا", agodaUrl, "#34d399")}
          {linkCard("✈️", "طيران Skyscanner", `${ORIGINS.find((o) => o.code === origin)?.label} ← ${destLabel}${checkin ? ` · ${checkin}` : ""}`, skyscannerUrl, "#e8a830")}
          {linkCard("🔍", "طيران Google Flights", "مقارنة سريعة لكل شركات الطيران", gflightsUrl, "#c084fc")}
        </div>
        <p style={{ color: "var(--faint,rgba(255,255,255,0.35))", fontSize: "11.5px", marginTop: "12px", marginBottom: 0, lineHeight: 1.7 }}>
          💡 نصيحة الناصح الأمين: احجز الغوص أولًا وثبّت مواعيده، ثم الفندق قريبًا من مركز الغوص، والطيران آخرًا — ولا تحجز طيران العودة قبل مرور 24 ساعة على آخر غطسة.
        </p>
      </div>
    </section>
  );
}
