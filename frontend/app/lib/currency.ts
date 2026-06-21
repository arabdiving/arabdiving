export interface Currency { code: string; symbol: string; name: string; country: string; }

// Gulf currencies + USD + Egyptian Pound.
export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "دولار أمريكي", country: "عام" },
  { code: "SAR", symbol: "ر.س", name: "ريال سعودي", country: "السعودية" },
  { code: "AED", symbol: "د.إ", name: "درهم إماراتي", country: "الإمارات" },
  { code: "KWD", symbol: "د.ك", name: "دينار كويتي", country: "الكويت" },
  { code: "QAR", symbol: "ر.ق", name: "ريال قطري", country: "قطر" },
  { code: "OMR", symbol: "ر.ع", name: "ريال عماني", country: "عُمان" },
  { code: "BHD", symbol: "د.ب", name: "دينار بحريني", country: "البحرين" },
  { code: "EGP", symbol: "ج.م", name: "جنيه مصري", country: "مصر" },
];

export const CODES = CURRENCIES.map((c) => c.code);
export const symbolOf = (code: string) => CURRENCIES.find((c) => c.code === code)?.symbol || code;
export const currencyByCountry = (country: string) => CURRENCIES.find((c) => c.country === country);

// Approximate fallback rates per 1 USD (used if the live API is unreachable).
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1, SAR: 3.75, AED: 3.6725, KWD: 0.307, QAR: 3.64, OMR: 0.3845, BHD: 0.376, EGP: 48,
};

// Fetch live rates (free, no key). Returns rates per 1 USD.
export async function fetchRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const d = await res.json();
    if (d && d.rates) {
      const out: Record<string, number> = {};
      for (const c of CODES) out[c] = d.rates[c] ?? FALLBACK_RATES[c];
      return out;
    }
  } catch {}
  return { ...FALLBACK_RATES };
}

// Convert an amount from one currency to another using USD-based rates.
export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  const rFrom = rates[from] || FALLBACK_RATES[from] || 1;
  const rTo = rates[to] || FALLBACK_RATES[to] || 1;
  const usd = amount / rFrom;
  return usd * rTo;
}

// Format with the right number of decimals + symbol after the number (RTL-friendly).
export function formatMoney(amount: number, code: string): string {
  const dp = ["KWD", "OMR", "BHD"].includes(code) ? 2 : 0;
  const n = amount.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  return `${n} ${symbolOf(code)}`;
}
