"use client";

import { useEffect, useRef, useState } from "react";

export default function ShareButtons({ title = "", compact = false }: { title?: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = title ? `${title} | ArabDiving` : "ArabDiving";
  const e = (s: string) => encodeURIComponent(s);

  useEffect(() => {
    const h = (ev: MouseEvent) => {
      if (ref.current && !ref.current.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  // On mobile, open the native share sheet (covers Instagram, Messenger, etc.).
  const onTrigger = async () => {
    const nav = navigator as Navigator & { share?: (d: any) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: shareText, text: shareText, url });
        return;
      } catch {
        /* user cancelled — fall through to menu */
      }
    }
    setOpen((o) => !o);
  };

  const instagram = async () => {
    await copyLink();
    alert("تم نسخ الرابط ✅ — افتح إنستجرام والصقه في القصة أو في البايو.");
    window.open("https://www.instagram.com", "_blank");
    setOpen(false);
  };

  const items: { label: string; icon: string; href?: string; onClick?: () => void; color: string }[] = [
    { label: "واتساب", icon: "🟢", color: "#25D366", href: `https://wa.me/?text=${e(shareText + " " + url)}` },
    { label: "تيليجرام", icon: "✈️", color: "#0088cc", href: `https://t.me/share/url?url=${e(url)}&text=${e(shareText)}` },
    { label: "فيسبوك", icon: "f", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { label: "إكس / تويتر", icon: "𝕏", color: "#000", href: `https://twitter.com/intent/tweet?text=${e(shareText)}&url=${e(url)}` },
    { label: "إنستجرام", icon: "📸", color: "#E1306C", onClick: instagram },
    { label: "بريد إلكتروني", icon: "✉️", color: "#64748b", href: `mailto:?subject=${e(shareText)}&body=${e(url)}` },
    { label: copied ? "✓ تم النسخ" : "نسخ الرابط", icon: "🔗", color: "var(--navy)", onClick: copyLink },
  ];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={onTrigger}
        aria-label="مشاركة"
        style={{
          background: compact ? "transparent" : "var(--navy)",
          color: compact ? "var(--navy)" : "white",
          border: compact ? "1px solid #d4dae3" : "none",
          padding: compact ? "6px 12px" : "9px 18px",
          borderRadius: "20px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "14px",
        }}
      >
        🔗 مشاركة
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            insetInlineEnd: 0,
            top: "calc(100% + 6px)",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 12px 34px rgba(0,0,0,0.18)",
            border: "1px solid #eef2f7",
            padding: "8px",
            minWidth: "190px",
            zIndex: 50,
          }}
        >
          {items.map((it) =>
            it.href ? (
              <a
                key={it.label}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={menuItem}
              >
                <span style={{ ...iconChip, background: it.color }}>{it.icon}</span>
                {it.label}
              </a>
            ) : (
              <button key={it.label} onClick={it.onClick} style={{ ...menuItem, width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "start" }}>
                <span style={{ ...iconChip, background: it.color }}>{it.icon}</span>
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

const menuItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "9px 10px",
  borderRadius: "8px",
  color: "#222",
  fontSize: "14px",
  fontFamily: "inherit",
  textDecoration: "none",
};
const iconChip: React.CSSProperties = {
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 700,
  flexShrink: 0,
};
