"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc } from "@/app/lib/image";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<string | null>(null);
  const [friends, setFriends] = useState<Set<string>>(new Set());
  const [outgoing, setOutgoing] = useState<Set<string>>(new Set());
  const [incoming, setIncoming] = useState<Set<string>>(new Set());

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

  const loadFriends = () => {
    if (!token) return;
    fetch(`${API_BASE}/api/friends`, { headers })
      .then((r) => r.json())
      .then((d) => {
        setFriends(new Set((d.friends || []).map((x: any) => x._id)));
        setOutgoing(new Set((d.outgoing || []).map((x: any) => x._id)));
        setIncoming(new Set((d.incoming || []).map((x: any) => x._id)));
      }).catch(() => {});
  };
  const load = () => {
    fetch(`${API_BASE}/api/users`, { headers })
      .then((r) => r.json())
      .then((d) => setMembers(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    try { const u = localStorage.getItem("user"); if (u) setMe(JSON.parse(u)._id); } catch {}
    load(); loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (path: string, id: string) => {
    if (!token) { alert("يرجى تسجيل الدخول أولًا."); return; }
    await fetch(`${API_BASE}/api/friends/${path}/${id}`, { method: "POST", headers });
    loadFriends();
  };

  const btn = (bg: string, color = "white"): React.CSSProperties => ({ background: bg, color, border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 700 });

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 24px" }}>
      <h1 style={{ color: "var(--navy)", fontSize: "clamp(26px,5vw,34px)", marginBottom: "8px" }}>دليل الأعضاء</h1>
      <p style={{ color: "#666", marginBottom: "26px" }}>تعرّف على غوّاصين من الخليج والعالم العربي، وكوّن صداقات وراسلهم.</p>
      {!token && <p style={{ color: "#9a6f1f", marginBottom: "18px" }}>سجّل الدخول لإضافة الأصدقاء ومراسلتهم.</p>}

      {loading ? (
        <p style={{ color: "#666" }}>جارٍ التحميل...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {members.filter((m) => m._id !== me).map((m) => {
            const img = siteImageSrc(m.profileImage);
            const isFriend = friends.has(m._id);
            const sent = outgoing.has(m._id);
            const got = incoming.has(m._id);
            return (
              <div key={m._id} style={{ background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", textAlign: "center" }}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={m.name} style={{ width: "84px", height: "84px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 10px" }} />
                ) : (
                  <div style={{ width: "84px", height: "84px", borderRadius: "50%", background: "linear-gradient(135deg,#2e75b6,#0d2c54)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 10px" }}>
                    {m.photoHidden ? "🔒" : (m.name || "؟").charAt(0)}
                  </div>
                )}
                <Link href={`/members/${m._id}`} style={{ color: "var(--navy)", fontSize: "18px", fontWeight: 700 }}>{m.name}</Link>
                <div style={{ color: "#888", fontSize: "13px", margin: "4px 0 14px" }}>
                  {m.infoHidden ? "🔒 بيانات خاصة" : `${m.country || "—"}${m.certificationLevel ? " · " + m.certificationLevel : ""}`}
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                  {isFriend ? (
                    <>
                      <Link href={`/messages?u=${m._id}`} style={{ ...btn("#25D366"), textDecoration: "none", display: "inline-block" }}>💬 رسالة</Link>
                      <button onClick={() => act("remove", m._id)} style={btn("#eef2f6", "#444")}>إزالة</button>
                    </>
                  ) : got ? (
                    <button onClick={() => act("accept", m._id)} style={btn("#1e7e34")}>✓ قبول الطلب</button>
                  ) : sent ? (
                    <button onClick={() => act("decline", m._id)} style={btn("#eef2f6", "#444")}>تم الإرسال · إلغاء</button>
                  ) : (
                    <button onClick={() => act("request", m._id)} style={btn("var(--mid)")}>➕ إضافة صديق</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
