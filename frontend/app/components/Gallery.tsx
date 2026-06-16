"use client";

import { useState } from "react";
import { siteImageSrc, imagePlaceholder } from "@/app/lib/image";

export default function Gallery({ images, alt = "" }: { images?: string[]; alt?: string }) {
  const valid = (images || []).map((i) => siteImageSrc(i)).filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  if (valid.length === 0) {
    return <div style={{ width: "100%", height: "460px", borderRadius: "20px", background: imagePlaceholder }} />;
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={valid[Math.min(active, valid.length - 1)]}
        alt={alt}
        style={{ width: "100%", height: "460px", objectFit: "cover", borderRadius: "20px" }}
      />
      {valid.length > 1 && (
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
          {valid.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              style={{
                padding: 0,
                border: i === active ? "3px solid var(--mid)" : "2px solid #e2e8f0",
                borderRadius: "10px",
                cursor: "pointer",
                overflow: "hidden",
                background: "none",
                lineHeight: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: "84px", height: "60px", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
