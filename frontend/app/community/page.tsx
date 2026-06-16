"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { uploadImage } from "@/app/lib/uploadImage";
import ShareButtons from "../components/ShareButtons";

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
  image?: string;
  user?: User;
  likes: string[];
  createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [editPostImage, setEditPostImage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const pickImage = async (file: File | undefined, setter: (url: string) => void) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setter(url);
    } catch (e: any) {
      alert(e.message || "تعذّر رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("يرجى تسجيل الدخول لنشر مشاركة.");
      return;
    }
    if (!content.trim() && !postImage) return;
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content, image: postImage }),
      });
      const data = await res.json();
      if (data.success) {
        setContent("");
        setPostImage("");
        if (fileRef.current) fileRef.current.value = "";
        loadPosts();
      }
    } catch {
      setError("تعذّر النشر.");
    }
  };

  const savePostEdit = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API}/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: editPostText, image: editPostImage }),
    });
    const data = await res.json();
    if (data.success) {
      setEditingPost(null);
      loadPosts();
    } else alert(data.message || "تعذّر تعديل المنشور.");
  };

  const likePost = async (id: string) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API}/api/posts/${id}/like`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    loadPosts();
  };

  const deletePost = async (id: string) => {
    const token = getToken();
    if (!token) return;
    if (!confirm("حذف هذا المنشور؟")) return;
    await fetch(`${API}/api/posts/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
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
    } else alert(data.message || "تعذّر إضافة التعليق.");
  };

  const saveCommentEdit = async (postId: string, commentId: string) => {
    const token = getToken();
    if (!token || !editingCommentText.trim()) return;
    const res = await fetch(`${API}/api/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: editingCommentText }),
    });
    const data = await res.json();
    if (data.success) {
      setEditingComment(null);
      setEditingCommentText("");
      loadComments(postId);
    } else alert(data.message || "تعذّر تعديل التعليق.");
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
          rows={3}
          placeholder="شارك تجربتك في الغوص..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontFamily: "inherit" }}
        />
        {postImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={postImage} alt="" style={{ maxHeight: "180px", borderRadius: "10px", marginTop: "10px" }} />
        )}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px", flexWrap: "wrap" }}>
          <label style={{ ...btn("#64748b"), display: "inline-flex", alignItems: "center", gap: "6px" }}>
            🖼️ إضافة صورة
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0], setPostImage)} />
          </label>
          {postImage && <button type="button" onClick={() => setPostImage("")} style={{ ...btn("#b91c1c"), padding: "6px 12px", fontSize: "13px" }}>إزالة الصورة</button>}
          {uploading && <span style={{ color: "#666", fontSize: "13px" }}>جارٍ الرفع...</span>}
          <button type="submit" style={{ ...btn("#0f3d75"), marginInlineStart: "auto", padding: "10px 18px" }}>نشر</button>
        </div>
      </form>

      {posts.map((post) => {
        const canManage = currentUser?.role === "admin" || currentUser?._id === post.user?._id;
        const isEditing = editingPost === post._id;
        return (
          <div key={post._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
            <h3 style={{ color: "var(--navy)" }}>{post.user?.name || "عضو غير معروف"}</h3>

            {isEditing ? (
              <div style={{ marginTop: "10px" }}>
                <textarea
                  rows={3}
                  value={editPostText}
                  onChange={(e) => setEditPostText(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", fontFamily: "inherit" }}
                />
                {editPostImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editPostImage} alt="" style={{ maxHeight: "160px", borderRadius: "10px", marginTop: "8px" }} />
                )}
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                  <label style={{ ...btn("#64748b"), padding: "6px 12px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    🖼️ تغيير الصورة
                    <input type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0], setEditPostImage)} />
                  </label>
                  {editPostImage && <button onClick={() => setEditPostImage("")} style={{ ...btn("#b91c1c"), padding: "6px 12px", fontSize: "13px" }}>إزالة الصورة</button>}
                  <button onClick={() => savePostEdit(post._id)} style={{ ...btn("#1e7e34"), padding: "6px 14px", fontSize: "13px" }}>حفظ</button>
                  <button onClick={() => setEditingPost(null)} style={{ ...btn("#64748b"), padding: "6px 14px", fontSize: "13px" }}>إلغاء</button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ marginTop: "10px", marginBottom: "12px" }}>{post.content}</p>
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt="" style={{ width: "100%", maxHeight: "420px", objectFit: "cover", borderRadius: "12px", marginBottom: "12px" }} />
                )}
              </>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => likePost(post._id)} style={btn("#0f3d75")}>❤️ {post.likes?.length || 0}</button>
              {canManage && !isEditing && (
                <>
                  <button onClick={() => { setEditingPost(post._id); setEditPostText(post.content); setEditPostImage(post.image || ""); }} style={btn("#2e75b6")}>✏️ تعديل</button>
                  <button onClick={() => deletePost(post._id)} style={btn("#b91c1c")}>🗑 حذف</button>
                </>
              )}
              <div style={{ marginInlineStart: "auto" }}>
                <ShareButtons title={post.content?.slice(0, 60)} url={`${typeof window !== "undefined" ? window.location.origin : ""}/community/${post._id}`} compact />
              </div>
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
                  comments[post._id].map((c) => {
                    const canEdit = currentUser?.role === "admin" || currentUser?._id === c.user?._id;
                    const editing = editingComment === c._id;
                    return (
                      <div key={c._id} style={{ borderTop: "1px solid #eee", padding: "10px 0" }}>
                        <strong>{c.user?.name || "عضو"}</strong>
                        {editing ? (
                          <div style={{ marginTop: "6px" }}>
                            <input value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit", marginBottom: "8px" }} />
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => saveCommentEdit(post._id, c._id)} style={{ ...btn("#1e7e34"), padding: "6px 14px", fontSize: "13px" }}>حفظ</button>
                              <button onClick={() => { setEditingComment(null); setEditingCommentText(""); }} style={{ ...btn("#64748b"), padding: "6px 14px", fontSize: "13px" }}>إلغاء</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p>{c.content}</p>
                            {canEdit && (
                              <button onClick={() => { setEditingComment(c._id); setEditingCommentText(c.content); }} style={{ background: "transparent", color: "var(--mid)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", padding: 0 }}>✏️ تعديل</button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "#666" }}>كن أول غوّاص يعلّق.</p>
                )}
              </div>
            </div>

            <br />
            <small style={{ color: "#888" }}>{new Date(post.createdAt).toLocaleString("ar-EG")}</small>
          </div>
        );
      })}
    </div>
  );
}
