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
  images: string[];
}

const empty: Site = { name: "", country: "مصر", city: "", depth: 0, difficulty: "Beginner", description: "", image: "", images: [] };

const resolve = (u: string) => (u ? (/^https?:\/\//.test(u) ? u : `/images/${u}`) : "");

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

  const startEdit = (s: any) => {
    setEditingId(s._id || null);
    const imgs: string[] = s.images && s.images.length ? s.images : s.image ? [s.image] : [];
    setForm({
      name: s.name, country: s.country, city: s.city || "", depth: s.depth || 0,
      difficulty: s.difficulty || "Beginner", description: s.description || "",
      image: imgs[0] || "", images: imgs,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(empty);
  };

  // Upload one or more files and append to the images array.
  const uploadFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch(`${API_BASE}/api/admin/upload`, { method: "POST", headers: authHeaders(false), body: fd });
        const d = await res.json();
        if (d.success) setForm((f) => ({ ...f, images: [...f.images, d.url] }));
        else setMsg(d.message || "تعذّر رفع الصورة");
      }
    } finally {
      setBusy(false);
    }
  };

  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }));

  const moveFirst = (i: number) =>
    setForm((f) => {
      const arr = [...f.images];
      const [x] = arr.splice(i, 1);
      arr.unshift(x);
      return { ...f, images: arr };
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const url = editingId ? `${API_BASE}/api/admin/dive-sites/${editingId}` : `${API_BASE}/api/admin/dive-sites`;
    const method = editingId ? "PUT" : "POST";
    const payload = { ...form, depth: Number(form.depth), image: form.images[0] || form.image || "" };
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
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

  const importDefaults = async () => {
    if (!confirm("استيراد قائمة مواقع الغوص الافتراضية (41 موقعًا)؟ لن تتكرّر المواقع الموجودة.")) return;
    setMsg("");
    const res = await fetch(`${API_BASE}/api/admin/dive-sites/seed-defaults`, { method: "POST", headers: authHeaders() });
    const d = await res.json();
    if (d.success) {
      setMsg(`تم الاستيراد ✅ (${d.created} جديد، ${d.updated} محدّث)`);
      load();
    } else setMsg(d.message || "تعذّر الاستيراد");
  };

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

        <Field label="الصور (يمكن إضافة أكثر من صورة — الأولى هي الرئيسية)">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
            {form.images.map((u, i) => (
              <div key={i} style={{ position: "relative", width: "110px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolve(u)} alt="" style={{ width: "110px", height: "75px", objectFit: "cover", borderRadius: "8px", border: i === 0 ? "2px solid var(--mid)" : "1px solid #e2e8f0" }} />
                <button type="button" onClick={() => removeImage(i)} title="حذف" style={{ position: "absolute", top: "-8px", insetInlineEnd: "-8px", background: "#b91c1c", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer" }}>✕</button>
                {i !== 0 && <button type="button" onClick={() => moveFirst(i)} style={{ width: "100%", marginTop: "3px", fontSize: "11px", background: "#64748b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", padding: "2px" }}>اجعلها الرئيسية</button>}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files)} />
            {busy && <span style={{ color: "#666", fontSize: "13px" }}>جارٍ الرفع...</span>}
          </div>
        </Field>

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button type="submit" style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>
            {editingId ? "حفظ التعديل" : "إضافة الموقع"}
          </button>
          {editingId && <button type="button" onClick={reset} style={{ background: "#64748b", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>}
        </div>
      </form>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
        <h2 style={{ color: "var(--navy)", fontSize: "20px" }}>كل المواقع ({sites.length})</h2>
        {sites.length === 0 && (
          <button onClick={importDefaults} style={{ background: "#1e7e34", color: "white", border: "none", padding: "10px 18px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>
            استيراد المواقع الافتراضية (41)
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {sites.map((s: any) => (
          <div key={s._id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
            <strong style={{ color: "var(--navy)" }}>{s.name}</strong>
            <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>📍 {s.city || "—"} · 🌊 {s.depth}م · 🎚 {difficultyAr(s.difficulty)} · 🖼️ {(s.images?.length || (s.image ? 1 : 0))}</p>
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
