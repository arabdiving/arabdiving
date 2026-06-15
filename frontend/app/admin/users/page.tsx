"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

interface U {
  _id: string;
  name: string;
  email: string;
  role: string;
  country?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<U[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });

  const load = () => {
    fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .catch(() => setMsg("تعذّر تحميل المستخدمين"));
  };
  useEffect(load, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (d.success) {
      setForm({ name: "", email: "", password: "", role: "member" });
      setMsg("تمت إضافة المستخدم ✅");
      load();
    } else setMsg(d.message || "تعذّرت الإضافة");
  };

  const remove = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    const res = await fetch(`${API_BASE}/api/admin/users/${id}`, { method: "DELETE", headers: authHeaders() });
    const d = await res.json();
    if (d.success) load();
    else setMsg(d.message || "تعذّر الحذف");
  };

  const setRole = async (id: string, role: string) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ role }),
    });
    const d = await res.json();
    if (d.success) load();
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

      <div style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
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
    </div>
  );
}

function btn(bg: string): React.CSSProperties {
  return { background: bg, color: "white", border: "none", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" };
}
