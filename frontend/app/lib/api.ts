// Single source of truth for the backend API base URL.
// Robust against a missing/incorrect NEXT_PUBLIC_API_URL in production.
const BACKEND = "https://arabdiving-api.onrender.com";
const ENV = (process.env.NEXT_PUBLIC_API_URL || "").trim();

function resolveBase(): string {
  // Server-side rendering: prefer the env var, else the known backend.
  if (typeof window === "undefined") return ENV || BACKEND;

  const here = window.location;
  const local = here.hostname === "localhost" || here.hostname === "127.0.0.1";

  if (!ENV) return local ? "http://localhost:5000" : BACKEND;

  // Guard: if the configured URL accidentally points at the site's own origin
  // (a common misconfiguration that makes every /api call return 404),
  // use the dedicated backend instead.
  try {
    const u = new URL(ENV, here.href);
    if (u.origin === here.origin) return local ? "http://localhost:5000" : BACKEND;
    return ENV.replace(/\/$/, "");
  } catch {
    return BACKEND;
  }
}

export const API_BASE = resolveBase();
