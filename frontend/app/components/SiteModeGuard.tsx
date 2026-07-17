"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE } from "@/app/lib/api";
import { isAllowedInFocus } from "@/app/lib/siteMode";

/*
  حارس وضع الموقع: في وضع «موقع يحل مشكلة» أي صفحة خارج
  (المدربين + المراكز + الأدوات + أساسيات الدخول والإدارة) تُعاد للرئيسية.
  يقرأ الوضع مرة واحدة ويعيد الفحص عند كل تنقّل.
*/

export default function SiteModeGuard() {
  const [mode, setMode] = useState<"full" | "focus" | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setMode(d.settings?.siteMode === "focus" ? "focus" : "full"))
      .catch(() => setMode("full"));
  }, []);

  useEffect(() => {
    if (mode === "focus" && pathname && !isAllowedInFocus(pathname)) {
      router.replace("/");
    }
  }, [mode, pathname, router]);

  return null;
}
