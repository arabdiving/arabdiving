"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";
import { contentDefaults } from "@/app/lib/content-defaults";

const PAGES = [
  { key: "home", label: "الرئيسية" },
  { key: "kids", label: "الأطفال" },
  { key: "women", label: "النساء" },
  { key: "youth", label: "الشباب" },
  { key: "trips", label: "الرحلات" },
  { key: "guide", label: "دليل الغوص" },
  { key: "stories", label: "القصص والمسابقة" },
];

const LABELS: Record<string, string> = {
  badge: "الشارة", title: "العنوان", subtitle: "النص الفرعي", text: "النص",
  desc: "الوصف", description: "الوصف", primaryLabel: "زر رئيسي — النص",
  primaryHref: "زر رئيسي — الرابط", secondaryLabel: "زر ثانوي — النص",
  secondaryHref: "زر ثانوي — الرابط", label: "نص الزر", href: "رابط الزر",
  icon: "الأيقونة", image: "الصورة", age: "العمر", n: "الرقم", duration: "المدة",
  level: "المستوى", highlights: "أبرز النقاط", color: "اللون",
  hero: "القسم العلوي", gulf: "قسم الخليج", community: "قسم المجتمع",
  reasons: "الأسباب", countries: "الدول", segments: "الفئات", features: "المميزات",
  steps: "الخطوات", tracks: "المسارات", perks: "المزايا", programs: "البرامج",
  trips: "الرحلات", cta: "الدعوة للإجراء", whyTitle: "عنوان القسم",
  featuresTitle: "عنوان المميزات", stepsTitle: "عنوان الخطوات",
  tracksTitle: "عنوان المسارات", tracksSubtitle: "نص فرعي للمسارات",
  perksTitle: "عنوان المزايا", programsTitle: "عنوان البرامج",
  programsSubtitle: "نص فرعي للبرامج", featuredTitle: "عنوان مواقع الغوص",
};
const lbl = (k: string) => LABELS[k] || k;
const LONG = ["subtitle", "text", "desc", "description"];

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        headers: authHeaders(false),
        body: fd,
      });
      const d = await res.json();
      if (d.success) onChange(d.url);
      else alert(d.message || "تعذّر رفع الصورة");
    } catch {
      alert("تعذّر الاتصال بالخادم");
    } finally {
      setBusy(false);
    }
  };
  const src = value ? (/^https?:\/\//.test(value) ? value : `/images/${value}`) : "";
  return (
    <div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" style={{ width: "140px", height: "90px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
      )}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <input type="file" accept="image/*" onChange={(e) => e.target.files && upload(e.target.files[0])} />
        {busy && <span style={{ color: "#666", fontSize: "13px" }}>جارٍ الرفع...</span>}
      </div>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="رابط الصورة أو اسم الملف" style={inp} />
    </div>
  );
}

function Field({ k, value, onChange }: { k: string; value: any; onChange: (v: any) => void }) {
  // string / number
  if (typeof value === "string" || typeof value === "number") {
    if (k === "image") return <Row k={k}><ImageField value={String(value)} onChange={onChange} /></Row>;
    const long = LONG.includes(k) || (typeof value === "string" && (value.length > 60 || value.includes("\n")));
    return (
      <Row k={k}>
        {long ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} style={inp} />
        )}
      </Row>
    );
  }

  // array
  if (Array.isArray(value)) {
    const isStrings = value.every((x) => typeof x === "string");
    const addItem = () => {
      const template = value.length ? clone(value[0]) : isStrings ? "" : {};
      onChange([...value, template]);
    };
    return (
      <div style={{ marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <strong style={{ color: "var(--navy)" }}>{lbl(k)} ({value.length})</strong>
          <button onClick={addItem} style={miniBtn("#1e7e34")}>+ إضافة عنصر</button>
        </div>
        {value.map((item, i) => (
          <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", marginBottom: "10px", background: "#fafbfc" }}>
            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", marginBottom: "8px" }}>
              <button onClick={() => { const a = clone(value); a.splice(i + 1, 0, clone(item)); onChange(a); }} style={miniBtn("#2e75b6")}>تكرار</button>
              <button onClick={() => onChange(value.filter((_, j) => j !== i))} style={miniBtn("#b91c1c")}>حذف</button>
            </div>
            {isStrings ? (
              <input value={item} onChange={(e) => { const a = [...value]; a[i] = e.target.value; onChange(a); }} style={inp} />
            ) : (
              Object.keys(item).map((ck) => (
                <Field key={ck} k={ck} value={item[ck]} onChange={(nv) => { const a = clone(value); a[i][ck] = nv; onChange(a); }} />
              ))
            )}
          </div>
        ))}
      </div>
    );
  }

  // object
  if (value && typeof value === "object") {
    return (
      <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "18px" }}>
        <legend style={{ color: "var(--navy)", fontWeight: 700, padding: "0 8px" }}>{lbl(k)}</legend>
        {Object.keys(value).map((ck) => (
          <Field key={ck} k={ck} value={value[ck]} onChange={(nv) => onChange({ ...value, [ck]: nv })} />
        ))}
      </fieldset>
    );
  }

  return null;
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#444", fontSize: "14px" }}>{lbl(k)}</label>
      {children}
    </div>
  );
}

export default function AdminContent() {
  const [page, setPage] = useState("home");
  const [data, setData] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const merge = (def: any, saved: any): any => {
    if (saved === undefined || saved === null) return clone(def);
    if (Array.isArray(def) || Array.isArray(saved)) return clone(saved);
    if (typeof def === "object" && typeof saved === "object") {
      const o: any = { ...def };
      for (const k of Object.keys(saved)) o[k] = merge(def[k], saved[k]);
      return clone(o);
    }
    return saved;
  };

  const load = (p: string) => {
    setData(null);
    setMsg("");
    fetch(`${API_BASE}/api/content/${p}`)
      .then((r) => r.json())
      .then((d) => setData(merge(contentDefaults[p] || {}, d.data)))
      .catch(() => setData(clone(contentDefaults[p] || {})));
  };
  useEffect(() => load(page), [page]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/content/${page}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ data }),
      });
      const d = await res.json();
      setMsg(d.success ? "تم الحفظ ✅" : d.message || "تعذّر الحفظ");
    } catch {
      setMsg("تعذّر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    if (confirm("استعادة المحتوى الافتراضي لهذه الصفحة؟ (لن يُحفظ إلا بعد الضغط على حفظ)")) {
      setData(clone(contentDefaults[page] || {}));
    }
  };

  return (
    <div style={{ maxWidth: "760px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "18px" }}>محتوى الصفحات</h1>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "22px", flexWrap: "wrap" }}>
        <label>الصفحة:</label>
        <select value={page} onChange={(e) => setPage(e.target.value)} style={{ ...inp, width: "auto" }}>
          {PAGES.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
        <button onClick={resetDefaults} style={miniBtn("#64748b")}>استعادة الافتراضي</button>
      </div>

      {!data ? (
        <p style={{ color: "#666" }}>جارٍ التحميل...</p>
      ) : (
        <>
          {Object.keys(data).map((k) => (
            <Field key={k} k={k} value={data[k]} onChange={(nv) => setData({ ...data, [k]: nv })} />
          ))}

          <div style={{ position: "sticky", bottom: 0, background: "var(--background)", paddingTop: "12px", display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={save} disabled={saving} style={{ background: "var(--mid)", color: "white", border: "none", padding: "12px 30px", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer", fontSize: "16px", fontFamily: "inherit" }}>
              {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </button>
            {msg && <span style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b" }}>{msg}</span>}
          </div>
        </>
      )}
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px" };
function miniBtn(bg: string): React.CSSProperties {
  return { background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" };
}
