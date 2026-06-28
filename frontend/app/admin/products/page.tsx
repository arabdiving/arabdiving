"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";
import { CURRENCIES, symbolOf } from "@/app/lib/currency";

interface Product {
  _id?: string; name: string; description: string; category: string;
  price: number; currency: string; image: string; images: string[];
  features: string[]; sizeType: string; sizes: string[]; inStock: boolean; active: boolean;
}
const empty: Product = { name: "", description: "", category: "", price: 0, currency: "USD", image: "", images: [], features: [], sizeType: "none", sizes: [], inStock: true, active: true };
const resolve = (u: string) => (u ? (/^https?:\/\//.test(u) ? u : `/images/${u}`) : "");

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => fetch(`${API_BASE}/api/products`).then((r) => r.json()).then((d) => setItems(d.data || [])).catch(() => setMsg("تعذّر التحميل"));
  useEffect(() => { load(); }, []);

  const startEdit = (p: any) => {
    setEditingId(p._id);
    const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
    setForm({ name: p.name, description: p.description || "", category: p.category || "", price: p.price || 0, currency: p.currency || "USD", image: imgs[0] || "", images: imgs, features: p.features || [], sizeType: p.sizeType || "none", sizes: p.sizes || [], inStock: p.inStock !== false, active: p.active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => { setEditingId(null); setForm({ ...empty }); };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append("image", file);
        const res = await fetch(`${API_BASE}/api/admin/upload`, { method: "POST", headers: authHeaders(false), body: fd });
        const d = await res.json();
        if (d.success) setForm((f) => ({ ...f, images: [...f.images, d.url] })); else setMsg(d.message || "تعذّر الرفع");
      }
    } finally { setBusy(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const url = editingId ? `${API_BASE}/api/products/${editingId}` : `${API_BASE}/api/products`;
    const payload = { ...form, price: Number(form.price), image: form.images[0] || "" };
    const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: authHeaders(), body: JSON.stringify(payload) });
    const d = await res.json();
    if (d.success) { setMsg(editingId ? "تم التحديث ✅" : "تمت الإضافة ✅"); reset(); load(); } else setMsg(d.message || "تعذّر الحفظ");
  };
  const remove = async (id?: string) => { if (!id || !confirm("حذف المنتج؟")) return; await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE", headers: authHeaders() }); load(); };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "16px" }}>متجر المنتجات</h1>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      <form onSubmit={save} style={{ background: "white", borderRadius: "14px", padding: "22px", marginBottom: "28px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "16px" }}>{editingId ? "تعديل منتج" : "إضافة منتج"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          <F label="الاسم"><input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></F>
          <F label="التصنيف"><input style={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="نظارات / زعانف / بدلات..." /></F>
          <F label="السعر"><input style={inp} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></F>
          <F label="العملة"><select style={inp} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</select></F>
        </div>
        <F label="الوصف"><textarea style={{ ...inp, resize: "vertical" }} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
        <F label="المواصفات والخصائص (سطر لكل ميزة)"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.features.join("\n")} onChange={(e) => setForm({ ...form, features: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} placeholder="مقاوم للماء&#10;عدسة مزدوجة&#10;..." /></F>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          <F label="نوع المقاسات"><select style={inp} value={form.sizeType} onChange={(e) => setForm({ ...form, sizeType: e.target.value })}><option value="none">بدون مقاسات</option><option value="letters">أحرف (S/M/L/XL)</option><option value="numbers">أرقام (32/34/...)</option></select></F>
          <F label="المقاسات (مفصولة بفاصلة)"><input style={inp} value={form.sizes.join(", ")} onChange={(e) => setForm({ ...form, sizes: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="مثال: S, M, L أو 30, 32, 34" disabled={form.sizeType === "none"} /></F>
        </div>

        <F label="الصور (الأولى رئيسية)">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
            {form.images.map((u, i) => (
              <div key={i} style={{ position: "relative", width: "100px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolve(u)} alt="" style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "8px", border: i === 0 ? "2px solid var(--mid)" : "1px solid #e2e8f0" }} />
                <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} style={{ position: "absolute", top: "-8px", insetInlineEnd: "-8px", background: "#b91c1c", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files)} />
          {busy && <span style={{ color: "#666", fontSize: "13px", marginInlineStart: "8px" }}>جارٍ الرفع...</span>}
        </F>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", margin: "8px 0" }}>
          <label style={{ display: "flex", gap: "6px", alignItems: "center", color: "#444" }}><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> متوفّر</label>
          <label style={{ display: "flex", gap: "6px", alignItems: "center", color: "#444" }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> منشور</label>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>{editingId ? "حفظ التعديل" : "إضافة المنتج"}</button>
          {editingId && <button type="button" onClick={reset} style={{ background: "#64748b", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>}
        </div>
      </form>

      <h2 style={{ color: "var(--navy)", fontSize: "20px", marginBottom: "14px" }}>كل المنتجات ({items.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
        {items.map((p: any) => (
          <div key={p._id} style={{ background: "white", borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
            <strong style={{ color: "var(--navy)" }}>{p.name}</strong>
            <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>{p.price}{symbolOf(p.currency)} · {p.category || "—"} · {p.sizes?.length ? p.sizes.join("/") : "بلا مقاسات"} {p.active ? "" : "· (غير منشور)"}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => startEdit(p)} style={mini("#2e75b6")}>تعديل</button>
              <button onClick={() => remove(p._id)} style={mini("#b91c1c")}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) { return <div style={{ marginBottom: "12px" }}><label style={{ display: "block", marginBottom: "5px", color: "#444", fontSize: "14px" }}>{label}</label>{children}</div>; }
const inp: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box" };
function mini(bg: string): React.CSSProperties { return { background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }; }
