"use client";

import { useEffect } from "react";
import { API_BASE } from "@/app/lib/api";

const VARS: Record<string, string> = {
  navy: "--navy", mid: "--mid", gold: "--gold", background: "--background",
  surface: "--surface", text: "--text", muted: "--muted", border: "--border", hero: "--hero",
};

export default function ThemeStyle() {
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => {
      const set = d.settings || {};
      let palette: any = { ...(set.theme || {}) };
      const dn = set.dayNight;
      if (dn && dn.enabled) {
        const h = new Date().getHours();
        const isDay = h >= 6 && h < 18;
        const chosen = isDay ? dn.day : dn.night;
        if (chosen && Object.keys(chosen).length) palette = { ...palette, ...chosen };
      }
      const root = document.documentElement;
      Object.keys(VARS).forEach((k) => { if (palette[k]) root.style.setProperty(VARS[k], palette[k]); });
    }).catch(() => {});
  }, []);
  return null;
}
