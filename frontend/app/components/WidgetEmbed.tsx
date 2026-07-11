"use client";

import { useEffect, useRef } from "react";

/*
  WidgetEmbed — منفّذ آمن لأكواد تضمين Travelpayouts.
  الأمان: لا يُنفَّذ أي سكربت إلا من نطاقات Travelpayouts المعتمدة حصرًا —
  أي كود آخر يُلصق بالخطأ (أو بنية خبيثة) يُتجاهل تمامًا.
*/

const ALLOWED_HOSTS = [
  "tp.media",
  "www.travelpayouts.com",
  "travelpayouts.com",
  "emrldtp.cc",
  "aviasales.com",
  "www.aviasales.com",
  "search.hotellook.com",
  "hotellook.com",
];

function hostAllowed(url: string): boolean {
  try {
    const h = new URL(url, "https://x.invalid").hostname.toLowerCase();
    return ALLOWED_HOSTS.some((a) => h === a || h.endsWith("." + a));
  } catch { return false; }
}

export default function WidgetEmbed({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !code) return;
    el.innerHTML = "";

    // سكربتات التضمين: نعيد إنشاءها يدويًا (innerHTML لا يشغّل السكربتات)
    const srcMatches = Array.from(code.matchAll(/<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi));
    let injected = false;
    for (const m of srcMatches) {
      const src = m[1];
      if (!hostAllowed(src)) continue;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.charset = "utf-8";
      el.appendChild(s);
      injected = true;
    }

    // إطارات iframe مباشرة (بعض الويدجت تأتي هكذا)
    const iframeMatch = code.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
    if (iframeMatch && hostAllowed(iframeMatch[1])) {
      const f = document.createElement("iframe");
      f.src = iframeMatch[1];
      f.style.width = "100%";
      f.style.minHeight = "420px";
      f.style.border = "0";
      f.loading = "lazy";
      el.appendChild(f);
      injected = true;
    }

    if (!injected) {
      el.innerHTML = `<p style="color:var(--muted,#9fb1c9);font-size:13px;padding:14px">⚠️ كود غير معتمد — يُقبل فقط كود التضمين الرسمي من Travelpayouts (tp.media).</p>`;
    }

    return () => { el.innerHTML = ""; };
  }, [code]);

  return <div ref={ref} style={{ minHeight: "80px" }} />;
}
