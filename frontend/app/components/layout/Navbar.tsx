"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { usePathname } from "next/navigation";

interface CurrentUser { name?: string; role?: string; }
interface MItem { href: string; label: string; }
interface MEntry { label: string; href?: string; items: MItem[]; }

const NAV_MAIN: MItem[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/family-booking", label: "احجز رحلة" },
  { href: "/dive-sites", label: "مواقع الغوص" },
  { href: "/community", label: "المجتمع" },
  { href: "/marketplace", label: "المتجر" },
  { href: "/guide", label: "الدليل" },
  { href: "/courses", label: "الدورات" },
];

const NAV_MORE: MItem[] = [
  { href: "/retreats", label: "باقات خاصة" },
  { href: "/trips", label: "الرحلات" },
  { href: "/try-diving", label: "جرّب الغوص" },
  { href: "/weight-calculator", label: "حاسبة الأوزان" },
  { href: "/trends", label: "الصيحات والأمان" },
  { href: "/temperatures", label: "حرارة المياه" },
  { href: "/quiz", label: "اكتشف نمطك" },
  { href: "/survey", label: "استبيان التعلم" },
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

const ALL_LINKS: MItem[] = [...NAV_MAIN, ...NAV_MORE];

function buildDesktopMenu(groups: any[], hidden: string[]): MEntry[] {
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
  const main: MEntry[] = NAV_MAIN.filter((l) => vis(l.href)).map((l) => ({ label: l.label, href: l.href, items: [] as MItem[] }));
  const more = NAV_MORE.filter((l) => vis(l.href));
  if (more.length > 0) main.push({ label: "المزيد", items: more });
  return main;
}

function buildMobileMenu(hidden: string[]): MEntry[] {
  return ALL_LINKS
    .filter((l) => !hidden.includes(l.href))
    .map((l) => ({ label: l.label, href: l.href, items: [] as MItem[] }));
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

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const activeStyle = (href: string): React.CSSProperties =>
    isActive(href) ? { background: "var(--gold)", color: "#fff", fontWeight: 700 } : {};

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch { setUser(null); }

    fetch(API_BASE + "/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setHidden(d.settings?.hiddenPages || []);
        setNavStyle(d.settings?.navStyle || "buttons");
        setNavGroups(d.settings?.navGroups || []);
      })
      .catch(() => {});

    try {
      const t = localStorage.getItem("token");
      if (t) {
        fetch(API_BASE + "/api/dm/unread", { headers: { Authorization: "Bearer " + t } })
          .then((r) => r.json())
          .then((d) => setUnread(d.count || 0))
          .catch(() => {});
      }
    } catch {}

    const handler = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const closeAll = () => { setOpen(false); setOpenIdx(null); };

  const lnkBase: React.CSSProperties = { color: "rgba(255,255,255,0.82)", fontSize: "13.5px", padding: "7px 11px" };

  const msgBadge = (href: string) =>
    href === "/messages" && unread > 0
      ? <span style={{ background: "#e11d48", color: "white", borderRadius: "20px", fontSize: "11px", padding: "1px 7px", marginInlineStart: "6px", fontWeight: 700 }}>{unread}</span>
      : null;

  const deskMenu = buildDesktopMenu(navGroups, hidden);
  const mobileMenu = buildMobileMenu(hidden);

  const authButtons = !user ? (
    <>
      <Link href="/login" onClick={closeAll} style={{ color: "rgba(255,255,255,0.65)", fontSize: "13.5px", padding: "7px 14px" }}>
        {"تسجيل الدخول"}
      </Link>
      <Link href="/register" onClick={closeAll} style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "white", padding: "9px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "13.5px", boxShadow: "0 4px 12px rgba(201,149,42,0.4)" }}>
        {"انضم الآن"}
      </Link>
    </>
  ) : (
    <>
      <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.82)" }}>{"\u{1F44B}"} {user.name}</span>
      {user.role === "admin" && <Link href="/admin" onClick={closeAll} style={lnkBase}>{"لوحة الإدارة"}</Link>}
      <button onClick={logout} style={{ background: "transparent", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13.5px", fontFamily: "inherit" }}>
        {"تسجيل الخروج"}
      </button>
    </>
  );

  const modeClass = navStyle === "dropdown" ? "nav-dropdown-mode" : navStyle === "sidebar" ? "nav-sidebar-mode" : undefined;
  const navBg = scrolled ? "rgba(6,14,36,0.97)" : "rgba(6,14,36,0.72)";
  const navShadow = scrolled ? "0 4px 28px rgba(0,0,0,0.35)" : "none";
  const navBorder = scrolled ? "1px solid rgba(255,255,255,0.07)" : "none";

  return (
    <nav
      className={modeClass}
      style={{ position: "sticky", top: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: navBorder, boxShadow: navShadow, transition: "background 0.35s ease, box-shadow 0.35s ease", color: "white" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", height: "68px", gap: "20px", padding: "0 24px" }}>

        <Link href="/" onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, textDecoration: "none" }}>
          <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#0891b2,#c9952a)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
            {"\u{1F93F}"}
          </div>
          <div>
            <div style={{ color: "white", fontSize: "19px", fontWeight: 900, lineHeight: 1.1 }}>ArabDiving</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>{"مجتمع الغوص العربي"}</div>
          </div>
        </Link>

        <div className="nav-desktop" style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: "2px" }}>
          {deskMenu.map((e, i) =>
            e.href ? (
              <Link key={i} href={e.href} className="nav-pill" style={{ ...lnkBase, ...activeStyle(e.href) }}>
                {e.label}{msgBadge(e.href)}
              </Link>
            ) : (
              <div key={i} style={{ position: "relative" }}>
                <button className="nav-pill" onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ ...lnkBase, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  {e.label} {"▾"}
                </button>
                {openIdx === i && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", insetInlineEnd: 0, background: "rgba(6,14,36,0.97)", backdropFilter: "blur(20px)", borderRadius: "10px", padding: "8px", minWidth: "180px", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.07)", zIndex: 60, display: "flex", flexDirection: "column", gap: "4px" }}>
                    {e.items.map((it) => (
                      <Link key={it.href} href={it.href} onClick={closeAll} style={{ ...lnkBase, padding: "8px 12px", borderRadius: "8px", ...activeStyle(it.href) }}>
                        {it.label}{msgBadge(it.href)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          {user && <Link href="/profile" className="nav-pill" onClick={closeAll} style={lnkBase}>{"ملفي الشخصي"}</Link>}
        </div>

        <div className="nav-desktop" style={{ alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {authButtons}
        </div>

        <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="القائمة" style={{ background: "transparent", border: "none", color: "white", fontSize: "28px", cursor: "pointer", lineHeight: 1 }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && navStyle !== "sidebar" && (
        <div className="nav-mobile-panel" style={{ flexDirection: "column", gap: "6px", padding: "14px 24px 18px", maxWidth: "1280px", margin: "0 auto" }}>
          {mobileMenu.map((e, i) => (
            <Link key={i} href={e.href || "/"} className="nav-pill" onClick={closeAll} style={{ ...lnkBase, ...activeStyle(e.href || "/") }}>
              {e.label}{msgBadge(e.href || "")}
            </Link>
          ))}
          {user && <Link href="/profile" onClick={closeAll} style={{ ...lnkBase, padding: "7px 11px" }}>{"ملفي الشخصي"}</Link>}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "6px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{authButtons}</div>
        </div>
      )}

      {open && navStyle === "sidebar" && (
        <>
          <div onClick={closeAll} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150 }} />
          <div style={{ position: "fixed", top: 0, insetInlineEnd: 0, height: "100vh", width: "min(300px,85vw)", background: "rgba(6,14,36,0.97)", backdropFilter: "blur(20px)", padding: "64px 18px 24px", overflowY: "auto", zIndex: 200, boxShadow: "-8px 0 24px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "6px" }}>
            {mobileMenu.map((e, i) => (
              <Link key={i} href={e.href || "/"} className="nav-pill" onClick={closeAll} style={{ ...lnkBase, ...activeStyle(e.href || "/") }}>
                {e.label}{msgBadge(e.href || "")}
              </Link>
            ))}
            {user && <Link href="/profile" onClick={closeAll} style={lnkBase}>{"ملفي الشخصي"}</Link>}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "6px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{authButtons}</div>
          </div>
        </>
      )}
    </nav>
  );
}
