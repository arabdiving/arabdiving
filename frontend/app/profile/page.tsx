"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";

interface DiveEntry {
  _id: string;
  depth: number;
  duration: number;
  date: string;
  diveSite?: { name?: string; city?: string };
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [sizeProfile, setSizeProfile] = useState<any>(null);
  const [entries, setEntries] = useState<DiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_BASE}/api/users/profile`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/logbook/my`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/size-profiles/me`, { headers }).then((r) => r.json()).catch(() => ({})),
    ])
      .then(([profile, logbook, sp]) => {
        if (profile?.user) setUser(profile.user);
        else setError("تعذّر تحميل الملف الشخصي.");
        setEntries(logbook?.entries || []);
        if (sp?.profile) setSizeProfile(sp.profile);
      })
      .catch(() => setError("تعذّر الاتصال بالخادم."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ التحميل...</div>;
  }

  if (error || !user) {
    return <div style={{ padding: "60px", textAlign: "center", color: "#c0392b" }}>{error || "تعذّر تحميل الملف الشخصي."}</div>;
  }

  const maxDepth = entries.length > 0 ? Math.max(...entries.map((e) => e.depth)) : 0;
  const totalBottomTime = entries.reduce((sum, e) => sum + e.duration, 0);
  const avatar = siteImageSrc(user.profileImage);

  const statCard = (label: string, value: string | number) => (
    <div style={{ background: "var(--navy)", color: "white", padding: "20px", borderRadius: "12px" }}>
      <p style={{ opacity: 0.85 }}>{label}</p>
      <h2 style={{ fontSize: "30px" }}>{value}</h2>
    </div>
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "25px", marginBottom: "20px", flexWrap: "wrap" }}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={user.name} style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "50px" }}>👤</div>
        )}

        <div>
          <h1 style={{ color: "var(--navy)" }}>{user.name}</h1>
          <p style={{ color: "#666" }}>{user.email}</p>
          <p>📍 {user.city || "غير محدد"}، {user.country || "غير محدد"}</p>
          {user.dateOfBirth && <p>🎂 {user.dateOfBirth}{(() => { const d = new Date(user.dateOfBirth); const a = isNaN(d.getTime()) ? null : Math.floor((Date.now() - d.getTime()) / 31557600000); return a ? ` (${a} سنة)` : ""; })()}</p>}
          <p>🎓 {user.certificationLevel || "Open Water"}</p>
          <p>🌊 إجمالي الغوصات: {user.divesCount || 0}</p>
          {user.personality?.dominant && <p>🧠 نمطك: {({ red: "🔴 الأحمر (قائد)", yellow: "🟡 الأصفر (مبدع)", green: "🟢 الأخضر (مسالم)", blue: "🔵 الأزرق (محلّل)" } as any)[user.personality.dominant]} · <Link href="/quiz" style={{ color: "var(--mid)" }}>إعادة الاختبار</Link></p>}
        </div>

        <Link
          href="/profile/edit"
          style={{ marginInlineStart: "auto", background: "var(--mid)", color: "white", padding: "10px 22px", borderRadius: "10px" }}
        >
          تعديل الملف
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px", marginBottom: "40px" }}>
        {statCard("الغوصات المسجلة", entries.length)}
        {statCard("أقصى عمق", `${maxDepth} م`)}
        {statCard("إجمالي زمن القاع", `${totalBottomTime} دقيقة`)}
        {statCard("الدور", user.role === "admin" ? "مدير" : "عضو")}
      </div>

      <h2 style={{ color: "var(--navy)", marginBottom: "16px" }}>📏 مقاساتي</h2>
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px", marginBottom: "40px" }}>
        {sizeProfile ? (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", color: "#333", marginBottom: "12px" }}>
              <span>👤 الفئة: {sizeProfile.group === "women" ? "الشابات" : "الشباب"}</span>
              <span>📐 الطول: {sizeProfile.sizes?.height || "—"} سم</span>
              <span>⚖️ الوزن: {sizeProfile.sizes?.weight || "—"} كجم</span>
              <span>👟 الحذاء: {sizeProfile.sizes?.shoe || "—"}</span>
              <span>🤿 البدلة: {sizeProfile.sizes?.wetsuit || "—"}</span>
              <span>🥽 النظارة: {sizeProfile.sizes?.mask || "—"}</span>
              {sizeProfile.group === "women" && sizeProfile.womenExtras?.hoodie && <span>🧥 الهودي: {sizeProfile.womenExtras.hoodie}</span>}
              {sizeProfile.group === "women" && sizeProfile.womenExtras?.swimCover && <span>🩱 كاش مايوه: {sizeProfile.womenExtras.swimCover}</span>}
            </div>
            <Link href={`/sizes/${sizeProfile.group === "women" ? "women" : "men"}`} style={{ background: "var(--mid)", color: "white", padding: "8px 18px", borderRadius: "8px", fontSize: "14px" }}>تعديل المقاسات</Link>
          </>
        ) : (
          <div>
            <p style={{ color: "#666", marginBottom: "12px" }}>لم تسجّل مقاساتك بعد — سجّلها لنجهّز معداتك مسبقًا.</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/sizes/men" style={{ background: "var(--gold)", color: "white", padding: "8px 18px", borderRadius: "8px", fontSize: "14px" }}>مقاسات الشباب</Link>
              <Link href="/sizes/women" style={{ background: "var(--gold)", color: "white", padding: "8px 18px", borderRadius: "8px", fontSize: "14px" }}>مقاسات الشابات</Link>
            </div>
          </div>
        )}
      </div>

      <h2 style={{ color: "var(--navy)", marginBottom: "16px" }}>أحدث الغوصات</h2>

      {entries.length === 0 ? (
        <p style={{ color: "#666" }}>لم تسجّل أي غوصات بعد.</p>
      ) : (
        entries.slice(0, 5).map((entry) => (
          <div key={entry._id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "15px", marginBottom: "15px", background: "white" }}>
            <h3 style={{ color: "var(--navy)" }}>{entry.diveSite?.name || "موقع غير معروف"}</h3>
            <p>📍 {entry.diveSite?.city || "—"}</p>
            <p>🌊 العمق: {entry.depth} متر</p>
            <p>⏱ المدة: {entry.duration} دقيقة</p>
            <p>📅 {new Date(entry.date).toLocaleDateString("ar-EG")}</p>
          </div>
        ))
      )}
    </div>
  );
}
