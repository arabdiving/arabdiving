"use client";

import Link from "next/link";
import { useContent } from "@/app/lib/useContent";

export default function Hero() {
  const c = useContent("home").hero || {};
  const titleLines = String(c.title || "").split("\n");

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">{c.badge}</span>

        <h1>
          {titleLines.map((line: string, i: number) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p>{c.subtitle}</p>

        <div className="hero-buttons">
          <Link href={c.primaryHref || "/register"} className="primary-btn" style={{ textDecoration: "none", display: "inline-block" }}>
            {c.primaryLabel}
          </Link>
          <Link href={c.secondaryHref || "/trips"} className="secondary-btn" style={{ textDecoration: "none", display: "inline-block" }}>
            {c.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
