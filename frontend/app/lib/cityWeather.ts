export type ClimateKey = "sharm" | "dahab" | "hurghada" | "marsaalam";

export interface Area {
  keys: string[];
  label: string;
  lat: number;
  lon: number;
  climate: ClimateKey;
}

// Each dive area maps to live coordinates + the nearest climate profile.
export const AREAS: Area[] = [
  { keys: ["شرم"], label: "شرم الشيخ", lat: 27.91, lon: 34.33, climate: "sharm" },
  { keys: ["تيران"], label: "مضيق تيران", lat: 27.99, lon: 34.55, climate: "sharm" },
  { keys: ["راس محمد", "رأس محمد"], label: "رأس محمد", lat: 27.73, lon: 34.25, climate: "sharm" },
  { keys: ["دهب"], label: "دهب", lat: 28.50, lon: 34.51, climate: "dahab" },
  { keys: ["نويبع", "طابا"], label: "نويبع / طابا", lat: 29.03, lon: 34.66, climate: "dahab" },
  { keys: ["الغردقة", "غردق", "الجونة", "الجونه"], label: "الغردقة", lat: 27.26, lon: 33.81, climate: "hurghada" },
  { keys: ["سفاجا"], label: "سفاجا", lat: 26.73, lon: 33.94, climate: "hurghada" },
  { keys: ["القصير"], label: "القصير", lat: 26.10, lon: 34.28, climate: "marsaalam" },
  { keys: ["مرسى علم", "مرسي علم"], label: "مرسى علم", lat: 25.07, lon: 34.90, climate: "marsaalam" },
  { keys: ["اقصى الجنوب", "أقصى الجنوب", "حماطة", "حماطه"], label: "أقصى الجنوب (حماطة)", lat: 24.28, lon: 35.01, climate: "marsaalam" },
];

const strip = (x: string) => String(x).replace(/[ً-ْـ]/g, "").trim();

// Always returns an area — falls back to a central Red Sea profile.
export function matchArea(city?: string): Area {
  const fallback: Area = { keys: [], label: city && strip(city) ? city : "البحر الأحمر", lat: 27.26, lon: 33.81, climate: "hurghada" };
  if (!city) return fallback;
  const c = strip(city);
  for (const a of AREAS) {
    if (a.keys.some((k) => c.includes(strip(k)))) return a;
  }
  return fallback;
}

// Distinct areas to showcase on the temperatures page.
export const SHOWCASE_AREAS: Area[] = AREAS.filter((a) => !["نويبع / طابا", "رأس محمد", "القصير"].includes(a.label));

export const CITIES = AREAS; // backward-compat alias

export const MONTHS_AR = ["ينا", "فبر", "مار", "أبر", "مايو", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];

// Approximate monthly average temperatures (°C). air = mean, sea = sea-surface.
export const CITY_TEMPS: Record<ClimateKey, { air: number[]; sea: number[] }> = {
  sharm:     { air: [18, 19, 21, 25, 29, 31, 33, 33, 31, 28, 24, 20], sea: [22, 21, 21, 22, 24, 26, 27, 28, 28, 27, 25, 23] },
  dahab:     { air: [17, 18, 21, 25, 29, 32, 34, 34, 31, 28, 23, 19], sea: [22, 21, 21, 22, 24, 26, 27, 28, 28, 27, 25, 23] },
  hurghada:  { air: [16, 17, 20, 24, 28, 30, 32, 32, 30, 27, 22, 18], sea: [22, 21, 21, 22, 25, 27, 28, 29, 28, 27, 25, 23] },
  marsaalam: { air: [21, 22, 24, 27, 30, 32, 33, 34, 32, 29, 26, 22], sea: [24, 23, 23, 24, 26, 28, 29, 30, 30, 28, 27, 25] },
};
