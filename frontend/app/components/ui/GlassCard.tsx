"use client";

/*
  GlassCard — بطاقة زجاجية من نظام Dark Ocean.
  في الوضع الفاتح تتحول تلقائيًا لبطاقة بيضاء عادية (المتغيرات في globals.css).
*/

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: "cyan" | "gold" | "purple" | "green" | "orange";
  hover?: boolean;
  onClick?: () => void;
}

const GLOWS: Record<string, string> = {
  cyan:   "0 20px 50px rgba(0,0,0,0.5), 0 0 28px rgba(6,182,212,0.15)",
  gold:   "0 20px 50px rgba(0,0,0,0.5), 0 0 28px rgba(201,149,42,0.2)",
  purple: "0 20px 50px rgba(0,0,0,0.5), 0 0 28px rgba(168,85,247,0.15)",
  green:  "0 20px 50px rgba(0,0,0,0.5), 0 0 28px rgba(52,211,153,0.12)",
  orange: "0 20px 50px rgba(0,0,0,0.5), 0 0 28px rgba(249,115,22,0.12)",
};

export default function GlassCard({ children, style, glow, hover = true, onClick }: GlassCardProps) {
  return (
    <div
      className="glass"
      onClick={onClick}
      style={{ borderRadius: "18px", overflow: "hidden", transition: "transform .2s, box-shadow .22s", ...style }}
      onMouseEnter={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = "translateY(-5px)";
        if (glow) e.currentTarget.style.boxShadow = GLOWS[glow];
      }}
      onMouseLeave={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </div>
  );
}
