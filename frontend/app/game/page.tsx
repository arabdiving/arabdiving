"use client";

import Link from "next/link";
import SeaHeroesGame from "@/app/components/SeaHeroesGame";

export default function GamePage() {
  return (
    <div style={{ position: "relative" }}>
      <SeaHeroesGame autosave />
      <div style={{ position: "fixed", bottom: "14px", insetInlineStart: 0, width: "100%", textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <Link href="/kids" style={{ pointerEvents: "auto", color: "white", textDecoration: "underline", fontSize: "14px", background: "rgba(0,0,0,0.2)", padding: "6px 14px", borderRadius: "20px" }}>← صفحة العائلات</Link>
      </div>
    </div>
  );
}
