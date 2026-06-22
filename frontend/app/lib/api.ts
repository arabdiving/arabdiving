// Single source of truth for the backend API base URL.
// Robust against a missing/incorrect NEXT_PUBLIC_API_URL on both client AND server (SSR).
const BACKEND = "https://arabdiving-api.onrender.com";
const ENV = (process.env.NEXT_PUBLIC_API_URL || "").trim();

// Frontend domains that must NEVER be used as the API base (they have no /api routes).
const isFrontendHost = (host: string) => /(^|\.)arabdiving\.com$/i.test(host) || host.endsWith(".vercel.app");

function resolveBase(): string {
  // ---- Server-side (SSR / generateMetadata) ----
  if (typeof window === "undefined") {
    if (!ENV) return BACKEND;
    try {
      const u = new URL(ENV);
      if (isFrontendHost(u.hostname)) return BACKEND; // env wrongly points at the site itself
      return ENV.replace(/\/$/, "");
    } catch {
      return BACKEND;
    }
  }

  // ---- Client-side ----
  const here = window.location;
  const local = here.hostname === "localhost" || here.hostname === "127.0.0.1";
  if (!ENV) return local ? "http://localhost:5000" : BACKEND;
  try {
    const u = new URL(ENV, here.href);
    if (u.origin === here.origin || isFrontendHost(u.hostname)) return local ? "http://localhost:5000" : BACKEND;
    return ENV.replace(/\/$/, "");
  } catch {
    return BACKEND;
  }
}

export const API_BASE = resolveBase();
