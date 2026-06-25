"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

const QUICK_LINKS = [
  { href: "/admin/homepage",       icon: "🏠", label: "بلوكات الهوم",         desc: "ترتيب وإظهار أقسام الصفحة الرئيسية" },
  { href: "/admin/content",        icon: "📝", label: "محتوى الصفحات",        desc: "تعديل نصوص وصور كل صفحة" },
  { href: "/admin/pages",          icon: "👁️", label: "ظهور الصفحات",         desc: "إخفاء أو إظهار صفحات الموقع" },
  { href: "/admin/partner-centers",icon: "🤿", label: "المراكز الشريكة",       desc: "إضافة وتعديل مراكز الغوص" },
  { href: "/admin/bookings",       icon: "🎟️", label: "الحجوزات",             desc: "متابعة طلبات الحجز الواردة" },
  { href: "/admin/messages",       icon: "📨", label: "الرسائل والتواصل",      desc: "رسائل الزوار وإعداد واتساب" },
  { href: "/admin/comments",       icon: "💬", label: "التعليقات والمنشورات",  desc: "إدارة محتوى المجتمع" },
  { href: "/admin/users",          icon: "👥", label: "المستخدمون",            desc: "إدارة الأعضاء والأدوار" },
  { href: "/admin/dive-sites",     icon: "📍", label: "مواقع الغوص",          desc: "إضافة وتعديل مواقع الغوص" },
  { href: "/admin/size-profiles",  icon: "📏", label: "مقاسات الأعضاء",       desc: "عرض ملفات المقاسات" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/dashboard`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => (d.success ? setStats(d.stats) : setErr(d.message || "تعذّر التحميل")))
      .catch(() => setErr("تعذّر الاتصال بالخادم"));
  }, []);

  const statCards = stats
    ? [
        { label: "الأعضاء",     value: stats.users },
        { label: "مواقع الغوص", value: stats.diveSites },
        { label: "التقييمات",   value: stats.reviews },
        { label: "المنشورات",   value: stats.posts },
        { label: "التعليقات",   value: stats.comments },
      ]
    : [];

  return (
    <div>
      <h1 style={{ color: "var(--navy)", marginBottom: "24px" }}>لوحة المعلومات</h1>
      {err && <p style={{ color: "#c0392b" }}>{err}</p>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "16px", marginBottom: "40px" }}>
        {statCards.map((c) => (
          <div key={c.label} style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", borderTop: "3px solid var(--navy)" }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--navy)" }}>{c.value}</div>
            <div style={{ color: "#666", marginTop: "6px", fontSize: "14px" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 style={{ color: "var(--navy)", fontSize: "20px", marginBottom: "18px" }}>إدارة الموقع</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "14px" }}>
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              display: "flex", alignItems: "flex-start", gap: "14px",
              background: "white", borderRadius: "14px", padding: "18px 16px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)", textDecoration: "none",
              border: "1px solid #e8eef6", transition: "box-shadow 0.2s",
            }}
          >
            <span style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }}>{l.icon}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "var(--navy)", fontSize: "15px" }}>{l.label}</p>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888", lineHeight: 1.5 }}>{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
