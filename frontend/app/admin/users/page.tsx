"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

interface U {
  _id: string;
  name: string;
  email: string;
  role: string;
  country?: string;
  city?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<U[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [editing, setEditing] = useState<U | null>(null);
  const [edit, setEdit] = useState({ name: "", email: "", role: "member", password: "", country: "", city: "" });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const limit = 20;

  const load = (p: number) => {
    fetch(`${API_BASE}/api/admin/users?page=${p}&limit=${limit}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setPages(d.pages || 1); })
      .catch(() => setMsg("تعذّر تحميل المستخدمين"));
  };
  useEffect(() => load(page), [page]);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`${API_BASE}/api/admin/users`, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
    const d = await res.json();
    if (d.success) { setForm({ name: "", email: "", password: "", role: "member" }); setMsg("تمت إضافة المستخدم ✅"); load(page); }
    else setMsg(d.message || "تعذّرت الإضافة");
  };

  const remove = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    const res = await fetch(`${API_BASE}/api/admin/users/${id}`, { method: "DELETE", headers: authHeaders() });
    const d = await res.json();
    if (d.success) load(page); else setMsg(d.message || "تعذّر الحذف");
  };

  const setRole = async (id: string, role: string) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${id}/role`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ role }) });
    const d = await res.json();
    if (d.success) load(page); else setMsg(d.message || "تعذّر التعديل");
  };

  const startEdit = (u: U) => {
    setEditing(u);
    setEdit({ name: u.name, email: u.email, role: u.role, password: "", country: u.country || "", city: u.city || "" });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setMsg("");
    const body: any = { name: edit.name, email: edit.email, role: edit.role, country: edit.country, city: edit.city };
    if (edit.password.trim()) body.password = edit.password.trim();
    const res = await fetch(`${API_BASE}/api/admin/users/${editing._id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) });
    const d = await res.json();
    if (d.success) { setEditing(null); setMsg("تم تحديث المستخدم ✅"); load(page); }
    else setMsg(d.message || "تعذّر التعديل");
  };

  const field = { padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit" } as const;

  return (
    <div>
      <h1 style={{ color: "var(--navy)", marginBottom: "20px" }}>المستخدمون</h1>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "14px" }}>{msg}</p>}

      <form onSubmit={addUser} style={{ background: "white", padding: "20px", borderRadius: "14px", marginBottom: "26px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <strong style={{ color: "var(--navy)" }}>إضافة مستخدم:</strong>
        <input style={field} placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input style={field} type="email" placeholder="البريد" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input style={field} type="password" placeholder="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select style={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="member">عضو</option>
          <option value="admin">مشرف</option>
        </select>
        <button type="submit" style={{ background: "var(--mid)", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>إضافة</button>
      </form>

      <div style={{ background: "white", borderRadius: "14px", overflowX: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", minWidth: "520px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", color: "var(--navy)" }}>
              <th style={{ padding: "12px" }}>الاسم</th>
              <th style={{ padding: "12px" }}>البريد</th>
              <th style={{ padding: "12px" }}>الدور</th>
              <th style={{ padding: "12px" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{u.name}</td>
                <td style={{ padding: "12px", direction: "ltr", textAlign: "right" }}>{u.email}</td>
                <td style={{ padding: "12px" }}>{u.role === "admin" ? "مشرف" : "عضو"}</td>
                <td style={{ padding: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => startEdit(u)} style={btn("#0d6cb0")}>تعديل</button>
                  {u.role === "admin" ? (
                    <button onClick={() => setRole(u._id, "member")} style={btn("#64748b")}>إلغاء الإشراف</button>
                  ) : (
                    <button onClick={() => setRole(u._id, "admin")} style={btn("#2e75b6")}>ترقية لمشرف</button>
                  )}
                  <button onClick={() => remove(u._id)} style={btn("#b91c1c")}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px", marginBottom: "16px" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page <= 1 ? 0.5 : 1 }}>→ السابق</button>
          <span style={{ padding: "8px 12px", color: "var(--navy)" }}>{page} / {pages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= pages} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page >= pages ? 0.5 : 1 }}>التالي ←</button>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", width: "min(440px, 100%)" }}>
            <h3 style={{ color: "var(--navy)", marginBottom: "16px" }}>تعديل: {editing.name}</h3>
            <L label="الاسم"><input style={{ ...field, width: "100%" }} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></L>
            <L label="البريد الإلكتروني"><input style={{ ...field, width: "100%" }} type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></L>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <L label="الدولة"><input style={{ ...field, width: "100%" }} value={edit.country} onChange={(e) => setEdit({ ...edit, country: e.target.value })} /></L>
              <L label="المدينة"><input style={{ ...field, width: "100%" }} value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })} /></L>
            </div>
            <L label="الدور">
              <select style={{ ...field, width: "100%" }} value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })}>
                <option value="member">عضو</option>
                <option value="admin">مشرف</option>
              </select>
            </L>
            <L label="كلمة مرور جديدة (اتركها فارغة لعدم التغيير)"><input style={{ ...field, width: "100%" }} type="text" value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} placeholder="6 أحرف على الأقل" /></L>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button onClick={saveEdit} style={{ flex: 2, background: "var(--mid)", color: "white", border: "none", padding: "11px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>حفظ</button>
              <button onClick={() => setEditing(null)} style={{ flex: 1, background: "#e2e8f0", color: "#444", border: "none", padding: "11px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit" }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: "12px" }}><label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "5px" }}>{label}</label>{children}</div>;
}
function btn(bg: string): React.CSSProperties {
  return { background: bg, color: "white", border: "none", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" };
}
