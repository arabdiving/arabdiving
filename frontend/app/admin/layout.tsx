"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/admin", label: "لوحة المعلومات", icon: "📊" },
  { href: "/admin/content", label: "محتوى الصفحات", icon: "📝" },
  { href: "/admin/dive-sites", label: "مواقع الغوص", icon: "🤿" },
  { href: "/admin/partner-centers", label: "المراكز الشريكة", icon: "🏝️" },
  { href: "/admin/bookings", label: "الحجوزات", icon: "🎟️" },
  { href: "/admin/comments", label: "التعليقات والمنشورات", icon: "💬" },
  { href: "/admin/users", label: "المستخدمون", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      const user = u ? JSON.parse(u) : null;
      if (user?.role === "admin") setOk(true);
      else {
        setOk(false);
        window.location.href = "/login";
      }
    } catch {
      setOk(false);
      window.location.href = "/login";
    }
  }, []);

  if (ok === null) {
    return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ التحقق...</div>;
  }
  if (!ok) {
    return <div style={{ padding: "60px", textAlign: "center", color: "#c0392b" }}>هذه الصفحة للمشرفين فقط.</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "70vh", background: "var(--background)" }}>
      <aside
        style={{
          width: "240px",
          background: "#0B2C59",
          color: "white",
          padding: "26px 16px",
          flexShrink: 0,
        }}
      >
        <h2 style={{ marginBottom: "24px", fontSize: "20px" }}>لوحة الإدارة</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: "white",
                padding: "12px 14px",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            >
              <span style={{ marginInlineEnd: "8px" }}>{l.icon}</span>
              {l.label}
            </Link>
          ))}
          <Link href="/" style={{ color: "rgba(255,255,255,0.7)", padding: "12px 14px", fontSize: "14px", marginTop: "10px" }}>
            ← العودة للموقع
          </Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>{children}</main>
    </div>
  );
}
