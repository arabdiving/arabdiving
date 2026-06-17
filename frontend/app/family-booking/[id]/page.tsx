"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";
import SeaHeroesGame, { ChildProfileData } from "@/app/components/SeaHeroesGame";

type BadgeKey = "womenStaff" | "privateTrip" | "family" | "separateFacilities" | "sanitizedGear" | "technical" | "ecoFriendly";
const BADGES: { key: BadgeKey; label: string; emoji: string }[] = [
  { key: "womenStaff", label: "طاقم نسائي", emoji: "🧕" },
  { key: "privateTrip", label: "رحلة خاصة", emoji: "🛥️" },
  { key: "family", label: "معتمد للعائلات", emoji: "👨‍👩‍👧‍👦" },
  { key: "separateFacilities", label: "مرافق مستقلة", emoji: "🚿" },
  { key: "sanitizedGear", label: "معدات معقّمة", emoji: "✨" },
  { key: "technical", label: "غوص تقني", emoji: "⚙️" },
  { key: "ecoFriendly", label: "صديق للبيئة", emoji: "🪸" },
];

interface Passenger { name: string; type: "adult" | "child"; profile?: ChildProfileData; }
const ADDONS = [
  { key: "photographer", label: "مصوّر تحت الماء 📸 (لليوم)", price: 100, perPerson: false },
  { key: "lunch", label: "وجبة غداء على القارب 🍽️", price: 20, perPerson: true },
  { key: "privateBoat", label: "قارب خاص للعائلة 🛥️", price: 1000, perPerson: false },
  { key: "transport", label: "نقل من وإلى الفندق 🚐", price: 25, perPerson: false },
];

const STEPS = ["التفاصيل", "الركاب", "الإضافات", "التأكيد"];

export default function BookingWizard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [center, setCenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [bestCallTime, setBestCallTime] = useState("");
  const [gameFor, setGameFor] = useState<number | null>(null);

  const [placing, setPlacing] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("people")) setPeople(Number(q.get("people")) || 2);
    if (q.get("date")) setDate(q.get("date")!);
    fetch(`${API_BASE}/api/partner-centers/${id}`)
      .then((r) => r.json()).then((d) => setCenter(d.center)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  // keep passengers array in sync with people count
  useEffect(() => {
    setPassengers((prev) => {
      const next = [...prev];
      while (next.length < people) next.push({ name: "", type: "adult" });
      next.length = people;
      return next;
    });
  }, [people]);

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ التحميل...</div>;
  if (!center) return <div style={{ padding: "60px", textAlign: "center", color: "#c0392b" }}>تعذّر العثور على المركز.</div>;

  const cur = center.currency || "$";
  const base = people * (center.priceFrom || 0);
  const addonsTotal = ADDONS.reduce((sum, a) => (addons[a.key] ? sum + a.price * (a.perPerson ? people : 1) : sum), 0);
  const total = base + addonsTotal;

  const setPassenger = (i: number, patch: Partial<Passenger>) =>
    setPassengers((p) => p.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const detailsValid = contact.name.trim() && contact.phone.trim() && date;
  const passengersValid = passengers.every((p) => p.name.trim() && (p.type !== "child" || p.profile));

  const placeBooking = async () => {
    setPlacing(true); setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          center: center._id, centerName: center.name, date, peopleCount: people, contact,
          passengers: passengers.map((p) => ({ name: p.name, type: p.type, profile: p.profile ? {
            age: p.profile.age, gender: p.profile.gender,
            sizes: { height: p.profile.sizes.height ? Number(p.profile.sizes.height) : undefined, weight: p.profile.sizes.weight ? Number(p.profile.sizes.weight) : undefined, shoe: p.profile.sizes.shoe ? Number(p.profile.sizes.shoe) : undefined, mask: p.profile.sizes.mask, wetsuit: p.profile.sizes.vest },
            pledge: p.profile.pledge, badgeTitle: p.profile.badgeTitle,
          } : undefined })),
          addons: ADDONS.filter((a) => addons[a.key]),
          subtotal: base, total, currency: cur,
          contactMethod, bestCallTime,
        }),
      });
      const d = await res.json();
      if (d.success) { setTicket(d.booking); setStep(4); window.scrollTo({ top: 0 }); }
      else setErr(d.message || "تعذّر إتمام الحجز.");
    } catch { setErr("تعذّر الاتصال بالخادم."); } finally { setPlacing(false); }
  };

  // ---------- Confirmation ----------
  if (step === 4 && ticket) {
    const welcome = `🌊 أهلًا بك في رحلتك مع ${center.name}!\nرقم الحجز: ${ticket.ticketCode}\nالتاريخ: ${date} · الأفراد: ${people}\nسنوافيك ببيانات التأكيد قريبًا. نتطلّع لاستقبالكم في البحر الأحمر 🤿`;
    const childBadges = passengers.filter((p) => p.type === "child" && p.profile);
    return (
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px)" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "56px" }}>🎉</div>
          <h1 style={{ color: "var(--navy)" }}>تم استلام حجزك!</h1>
          <p style={{ color: "#666" }}>سجّلنا طلبك بنجاح — سنوافيك ببيانات تأكيد الحجز قريبًا.</p>
        </div>

        <div style={{ background: "white", borderRadius: "18px", padding: "26px", boxShadow: "0 12px 34px rgba(0,0,0,0.08)", border: "2px dashed var(--mid)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "12px" }}>
            <strong style={{ color: "var(--navy)", fontSize: "20px" }}>🎟️ تذكرة إلكترونية</strong>
            <span style={{ background: "#fff3cd", color: "#8a6d3b", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: 700 }}>بانتظار التأكيد</span>
          </div>
          <Row k="رقم الحجز" v={ticket.ticketCode} />
          <Row k="المركز" v={center.name} />
          <Row k="التاريخ" v={date} />
          <Row k="عدد الأفراد" v={String(people)} />
          <Row k="الإجمالي التقديري" v={`${total} ${cur}`} />
          <Row k="سنتواصل عبر" v={contactMethod === "phone" ? `مكالمة${bestCallTime ? " · " + bestCallTime : ""}` : contactMethod === "email" ? "البريد الإلكتروني" : "واتساب"} />
          {childBadges.length > 0 && (
            <div style={{ marginTop: "14px", background: "#f0f9ff", borderRadius: "12px", padding: "12px" }}>
              <div style={{ fontSize: "14px", color: "#0d6cb0", marginBottom: "6px" }}>🏅 أبطال البحر الأحمر (المقاسات أُرسلت للمركز):</div>
              {childBadges.map((p, i) => (
                <div key={i} style={{ fontSize: "14px", color: "#333" }}>🐢 القبطان {p.name} — حامي البحر الأحمر</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "22px" }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(welcome)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#25D366", color: "white", padding: "13px 24px", borderRadius: "10px", fontWeight: 700 }}>إرسال التذكرة عبر واتساب 💬</a>
          <button onClick={() => window.print()} style={{ background: "var(--mid)", color: "white", border: "none", padding: "13px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>طباعة / حفظ PDF 🖨️</button>
          <Link href="/family-booking" style={{ background: "#eef4fa", color: "#0d6cb0", padding: "13px 24px", borderRadius: "10px", fontWeight: 700 }}>حجز رحلة أخرى</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "clamp(16px, 4vw, 36px)" }}>
      <Link href="/family-booking" style={{ color: "var(--mid)", fontSize: "14px" }}>← كل المراكز</Link>

      {/* Center summary header */}
      <div style={{ display: "flex", gap: "14px", alignItems: "center", margin: "14px 0 6px", flexWrap: "wrap" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "14px", overflow: "hidden", flexShrink: 0 }}>
          {center.images?.[0] || center.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={siteImageSrc(center.images?.[0] || center.image) || ""} alt={center.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0d2c54,#2e75b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>🏝️</div>}
        </div>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: "clamp(20px, 4vw, 28px)" }}>{center.name}</h1>
          <div style={{ color: "#777", fontSize: "14px" }}>📍 {center.city} · ⭐ {center.rating} · من {center.priceFrom}{cur}/للفرد</div>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", gap: "6px", margin: "18px 0 26px", flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, minWidth: "70px", textAlign: "center", padding: "8px 4px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, background: i === step ? "var(--mid)" : i < step ? "#d1ece0" : "#f1f5f9", color: i === step ? "white" : i < step ? "#1e7e34" : "#94a3b8" }}>
            {i < step ? "✓ " : `${i + 1}. `}{s}
          </div>
        ))}
      </div>

      {err && <p style={{ color: "#c0392b", marginBottom: "12px" }}>{err}</p>}

      {/* STEP 0: details */}
      {step === 0 && (
        <Card>
          <H>تفاصيل الرحلة</H>
          <div style={grid2}>
            <Field label="الاسم الكامل *"><input style={inp} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></Field>
            <Field label="رقم الجوال *"><input style={inp} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="مثال: 9665..." /></Field>
            <Field label="البريد الإلكتروني"><input style={inp} type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></Field>
            <Field label="تاريخ الرحلة *"><input style={inp} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="عدد الأفراد"><input style={inp} type="number" min={1} max={20} value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))} /></Field>
          </div>
          <Nav onNext={() => setStep(1)} nextOk={!!detailsValid} />
        </Card>
      )}

      {/* STEP 1: passengers + game hook */}
      {step === 1 && (
        <Card>
          <H>بيانات الركاب</H>
          {passengers.map((p, i) => (
            <div key={i} style={{ border: "1px solid #e8edf2", borderRadius: "14px", padding: "16px", marginBottom: "14px" }}>
              <div style={grid2}>
                <Field label={`اسم الفرد ${i + 1}`}><input style={inp} value={p.name} onChange={(e) => setPassenger(i, { name: e.target.value })} /></Field>
                <Field label="النوع">
                  <select style={inp} value={p.type} onChange={(e) => setPassenger(i, { type: e.target.value as any, profile: undefined })}>
                    <option value="adult">بالغ</option>
                    <option value="child">طفل</option>
                  </select>
                </Field>
              </div>
              {p.type === "child" && (
                <div style={{ background: "linear-gradient(135deg,#fff7e0,#ffe9a8)", borderRadius: "12px", padding: "14px", marginTop: "6px", textAlign: "center" }}>
                  {p.profile ? (
                    <div style={{ color: "#06324f", fontWeight: 700 }}>✅ القبطان {p.name || "الصغير"} جاهز! (المقاسات محفوظة)
                      <button onClick={() => setGameFor(i)} style={{ display: "block", margin: "8px auto 0", background: "transparent", border: "none", color: "#0d6cb0", textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}>إعادة اللعب</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ color: "#06324f", marginBottom: "8px", fontWeight: 700 }}>🤿 دعوا أبطالنا الصغار يجهّزون معداتهم بأنفسهم!</div>
                      <button onClick={() => setGameFor(i)} style={{ background: "var(--gold)", color: "white", border: "none", padding: "11px 22px", borderRadius: "30px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>هل القبطان الصغير جاهز؟ ابدأ اللعبة</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} nextOk={passengersValid} nextHint="أكمل أسماء الجميع وجهّز معدات الأطفال" />
        </Card>
      )}

      {/* STEP 2: addons */}
      {step === 2 && (
        <Card>
          <H>أضف لمسة مميّزة لرحلتك</H>
          {ADDONS.map((a) => (
            <label key={a.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: addons[a.key] ? "2px solid var(--mid)" : "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", cursor: "pointer" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" checked={!!addons[a.key]} onChange={(e) => setAddons({ ...addons, [a.key]: e.target.checked })} />
                <span style={{ color: "#06324f" }}>{a.label}</span>
              </span>
              <span style={{ color: "var(--navy)", fontWeight: 700 }}>{a.price}{cur}{a.perPerson ? " /للفرد" : ""}</span>
            </label>
          ))}
          <Nav onBack={() => setStep(1)} onNext={() => setStep(3)} nextOk />
        </Card>
      )}

      {/* STEP 3: checkout */}
      {step === 3 && (
        <Card>
          <H>تأكيد الحجز</H>
          <div style={{ background: "#f7fafc", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <SummaryRow k={`الرحلة (${people} × ${center.priceFrom}${cur})`} v={`${base} ${cur}`} />
            {ADDONS.filter((a) => addons[a.key]).map((a) => (
              <SummaryRow key={a.key} k={a.label} v={`${a.price * (a.perPerson ? people : 1)} ${cur}`} />
            ))}
            <div style={{ borderTop: "1px solid #dde5ec", marginTop: "10px", paddingTop: "10px" }}>
              <SummaryRow k="الإجمالي التقديري" v={`${total} ${cur}`} bold />
            </div>
          </div>

          <div style={{ marginBottom: "8px", color: "var(--navy)", fontWeight: 700 }}>كيف تفضّل أن نتواصل معك للتأكيد؟</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            {[{ k: "whatsapp", l: "واتساب 💬" }, { k: "phone", l: "مكالمة هاتفية 📞" }, { k: "email", l: "بريد إلكتروني ✉️" }].map((o) => (
              <button key={o.k} type="button" onClick={() => setContactMethod(o.k)}
                style={{ flex: "1 1 120px", padding: "12px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  border: contactMethod === o.k ? "2px solid var(--mid)" : "1px solid #d4dae3",
                  background: contactMethod === o.k ? "rgba(46,117,182,0.12)" : "white", color: "#06324f" }}>
                {o.l}
              </button>
            ))}
          </div>

          {contactMethod === "phone" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "5px" }}>أفضل وقت للاتصال</label>
              <select value={bestCallTime} onChange={(e) => setBestCallTime(e.target.value)} style={inp}>
                <option value="">اختر...</option>
                <option value="صباحًا (9 - 12)">صباحًا (9 - 12)</option>
                <option value="ظهرًا (12 - 4)">ظهرًا (12 - 4)</option>
                <option value="مساءً (4 - 8)">مساءً (4 - 8)</option>
                <option value="ليلًا (8 - 11)">ليلًا (8 - 11)</option>
              </select>
            </div>
          )}

          <div style={{ background: "#ecf7f0", border: "1px solid #b7e4c7", borderRadius: "12px", padding: "14px", fontSize: "14px", color: "#1e6b3a", lineHeight: 1.9, marginBottom: "16px" }}>
            ✅ لا حاجة للدفع الآن. سنسجّل طلبك ونوافيك ببيانات تأكيد الحجز عبر الطريقة التي اخترتها.
            <br />🛟 جميع رحلاتنا مع مراكز معتمدة بأعلى معايير السلامة · استرداد كامل حتى 7 أيام قبل الرحلة.
          </div>

          <Nav onBack={() => setStep(2)} onNext={placeBooking} nextOk={!placing} nextLabel={placing ? "جارٍ التسجيل..." : "أرسل طلب الحجز"} />
        </Card>
      )}

      {/* Game modal */}
      {gameFor !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, overflowY: "auto", padding: "16px", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          <div style={{ maxWidth: "600px", width: "100%", marginTop: "10px" }}>
            <SeaHeroesGame
              embedded skipIntro
              initialName={passengers[gameFor]?.name || ""}
              onComplete={(profile) => setPassenger(gameFor, { profile, name: passengers[gameFor]?.name || profile.childName })}
              onClose={() => setGameFor(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "white", borderRadius: "18px", padding: "clamp(18px, 4vw, 28px)", boxShadow: "0 10px 30px rgba(0,0,0,0.07)" }}>{children}</div>;
}
function H({ children }: { children: React.ReactNode }) {
  return <h2 style={{ color: "var(--navy)", fontSize: "21px", marginBottom: "18px" }}>{children}</h2>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: "14px" }}><label style={{ display: "block", fontSize: "13px", color: "#666", marginBottom: "5px" }}>{label}</label>{children}</div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "15px" }}><span style={{ color: "#666" }}>{k}</span><strong style={{ color: "var(--navy)" }}>{v}</strong></div>;
}
function SummaryRow({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: bold ? "18px" : "15px", fontWeight: bold ? 800 : 400, color: bold ? "var(--navy)" : "#444" }}><span>{k}</span><span>{v}</span></div>;
}
function Nav({ onBack, onNext, nextOk, nextLabel, nextHint }: { onBack?: () => void; onNext: () => void; nextOk?: boolean; nextLabel?: string; nextHint?: string }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", flexWrap: "wrap" }}>
        {onBack ? <button onClick={onBack} style={{ background: "#eef2f6", color: "#444", border: "none", padding: "12px 22px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>السابق</button> : <span />}
        <button onClick={onNext} disabled={nextOk === false} style={{ background: "var(--gold)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", cursor: nextOk === false ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700, opacity: nextOk === false ? 0.5 : 1 }}>{nextLabel || "التالي ←"}</button>
      </div>
      {nextOk === false && nextHint && <p style={{ color: "#999", fontSize: "13px", marginTop: "8px", textAlign: "end" }}>{nextHint}</p>}
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "15px", color: "#06324f", boxSizing: "border-box" };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" };
