"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { contentDefaults } from "@/app/lib/content-defaults";

// Deep-merge saved content over defaults. Arrays from saved replace defaults
// (so admin add/duplicate/delete on lists works as expected).
function merge(def: any, saved: any): any {
  if (saved === undefined || saved === null) return def;
  if (Array.isArray(def) || Array.isArray(saved)) return saved;
  if (typeof def === "object" && typeof saved === "object") {
    const out: any = { ...def };
    for (const k of Object.keys(saved)) out[k] = merge(def[k], saved[k]);
    return out;
  }
  return saved;
}

export function useContent(page: string) {
  const [content, setContent] = useState<any>(contentDefaults[page] || {});

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/content/${page}`)
      .then((r) => r.json())
      .then((res) => {
        if (active && res?.data) {
          setContent(merge(contentDefaults[page] || {}, res.data));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [page]);

  return content;
}
