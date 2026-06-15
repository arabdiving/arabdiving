// Single source of truth for the backend API base URL.
// Set NEXT_PUBLIC_API_URL in your environment for production.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
