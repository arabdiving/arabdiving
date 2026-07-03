"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

const DEFAULT = {
  siteName: "ArabDiving",
  tagline: "أول مجتمع عربي متخصص في الغوص",
  footerText: "",
};

export default function Footer() {
  const [brand, setBrand] = useState(DEFAULT);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const b = d.settings?.branding;
        if (b) setBrand({
          siteName: b.siteName || DEFAULT.siteName,
          tagline: b.tagline || DEFAULT.tagline,
          footerText: b.footerText || "",
        });
      })
      .catch(() => {});
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#081F3F",
        color: "white",
        padding: "50px",
        marginTop: "80px",
        textAlign: "center",
      }}
    >
      <h3>{brand.siteName}</h3>

      <p>{brand.tagline}</p>

      <p>{brand.footerText || `© ${year} ${brand.siteName}`}</p>
    </footer>
  );
}
