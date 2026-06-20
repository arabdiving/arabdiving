"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";

type BadgeKey = "womenStaff" | "privateTrip" | "family" | "separateFacilities" | "sanitizedGear" | "technical" | "ecoFriendly";

interface Center {
  _id: string;
  name: string; city: string; country: string; description: string;
  image: string; images: string[];
  rating: number; reviewsCount: number;
  priceFrom: number; currency: string;
  whatsapp: string; tier: string;
  badges: Record<BadgeKey, boolean>;
}

const BADGES: { key: BadgeKey; label: string; emoji: string }[] = [
  { key: "womenStaff", label: "طاقم نسائي", emoji: "🧕" },
  { key: "privateTrip", label: "رحلة خاصة", emoji: "🛥️" },
  { key: "family", label: "معتمد للعائلات", emoji: "👨‍👩‍👧‍👦" },
  { key: "separateFacilities", label: "مرافق مستقلة", emoji: "🚿" },
  { key: "sanitizedGear", label: "معدات معقّمة", emoji: "✨" },
  { key: "technical", label: "غوص تقني", emoji: "⚙️" },
  { key: "ecoFriendly", label: "صديق للبيئة", emoji: "🪸" },
];

const TIER_LABEL: Record<string, string> = { silver: "فضي", gold: "ذهبي", platinum: "بلاتيني" };
const TIER_COLOR: Record<string, string> = { silver: "#94a3b8", gold: "#d4a017", platinum: "#0d6cb0" };

export default function FamilyBookingPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("");
  const [active, setActive] = useState<BadgeKey[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/partner-centers`)
      .then((r) => r.json())
      .then((d) => setCenters(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => Array.from(new Set(centers.map((c) => c.city).filter(Boolean))), [centers]);

  const filtered = useMemo(() => centers.filter((c) => {
    if (city && c.city !== city) return false;
    return active.every((k) => c.badges?.[k]);
  }), [centers, city, active]);

  const toggle = (k: BadgeKey) => setActive((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));

  const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  const bookHref = (c: Center) => {
    const params = new URLSearchParams({ people: String(people), ...(date ? { date } : {}) });
    return `/family-booking/${c._id}?${params.toString()}`;
  };

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      {/* Hero + search */}
      <section style={{ background: "linear-gradient(135deg, #08233e 0%, #0d2c54 45%, #2e75b6 100%)", color: "white", padding: "70px 20px 90px", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "8px 20px", borderRadius: "30px", marginBottom: "16px", fontSize: "15px" }}>👨‍👩‍👧‍👦 رحلات العائلات</span>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 46px)", marginBottom: "12px" }}>احجز رحلة غوص عائلية آمنة</h1>
        <p style={{ fontSize: "clamp(16px, 4vw, 19px)", opacity: 0.92, maxWidth: "640px", margin: "0 auto 30px", lineHeight: 1.8 }}>اختر مركزًا معتمدًا في البحر الأحمر — بطواقم نسائية، مرافق مستقلة، ومعدات معقّمة.</p>

        <div style={{ background: "white", borderRadius: "18px", padding: "16px", maxWidth: "780px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}>
          <div style={{ textAlign: "start" }}>
            <label style={lbl}>الوجهة</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} style={field}>
              <option value="">كل المدن</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ textAlign: "start" }}>
            <label style={lbl}>التاريخ</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={field} />
          </div>
          <div style={{ textAlign: "start" }}>
            <label style={lbl}>عدد الأفراد</label>
            <input type="number" min={1} max={20} value={people} onChange={(e) => setPeople(Number(e.target.value))} style={field} />
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "-50px auto 0", padding: "0 20px 70px", position: "relative" }}>
        {/* Smart filters */}
        <div style={{ background: "white", borderRadius: "16px", padding: "16px 18px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", marginBottom: "26px" }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>فلاتر ذكية:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {BADGES.map((b) => {
              const on = active.includes(b.key);
              return (
                <button key={b.key} onClick={() => toggle(b.key)}
                  style={{ background: on ? "var(--mid)" : "#f3f6f9", color: on ? "white" : "#06324f", border: on ? "2px solid var(--mid)" : "1px solid #d4dae3", borderRadius: "22px", padding: "9px 15px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>
                  {b.emoji} {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>جارٍ التحميل...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "50px 20px", background: "white", borderRadius: "16px" }}>
            <p style={{ fontSize: "44px", marginBottom: "8px" }}>🤿</p>
            <p>لا توجد مراكز مطابقة حاليًا. {centers.length === 0 && "سيتم إضافة المراكز قريبًا."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "22px" }}>
            {filtered.map((c) => (
              <div key={c._id} style={{ background: "white", borderRadius: "18px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "170px" }}>
                  {c.images?.[0] || c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={siteImageSrc(c.images?.[0] || c.image) || ""} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0d2c54, #2e75b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🏝️</div>
                  )}
                  <span style={{ position: "absolute", top: "10px", insetInlineStart: "10px", background: TIER_COLOR[c.tier] || "#94a3b8", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: 700 }}>
                    شريك {TIER_LABEL[c.tier] || ""}
                  </span>
                </div>

                <div style={{ padding: "18px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ color: "var(--navy)", fontSize: "20px", marginBottom: "4px" }}>{c.name}</h3>
                  <div style={{ color: "#777", fontSize: "14px", marginBottom: "8px" }}>📍 {c.city}، {c.country}</div>
                  <div style={{ marginBottom: "10px", fontSize: "15px" }}>
                    <span style={{ color: "#f5a623" }}>{stars(c.rating)}</span>
                    <span style={{ color: "#999", fontSize: "13px", marginInlineStart: "6px" }}>{c.rating} ({c.reviewsCount})</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {BADGES.filter((b) => c.badges?.[b.key]).map((b) => (
                      <span key={b.key} title={b.label} style={{ background: "#eef4fa", color: "#0d6cb0", borderRadius: "8px", padding: "4px 9px", fontSize: "12px" }}>{b.emoji} {b.label}</span>
                    ))}
                  </div>

                  <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px", flex: 1 }}>{c.description}</p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <div style={{ color: "var(--navy)", fontWeight: 700 }}>من {c.priceFrom}{c.currency} <span style={{ fontWeight: 400, fontSize: "12px", color: "#888" }}>/ للفرد</span></div>
                    <Link href={bookHref(c)} style={{ background: "var(--gold)", color: "white", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "15px" }}>احجز الآن</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "12px", color: "#888", marginBottom: "4px" };
const field: React.CSSProperties = { width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "15px", color: "#06324f" };
