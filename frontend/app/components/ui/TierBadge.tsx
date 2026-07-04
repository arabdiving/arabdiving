/*
  TierBadge — شارة مستوى المركز (Dark Ocean).
  من design_handoff/DARK_OCEAN_DESIGN_SYSTEM.md — قسم 9.
*/

type Tier = "platinum" | "gold" | "silver";

const TIERS: Record<Tier, { label: string; style: React.CSSProperties }> = {
  platinum: { label: "💎 بلاتيني", style: { background: "linear-gradient(135deg, #c9952a, #e8a830)", color: "white" } },
  gold:     { label: "🥇 ذهبي",    style: { background: "linear-gradient(135deg, #d4a017, #f5c218)", color: "white" } },
  silver:   { label: "🥈 فضي",     style: { background: "rgba(148,163,184,0.85)", color: "white" } },
};

export default function TierBadge({ tier }: { tier: string }) {
  const t = TIERS[(tier as Tier)] || TIERS.silver;
  return (
    <span style={{ ...t.style, fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "7px", whiteSpace: "nowrap" }}>
      {t.label}
    </span>
  );
}
