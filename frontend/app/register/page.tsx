"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("تم إنشاء حسابك بنجاح ✅ سيتم تحويلك لتسجيل الدخول...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setError(data.message || "تعذّر إنشاء الحساب");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #d4dae3",
    fontFamily: "inherit",
  } as const;

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "var(--navy)",
  } as const;

  return (
    <div style={{ maxWidth: "440px", margin: "60px auto", padding: "0 20px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "40px 34px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
        }}
      >
        <h1 style={{ color: "var(--navy)", fontSize: "30px", marginBottom: "8px" }}>
          إنشاء حساب جديد
        </h1>
        <p style={{ color: "#666", marginBottom: "26px" }}>
          انضم إلى مجتمع الغواصين العرب
        </p>

        <form onSubmit={handleRegister}>
          <label style={labelStyle}>الاسم</label>
          <input
            type="text"
            placeholder="اسمك الكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>البريد الإلكتروني</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>كلمة المرور</label>
          <input
            type="password"
            placeholder="6 أحرف على الأقل"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: "24px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "var(--mid)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#c0392b", marginTop: "16px", textAlign: "center" }}>
            {error}
          </p>
        )}
        {message && (
          <p style={{ color: "#1e7e34", marginTop: "16px", textAlign: "center" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "22px", textAlign: "center", color: "#666" }}>
          لديك حساب بالفعل؟{" "}
          <Link href="/login" style={{ color: "var(--mid)", fontWeight: 600 }}>
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
