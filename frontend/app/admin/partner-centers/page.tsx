"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";
import { CURRENCIES } from "@/app/lib/currency";

type Badges = {
  womenStaff: boolean; privateTrip: boolean; family: boolean;
  separateFacilities: boolean; sanitizedGear: boolean; technical: boolean; ecoFriendly: boolean;
};
interface Center {
  _id?: string;
  name: string; country: string; city: string; description: string;
  image: string; images: string[];
  rating: number; reviewsCount: number;
  priceFrom: number; currency: string;
  whatsapp: string; tier: string; active: boolean; slug: string; ownerEmail: string;
  featuredProducts?: string[]; featuredCourses?: string[];
  badges: Badges;
}

const BADGE_LABELS: { key: keyof Badges; label: string; emoji: string }[] = [
  { key: "womenStaff", label: "طاقم نسائي", emoji: "🧕" },
  { key: "privateTrip", label: "رحلة خاصة", emoji: "🛥️" },
  { key: "family", label: "معتمد للعائلات", emoji: "👨‍👩‍👧‍👦" },
  { key: "separateFacilities", label: "مرافق مستقلة", emoji: "🚿" },
  { key: "sanitizedGear", label: "معدات معقّمة", emoji: "✨" },
  { key: "technical", label: "غوص تقني", emoji: "⚙️" },
  { key: "ecoFriendly", label: "صديق للبيئة", emoji: "🪸" },
];

const emptyBadges: Badges = { womenStaff: false, privateTrip: false, family: false, separateFacilities: false, sanitizedGear: false, technical: false, ecoFriendly: false };
const empty: Center = { name: "", country: "مصر", city: "", description: "", image: "", images: [], rating: 0, reviewsCount: 0, priceFrom: 0, currency: "$", whatsapp: "", tier: "silver", active: true, slug: "", ownerEmail: "", featuredProducts: [], featuredCourses: [], badges: { ...emptyBadges } };

const resolve = (u: string) => (u ? (/^https?:\/\//.test(u) ? u : `/images/${u}`) : "");

export default function AdminPartnerCenters() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/products?all=true`).then((r) => r.json()).then((d) => setAllProducts(d.data || [])).catch(() => {});
    fetch(`${API_BASE}/api/courses`).then((r) => r.json()).then((d) => setAllCourses(d.data || [])).catch(() => {});
  }, []);
  const [form, setForm] = useState<Center>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  // المفتاح العام: السماح بالتواصل المباشر (مدربون + مراكز)
  const [directContact, setDirectContact] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json())
      .then((d) => setDirectContact(d.settings?.directContactEnabled !== false)).catch(() => {});
  }, []);
  const toggleDirectContact = async () => {
    const next = !directContact;
    setDirectContact(next);
    const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ directContactEnabled: next }) });
    const d = await res.json();
    if (!d.success) { setDirectContact(!next); setMsg(d.message || "تعذّر الحفظ"); }
    else setMsg(next ? "التواصل المباشر مفعّل ✅" : "التواصل المباشر موقوف — تُخفى أرقام الواتساب من كل الصفحات العامة ✅");
  };

  const load = () => {
    fetch(`${API_BASE}/api/partner-centers?all=true`)
      .then((r) => r.json())
      .then((d) => setCenters(d.data || []))
      .catch(() => setMsg("تعذّر تحميل المراكز"));
  };
  useEffect(load, []);

  const startEdit = (c: any) => {
    setEditingId(c._id || null);
    const imgs: string[] = c.images && c.images.length ? c.images : c.image ? [c.image] : [];
    setForm({
      name: c.name, country: c.country || "مصر", city: c.city || "", description: c.description || "",
      image: imgs[0] || "", images: imgs, rating: c.rating || 0, reviewsCount: c.reviewsCount || 0,
      priceFrom: c.priceFrom || 0, currency: c.currency || "$", whatsapp: c.whatsapp || "", slug: c.slug || "", ownerEmail: "",
      tier: c.tier || "silver", active: c.active !== false, featuredProducts: (c.featuredProducts || []).map((x: any) => String(x)), featuredCourses: (c.featuredCourses || []).map((x: any) => String(x)), badges: { ...emptyBadges, ...(c.badges || {}) },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => { setEditingId(null); setForm({ ...empty, badges: { ...emptyBadges } }); };

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
    } finally { setBusy(false); }
  };

  const removeImage = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }));
  const moveFirst = (i: number) => setForm((f) => { const arr = [...f.images]; const [x] = arr.splice(i, 1); arr.unshift(x); return { ...f, images: arr }; });
  const toggleBadge = (k: keyof Badges) => setForm((f) => ({ ...f, badges: { ...f.badges, [k]: !f.badges[k] } }));
  const featChip = (on: boolean): React.CSSProperties => ({ background: on ? "#c9952a" : "#fff", color: on ? "#fff" : "#92400e", border: "1px solid #fcd34d", borderRadius: "18px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: "12.5px", fontWeight: on ? 700 : 500 });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const url = editingId ? `${API_BASE}/api/admin/partner-centers/${editingId}` : `${API_BASE}/api/admin/partner-centers`;
    const method = editingId ? "PUT" : "POST";
    const payload: any = { ...form, priceFrom: Number(form.priceFrom), rating: Number(form.rating), reviewsCount: Number(form.reviewsCount), image: form.images[0] || form.image || "" };
    if (!payload.ownerEmail) delete payload.ownerEmail;
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
    const d = await res.json();
    if (d.success) { setMsg(editingId ? "تم تحديث المركز ✅" : "تمت إضافة المركز ✅"); reset(); load(); }
    else setMsg(d.message || "تعذّر الحفظ");
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("حذف هذا المركز؟")) return;
    await fetch(`${API_BASE}/api/admin/partner-centers/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
  };

  const toggleActive = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/partner-centers/${id}/toggle-active`, { method: "PATCH", headers: authHeaders() });
    const d = await res.json();
    if (d.success) setCenters((prev) => prev.map((c: any) => c._id === id ? { ...c, active: d.active } : c));
  };

  const toggleFeatured = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/partner-centers/${id}/toggle-featured`, {
      method: "PATCH", headers: authHeaders(),
    });
    const d = await res.json();
    if (d.success) {
      setCenters((prev) => prev.map((c: any) => c._id === id ? { ...c, featuredOnHome: d.featuredOnHome } : c));
      // Bust ISR cache so homepage shows updated centers immediately
      await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
    }
  };

  const seed = async () => {
    if (!confirm("استيراد مراكز تجريبية للبدء؟ (لن تتكرّر الموجودة)")) return;
    const res = await fetch(`${API_BASE}/api/admin/partner-centers/seed-defaults`, { method: "POST", headers: authHeaders() });
    const d = await res.json();
    if (d.success) { setMsg(`تم الاستيراد ✅ (${d.created} جديد، ${d.skipped} موجود)`); load(); }
    else setMsg(d.message || "تعذّر الاستيراد");
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "18px" }}>المراكز الشريكة</h1>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {/* المفتاح العام للتواصل المباشر */}
      <div style={{ background: directContact ? "#ecf7f0" : "#fef2f2", border: `1px solid ${directContact ? "#b7e4c7" : "#fecaca"}`, borderRadius: "14px", padding: "16px 18px", marginBottom: "22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <strong style={{ color: "var(--navy)", fontSize: "15px" }}>📞 التواصل المباشر (مدربون + مراكز)</strong>
          <p style={{ color: "#666", fontSize: "13px", margin: "4px 0 0", lineHeight: 1.7 }}>
            {directContact
              ? "مفعّل — أرقام الواتساب تظهر لمن اختار إظهارها (وسيلة جذب الآن)."
              : "موقوف — كل أرقام الواتساب مخفية من الصفحات العامة، والتواصل يمر عبر المنصة فقط."}
          </p>
        </div>
        <button type="button" onClick={toggleDirectContact}
          style={{ background: directContact ? "#059669" : "#b91c1c", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {directContact ? "إيقاف التواصل المباشر" : "تفعيل التواصل المباشر"}
        </button>
      </div>

      <form onSubmit={save} style={{ background: "white", borderRadius: "14px", padding: "22px", marginBottom: "28px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "16px" }}>{editingId ? "تعديل مركز" : "إضافة مركز جديد"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" }}>
          <Field label="اسم المركز"><input style={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="المدينة"><input style={inp} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="الغردقة / شرم الشيخ ..." /></Field>
          <Field label="الدولة"><input style={inp} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="السعر يبدأ من"><input style={inp} type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: Number(e.target.value) })} /></Field>
          <Field label="العملة (أساس السعر)"><select style={inp} value={/^[A-Z]{3}$/.test(form.currency) ? form.currency : "USD"} onChange={(e) => setForm({ ...form, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</select></Field>
          <Field label="التقييم (0-5)"><input style={inp} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
          <Field label="عدد التقييمات"><input style={inp} type="number" value={form.reviewsCount} onChange={(e) => setForm({ ...form, reviewsCount: Number(e.target.value) })} /></Field>
          <Field label="واتساب (للحجز)"><input style={inp} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="مثال: 20100..." /></Field>
          <Field label="رابط المتجر (slug) — يظهر كـ /store/الاسم"><input style={inp} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/\s+/g, "-").toLowerCase() })} placeholder="مثال: arabdive-store" /></Field>
          <Field label="بريد مالك المتجر (يربط حسابه)"><input style={inp} type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} placeholder="اتركه فارغًا لعدم التغيير" /></Field>
          <Field label="المستوى">
            <select style={inp} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
              <option value="silver">فضي</option>
              <option value="gold">ذهبي</option>
              <option value="platinum">بلاتيني</option>
            </select>
          </Field>
        </div>

        <Field label="الوصف"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

        <Field label="أوسمة الجودة (Trust Badges)">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {BADGE_LABELS.map((b) => {
              const on = form.badges[b.key];
              return (
                <button type="button" key={b.key} onClick={() => toggleBadge(b.key)}
                  style={{ background: on ? "rgba(46,117,182,0.15)" : "#f3f6f9", border: on ? "2px solid var(--mid)" : "1px solid #d4dae3", borderRadius: "20px", padding: "8px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", color: "#06324f" }}>
                  {b.emoji} {b.label} {on ? "✓" : ""}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="الصور (الأولى هي الرئيسية)">
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

        <label style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", color: "#444" }}>
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> نشط (يظهر للعملاء)
        </label>

        {["gold", "platinum"].includes(form.tier) && (
          <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
            <strong style={{ color: "#92400e" }}>⭐ الانتقاء المميّز (لفئة {form.tier === "platinum" ? "بلاتيني" : "ذهبي"})</strong>
            <p style={{ color: "#a16207", fontSize: "12.5px", margin: "4px 0 10px" }}>اختر منتجات وكورسات من الكتالوج تظهر على صفحة هذا الشريك (تُحفظ مع المركز).</p>
            <p style={{ color: "#92400e", fontWeight: 700, fontSize: "12.5px", marginBottom: "5px" }}>منتجات ({(form.featuredProducts || []).length}):</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
              {allProducts.map((p) => { const on = (form.featuredProducts || []).includes(String(p._id)); return <button type="button" key={p._id} onClick={() => setForm((f: any) => ({ ...f, featuredProducts: on ? (f.featuredProducts || []).filter((i: string) => i !== String(p._id)) : [...(f.featuredProducts || []), String(p._id)] }))} style={featChip(on)}>{on ? "✓ " : ""}{p.name}</button>; })}
              {allProducts.length === 0 && <span style={{ color: "#a16207", fontSize: "12.5px" }}>لا توجد منتجات.</span>}
            </div>
            <p style={{ color: "#92400e", fontWeight: 700, fontSize: "12.5px", marginBottom: "5px" }}>كورسات ({(form.featuredCourses || []).length}):</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {allCourses.map((c) => { const on = (form.featuredCourses || []).includes(String(c._id)); return <button type="button" key={c._id} onClick={() => setForm((f: any) => ({ ...f, featuredCourses: on ? (f.featuredCourses || []).filter((i: string) => i !== String(c._id)) : [...(f.featuredCourses || []), String(c._id)] }))} style={featChip(on)}>{on ? "✓ " : ""}{c.title}</button>; })}
              {allCourses.length === 0 && <span style={{ color: "#a16207", fontSize: "12.5px" }}>لا توجد كورسات.</span>}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button type="submit" style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>{editingId ? "حفظ التعديل" : "إضافة المركز"}</button>
          {editingId && <button type="button" onClick={reset} style={{ background: "#64748b", color: "white", border: "none", padding: "11px 20px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>}
        </div>
      </form>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
        <div>
          <h2 style={{ color: "var(--navy)", fontSize: "20px", margin: 0 }}>كل المراكز ({centers.length})</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0" }}>
            🏠 الظاهرة في الهوم: {centers.filter((c: any) => c.featuredOnHome).length}
          </p>
        </div>
        {centers.length === 0 && (
          <button onClick={seed} style={{ background: "#1e7e34", color: "white", border: "none", padding: "10px 18px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>استيراد مراكز تجريبية</button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {centers.map((c: any) => (
          <div key={c._id} style={{
            background: "white", borderRadius: "12px", padding: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
            border: c.featuredOnHome ? "2px solid #c9a84c" : "2px solid transparent",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <strong style={{ color: "var(--navy)", fontSize: "15px" }}>{c.name}</strong>
              {c.featuredOnHome && (
                <span style={{ background: "#fffbeb", color: "#c9a84c", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                  🏠 هوم
                </span>
              )}
            </div>
            <p style={{ color: "#666", fontSize: "13px", margin: "6px 0 4px" }}>
              📍 {c.city || "—"} · ⭐ {c.rating} · من {c.priceFrom} {c.currency}
            </p>
            <p style={{ fontSize: "16px", margin: "4px 0 10px" }}>
              {BADGE_LABELS.filter((b) => c.badges?.[b.key]).map((b) => b.emoji).join(" ")}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => startEdit(c)} style={mini("#2e75b6")}>تعديل</button>
              <button
                onClick={() => toggleFeatured(c._id)}
                style={mini(c.featuredOnHome ? "#c9a84c" : "#64748b")}
                title={c.featuredOnHome ? "إزالة من الهوم" : "عرض في الهوم"}
              >
                {c.featuredOnHome ? "🏠 في الهوم" : "⊕ عرض في الهوم"}
              </button>
              <button onClick={() => toggleActive(c._id)} style={mini(c.active === false ? "#b45309" : "#0d9488")} title={c.active === false ? "إظهار للعملاء" : "إخفاء من العملاء"}>{c.active === false ? "🙈 مخفي" : "👁️ ظاهر"}</button>
              <button onClick={() => remove(c._id)} style={mini("#b91c1c")}>حذف</button>
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
