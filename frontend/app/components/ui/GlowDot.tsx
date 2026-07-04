"use client";

/*
  GlowDot — نقطة مضيئة نابضة (Dark Ocean) لاستخدامها على الخرائط والأقسام الداكنة.
  من design_handoff/DARK_OCEAN_DESIGN_SYSTEM.md — قسم 7.
*/

interface GlowDotProps {
  color: string;
  size?: number;
  label?: string;
  side?: "left" | "right";
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export default function GlowDot({ color, size = 14, label, side = "left", top, right, left, bottom, onClick, onHover }: GlowDotProps) {
  return (
    <div
      style={{ position: "absolute", top, right, left, bottom, cursor: onClick ? "pointer" : "default", zIndex: 20, transform: "translate(-50%, -50%)" }}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {/* النواة */}
      <div style={{ width: size, height: size, borderRadius: "50%", background: color, animation: "pulseGlow 2s ease-in-out infinite", boxShadow: `0 0 14px ${color}` }} />
      {/* حلقة النبض */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${color}`, animation: "pulseRing 2s ease-out infinite" }} />
      {/* التسمية */}
      {label && (
        <span style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          ...(side === "right" ? { right: "calc(100% + 14px)" } : { left: "calc(100% + 14px)" }),
          whiteSpace: "nowrap", fontSize: "11.5px", fontWeight: 700, color: "white",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
        }}>
          {label}
        </span>
      )}
    </div>
  );
}
