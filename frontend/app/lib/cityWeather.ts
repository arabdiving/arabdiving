export interface CityInfo { key: string; label: string; lat: number; lon: number; }

export const CITIES: CityInfo[] = [
  { key: "sharm", label: "شرم الشيخ", lat: 27.91, lon: 34.33 },
  { key: "dahab", label: "دهب", lat: 28.50, lon: 34.51 },
  { key: "hurghada", label: "الغردقة", lat: 27.26, lon: 33.81 },
  { key: "marsaalam", label: "مرسى علم", lat: 25.07, lon: 34.90 },
];

export function matchCity(city?: string): CityInfo | null {
  if (!city) return null;
  const c = String(city).replace(/[ً-ْـ]/g, "").trim();
  if (c.includes("شرم")) return CITIES[0];
  if (c.includes("دهب")) return CITIES[1];
  if (c.includes("الغردقة") || c.includes("غردق") || c.includes("هرغ")) return CITIES[2];
  if (c.includes("مرسى علم") || c.includes("مرسي علم") || c.includes("علم")) return CITIES[3];
  return null;
}

export const MONTHS_AR = ["ينا", "فبر", "مار", "أبر", "مايو", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];

// Approximate monthly average temperatures (°C). Air = mean, Sea = sea-surface.
export const CITY_TEMPS: Record<string, { air: number[]; sea: number[] }> = {
  sharm:     { air: [18, 19, 21, 25, 29, 31, 33, 33, 31, 28, 24, 20], sea: [22, 21, 21, 22, 24, 26, 27, 28, 28, 27, 25, 23] },
  dahab:     { air: [17, 18, 21, 25, 29, 32, 34, 34, 31, 28, 23, 19], sea: [22, 21, 21, 22, 24, 26, 27, 28, 28, 27, 25, 23] },
  hurghada:  { air: [16, 17, 20, 24, 28, 30, 32, 32, 30, 27, 22, 18], sea: [22, 21, 21, 22, 25, 27, 28, 29, 28, 27, 25, 23] },
  marsaalam: { air: [21, 22, 24, 27, 30, 32, 33, 34, 32, 29, 26, 22], sea: [24, 23, 23, 24, 26, 28, 29, 30, 30, 28, 27, 25] },
};
