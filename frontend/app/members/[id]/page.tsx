"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { useParams } from "next/navigation";

interface User {
  _id: string;
  name: string;
  country?: string;
  city?: string;
  certificationLevel?: string;
  divesCount?: number;
  bio?: string;
  profileImage?: string;
  followersCount?: number;
  followingCount?: number;
  following?: boolean;
  relation?: string;
}

export default function MemberProfile() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const currentUserId = typeof window !== "undefined" ? (() => { try { return JSON.parse(localStorage.getItem("user") || "{}")._id; } catch { return null; } })() : null;

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } })
      .then((res) => res.json())
      .then((data) => {
        const u = data.user || null;
        setUser(u);
        setFollowing(u?.following || false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch(`${API_BASE}/api/posts/user/${id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.error);
  }, [id]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setNotice("يرجى تسجيل الدخول أولًا."); return; }
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}/follow`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setFollowing(true);
        setUser((prev) => prev ? { ...prev, followersCount: (prev.followersCount || 0) + 1 } : prev);
      } else setNotice(data.message || "تعذّر تنفيذ العملية.");
    } catch { setNotice("تعذّر الاتصال بالخادم."); }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setNotice("يرجى تسجيل الدخول أولًا."); return; }
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}/unfollow`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setFollowing(false);
        setUser((prev) => prev ? { ...prev, followersCount: Math.max(0, (prev.followersCount || 0) - 1) } : prev);
      } else setNotice(data.message || "تعذّر تنفيذ العملية.");
    } catch { setNotice("تعذّر الاتصال بالخادم."); }
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>جارٍ تحميل الملف...</div>;

  if (!user) return <div style={{ padding: "60px", textAlign: "center", color: "#c0392b" }}>تعذّر العثور على هذا العضو.</div>;

  const isSelf = currentUserId === user._id;

  const card = {
    background: "white", borderRadius: "14px", padding: "32px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)", maxWidth: "800px", margin: "0 auto",
  } as const;
  const statBox = {
    background: "#eef4fa", borderRadius: "10px", padding: "16px", textAlign: "center" as const,
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "clamp(12px, 4vw, 32px)" }}>
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "20px", textAlign: "center" as const }}>
          <div style={{
            width: "120px", height: "120px", borderRadius: "50%", background: "#e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px",
            overflow: "hidden", flexShrink: 0,
          }}>
            {user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profileImage} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : "👤"}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--navy)", marginBottom: "12px" }}>{user.name}</h1>

            {!isSelf && (
              <>
                {following ? (
                  <button onClick={handleUnfollow} style={{ background: "#b91c1c", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", marginBottom: "12px" }}>
                    إلغاء المتابعة
                  </button>
                ) : (
                  <button onClick={handleFollow} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", marginBottom: "12px" }}>
                    متابعة
                  </button>
                )}
              </>
            )}
            {notice && <p style={{ color: "#c0392b", fontSize: "14px", marginBottom: "12px" }}>{notice}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "15px", marginBottom: "20px" }}>
              <div><strong>الدولة:</strong> {user.country || "غير محدد"}</div>
              <div><strong>المدينة:</strong> {user.city || "غير محدد"}</div>
              <div><strong>الشهادة:</strong> {user.certificationLevel || "غير محدد"}</div>
              <div><strong>إجمالي الغوصات:</strong> {user.divesCount || 0}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
              <div style={statBox}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--navy)" }}>{user.divesCount || 0}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>غوصات</div>
              </div>
              <div style={statBox}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--navy)" }}>{posts.length}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>منشورات</div>
              </div>
              <div style={statBox}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--navy)" }}>{user.followersCount || 0}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>متابِعون</div>
              </div>
              <div style={statBox}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--navy)" }}>{user.followingCount || 0}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>يتابِع</div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>نبذة</h2>
              <p style={{ color: "#555", lineHeight: 1.7 }}>{user.bio || "لا توجد نبذة بعد."}</p>
            </div>

            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--navy)", marginBottom: "12px" }}>أحدث المنشورات</h2>
              {posts.length === 0 ? (
                <p style={{ color: "#666" }}>لا توجد منشورات بعد.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {posts.map((post) => (
                    <div key={post._id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px" }}>
                      {post.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
