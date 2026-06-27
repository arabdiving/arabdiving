"use client";

import { useState } from "react";

type SuitType = "wetsuit3" | "wetsuit5" | "wetsuit7" | "drysuit" | "swimsuit";
type TankType = "al80" | "steel12" | "steel15";
type WaterType = "salt" | "fresh";

interface Calc {
  bodyWeight: number;
  suitType: SuitType;
  tankType: TankType;
  waterType: WaterType;
}

/**
 * قاعدة الحساب:
 * - نقطة الصفر (المرجع) = بدلة 5mm + أسطوانة AL80 + مياه مالحة
 * - قاعدة PADI: 10% من وزن الجسم صحيحة لهذا المرجع تحديداً
 * - كل العوامل الأخرى هي تعديلات موجبة أو سالبة حول هذا المرجع
 *
 * المصدر: PADI Open Water Diver Manual + SSI Buoyancy tables
 */

// التعديل مقارنةً ببدلة 5mm (المرجع = 0)
const SUIT_ADJUSTMENT: Record<SuitType, number> = {
  swimsuit: -3.5,  // بدون بدلة — طفو أقل بكثير من 5mm
  wetsuit3: -1.5,  // بدلة 3mm — أقل من 5mm
  wetsuit5:  0,    // ◀ المرجع
  wetsuit7: +2.5,  // بدلة 7mm — أثقل وأكثر طفواً
  drysuit:  +5.0,  // بدلة جافة — تحبس هواءً بشكل كبير
};

// التعديل مقارنةً بأسطوانة AL80 (المرجع = 0)
const TANK_ADJUSTMENT: Record<TankType, number> = {
  al80:     0,    // ◀ المرجع — AL80 ألومنيوم 11L
  steel12: -1.5, // فولاذ 12L — غوص أكثر (يحتاج رصاص أقل)
  steel15: -2.0, // فولاذ 15L — غوص أكثر
};

function calcLead(c: Calc): number {
  // 10% من وزن الجسم = الوزن المبدئي لـ (5mm + AL80 + ماء مالح) — هذا صحيح وفق PADI
  const base  = c.bodyWeight * 0.10;
  const suit  = SUIT_ADJUSTMENT[c.suitType];
  const tank  = TANK_ADJUSTMENT[c.tankType];
  // الماء العذب أقل كثافة من المالح → يحتاج رصاصاً أقل بنحو 2 كغ
  const water = c.waterType === "fresh" ? -2 : 0;
  const total = base + suit + tank + water;
  return Math.max(0, Math.round(total * 2) / 2); // تقريب لأقرب 0.5 كغ
}

const INP: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  border: "1px solid #2a5a8a", background: "rgba(255,255,255,0.08)",
  color: "#fff", fontFamily: "inherit", fontSize: "15px",
};

export default function WeightCalculator() {
  const [form, setForm] = useState<Calc>({
    bodyWeight: 70, suitType: "wetsuit5", tankType: "al80", waterType: "salt",
  });
  const [result, setResult] = useState<number | null>(null);

  const calc = () => setResult(calcLead(form));

  return (
    <section style={{ padding: "70px 20px", background: "linear-gradient(135deg,#0d2c54 0%,#0b3d2e 100%)" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ display: "inline-block", background: "rgba(201,168,76,0.18)", color: "#c9a84c", padding: "5px 18px", borderRadius: "30px", fontSize: "13px", marginBottom: "12px" }}>
            أدوات الغوّاص
          </span>
          <h2 style={{ color: "#fff", fontSize: "clamp(24px,4vw,36px)", margin: "0 0 10px" }}>
            ⚖️ حاسبة وزن الحزام الرصاصي
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            احسب الوزن المثالي للحزام الرصاصي للوصول إلى التوازن المحايد تحت الماء
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "20px", padding: "32px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "24px" }}>

            {/* Body weight */}
            <div>
              <label style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                وزن الجسم (كغ)
              </label>
              <input
                type="number" min={30} max={200} style={INP}
                value={form.bodyWeight}
                onChange={(e) => setForm({ ...form, bodyWeight: Number(e.target.value) })}
              />
            </div>

            {/* Suit type */}
            <div>
              <label style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                نوع البدلة
              </label>
              <select style={INP} value={form.suitType} onChange={(e) => setForm({ ...form, suitType: e.target.value as SuitType })}>
                <option value="swimsuit">بدلة سباحة (1 مم)</option>
                <option value="wetsuit3">بدلة مطاط 3 مم</option>
                <option value="wetsuit5">بدلة مطاط 5 مم</option>
                <option value="wetsuit7">بدلة مطاط 7 مم</option>
                <option value="drysuit">بدلة جافة (Dry Suit)</option>
              </select>
            </div>

            {/* Tank type */}
            <div>
              <label style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                نوع الأسطوانة
              </label>
              <select style={INP} value={form.tankType} onChange={(e) => setForm({ ...form, tankType: e.target.value as TankType })}>
                <option value="al80">ألومنيوم 80 قدم³</option>
                <option value="steel12">فولاذ 12 لتر</option>
                <option value="steel15">فولاذ 15 لتر</option>
              </select>
            </div>

            {/* Water type */}
            <div>
              <label style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                نوع الماء
              </label>
              <select style={INP} value={form.waterType} onChange={(e) => setForm({ ...form, waterType: e.target.value as WaterType })}>
                <option value="salt">مياه مالحة (البحر)</option>
                <option value="fresh">مياه عذبة (بحيرة / حوض)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calc}
            style={{
              width: "100%", padding: "14px", background: "#c9a84c", color: "#0d2c54",
              border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
            }}
          >
            احسب الوزن المطلوب
          </button>

          {result !== null && (
            <div style={{
              marginTop: "24px", padding: "24px", background: "rgba(201,168,76,0.12)",
              borderRadius: "14px", border: "1px solid rgba(201,168,76,0.3)", textAlign: "center",
            }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: "0 0 8px" }}>الوزن الموصى به</p>
              <p style={{ color: "#c9a84c", fontSize: "52px", fontWeight: 700, margin: "0 0 6px", lineHeight: 1 }}>
                {result} <span style={{ fontSize: "22px" }}>كغ</span>
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "10px 0 0", lineHeight: 1.8 }}>
                * هذه قيمة تقريبية مبنية على المعايير القياسية.<br/>
                قم دائمًا بإجراء اختبار طفو أمام المرشد قبل الغطسة الأولى.
              </p>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "24px" }}>
          {[
            { icon: "🌊", title: "البحر الأحمر", tip: "المياه المالحة أكثر كثافة — تحتاج وزناً أقل" },
            { icon: "🧥", title: "البدلة الجافة", tip: "تحتاج وزناً إضافياً لتعويض الهواء المحبوس" },
            { icon: "🫧", title: "قاعدة الثلثين", tip: "ابدأ بـ 10٪ من وزنك وعدّل تدريجياً" },
          ].map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{c.icon}</div>
              <p style={{ color: "#c9a84c", fontWeight: 600, margin: "0 0 4px", fontSize: "14px" }}>{c.title}</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>{c.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
