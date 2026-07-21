"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE } from "@/app/lib/api";
import { isAllowedInFocus } from "@/app/lib/siteMode";

/*
  حارسان في مكوّن واحد:

  1) كلمة المرور المؤقتة: من أنشأت الإدارة حسابه بكلمة مؤقتة (mustChangePassword)
     يُمنع من تصفح الموقع حتى يغيّرها — كل صفحة تعيده إلى /change-password.

  2) وضع الموقع: في وضع «يحل مشكلة» أي صفحة خارج (المدربين + المراكز + الأدوات
     + أساسيات الدخول) تُعاد للرئيسية.
*/

// صفحات يُسمح بها أثناء إلزام تغيير كلمة المرور (وإلا وقعنا في حلقة إعادة توجيه)
const PASSWORD_EXEMPT = ["/change-password", "/login", "/register"];

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

  // (1) إلزام تغيير كلمة المرور المؤقتة — أسبقية على كل شيء
  useEffect(() => {
    if (!pathname || PASSWORD_EXEMPT.some((p) => pathname.startsWith(p))) return;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const u = JSON.parse(raw);
      if (u?.mustChangePassword) router.replace("/change-password");
    } catch {}
  }, [pathname, router]);

  // (2) وضع «يحل مشكلة»
  useEffect(() => {
    if (mode === "focus" && pathname && !isAllowedInFocus(pathname)) {
      router.replace("/");
    }
  }, [mode, pathname, router]);

  return null;
}
