import { API_BASE } from "@/app/lib/api";

export function authHeaders(json = true): Record<string, string> {
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

export { API_BASE };
