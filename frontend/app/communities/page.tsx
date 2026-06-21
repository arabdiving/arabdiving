"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";

const TRIBES = [
  { key: "red", name: "مجتمع الأحمر — القادة", emoji: "🔴", color: "#b91c1c", light: "#fef2f2", desc: "حاسمون، مباشرون، يحبون التحدي والنتائج السريعة. يقودون الرحلات بثقة." },
  { key: "yellow", name: "مجتمع الأصفر — المبدعون", emoji: "🟡", color: "#b45309", light: "#fffbeb", desc: "اجتماعيون، مرحون، أصحاب طاقة وإبداع. يصنعون أجواء الرحلة وذكرياتها." },
  { key: "green", name: "مجتمع الأخضر — المسالمون", emoji: "🟢", color: "#15803d", light: "#f0fdf4", desc: "ودودون، صبورون، متعاونون. يحبون الانسجام والبيئة الآمنة." },
  { key: "blue", name: "مجتمع الأزرق — المحلّلون", emoji: "🔵", color: "#1d4ed8", light: "#eef4fa", desc: "دقيقون، منطقيون، يحبون التفاصيل والتخطيط. خبراء المعدات والأمان." },
];

export default function CommunitiesPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${API_BASE}/api/users`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.json()).then((d) => setMembers(d.users || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "clamp(20px,5vw,44px) 18px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "var(--navy)", fontSize: "clamp(26px,5vw,36px)" }}>🎨 المجتمعات اللونية</h1>
        <p style={{ color: "#666", lineHeight: 1.8, maxWidth: "640px", margin: "8px auto 0" }}>مجتمعات مبنية على نمط شخصيتك من <Link href="/quiz" style={{ color: "var(--mid)" }}>اختبار النمط</Link>. اكتشف نمطك وانضم لمجتمعك من إعدادات ملفك الشخصي.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
        {TRIBES.map((t) => {
          const list = members.filter((m) => m.colorCommunity === t.key);
          return (
            <section key={t.key} style={{ background: t.light, borderRadius: "18px", padding: "22px", borderInlineStart: `6px solid ${t.color}` }}>
              <h2 style={{ color: t.color, fontSize: "22px", marginBottom: "4px" }}>{t.emoji} {t.name}</h2>
              <p style={{ color: "#555", marginBottom: "16px" }}>{t.desc}</p>
              {loading ? <p style={{ color: "#888" }}>...</p> : list.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>لا يوجد أعضاء منضمّون بعد — كن أول المنضمّين من ملفك الشخصي.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
                  {list.map((m) => {
                    const img = siteImageSrc(m.profileImage);
                    return (
                      <Link key={m._id} href={`/members/${m._id}`} style={{ background: "white", borderRadius: "12px", padding: "14px", textAlign: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={m.name} style={{ width: "54px", height: "54px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 8px" }} />
                        ) : (
                          <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: t.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 700 }}>{(m.name || "؟").charAt(0)}</div>
                        )}
                        <div style={{ color: "var(--navy)", fontSize: "14px", fontWeight: 700 }}>{m.name}</div>
                        {m.surveyRole && <div style={{ color: "#888", fontSize: "12px" }}>{m.surveyRole === "teacher" ? "مدرّب" : m.surveyRole === "student" ? "متدرّب" : "الاثنان"}</div>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
