"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

type Stage = "intro" | "avatar" | "gear" | "pledge" | "reward";
type Sizes = { shoe?: string; height?: string; weight?: string; mask?: string; vest?: string };

interface GearItem {
  id: string;
  emoji: string;
  label: string;
  ask: "shoe" | "mask" | "body" | "vest" | null;
  required?: boolean;
}

const GEAR: GearItem[] = [
  { id: "mask", emoji: "🥽", label: "نظارة الغوص", ask: "mask", required: true },
  { id: "fins", emoji: "🦶", label: "الزعانف", ask: "shoe", required: true },
  { id: "wetsuit", emoji: "🩱", label: "بدلة الغوص", ask: "body", required: true },
  { id: "snorkel", emoji: "🤿", label: "أنبوب التنفس", ask: null },
  { id: "vest", emoji: "🦺", label: "سترة الطفو", ask: "vest" },
];

const SEA_BG = "linear-gradient(180deg, #0a4d8c 0%, #0d6cb0 40%, #1184c4 100%)";

export default function GamePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);

  const [equipped, setEquipped] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Sizes>({});
  const [activeGear, setActiveGear] = useState<GearItem | null>(null);

  const [pledgeProgress, setPledgeProgress] = useState(0);
  const [pledged, setPledged] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  const avatarFace = gender === "girl" ? "👧" : "👦";
  const requiredDone = GEAR.filter((g) => g.required).every((g) => equipped.includes(g.id));

  // ---- Gear logic ----
  const handleGearTap = (g: GearItem) => {
    if (equipped.includes(g.id)) return;
    if (g.ask) setActiveGear(g);
    else setEquipped((e) => [...e, g.id]);
  };

  const confirmSize = () => {
    if (!activeGear) return;
    setEquipped((e) => [...e, activeGear.id]);
    setActiveGear(null);
  };

  const sizeFormValid = (): boolean => {
    if (!activeGear) return false;
    if (activeGear.ask === "shoe") return !!sizes.shoe;
    if (activeGear.ask === "mask") return !!sizes.mask;
    if (activeGear.ask === "vest") return !!sizes.vest;
    if (activeGear.ask === "body") return !!sizes.height && !!sizes.weight;
    return true;
  };

  // ---- Pledge press-and-hold ----
  const startHold = () => {
    if (pledged) return;
    holdRef.current = setInterval(() => {
      setPledgeProgress((p) => {
        if (p >= 100) {
          if (holdRef.current) clearInterval(holdRef.current);
          setPledged(true);
          return 100;
        }
        return p + 4;
      });
    }, 40);
  };
  const endHold = () => {
    if (holdRef.current) clearInterval(holdRef.current);
    if (!pledged) setPledgeProgress(0);
  };

  // ---- Save ----
  const saveProfile = async () => {
    setSaving(true);
    setErr("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/api/child-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          childName: name,
          age,
          gender,
          sizes: {
            height: sizes.height ? Number(sizes.height) : undefined,
            weight: sizes.weight ? Number(sizes.weight) : undefined,
            shoe: sizes.shoe ? Number(sizes.shoe) : undefined,
            mask: sizes.mask,
            wetsuit: sizes.vest,
          },
          gearEquipped: equipped,
          pledge: pledged,
          badgeTitle: `القبطان ${name} — حامي البحر الأحمر`,
        }),
      });
      const d = await res.json();
      if (d.success) setSaved(true);
      else setErr(d.message || "تعذّر حفظ الإنجاز.");
    } catch {
      setErr("تعذّر الاتصال بالخادم.");
    } finally {
      setSaving(false);
    }
  };

  const shareBadge = () => {
    const text = `🐢 القبطان ${name} أصبح حامي البحر الأحمر مع الغواصين العرب! 🌊🤿`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // ---- Shared styles ----
  const wrap: React.CSSProperties = { minHeight: "100vh", background: SEA_BG, color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 18px", textAlign: "center", position: "relative", overflow: "hidden" };
  const card: React.CSSProperties = { background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)", borderRadius: "24px", padding: "clamp(22px, 5vw, 40px)", maxWidth: "560px", width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", position: "relative", zIndex: 1 };
  const bigBtn = (bg = "#ffcc00", color = "#06324f"): React.CSSProperties => ({ background: bg, color, border: "none", padding: "15px 34px", borderRadius: "40px", fontSize: "19px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" });

  const bubbles = (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {[12, 28, 46, 64, 82].map((left, i) => (
        <span key={i} style={{ position: "absolute", left: `${left}%`, bottom: "-30px", fontSize: `${18 + i * 6}px`, opacity: 0.35, animation: `floatUp ${7 + i * 2}s linear ${i}s infinite` }}>🫧</span>
      ))}
    </div>
  );

  return (
    <div style={wrap}>
      <style>{`@keyframes floatUp{0%{transform:translateY(0)}100%{transform:translateY(-105vh)}}`}</style>
      {bubbles}

      {/* INTRO */}
      {stage === "intro" && (
        <div style={card}>
          <div style={{ fontSize: "70px", marginBottom: "10px" }}>🐢🤿🐠</div>
          <h1 style={{ fontSize: "clamp(28px, 7vw, 42px)", marginBottom: "14px" }}>أبطال البحر الأحمر</h1>
          <p style={{ fontSize: "18px", lineHeight: 1.9, opacity: 0.95, marginBottom: "28px" }}>
            دعوا أبطالنا الصغار يجهّزون معداتهم بأنفسهم! 🤿
            <br />هل القبطان الصغير جاهز للمغامرة؟
          </p>
          <button onClick={() => setStage("avatar")} style={bigBtn()}>ابدأ المغامرة! 🚀</button>
        </div>
      )}

      {/* AVATAR */}
      {stage === "avatar" && (
        <div style={card}>
          <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>من هو بطلنا اليوم؟</h2>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "22px" }}>
            {(["boy", "girl"] as const).map((g) => (
              <button key={g} onClick={() => setGender(g)} style={{ fontSize: "60px", background: gender === g ? "rgba(255,204,0,0.3)" : "rgba(255,255,255,0.1)", border: gender === g ? "3px solid #ffcc00" : "3px solid transparent", borderRadius: "20px", padding: "12px 22px", cursor: "pointer" }}>
                {g === "boy" ? "👦" : "👧"}
              </button>
            ))}
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اكتب اسمك أيها البطل" maxLength={20}
            style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "none", fontSize: "18px", textAlign: "center", fontFamily: "inherit", marginBottom: "20px" }} />
          <p style={{ marginBottom: "10px", fontSize: "16px" }}>كم عمرك؟ 🎂</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "28px" }}>
            {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
              <button key={a} onClick={() => setAge(a)} style={{ width: "46px", height: "46px", borderRadius: "50%", border: age === a ? "3px solid #ffcc00" : "2px solid rgba(255,255,255,0.5)", background: age === a ? "#ffcc00" : "rgba(255,255,255,0.1)", color: age === a ? "#06324f" : "white", fontSize: "17px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{a}</button>
            ))}
          </div>
          <button onClick={() => setStage("gear")} disabled={!name.trim() || !age} style={{ ...bigBtn(), opacity: !name.trim() || !age ? 0.5 : 1 }}>التالي: غرفة المعدات 🎒</button>
        </div>
      )}

      {/* GEAR */}
      {stage === "gear" && (
        <div style={{ ...card, maxWidth: "640px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "6px" }}>غرفة المعدات السحرية ✨</h2>
          <p style={{ opacity: 0.9, marginBottom: "18px", fontSize: "15px" }}>اسحب القطعة على البطل أو اضغط عليها لإلباسها</p>

          {/* Avatar drop target */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); const g = GEAR.find((x) => x.id === id); if (g) handleGearTap(g); }}
            style={{ fontSize: "90px", lineHeight: 1, margin: "0 auto 6px", width: "140px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "20px", border: "2px dashed rgba(255,255,255,0.4)" }}
          >
            {avatarFace}
          </div>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", minHeight: "26px", marginBottom: "16px" }}>
            {equipped.map((id) => { const g = GEAR.find((x) => x.id === id); return <span key={id} style={{ fontSize: "22px" }}>{g?.emoji}</span>; })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(95px, 1fr))", gap: "12px", marginBottom: "22px" }}>
            {GEAR.map((g) => {
              const on = equipped.includes(g.id);
              return (
                <button key={g.id}
                  draggable={!on}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", g.id)}
                  onClick={() => handleGearTap(g)}
                  disabled={on}
                  style={{ background: on ? "rgba(46,204,113,0.3)" : "rgba(255,255,255,0.14)", border: on ? "2px solid #2ecc71" : "2px solid rgba(255,255,255,0.3)", borderRadius: "16px", padding: "14px 8px", cursor: on ? "default" : "grab", fontFamily: "inherit", color: "white" }}>
                  <div style={{ fontSize: "34px" }}>{g.emoji}</div>
                  <div style={{ fontSize: "13px", marginTop: "4px" }}>{g.label}{g.required ? " *" : ""}</div>
                  {on && <div style={{ fontSize: "12px", color: "#2ecc71", marginTop: "2px" }}>✓ جاهز</div>}
                </button>
              );
            })}
          </div>

          <button onClick={() => setStage("pledge")} disabled={!requiredDone} style={{ ...bigBtn(), opacity: requiredDone ? 1 : 0.5 }}>
            {requiredDone ? "التالي: عهد المحيط 🐢" : "ألبِس القطع الأساسية (*)"}
          </button>

          {/* Size mini-form */}
          {activeGear && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "18px" }}>
              <div style={{ background: "white", color: "#06324f", borderRadius: "20px", padding: "26px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
                <div style={{ fontSize: "44px" }}>{activeGear.emoji}</div>
                <h3 style={{ margin: "8px 0 4px" }}>{activeGear.label}</h3>
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>ساعِد القبطان: أدخل المقاس الحقيقي ليجهّزه المركز مسبقًا.</p>

                {activeGear.ask === "shoe" && (
                  <input type="number" inputMode="numeric" value={sizes.shoe || ""} onChange={(e) => setSizes((s) => ({ ...s, shoe: e.target.value }))} placeholder="مقاس الحذاء (مثال: 30)"
                    style={miniInp} />
                )}
                {activeGear.ask === "body" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="number" inputMode="numeric" value={sizes.height || ""} onChange={(e) => setSizes((s) => ({ ...s, height: e.target.value }))} placeholder="الطول (سم)" style={miniInp} />
                    <input type="number" inputMode="numeric" value={sizes.weight || ""} onChange={(e) => setSizes((s) => ({ ...s, weight: e.target.value }))} placeholder="الوزن (كجم)" style={miniInp} />
                  </div>
                )}
                {(activeGear.ask === "mask" || activeGear.ask === "vest") && (
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "6px" }}>
                    {["S", "M", "L"].map((sz) => {
                      const key = activeGear.ask as "mask" | "vest";
                      const sel = sizes[key] === sz;
                      return <button key={sz} onClick={() => setSizes((s) => ({ ...s, [key]: sz }))} style={{ width: "54px", height: "54px", borderRadius: "12px", border: sel ? "3px solid #1184c4" : "2px solid #ccc", background: sel ? "#1184c4" : "#f3f6f9", color: sel ? "white" : "#06324f", fontSize: "18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{sz}</button>;
                    })}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                  <button onClick={() => setActiveGear(null)} style={{ flex: 1, background: "#e2e8f0", color: "#444", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>
                  <button onClick={confirmSize} disabled={!sizeFormValid()} style={{ flex: 2, background: "#1184c4", color: "white", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", opacity: sizeFormValid() ? 1 : 0.5 }}>ألبِس البطل! ✅</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLEDGE */}
      {stage === "pledge" && (
        <div style={card}>
          <div style={{ fontSize: "70px", marginBottom: "6px" }}>🐢</div>
          <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>عهد حامي المحيط</h2>
          <p style={{ fontSize: "17px", lineHeight: 2, marginBottom: "18px", opacity: 0.96 }}>
            تقول السلحفاة الحكيمة: «أيها البطل، اضغط بإصبعك لتقطع عهد حماية البحر:»
            <br />🪸 لن ألمس المرجان
            <br />🛍️ لن أرمي البلاستيك في البحر
          </p>

          <div
            onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold}
            style={{ width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", userSelect: "none", background: `conic-gradient(#ffcc00 ${pledgeProgress * 3.6}deg, rgba(255,255,255,0.18) 0deg)`, border: "3px solid rgba(255,255,255,0.5)" }}
          >
            <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "rgba(6,50,79,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px" }}>
              {pledged ? "✅" : "👆"}
            </div>
          </div>
          <p style={{ fontSize: "15px", opacity: 0.85, marginBottom: "22px" }}>{pledged ? "أحسنت! أصبحت حاميًا للبحر 🌊" : "استمر بالضغط حتى يكتمل الوعد..."}</p>

          <button onClick={() => setStage("reward")} disabled={!pledged} style={{ ...bigBtn(), opacity: pledged ? 1 : 0.5 }}>استلم وسامك! 🏅</button>
        </div>
      )}

      {/* REWARD */}
      {stage === "reward" && (
        <div style={card}>
          <h2 style={{ fontSize: "22px", marginBottom: "16px", opacity: 0.9 }}>🎉 مبروك أيها البطل! 🎉</h2>
          <div style={{ background: "linear-gradient(135deg, #fff7e0, #ffe9a8)", color: "#06324f", borderRadius: "20px", padding: "28px 22px", border: "4px solid #ffcc00", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
            <div style={{ fontSize: "60px" }}>🐢🏅</div>
            <div style={{ fontSize: "15px", letterSpacing: "1px", marginTop: "6px" }}>القبطان</div>
            <div style={{ fontSize: "30px", fontWeight: 800, margin: "2px 0" }}>{name}</div>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#0d6cb0" }}>حامي البحر الأحمر 🌊</div>
            <div style={{ fontSize: "13px", color: "#777", marginTop: "10px" }}>{new Date().toLocaleDateString("ar-EG")}</div>
          </div>

          <p style={{ fontSize: "14px", opacity: 0.9, margin: "18px 0" }}>
            سيظهر هذا الوسام على خزانة معداتك في المركز عند وصولك 🤿
          </p>

          {err && <p style={{ color: "#ffd0d0", marginBottom: "10px" }}>{err}</p>}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            {!saved ? (
              <button onClick={saveProfile} disabled={saving} style={bigBtn("#2ecc71", "#06324f")}>{saving ? "جارٍ الحفظ..." : "احفظ الإنجاز 💾"}</button>
            ) : (
              <span style={{ background: "rgba(46,204,113,0.25)", border: "2px solid #2ecc71", borderRadius: "40px", padding: "13px 26px", fontWeight: 700 }}>✓ تم الحفظ وأُرسلت المقاسات للمركز</span>
            )}
            <button onClick={shareBadge} style={bigBtn("#25D366", "#06324f")}>شارك 💬</button>
          </div>
          <div style={{ marginTop: "18px" }}>
            <Link href="/kids" style={{ color: "white", textDecoration: "underline", fontSize: "15px" }}>العودة لصفحة العائلات</Link>
          </div>
        </div>
      )}
    </div>
  );
}

const miniInp: React.CSSProperties = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ccd5df", fontSize: "16px", textAlign: "center", fontFamily: "inherit", marginBottom: "4px" };
