"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

const links = [
  { href: "/admin", label: "لوحة المعلومات", icon: "📊" },
  { href: "/admin/content", label: "محتوى الصفحات", icon: "📝" },
  { href: "/admin/theme", label: "ألوان الموقع", icon: "🎨" },
  { href: "/admin/home-cards", label: "بطاقات الرئيسية", icon: "🃏" },
  { href: "/admin/pages", label: "ظهور الصفحات", icon: "👁️" },
  { href: "/admin/menu", label: "تنظيم القائمة", icon: "🧭" },
  { href: "/admin/sections", label: "الأقسام", icon: "🗂️" },
  { href: "/admin/dive-sites", label: "مواقع الغوص", icon: "🤿" },
  { href: "/admin/partner-centers", label: "المراكز الشريكة", icon: "🏝️" },
  { href: "/admin/instructors", label: "طلبات المدربين", icon: "🧑‍🏫" },
  { href: "/admin/products", label: "متجر المنتجات", icon: "🛒" },
  { href: "/admin/courses", label: "الدورات", icon: "🎓" },
  { href: "/admin/bookings", label: "الحجوزات", icon: "🎟️" },
  { href: "/admin/messages", label: "الرسائل والتواصل", icon: "📨" },
  { href: "/admin/testimonials", label: "تجارب وشكاوى الزوار", icon: "✍️" },
  { href: "/admin/size-profiles", label: "مقاسات الأعضاء", icon: "📏" },
  { href: "/admin/comments", label: "التعليقات والمنشورات", icon: "💬" },
  { href: "/admin/users", label: "المستخدمون", icon: "👥" },
  { href: "/admin/homepage", label: "بلوكات الهوم", icon: "🏠" },
  { href: "/admin/map", label: "خريطة الموقع", icon: "🗺️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<{ pendingInstructors: number; newBookings: number; pendingTestimonials?: number; total: number }>({ pendingInstructors: 0, newBookings: 0, total: 0 });

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      const user = u ? JSON.parse(u) : null;
      if (user?.role === "admin") setOk(true);
      else { setOk(false); window.location.href = "/login"; }
    } catch {
      setOk(false); window.location.href = "/login";
    }
  }, []);

  // إشعارات الأدمن — تُحدَّث عند الدخول وكل 60 ثانية (لا تعتمد على البريد)
  useEffect(() => {
    if (!ok) return;
    const load = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch(`${API_BASE}/api/admin/notifications`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { if (d.counts) setCounts(d.counts); })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [ok]);

  // ربط الشارة بالرابط المناسب
  const badgeFor = (href: string): number =>
    href === "/admin/instructors" ? counts.pendingInstructors
    : href === "/admin/bookings" ? counts.newBookings
    : href === "/admin/testimonials" ? (counts.pendingTestimonials || 0)
    : 0;

  if (ok === null) return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ التحقق...</div>;
  if (!ok) return <div style={{ padding: "60px", textAlign: "center", color: "#c0392b" }}>هذه الصفحة للمشرفين فقط.</div>;

  return (
    <div className="admin-shell">
      <style>{`
        .admin-shell { display:flex; min-height:70vh; background:var(--background); }
        .admin-topbar { display:none; }
        .admin-side { width:240px; background:#0B2C59; color:#fff; padding:26px 16px; flex-shrink:0; }
        .admin-main { flex:1; padding:32px; overflow:auto; }
        @media (max-width: 860px) {
          .admin-shell { flex-direction:column; }
          .admin-topbar { display:flex; align-items:center; justify-content:space-between; background:#0B2C59; color:#fff; padding:14px 18px; position:sticky; top:0; z-index:30; }
          .admin-side { width:100%; padding:8px 16px 18px; display:none; }
          .admin-side.open { display:block; }
          .admin-side-title { display:none; }
          .admin-main { padding:18px; }
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="admin-topbar">
        <strong style={{ fontSize: "17px" }}>
          لوحة الإدارة
          {counts.total > 0 && <span style={{ background: "#e11d48", color: "#fff", borderRadius: "20px", fontSize: "12px", padding: "1px 8px", marginInlineStart: "8px", fontWeight: 700 }}>{counts.total}</span>}
        </strong>
        <button onClick={() => setOpen((o) => !o)} aria-label="القائمة" style={{ background: "transparent", border: "none", color: "#fff", fontSize: "26px", cursor: "pointer", lineHeight: 1 }}>{open ? "✕" : "☰"}</button>
      </div>

      <aside className={`admin-side${open ? " open" : ""}`}>
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }} className="admin-side-title">لوحة الإدارة</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {links.map((l) => {
            const n = badgeFor(l.href);
            return (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ color: "white", padding: "12px 14px", borderRadius: "10px", fontSize: "15px", display: "flex", alignItems: "center" }}>
              <span style={{ marginInlineEnd: "8px" }}>{l.icon}</span>
              <span>{l.label}</span>
              {n > 0 && <span style={{ marginInlineStart: "auto", background: "#e11d48", color: "#fff", borderRadius: "20px", fontSize: "12px", minWidth: "20px", height: "20px", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px", fontWeight: 700 }}>{n}</span>}
            </Link>
            );
          })}
          <Link href="/" onClick={() => setOpen(false)} style={{ color: "rgba(255,255,255,0.7)", padding: "12px 14px", fontSize: "14px", marginTop: "10px" }}>← العودة للموقع</Link>
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
