"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

const API = API_BASE;

interface User {
  _id: string;
  name: string;
  role?: string;
}
interface Comment {
  _id: string;
  content: string;
  user?: User;
}
interface Post {
  _id: string;
  content: string;
  user?: User;
  likes: string[];
  createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const getCurrentUser = (): User | null => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };
  const getToken = () => localStorage.getItem("token");
  const currentUser = typeof window !== "undefined" ? getCurrentUser() : null;

  const loadComments = async (postId: string) => {
    try {
      const res = await fetch(`${API}/api/comments/post/${postId}`);
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
    } catch (e) {
      console.error(e);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/posts`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      const list: Post[] = data.posts || [];
      setPosts(list);
      await Promise.all(list.map((p) => loadComments(p._id)));
    } catch {
      setError("تعذّر تحميل منشورات المجتمع.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    fetch(`${API}/api/settings`)
      .then((r) => r.json())
      .then((d) => setCommentsEnabled(d.settings?.commentsEnabled ?? true))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("يرجى تسجيل الدخول لنشر مشاركة.");
      return;
    }
    if (!content.trim()) return;
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        setContent("");
        loadPosts();
      }
    } catch {
      setError("تعذّر النشر.");
    }
  };

  const likePost = async (id: string) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API}/api/posts/${id}/like`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadPosts();
  };

  const deletePost = async (id: string) => {
    const token = getToken();
    if (!token) return;
    if (!confirm("حذف هذا المنشور؟")) return;
    await fetch(`${API}/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadPosts();
  };

  const createComment = async (postId: string) => {
    const token = getToken();
    if (!token) {
      alert("يرجى تسجيل الدخول أولًا.");
      return;
    }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    const res = await fetch(`${API}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ postId, content: text }),
    });
    const data = await res.json();
    if (data.success) {
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      loadComments(postId);
    } else {
      alert(data.message || "تعذّر إضافة التعليق.");
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>جارٍ التحميل...</div>;
  }
  if (error) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#c0392b" }}>{error}</div>;
  }

  const btn = (bg: string): React.CSSProperties => ({
    background: bg, color: "#fff", border: "none", padding: "8px 15px",
    borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
  });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "30px", color: "var(--navy)" }}>🌊 منشورات المجتمع</h1>

      <form onSubmit={createPost} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e5e7eb", marginBottom: "30px" }}>
        <textarea
          rows={4}
          placeholder="شارك تجربتك في الغوص..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontFamily: "inherit" }}
        />
        <button type="submit" style={{ ...btn("#0f3d75"), marginTop: "12px", padding: "10px 18px" }}>نشر</button>
      </form>

      {posts.map((post) => (
        <div key={post._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ color: "var(--navy)" }}>{post.user?.name || "عضو غير معروف"}</h3>
          <p style={{ marginTop: "10px", marginBottom: "15px" }}>{post.content}</p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => likePost(post._id)} style={btn("#0f3d75")}>
              ❤️ {post.likes?.length || 0}
            </button>
            {(currentUser?.role === "admin" || currentUser?._id === post.user?._id) && (
              <button onClick={() => deletePost(post._id)} style={btn("#b91c1c")}>🗑 حذف</button>
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <h4>💬 التعليقات</h4>

            {commentsEnabled ? (
              <>
                <input
                  type="text"
                  placeholder="اكتب تعليقًا..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))}
                  style={{ width: "100%", padding: "10px", marginTop: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit" }}
                />
                <button onClick={() => createComment(post._id)} style={btn("#0f3d75")}>أضف تعليقًا</button>
              </>
            ) : (
              <p style={{ color: "#9a6f1f", marginTop: "10px" }}>التعليقات معطّلة حاليًا.</p>
            )}

            <div style={{ marginTop: "15px" }}>
              {comments[post._id]?.length ? (
                comments[post._id].map((c) => (
                  <div key={c._id} style={{ borderTop: "1px solid #eee", padding: "10px 0" }}>
                    <strong>{c.user?.name || "عضو"}</strong>
                    <p>{c.content}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#666" }}>كن أول غوّاص يعلّق.</p>
              )}
            </div>
          </div>

          <br />
          <small style={{ color: "#888" }}>{new Date(post.createdAt).toLocaleString("ar-EG")}</small>
        </div>
      ))}
    </div>
  );
}
