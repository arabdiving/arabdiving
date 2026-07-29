"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/app/lib/api";

/*
  زر «الدخول بحساب جوجل» — يعتمد Google Identity Services (GIS).
  يحمّل سكربت جوجل الرسمي، يعرض الزر، وعند نجاح الدخول يرسل الرمز (credential)
  إلى /api/auth/google الذي يتحقق منه ويعيد JWT.

  يتطلب: NEXT_PUBLIC_GOOGLE_CLIENT_ID في بيئة الفرونت (Vercel).
*/

declare global {
  interface Window { google?: any; }
}

const CLIENT_ID = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();

export default function GoogleSignIn({ text = "signin_with" }: { text?: "signin_with" | "signup_with" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!CLIENT_ID) { setErr("الدخول بجوجل غير مُهيّأ بعد"); return; }

    const onCredential = async (resp: any) => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: resp.credential }),
        });
        const d = await res.json();
        if (d.success) {
          localStorage.setItem("token", d.token);
          localStorage.setItem("user", JSON.stringify(d.user));
          window.location.href = d.mustChangePassword ? "/change-password" : "/profile";
        } else {
          setErr(d.message || "تعذّر الدخول بجوجل");
        }
      } catch {
        setErr("تعذّر الاتصال بالخادم");
      }
    };

    const init = () => {
      if (!window.google?.accounts?.id || !ref.current) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: onCredential });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline", size: "large", width: 320, shape: "pill",
        text, locale: "ar", logo_alignment: "center",
      });
    };

    // حمّل السكربت مرة واحدة
    const SRC = "https://accounts.google.com/gsi/client";
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (window.google?.accounts?.id) { init(); return; }
    if (!script) {
      script = document.createElement("script");
      script.src = SRC; script.async = true; script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", init);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null; // لا نعرض شيئًا إن لم يُهيّأ بعد

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", margin: "6px 0" }}>
      <div ref={ref} />
      {err && <p style={{ color: "#f87171", fontSize: "12.5px", margin: 0 }}>{err}</p>}
    </div>
  );
}
