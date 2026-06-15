"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/profile";
      } else {
        setMessage(data.message || "بيانات الدخول غير صحيحة");
      }
    } catch {
      setMessage("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

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
          تسجيل الدخول
        </h1>
        <p style={{ color: "#666", marginBottom: "26px" }}>
          أهلًا بعودتك إلى مجتمع ArabDiving
        </p>

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", marginBottom: "6px", color: "var(--navy)" }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              borderRadius: "10px",
              border: "1px solid #d4dae3",
              fontFamily: "inherit",
            }}
          />

          <label style={{ display: "block", marginBottom: "6px", color: "var(--navy)" }}>
            كلمة المرور
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "24px",
              borderRadius: "10px",
              border: "1px solid #d4dae3",
              fontFamily: "inherit",
            }}
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
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {message && (
          <p style={{ color: "#c0392b", marginTop: "16px", textAlign: "center" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "22px", textAlign: "center", color: "#666" }}>
          ليس لديك حساب؟{" "}
          <Link href="/register" style={{ color: "var(--mid)", fontWeight: 600 }}>
            انضم الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
