"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { usePathname } from "next/navigation";

interface CurrentUser {
  name?: string;
  role?: string;
}

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/dive-sites", label: "مواقع الغوص" },
  { href: "/family-booking", label: "احجز رحلة" },
  { href: "/retreats", label: "باقات خاصة" },
  { href: "/trips", label: "الرحلات" },
  { href: "/guide", label: "الدليل" },
  { href: "/temperatures", label: "حرارة المياه" },
  { href: "/community", label: "المجتمع" },
  { href: "/stories", label: "القصص" },
  { href: "/youth", label: "الشباب" },
  { href: "/women", label: "النساء" },
  { href: "/kids", label: "الأطفال" },
  { href: "/members", label: "الأعضاء" },
  { href: "/logbook", label: "اللوج بوك" },
];

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const activeStyle = (href: string) => (isActive(href) ? { background: "#c9952a", color: "#0B2C59", fontWeight: 700 } : {});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setHidden(d.settings?.hiddenPages || []))
      .catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const linkStyle = { color: "white", fontSize: "15px", padding: "6px 0" } as const;

  const authArea = !user ? (
    <>
      <Link href="/login" style={linkStyle} onClick={() => setOpen(false)}>تسجيل الدخول</Link>
      <Link href="/register" onClick={() => setOpen(false)} style={{ background: "#c9952a", color: "white", padding: "9px 18px", borderRadius: "8px", fontSize: "15px", textAlign: "center" }}>انضم الآن</Link>
    </>
  ) : (
    <>
      <span style={{ fontSize: "15px" }}>👋 {user.name}</span>
      {user.role === "admin" && (
        <Link href="/admin" style={linkStyle} onClick={() => setOpen(false)}>لوحة الإدارة</Link>
      )}
      <button onClick={logout} style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontFamily: "inherit" }}>تسجيل الخروج</button>
    </>
  );

  return (
    <nav style={{ background: "#0B2C59", color: "white", padding: "14px 20px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <Link href="/" style={{ fontSize: "22px", fontWeight: "bold", color: "white" }}>ArabDiving</Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          {navLinks.filter((l) => !hidden.includes(l.href)).map((l) => (
            <Link key={l.href} href={l.href} className="nav-pill" style={{ ...linkStyle, ...activeStyle(l.href) }}>{l.label}</Link>
          ))}
          {user && <Link href="/profile" style={linkStyle}>ملفي الشخصي</Link>}
        </div>
        <div className="nav-desktop" style={{ alignItems: "center", gap: "14px" }}>{authArea}</div>

        {/* Mobile hamburger */}
        <button
          className="nav-burger"
          onClick={() => setOpen((o) => !o)}
          aria-label="القائمة"
          style={{ background: "transparent", border: "none", color: "white", fontSize: "28px", cursor: "pointer", lineHeight: 1 }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="nav-mobile-panel" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px 4px 6px", maxWidth: "1280px", margin: "0 auto" }}>
          {navLinks.filter((l) => !hidden.includes(l.href)).map((l) => (
            <Link key={l.href} href={l.href} className="nav-pill" style={{ ...linkStyle, ...activeStyle(l.href) }} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user && <Link href="/profile" style={linkStyle} onClick={() => setOpen(false)}>ملفي الشخصي</Link>}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", margin: "6px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{authArea}</div>
        </div>
      )}
    </nav>
  );
}
