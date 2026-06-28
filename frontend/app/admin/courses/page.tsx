"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";
import { CURRENCIES, symbolOf } from "@/app/lib/currency";

const LEVELS = [
  { v: "try", l: "جرّب الغوص" }, { v: "open_water", l: "مبتدئ (Open Water)" }, { v: "advanced", l: "متقدّم" },
  { v: "rescue", l: "إنقاذ" }, { v: "divemaster", l: "احترافي (Divemaster)" }, { v: "specialty", l: "تخصص" },
  { v: "freediving", l: "غوص حر" }, { v: "kids", l: "أطفال" },
];
interface Course { _id?: string; title: string; level: string; agency: string; price: number; currency: string; duration: string; description: string; includes: string[]; image: string; images: string[]; order: number; active: boolean; }
const empty: Course = { title: "", level: "open_water", agency: "PADI", price: 0, currency: "SAR", duration: "", description: "", includes: [], image: "", images: [], order: 0, active: true };

export default function AdminCourses() {
  const [items, setItems] = useState<Course[]>([]);
  const [form, setForm] = useState<Course>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => fetch(`${API_BASE}/api/courses`).then((r) => r.json()).then((d) => setItems(d.data || [])).catch(() => setMsg("تعذّر التحميل"));
  useEffect(() => { load(); }, []);

  const startEdit = (c: any) => { setEditingId(c._id); setForm({ ...empty, ...c, images: c.images || [], includes: c.includes || [] }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setEditingId(null); setForm({ ...empty }); };
  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    try { for (const file of Array.from(files)) { const fd = new FormData(); fd.append("image", file); const res = await fetch(`${API_BASE}/api/admin/upload`, { method: "POST", headers: authHeaders(false), body: fd }); const d = await res.json(); if (d.success) setForm((f) => ({ ...f, images: [...f.images, d.url] })); } } finally { setBusy(false); }
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const url = editingId ? `${API_BASE}/api/courses/${editingId}` : `${API_BASE}/api/courses`;
    const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: authHeaders(), body: JSON.stringify({ ...form, price: Number(form.price), order: Number(form.order), image: form.images[0] || "" }) });
    const d = await res.json();
    if (d.success) { setMsg(editingId ? "تم التحديث ✅" : "تمت الإضافة ✅"); reset(); load(); } else setMsg(d.message || "تعذّر الحفظ");
  };
  const remove = async (id?: string) => { if (!id || !confirm("حذف الدورة؟")) return; await fetch(`${API_BASE}/api/courses/${id}`, { method: "DELETE", headers: authHeaders() }); load(); };
  const seed = async () => { if (!confirm("استيراد سلّم الدورات القياسي؟")) return; const res = await fetch(`${API_BASE}/api/courses/seed-defaults`, { method: "POST", headers: authHeaders() }); const d = await res.json(); if (d.success) { setMsg(`تم ✅ (${d.created} جديد، ${d.skipped} موجود)`); load(); } else setMsg(d.message || "تعذّر"); };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "16px" }}>الدورات</h1>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      <form onSubmit={save} style={{ background: "white", borderRadius: "14px", padding: "22px", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "16px" }}>{editingId ? "تعديل دورة" : "إضافة دورة"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))", gap: "12px" }}>
          <F l="العنوان"><input style={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></F>
          <F l="المستوى"><select style={inp} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>{LEVELS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select></F>
          <F l="المنظمة"><select style={inp} value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })}><option>PADI</option><option>SSI</option><option>CMAS</option></select></F>
          <F l="السعر"><input style={inp} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></F>
          <F l="العملة"><select style={inp} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}</select></F>
          <F l="المدة"><input style={inp} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3-4 أيام" /></F>
          <F l="الترتيب"><input style={inp} type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></F>
        </div>
        <F l="الوصف"><textarea style={{ ...inp, resize: "vertical" }} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
        <F l="يشمل (سطر لكل بند)"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.includes.join("\n")} onChange={(e) => setForm({ ...form, includes: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} /></F>
        <F l="صورة"><input type="file" accept="image/*" onChange={(e) => uploadFiles(e.target.files)} />{busy && <span style={{ color: "#666", fontSize: "13px", marginInlineStart: "8px" }}>جارٍ الرفع...</span>}{form.images[0] && (/* eslint-disable-next-line @next/next/no-img-element */<img src={/^https?:\/\//.test(form.images[0]) ? form.images[0] : `/images/${form.images[0]}`} alt="" style={{ display: "block", width: "120px", height: "70px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />)}</F>
        <label style={{ display: "flex", gap: "6px", alignItems: "center", color: "#444", margin: "6px 0" }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> منشورة</label>
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>{editingId ? "حفظ" : "إضافة"}</button>
          {editingId && <button type="button" onClick={reset} style={{ background: "#64748b", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>}
        </div>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ color: "var(--navy)", fontSize: "20px" }}>كل الدورات ({items.length})</h2>
        {items.length === 0 && <button onClick={seed} style={{ background: "#1e7e34", color: "white", border: "none", padding: "10px 18px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit" }}>استيراد سلّم الدورات القياسي</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: "14px" }}>
        {items.map((c: any) => (
          <div key={c._id} style={{ background: "white", borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
            <strong style={{ color: "var(--navy)" }}>{c.title}</strong>
            <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>{c.agency} · {c.price}{symbolOf(c.currency)} · {c.duration || "—"} {c.active ? "" : "· (مخفية)"}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => startEdit(c)} style={mini("#2e75b6")}>تعديل</button>
              <button onClick={() => remove(c._id)} style={mini("#b91c1c")}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function F({ l, children }: { l: string; children: React.ReactNode }) { return <div style={{ marginBottom: "12px" }}><label style={{ display: "block", marginBottom: "5px", color: "#444", fontSize: "14px" }}>{l}</label>{children}</div>; }
const inp: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box" };
function mini(bg: string): React.CSSProperties { return { background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }; }
