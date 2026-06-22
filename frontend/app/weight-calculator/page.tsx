"use client";

import { useState } from "react";
import Link from "next/link";

export default function WeightCalculatorPage() {
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("175");
  const [age, setAge] = useState("30");
  const [water, setWater] = useState("salt");
  const [suit, setSuit] = useState("0");
  const [tank, setTank] = useState("2");
  const [result, setResult] = useState<number | null>(null);
  const [err, setErr] = useState("");

  // 🔴 هنا تم التعديل بالكامل لتطبيق المنطق العلمي الصحيح
  const calculate = () => {
    const w = parseFloat(weight);
    const hCm = parseFloat(height);
    const suitVal = parseFloat(suit);
    const tankVal = parseFloat(tank);
    const isSalt = water === "salt";

    if (!w || !hCm) { 
        setErr("يرجى إدخال الوزن والطول بشكل صحيح"); 
        setResult(null); 
        return; 
    }
    setErr("");

    // 1. حساب الوزن الأساسي بناءً على سُمك البدلة
    let baseWeight = 0;
    if (suitVal === 0) {
        baseWeight = 1.5; // بدون بدلة
    } else if (suitVal === 1.5) {
        baseWeight = w * 0.05; // بدلة 3 ملم
    } else if (suitVal === 3) {
        baseWeight = w * 0.10; // بدلة 5 ملم
    } else if (suitVal === 5) {
        baseWeight = (w * 0.10) + 2; // بدلة 7 ملم
    }

    // 2. تعديل نوع المياه
    if (!isSalt) {
        baseWeight -= 1.5; // المياه العذبة
    }

    // 3. تعديل نوع الأسطوانة
    if (tankVal === 0) {
        baseWeight -= 2; // أسطوانة الحديد
    }

    // 4. تعديل بنية الجسم (حساب مؤشر كتلة الجسم)
    const hM = hCm / 100;
    const bmi = w / (hM * hM);
    let bmiMod = 0;
    if (bmi > 25) bmiMod = 1;  // نسبة دهون أعلى
    if (bmi < 20) bmiMod = -1; // كتلة عضلية أكبر

    // إجمالي الوزن
    let total = baseWeight + bmiMod;
    total = Math.max(0, Math.round(total * 2) / 2); // عدم السماح بقيمة سالبة، والتقريب لنصف كيلو
    setResult(total);
  };

  const field: React.CSSProperties = { width: "100%", padding: "11px", border: "1px solid #d4dae3", borderRadius: "8px", boxSizing: "border-box", fontFamily: "inherit", fontSize: "15px" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "13px", color: "#555", marginBottom: "5px" };

  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(20px,5vw,44px) 18px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "46px" }}>⚖️🤿</div>
        <h1 style={{ color: "var(--navy)", fontSize: "clamp(24px,5vw,34px)" }}>حاسبة أوزان الغوص الذكية</h1>
        <p style={{ color: "#666", lineHeight: 1.8 }}>تقدير وزن الرصاص المطلوب حسب وزنك وطولك (مؤشر كتلة الجسم لتقدير الطفوية) ونوع المياه والمعدات.</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "clamp(18px,4vw,28px)", boxShadow: "0 10px 30px rgba(0,0,0,0.07)", borderTop: "5px solid var(--mid)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
          <div><label style={lbl}>الوزن (كجم)</label><input type="number" inputMode="numeric" value={weight} onChange={(e) => setWeight(e.target.value)} style={field} /></div>
          <div><label style={lbl}>الطول (سم)</label><input type="number" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} style={field} /></div>
          <div><label style={lbl}>العمر</label><input type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} style={field} /></div>
          <div><label style={lbl}>نوع المياه</label><select value={water} onChange={(e) => setWater(e.target.value)} style={field}><option value="salt">مالحة (بحر)</option><option value="fresh">عذبة (نهر/بحيرة)</option></select></div>
          <div><label style={lbl}>سُمك البدلة (Wetsuit)</label><select value={suit} onChange={(e) => setSuit(e.target.value)} style={field}><option value="0">بدون / ليكرا</option><option value="1.5">3 ملم (استوائي)</option><option value="3">5 ملم (معتدل)</option><option value="5">7 ملم (بارد)</option></select></div>
          <div><label style={lbl}>نوع الأسطوانة (Tank)</label><select value={tank} onChange={(e) => setTank(e.target.value)} style={field}><option value="2">ألمنيوم (أخف في النهاية)</option><option value="0">حديد (Steel)</option></select></div>
        </div>

        <button onClick={calculate} style={{ width: "100%", background: "var(--mid)", color: "white", border: "none", padding: "13px", borderRadius: "10px", fontSize: "17px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>احسب الوزن المطلوب</button>

        {err && <p style={{ color: "#c0392b", textAlign: "center", marginTop: "12px" }}>{err}</p>}
        {result !== null && (
          /* 🔴 هنا تم تعديل اللون ليكون مميزاً (أخضر مع إطار) بناءً على طلبك */
          <div style={{ marginTop: "16px", padding: "16px", background: "#d4edda", border: "2px solid #28a745", borderRadius: "10px", textAlign: "center", color: "#155724" }}>
            <div style={{ fontSize: "22px", fontWeight: 800 }}>الوزن التقريبي المطلوب: {result} كجم</div>
            <div style={{ fontSize: "13px", color: "#155724", marginTop: "4px" }}>(تم الحساب بناءً على المعايير العلمية المعتمدة للطفوية)</div>
          </div>
        )}

        <p style={{ fontSize: "13px", color: "#888", textAlign: "center", marginTop: "14px", lineHeight: 1.7 }}>
          ⚠️ تنبيه: هذا الرقم تقديري للبدء فقط. أجرِ دائمًا <strong>فحص الطفو (Buoyancy Check)</strong> في الماء قبل الغوص للسلامة.
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link href="/trends" style={{ color: "var(--mid)" }}>← الصيحات وتقييم أمان المعدات</Link>
      </div>
    </main>
  );
}