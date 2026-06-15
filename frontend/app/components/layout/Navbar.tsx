"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CurrentUser {
  name?: string;
  role?: string;
}

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/dive-sites", label: "مواقع الغوص" },
  { href: "/trips", label: "الرحلات" },
  { href: "/community", label: "المجتمع" },
  { href: "/youth", label: "الشباب" },
  { href: "/women", label: "النساء" },
  { href: "/kids", label: "الأطفال" },
  { href: "/members", label: "الأعضاء" },
  { href: "/logbook", label: "اللوج بوك" },
];

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const linkStyle = { color: "white", fontSize: "15px" } as const;

  return (
    <nav
      style={{
        background: "#0B2C59",
        color: "white",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <Link href="/" style={{ fontSize: "22px", fontWeight: "bold", color: "white" }}>
        ArabDiving
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href} style={linkStyle}>
            {l.label}
          </Link>
        ))}
        {user && (
          <Link href="/profile" style={linkStyle}>
            ملفي الشخصي
          </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link href="/login" style={linkStyle}>
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              style={{
                background: "#c9952a",
                color: "white",
                padding: "9px 18px",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            >
              انضم الآن
            </Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: "15px" }}>👋 {user.name}</span>
            {user.role === "admin" && (
              <Link href="/admin" style={linkStyle}>
                لوحة الإدارة
              </Link>
            )}
            <button
              onClick={logout}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.6)",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontFamily: "inherit",
              }}
            >
              تسجيل الخروج
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
