"use client";

import { useEffect } from "react";
import { API_BASE } from "@/app/lib/api";

export default function ThemeStyle() {
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const t = d.settings?.theme || {};
        const root = document.documentElement;
        if (t.navy) root.style.setProperty("--navy", t.navy);
        if (t.mid) root.style.setProperty("--mid", t.mid);
        if (t.gold) root.style.setProperty("--gold", t.gold);
        if (t.background) root.style.setProperty("--background", t.background);
      })
      .catch(() => {});
  }, []);
  return null;
}
