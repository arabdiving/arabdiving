"use client";

import { useState } from "react";

export default function ShareButtons({ title = "", compact = false }: { title?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = encodeURIComponent(title ? `${title} | ArabDiving` : "ArabDiving");
  const u = encodeURIComponent(url);

  const links = [
    { label: "واتساب", color: "#25D366", icon: "🟢", href: `https://wa.me/?text=${text}%20${u}` },
    { label: "تويتر / X", color: "#000000", icon: "𝕏", href: `https://twitter.com/intent/tweet?text=${text}&url=${u}` },
    { label: "فيسبوك", color: "#1877F2", icon: "f", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "تيليجرام", color: "#0088cc", icon: "✈", href: `https://t.me/share/url?url=${u}&text=${text}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
      {!compact && <span style={{ color: "#666", fontSize: "14px" }}>شارك:</span>}
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          title={l.label}
          aria-label={`مشاركة على ${l.label}`}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: l.color,
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {l.icon}
        </a>
      ))}
      <button
        onClick={copy}
        title="نسخ الرابط"
        aria-label="نسخ الرابط"
        style={{
          height: "38px",
          padding: "0 14px",
          borderRadius: "20px",
          background: copied ? "#1e7e34" : "var(--navy)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "13px",
        }}
      >
        {copied ? "✓ تم النسخ" : "🔗 نسخ الرابط"}
      </button>
    </div>
  );
}
