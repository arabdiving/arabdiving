"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

/*
  تغيير كلمة المرور — إلزامي عند أول دخول للحسابات التي أنشأتها الإدارة
  (mustChangePassword = true)، ومتاح اختياريًا لأي عضو.
*/

const glass: React.CSSProperties = {
  background: "var(--glass-bg,rgba(8,20,48,0.78))",
  border: "1px solid var(--glass-border,rgba(255,255,255,0.08))",
  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
};
const field: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff", borderRadius: "11px", padding: "12px", fontFamily: "inherit",
  fontSize: "15px", width: "100%", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12.5px",
  fontWeight: 700, marginBottom: "6px",
};

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [forced, setForced] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // لا بد من تسجيل الدخول لتغيير كلمة المرور
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setForced(!!u.mustChangePassword);
    } catch {}
    // المصدر الموثوق هو الخادم — نزامن العلم منه (يمنع بقاءه بعد التغيير أو ضياعه)
    fetch(`${API_BASE}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.user) return;
        setForced(!!d.user.mustChangePassword);
        try {
          const u = JSON.parse(localStorage.getItem("user") || "{}");
          if (d.user.mustChangePassword) u.mustChangePassword = true;
          else delete u.mustChangePassword;
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
      })
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (next.length < 6) { setErr("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"); return; }
    if (next !== confirm) { setErr("كلمتا المرور غير متطابقتين"); return; }

    setBusy(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const d = await res.json();
      if (d.success) {
        setMsg("تم تغيير كلمة المرور بنجاح ✅ — جارٍ التحويل...");
        try {
          const u = JSON.parse(localStorage.getItem("user") || "{}");
          delete u.mustChangePassword;
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
        setTimeout(() => { window.location.href = "/profile"; }, 1200);
      } else setErr(d.message || "تعذّر التغيير");
    } catch { setErr("تعذّر الاتصال بالخادم"); }
    finally { setBusy(false); }
  };

  return (
    <main style={{ background: "var(--bg-deep,#040d1a)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ ...glass, borderRadius: "18px", padding: "30px", maxWidth: "460px", width: "100%" }}>
        <div style={{ fontSize: "40px", textAlign: "center", marginBottom: "8px" }}>🔑</div>
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>
          {forced ? "غيّر كلمة المرور المؤقتة" : "تغيير كلمة المرور"}
        </h1>

        {forced && (
          <p style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "12px", padding: "12px 14px", color: "#fbbf24", fontSize: "13px", lineHeight: 1.8, marginBottom: "18px" }}>
            ⚠️ حسابك أُنشئ بكلمة مرور مؤقتة من الإدارة. اختر كلمة مرور خاصة بك الآن لحماية حسابك.
          </p>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={lbl}>{forced ? "كلمة المرور المؤقتة (من رسالة البريد)" : "كلمة المرور الحالية"}</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required style={field} dir="ltr" />
          </div>
          <div>
            <label style={lbl}>كلمة المرور الجديدة</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={6} placeholder="6 أحرف على الأقل" style={field} dir="ltr" />
          </div>
          <div>
            <label style={lbl}>تأكيد كلمة المرور الجديدة</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={field} dir="ltr" />
          </div>

          {err && <p style={{ color: "#f87171", fontSize: "13.5px", margin: 0 }}>{err}</p>}
          {msg && <p style={{ color: "#34d399", fontSize: "13.5px", margin: 0 }}>{msg}</p>}

          <button type="submit" disabled={busy}
            style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 800, cursor: busy ? "default" : "pointer", fontFamily: "inherit", opacity: busy ? 0.6 : 1 }}>
            {busy ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
          </button>
        </form>

        {!forced && (
          <p style={{ textAlign: "center", marginTop: "16px" }}>
            <Link href="/profile" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>← العودة لملفي</Link>
          </p>
        )}
      </div>
    </main>
  );
}
