"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";
import { difficultyAr } from "@/app/lib/labels";

interface Site {
  _id?: string;
  name: string;
  country: string;
  city: string;
  depth: number;
  difficulty: string;
  description: string;
  image: string;
}

const empty: Site = { name: "", country: "مصر", city: "", depth: 0, difficulty: "Beginner", description: "", image: "" };

export default function AdminDiveSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [form, setForm] = useState<Site>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch(`${API_BASE}/api/dive-sites`)
      .then((r) => r.json())
      .then((d) => setSites(d.data || []))
      .catch(() => setMsg("تعذّر تحميل المواقع"));
  };
  useEffect(load, []);

  const startEdit = (s: Site) => {
    setEditingId(s._id || null);
    setForm({ name: s.name, country: s.country, city: s.city || "", depth: s.depth || 0, difficulty: s.difficulty || "Beginner", description: s.description || "", image: s.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(empty);
  };

  const uploadImage = async (file: File) => {
    setBusy(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, { method: "POST", headers: authHeaders(false), body: fd });
      const d = await res.json();
      if (d.success) setForm((f) => ({ ...f, image: d.url }));
      else setMsg(d.message || "تعذّر رفع الصورة");
    } finally {
      setBusy(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const url = editingId ? `${API_BASE}/api/admin/dive-sites/${editingId}` : `${API_BASE}/api/admin/dive-sites`;
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify({ ...form, depth: Number(form.depth) }) });
    const d = await res.json();
    if (d.success) {
      setMsg(editingId ? "تم تحديث الموقع ✅" : "تمت إضافة الموقع ✅");
      reset();
      load();
    } else setMsg(d.message || "تعذّر الحفظ");
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("حذف هذا الموقع؟")) return;
    await fetch(`${API_BASE}/api/admin/dive-sites/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
  };

  const imgSrc = form.image ? (/^https?:\/\//.test(form.image) ? form.image : `/images/${form.image}`) : "";

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "18px" }}>مواقع الغوص</h1>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      <form onSubmit={save} style={{ background: "white", borderRadius: "14px", padding: "22px", marginBottom: "28px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "16px" }}>{editingId ? "تعديل موقع" : "إضافة موقع جديد"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <Field label="الاسم"><input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="الدولة"><input style={inp} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></Field>
          <Field label="المدينة / المنطقة"><input style={inp} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="العمق (متر)"><input style={inp} type="number" value={form.depth} onChange={(e) => setForm({ ...form, depth: Number(e.target.value) })} /></Field>
          <Field label="المستوى">
            <select style={inp} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="Beginner">مبتدئ</option>
              <option value="Intermediate">متوسط</option>
              <option value="Advanced">متقدّم</option>
            </select>
          </Field>
        </div>

        <Field label="الوصف"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

        <Field label="الصورة">
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt="" style={{ width: "150px", height: "95px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
          )}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept="image/*" onChange={(e) => e.target.files && uploadImage(e.target.files[0])} />
            {busy && <span style={{ color: "#666", fontSize: "13px" }}>جارٍ الرفع...</span>}
          </div>
          <input style={inp} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="رابط الصورة أو اسم الملف" />
        </Field>

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button type="submit" style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>
            {editingId ? "حفظ التعديل" : "إضافة الموقع"}
          </button>
          {editingId && <button type="button" onClick={reset} style={{ background: "#64748b", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>}
        </div>
      </form>

      <h2 style={{ color: "var(--navy)", fontSize: "20px", marginBottom: "14px" }}>كل المواقع ({sites.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {sites.map((s) => (
          <div key={s._id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
            <strong style={{ color: "var(--navy)" }}>{s.name}</strong>
            <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>📍 {s.city || "—"} · 🌊 {s.depth}م · 🎚 {difficultyAr(s.difficulty)}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button onClick={() => startEdit(s)} style={mini("#2e75b6")}>تعديل</button>
              <button onClick={() => remove(s._id)} style={mini("#b91c1c")}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#444", fontSize: "14px" }}>{label}</label>
      {children}
    </div>
  );
}
const inp: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px" };
function mini(bg: string): React.CSSProperties {
  return { background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" };
}
