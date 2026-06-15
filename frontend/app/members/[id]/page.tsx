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
}

export default function MemberProfile() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch(`${API_BASE}/api/posts/user/${id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(console.error);
  }, [id]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotice("يرجى تسجيل الدخول أولًا.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/${id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setFollowing(true);
        setUser((prev) =>
          prev ? { ...prev, followersCount: (prev.followersCount || 0) + 1 } : prev
        );
      } else {
        setNotice(data.message || "تعذّر تنفيذ العملية.");
      }
    } catch (error) {
      console.error(error);
      setNotice("تعذّر الاتصال بالخادم.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">جارٍ تحميل الملف...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center text-red-600">تعذّر العثور على هذا العضو.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-4xl overflow-hidden">
              {user.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                "👤"
              )}
            </div>
          </div>

          <div className="flex-1 text-right">
            <h1 className="text-4xl font-bold mb-4">{user.name}</h1>

            <button
              onClick={handleFollow}
              disabled={following}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
            >
              {following ? "تمت المتابعة" : "متابعة"}
            </button>
            {notice && <p className="text-red-600 mb-3">{notice}</p>}

            <div className="grid md:grid-cols-2 gap-4">
              <div><strong>الدولة:</strong> {user.country || "غير محدد"}</div>
              <div><strong>المدينة:</strong> {user.city || "غير محدد"}</div>
              <div><strong>الشهادة:</strong> {user.certificationLevel || "غير محدد"}</div>
              <div><strong>إجمالي الغوصات:</strong> {user.divesCount || 0}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded text-center">
                <div className="text-2xl font-bold">{user.divesCount || 0}</div>
                <div>غوصات</div>
              </div>
              <div className="bg-blue-50 p-4 rounded text-center">
                <div className="text-2xl font-bold">{posts.length}</div>
                <div>منشورات</div>
              </div>
              <div className="bg-blue-50 p-4 rounded text-center">
                <div className="text-2xl font-bold">{user.followersCount || 0}</div>
                <div>متابِعون</div>
              </div>
              <div className="bg-blue-50 p-4 rounded text-center">
                <div className="text-2xl font-bold">{user.followingCount || 0}</div>
                <div>يتابِع</div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">نبذة</h2>
              <p>{user.bio || "لا توجد نبذة بعد."}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">أحدث المنشورات</h2>
              {posts.length === 0 ? (
                <p>لا توجد منشورات بعد.</p>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post._id} className="border rounded p-3">
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
