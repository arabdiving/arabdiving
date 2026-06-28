"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { CURRENCIES, symbolOf } from "@/app/lib/currency";

const empty = { name: "", description: "", price: 0, currency: "USD", images: [] as string[], features: [] as string[], sizeType: "none", sizes: [] as string[], inStock: true, active: true };

export default function MyStorePage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [center, setCenter] = useState<any>(null);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const H: any = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const HF: any = token ? { Authorization: `Bearer ${token}` } : {};

  const loadProducts = () => fetch(`${API_BASE}/api/store/me/products`, { headers: HF }).then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});
  const loadOrders = () => fetch(`${API_BASE}/api/store/me/orders`, { headers: HF }).then((r) => r.json()).then((d) => setOrders(d.orders || [])).catch(() => {});

  useEffect(() => {
    if (!token) { setAuthed(false); return; }
    setAuthed(true);
    fetch(`${API_BASE}/api/store/me/center`, { headers: HF }).then((r) => r.json()).then((d) => setCenter(d.center || null)).catch(() => {});
    loadProducts(); loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append("image", file);
        const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", headers: HF, body: fd });
        const d = await res.json();
        if (d.success && d.url) setForm((f: any) => ({ ...f, images: [...f.images, d.url] }));
        else setMsg(d.message || "تعذّر رفع الصورة");
      }
    } finally { setBusy(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const url = editingId ? `${API_BASE}/api/store/me/products/${editingId}` : `${API_BASE}/api/store/me/products`;
    const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: H, body: JSON.stringify({ ...form, price: Number(form.price), image: form.images[0] || "" }) });
    const d = await res.json();
    if (d.success) { setMsg("تم الحفظ ✅"); setForm(empty); setEditingId(null); loadProducts(); } else setMsg(d.message || "تعذّر الحفظ");
  };
  const edit = (p: any) => { setEditingId(p._id); setForm({ name: p.name, description: p.description || "", price: p.price || 0, currency: p.currency || "USD", images: p.images || [], features: p.features || [], sizeType: p.sizeType || "none", sizes: p.sizes || [], inStock: p.inStock !== false, active: p.active !== false }); window.scrollTo({ top: 0 }); };
  const del = async (id: string) => { if (!confirm("حذف المنتج؟")) return; await fetch(`${API_BASE}/api/store/me/products/${id}`, { method: "DELETE", headers: HF }); loadProducts(); };

  if (authed === false) return <Center><div style={{ fontSize: "48px" }}>🏪</div><h1 style={{ color: "var(--navy)" }}>متجري</h1><p style={{ color: "#666", margin: "10px 0 18px" }}>سجّل الدخول للوصول إلى لوحة متجرك.</p><Link href="/login" style={btnGold}>تسجيل الدخول</Link></Center>;
  if (authed && center === null) return <Center><div style={{ fontSize: "48px" }}>🏪</div><h1 style={{ color: "var(--navy)" }}>متجري</h1><p style={{ color: "#666", marginTop: "10px", lineHeight: 1.8 }}>لا يوجد متجر مرتبط بحسابك بعد.<br />تواصل مع إدارة ArabDiving لإنشاء متجرك الخاص وربطه بحسابك.</p></Center>;

  const inp: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit", fontSize: "14px", boxSizing: "border-box" };

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "clamp(20px,4vw,40px) 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
        <h1 style={{ color: "var(--navy)" }}>🏪 {center?.name || "متجري"}</h1>
        {center?.slug && <Link href={`/store/${center.slug}`} style={{ color: "var(--mid)", fontSize: "14px" }}>عرض صفحة متجري ←</Link>}
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button onClick={() => setTab("products")} style={tabBtn(tab === "products")}>المنتجات ({products.length})</button>
        <button onClick={() => setTab("orders")} style={tabBtn(tab === "orders")}>الطلبات ({orders.length})</button>
      </div>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {tab === "products" ? (
        <>
          <form onSubmit={save} style={{ background: "white", borderRadius: "14px", padding: "20px", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <h3 style={{ color: "var(--navy)", marginBottom: "14px" }}>{editingId ? "تعديل منتج" : "إضافة منتج"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px" }}>
              <input style={inp} placeholder="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input style={inp} type="number" placeholder="السعر" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <select style={inp} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</select>
              <select style={inp} value={form.sizeType} onChange={(e) => setForm({ ...form, sizeType: e.target.value })}><option value="none">بدون مقاسات</option><option value="letters">أحرف</option><option value="numbers">أرقام</option></select>
            </div>
            <textarea style={{ ...inp, marginTop: "12px", resize: "vertical" }} rows={2} placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input style={{ ...inp, marginTop: "12px" }} placeholder="المقاسات مفصولة بفاصلة (مثال: S, M, L أو 30, 32)" value={form.sizes.join(", ")} onChange={(e) => setForm({ ...form, sizes: e.target.value.split(",").map((x: string) => x.trim()).filter(Boolean) })} disabled={form.sizeType === "none"} />
            <textarea style={{ ...inp, marginTop: "12px", resize: "vertical" }} rows={2} placeholder="المواصفات (سطر لكل ميزة)" value={form.features.join("\n")} onChange={(e) => setForm({ ...form, features: e.target.value.split("\n").map((x: string) => x.trim()).filter(Boolean) })} />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px", alignItems: "center" }}>
              {form.images.map((u: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={/^https?:\/\//.test(u) ? u : `/images/${u}`} alt="" style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
              ))}
              <input type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files)} />
              {busy && <span style={{ color: "#666", fontSize: "13px" }}>جارٍ الرفع...</span>}
            </div>
            <label style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "12px", color: "#444" }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> منشور في المتجر</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button type="submit" style={btnMid}>{editingId ? "حفظ" : "إضافة"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} style={{ ...btnMid, background: "#64748b" }}>إلغاء</button>}
            </div>
          </form>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "14px" }}>
            {products.map((p) => (
              <div key={p._id} style={{ background: "white", borderRadius: "12px", padding: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
                <strong style={{ color: "var(--navy)" }}>{p.name}</strong>
                <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>{p.price}{symbolOf(p.currency)} {p.sizes?.length ? "· " + p.sizes.join("/") : ""} {p.active ? "" : "· (مخفي)"}</p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => edit(p)} style={miniBtn("#2e75b6")}>تعديل</button>
                  <button onClick={() => del(p._id)} style={miniBtn("#b91c1c")}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {orders.length === 0 ? <p style={{ color: "#888" }}>لا توجد طلبات بعد.</p> : orders.map((b) => (
            <div key={b._id} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                <strong style={{ color: "var(--navy)" }}>{b.ticketCode}</strong>
                <span style={{ color: "#666", fontSize: "13px" }}>{new Date(b.createdAt).toLocaleString("ar-EG")}</span>
              </div>
              <div style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>👤 {b.contact?.name} · 📞 {b.contact?.phone} · 📅 {b.date || "—"} · 👥 {b.peopleCount} · 💰 {b.displayTotal || b.total} {b.displayCurrency || ""}</div>
              <div style={{ color: "#0d6cb0", fontSize: "13px", marginTop: "4px" }}>التواصل المفضّل: {b.contactMethod === "phone" ? "مكالمة" : b.contactMethod === "email" ? "بريد" : "واتساب"}{b.bestCallTime ? " · " + b.bestCallTime : ""}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function Center({ children }: { children: React.ReactNode }) { return <main style={{ maxWidth: "520px", margin: "60px auto", padding: "0 20px", textAlign: "center" }}>{children}</main>; }
const btnGold: React.CSSProperties = { background: "var(--gold)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: 700 };
const btnMid: React.CSSProperties = { background: "var(--mid)", color: "white", border: "none", padding: "11px 24px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 };
function tabBtn(active: boolean): React.CSSProperties { return { background: active ? "var(--navy)" : "#eef2f6", color: active ? "white" : "#444", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }; }
function miniBtn(bg: string): React.CSSProperties { return { background: bg, color: "white", border: "none", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }; }
