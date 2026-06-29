"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { usePathname } from "next/navigation";

interface CurrentUser { name?: string; role?: string; }
interface MItem { href: string; label: string; }
interface MEntry { label: string; href?: string; items: MItem[]; }

const DEFAULT_LINKS: MItem[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/dive-sites", label: "مواقع الغوص" },
  { href: "/marketplace", label: "المتجر" },
  { href: "/family-booking", label: "احجز رحلة" },
  { href: "/retreats", label: "باقات خاصة" },
  { href: "/trips", label: "الرحلات" },
  { href: "/guide", label: "الدليل" },
  { href: "/courses", label: "الدورات" },
  { href: "/try-diving", label: "جرّب الغوص" },
  { href: "/weight-calculator", label: "حاسبة الأوزان" },
  { href: "/trends", label: "الصيحات والأمان" },
  { href: "/temperatures", label: "حرارة المياه" },
  { href: "/community", label: "المجتمع" },
  { href: "/quiz", label: "اكتشف نمطك" },
  { href: "/stories", label: "القصص" },
  { href: "/youth", label: "الشباب" },
  { href: "/women", label: "النساء" },
  { href: "/kids", label: "الأطفال" },
  { href: "/members", label: "الأعضاء" },
  { href: "/communities", label: "المجتمعات" },
  { href: "/messages", label: "الرسائل" },
  { href: "/my-store", label: "متجري" },
  { href: "/logbook", label: "اللوج بوك" },
];

function buildMenu(groups: any[], hidden: string[]): MEntry[] {
  const vis = (h: string) => !hidden.includes(h);
  if (groups && groups.length) {
    const out: MEntry[] = [];
    for (const g of groups) {
      const items: MItem[] = (g.items || []).filter((it: MItem) => it.href && vis(it.href));
      if (items.length === 1) out.push({ label: g.label || items[0].label, href: items[0].href, items: [] });
      else if (items.length > 1) out.push({ label: g.label, items });
    }
    return out;
  }
  return DEFAULT_LINKS.filter((l) => vis(l.href)).map((l) => ({ label: l.label, href: l.href, items: [] as MItem[] }));
}

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);
  const [navStyle, setNavStyle] = useState("buttons");
  const [navGroups, setNavGroups] = useState<any[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const activeStyle = (href: string) => (isActive(href) ? { background: "var(--gold)", color: "#fff", fontWeight: 700 } : {});

  useEffect(() => {
    // Settings + user
    try { const stored = localStorage.getItem("user"); if (stored) setUser(JSON.parse(stored)); } catch { setUser(null); }
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => {
      setHidden(d.settings?.hiddenPages || []);
      setNavStyle(d.settings?.navStyle || "buttons");
      setNavGroups(d.settings?.navGroups || []);
    }).catch(() => {});
    try {
      const t = localStorage.getItem("token");
      if (t) fetch(`${API_BASE}/api/dm/unread`, { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()).then((d) => setUnread(d.count || 0)).catch(() => {});
    } catch {}

    // Scroll listener
    const handler = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/"; };

  const linkStyle = {
    color: "rgba(255,255,255,0.82)",
    fontSize: "13.5px",
    padding: "7px 11px",
  } as const;

  const menu = buildMenu(navGroups, hidden);

  const badge = (href: string) =>
    href === "/messages" && unread > 0
      ? <span style={{ background: "#e11d48", color: "white", borderRadius: "20px", fontSize: "11px", padding: "1px 7px", marginInlineStart: "6px", fontWeight: 700 }}>{unread}</span>
      : null;

  const closeAll = () => { setOpen(false); setOpenIdx(null); };

  const authArea = !user ? (
    <>
      <Link href="/login" style={{ color: "rgba(255,255,255,0.65)", fontSize: "13.5px", padding: "7px 14px" }} onClick={closeAll}>
        تسجيل الدخول
      </Link>
      <Link href="/register" onClick={closeAll} style={{
        background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white",
        padding: "9px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "13.5px",
        boxShadow: "0 4px 12px rgba(201,149,42,0.4)", textAlign: "center",
        transition: "box-shadow .2s, transform .2s",
      }}>
        انضم الآن ←
      </Link>
    </>
  ) : (
    <>
      <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.82)" }}>👋 {user.name}</span>
      {user.role === "admin" && <Link href="/admin" style={linkStyle} onClick={closeAll}>لوحة الإدارة</Link>}
      <button onClick={logout} style={{ background: "transparent", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13.5px", fontFamily: "inherit" }}>
        تسجيل الخروج
      </button>
    </>
  );

  // Desktop inline nav
  const desktopInline = (
    <div className="nav-desktop" style={{ alignItems: "center", gap: "2px", flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
      {menu.map((e, i) =>
        e.href ? (
          <Link key={i} href={e.href} className="nav-pill" style={{ ...linkStyle, ...activeStyle(e.href) }}>
            {e.label}{badge(e.href)}
          </Link>
        ) : (
          <div key={i} style={{ position: "relative" }}>
            <button className="nav-pill" onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ ...linkStyle, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {e.label} ▾
            </button>
            {openIdx === i && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", insetInlineEnd: 0, background: "rgba(6,14,36,0.97)", backdropFilter: "blur(20px)", borderRadius: "10px", padding: "8px", minWidth: "180px", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.07)", zIndex: 60, display: "flex", flexDirection: "column", gap: "4px" }}>
                {e.items.map((it) => (
                  <Link key={it.href} href={it.href} onClick={closeAll} style={{ ...linkStyle, padding: "8px 12px", borderRadius: "8px", ...activeStyle(it.href) }}>
                    {it.label}{badge(it.href)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      )}
      {user && <Link href="/profile" className="nav-pill" style={linkStyle}>ملفي الشخصي</Link>}
    </div>
  );

  // Panel content (hamburger / sidebar / dropdown)
  const panelContent = (
    <>
      {menu.map((e, i) =>
        e.href ? (
          <Link key={i} href={e.href} className="nav-pill" style={{ ...linkStyle, ...activeStyle(e.href) }} onClick={closeAll}>
            {e.label}{badge(e.href)}
          </Link>
        ) : (
          <div key={i}>
            <div style={{ color: "var(--gold)", fontSize: "13px", fontWeight: 700, margin: "8px 0 2px" }}>{e.label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingInlineStart: "10px" }}>
              {e.items.map((it) => <Link key={it.href} href={it.href} style={{ ...linkStyle, ...activeStyle(it.href) }} onClick={closeAll}>{it.label}{badge(it.href)}</Link>)}
            </div>
          </div>
        )
      )}
      {user && <Link href="/profile" style={linkStyle} onClick={closeAll}>ملفي الشخصي</Link>}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "6px 0" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{authArea}</div>
    </>
  );

  const modeClass = navStyle === "dropdown" ? "nav-dropdown-mode" : navStyle === "sidebar" ? "nav-sidebar-mode" : undefined;

  const navBg = scrolled
    ? "rgba(6,14,36,0.97)"
    : "rgba(6,14,36,0.72)";

  const navBorderBottom = scrolled ? "1px solid rgba(255,255,255,0.07)" : "none";

  return (
    <nav
      className={modeClass}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: navBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: navBorderBottom,
        boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.35)" : "none",
        transition: "background 0.35s ease, box-shadow 0.35s ease, border-bottom 0.35s ease",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", height: "68px", gap: "20px", padding: "0 24px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }} onClick={closeAll}>
          <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#0891b2,#c9952a)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
            🤿
          </div>
          <div>
            <div style={{ color: "white", fontSize: "19px", fontWeight: 900, lineHeight: 1.1 }}>ArabDiving</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>مجتمع الغوص العربي</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        {desktopInline}

        {/* Desktop auth */}
        <div className="nav-desktop" style={{ alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {authArea}
        </div>

        {/* Hamburger */}
        <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="القائمة" style={{ background: "transparent", border: "none", color: "white", fontSize: "28px", cursor: "pointer", lineHeight: 1 }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Top panel (dropdown + mobile) */}
      {open && navStyle !== "sidebar" && (
        <div className="nav-mobile-panel" style={{ flexDirection: "column", gap: "8px", padding: "16px 24px 18px", maxWidth: "1280px", margin: "0 auto" }}>
          {panelContent}
        </div>
      )}

      {/* Side drawer (sidebar mode) */}
      {open && navStyle === "sidebar" && (
        <>
          <div onClick={closeAll} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150 }} />
          <div style={{ position: "fixed", top: 0, insetInlineEnd: 0, height: "100vh", width: "min(300px,85vw)", background: "rgba(6,14,36,0.97)", backdropFilter: "blur(20px)", padding: "64px 18px 24px", overflowY: "auto", zIndex: 200, boxShadow: "-8px 0 24px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "8px" }}>
            {panelContent}
          </div>
        </>
      )}
    </nav>
  );
}
