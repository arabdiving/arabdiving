"use client";

import { useEffect } from "react";
import { API_BASE } from "@/app/lib/api";

/*
  محرك الثيم الواعي بالتباين — يضمن قابلية القراءة مع أي لوحة ألوان يختارها الأدمن.
  1) يطبّق لوحة الأدمن (+ الوضع الليلي/النهاري إن كان مفعّلًا).
  2) يحسب التباين رياضيًا (WCAG) ويصحّح المتغيرات المحايدة (نص/خافت/حدود/سطح)
     تلقائيًا إذا كانت غير مقروءة على الخلفية المختارة.
  3) يضبط data-theme="dark|light" على <html> لتفعيل طبقة إنقاذ CSS
     التي تصحّح الألوان الثابتة داخل المكونات القديمة (انظر globals.css).
  4) يوفّر متغير --ink: لون العناوين المقروء دائمًا (بديل آمن عن navy كنص).
*/

const VARS: Record<string, string> = {
  navy: "--navy", mid: "--mid", gold: "--gold", background: "--background",
  surface: "--surface", text: "--text", muted: "--muted", border: "--border", hero: "--hero",
};

/* ── الثيمان الرسميان — يبدّل بينهما الزائر من زر الهيدر ── */
export const THEMES: Record<string, Record<string, string>> = {
  // الكلاسيك: المظهر الأصلي الفاتح
  classic: {
    navy: "#0d2c54", mid: "#2e75b6", gold: "#c9952a",
    background: "#f1f5fb", surface: "#ffffff",
    text: "#0f172a", muted: "#64748b", border: "#e2e8f0", hero: "#060e24",
  },
  // البحر العميق: Dark Ocean الرسمي (design_handoff/DARK_OCEAN_DESIGN_SYSTEM.md)
  ocean: {
    navy: "#0d2c54", mid: "#22d3ee", gold: "#e8a830",
    background: "#040d1a", surface: "#0d1e3d",
    text: "#f2f7ff", muted: "#93a7c4", border: "#22365c", hero: "#041226",
  },
};
export const THEME_KEY = "ad_theme"; // "classic" | "ocean" | "" (اتباع إعدادات الأدمن)

/* ── أدوات الألوان ───────────────────────────────── */
function hexToRgb(hex: string): [number, number, number] | null {
  if (!hex) return null;
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(rgb: [number, number, number]): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(rgb[0])}${c(rgb[1])}${c(rgb[2])}`;
}
/* إضاءة نسبية وفق WCAG */
function luminance(rgb: [number, number, number]): number {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
}
function contrast(hex1: string, hex2: string): number {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  if (!a || !b) return 21; // لون غير مفهوم — لا نتدخل
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
/* مزج لونين بنسبة t (0..1) */
function mix(hex1: string, hex2: string, t: number): string {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  if (!a || !b) return hex1;
  return rgbToHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
}
/* فتّح/غمّق اللون تدريجيًا حتى يحقق تباينًا كافيًا على خلفية معينة */
function lightenUntilReadable(color: string, bg: string, min = 4.5): string {
  let c = color;
  for (let i = 0; i < 12 && contrast(c, bg) < min; i++) c = mix(c, "#ffffff", 0.15);
  return contrast(c, bg) >= min ? c : "#dbeafe";
}
function darkenUntilReadable(color: string, bg: string, min = 4.5): string {
  let c = color;
  for (let i = 0; i < 12 && contrast(c, bg) < min; i++) c = mix(c, "#0f172a", 0.15);
  return contrast(c, bg) >= min ? c : "#0f172a";
}

/* ── تعقيم اللوحة: يضمن التباين مهما اختار الأدمن ── */
function sanitize(palette: Record<string, string>) {
  const p: Record<string, string> = { ...palette };
  const bg = p.background || "#f1f5fb";
  const bgRgb = hexToRgb(bg);
  const dark = bgRgb ? luminance(bgRgb) < 0.3 : false;

  if (dark) {
    // سطح مرتفع قليلًا عن الخلفية (وإن ترك الأدمن السطح فاتحًا نوحّده مع الوضع الداكن)
    const surfRgb = p.surface ? hexToRgb(p.surface) : null;
    if (!surfRgb || luminance(surfRgb) > 0.5) p.surface = mix(bg, "#ffffff", 0.08);
    // نصوص وحدود مضمونة القراءة على الخلفية والسطح معًا
    if (!p.text || contrast(p.text, bg) < 4.5 || contrast(p.text, p.surface) < 4.5) p.text = "#f1f5f9";
    if (!p.muted || contrast(p.muted, p.surface) < 3.5) p.muted = "#a8b6c9";
    p.faint = "#8494a8";
    if (!p.border || contrast(p.border, bg) > 8) p.border = mix(bg, "#ffffff", 0.16);
    // لون العناوين: نسخة مقروءة من navy على السطح الداكن
    p.ink = lightenUntilReadable(p.navy || "#0d2c54", p.surface);
  } else {
    const surfRgb = p.surface ? hexToRgb(p.surface) : null;
    if (!surfRgb || luminance(surfRgb) < 0.5) p.surface = "#ffffff";
    if (!p.text || contrast(p.text, p.surface) < 4.5) p.text = "#0f172a";
    if (!p.muted || contrast(p.muted, p.surface) < 3.5) p.muted = "#64748b";
    p.faint = "#94a3b8";
    if (!p.border) p.border = "#e2e8f0";
    const navy = p.navy || "#0d2c54";
    p.ink = contrast(navy, p.surface) >= 4.5 ? navy : darkenUntilReadable(navy, p.surface);
  }
  return { p, dark };
}

function apply(palette: Record<string, string>) {
  const { p, dark } = sanitize(palette);
  const root = document.documentElement;
  Object.keys(VARS).forEach((k) => { if (p[k]) root.style.setProperty(VARS[k], p[k]); });
  if (p.faint) root.style.setProperty("--faint", p.faint);
  if (p.ink) root.style.setProperty("--ink", p.ink);
  root.dataset.theme = dark ? "dark" : "light";
}

export default function ThemeStyle() {
  useEffect(() => {
    let adminPalette: Record<string, string> = {};

    const resolveAndApply = () => {
      // اختيار الزائر (زر 🌊/☀️ في الهيدر) يتقدم على إعدادات الأدمن
      let choice = "";
      try { choice = localStorage.getItem(THEME_KEY) || ""; } catch {}
      if (choice && THEMES[choice]) { apply(THEMES[choice]); return; }
      apply(adminPalette);
    };

    fetch(`${API_BASE}/api/settings`).then((r) => r.json()).then((d) => {
      const set = d.settings || {};
      let palette: Record<string, string> = { ...(set.theme || {}) };
      const dn = set.dayNight;
      if (dn && dn.enabled) {
        const h = new Date().getHours();
        const isDay = h >= 6 && h < 18;
        const chosen = isDay ? dn.day : dn.night;
        if (chosen && Object.keys(chosen).length) palette = { ...palette, ...chosen };
      }
      adminPalette = palette;
      resolveAndApply();
    }).catch(() => { resolveAndApply(); });

    // تطبيق فوري عند الضغط على مبدّل الثيم دون إعادة تحميل
    window.addEventListener("ad-theme-change", resolveAndApply);
    return () => window.removeEventListener("ad-theme-change", resolveAndApply);
  }, []);
  return null;
}
