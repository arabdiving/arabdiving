"use client";

import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";

interface Post {
  _id: string;
  content: string;
  user?: { name?: string };
  createdAt?: string;
}
interface Comment {
  _id: string;
  content: string;
  user?: { name?: string };
}

export default function AdminComments() {
  const [enabled, setEnabled] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadSettings = () =>
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setEnabled(d.settings?.commentsEnabled ?? true))
      .catch(() => {});

  const loadComments = (postId: string) =>
    fetch(`${API_BASE}/api/comments/post/${postId}`)
      .then((r) => r.json())
      .then((d) => setComments((p) => ({ ...p, [postId]: d.comments || [] })))
      .catch(() => {});

  const loadPosts = (p: number) =>
    fetch(`${API_BASE}/api/admin/posts?page=${p}&limit=20`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        const list: Post[] = d.posts || [];
        setPosts(list);
        setPages(d.pages || 1);
        list.forEach((p) => loadComments(p._id));
      })
      .catch(() => setMsg("تعذّر تحميل المنشورات"));

  useEffect(() => {
    loadSettings();
    loadPosts(page);
  }, [page]);

  const toggle = async () => {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ commentsEnabled: !enabled }),
    });
    const d = await res.json();
    if (d.success) setEnabled(d.settings.commentsEnabled);
  };

  const delPost = async (id: string) => {
    if (!confirm("حذف هذا المنشور وكل تعليقاته؟")) return;
    await fetch(`${API_BASE}/api/admin/posts/${id}`, { method: "DELETE", headers: authHeaders() });
    loadPosts(page);
  };

  const delComment = async (id: string, postId: string) => {
    await fetch(`${API_BASE}/api/admin/comments/${id}`, { method: "DELETE", headers: authHeaders() });
    loadComments(postId);
  };

  return (
    <div>
      <h1 style={{ color: "var(--navy)", marginBottom: "16px" }}>التعليقات والمنشورات</h1>
      {msg && <p style={{ color: "#c0392b" }}>{msg}</p>}

      <div style={{ background: "white", borderRadius: "14px", padding: "20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div>
          <strong style={{ color: "var(--navy)" }}>التعليقات والتقييمات</strong>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
            {enabled ? "مفعّلة — يمكن للأعضاء إضافة تعليقات وتقييمات." : "معطّلة — لا يمكن إضافة تعليقات أو تقييمات."}
          </p>
        </div>
        <button
          onClick={toggle}
          style={{
            background: enabled ? "#b91c1c" : "#1e7e34",
            color: "white",
            border: "none",
            padding: "10px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "15px",
          }}
        >
          {enabled ? "إيقاف التعليقات" : "تفعيل التعليقات"}
        </button>
      </div>

      <h2 style={{ color: "var(--navy)", fontSize: "20px", marginBottom: "14px" }}>المنشورات</h2>
      {posts.length === 0 && <p style={{ color: "#666" }}>لا توجد منشورات.</p>}

      {pages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page <= 1 ? 0.5 : 1 }}>→ السابق</button>
          <span style={{ padding: "8px 12px", color: "var(--navy)" }}>{page} / {pages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= pages} style={{ background: "var(--mid)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", opacity: page >= pages ? 0.5 : 1 }}>التالي ←</button>
        </div>
      )}

      {posts.map((p) => (
        <div key={p._id} style={{ background: "white", borderRadius: "14px", padding: "18px", marginBottom: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px" }}>
            <div>
              <strong style={{ color: "var(--navy)" }}>{p.user?.name || "عضو"}</strong>
              <p style={{ margin: "8px 0", color: "#333" }}>{p.content}</p>
            </div>
            <button onClick={() => delPost(p._id)} style={{ background: "#b91c1c", color: "white", border: "none", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", flexShrink: 0 }}>حذف المنشور</button>
          </div>

          {(comments[p._id]?.length ?? 0) > 0 && (
            <div style={{ borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" }}>
              {comments[p._id].map((c) => (
                <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", gap: "10px" }}>
                  <span style={{ color: "#444", fontSize: "14px" }}>
                    <strong>{c.user?.name || "عضو"}:</strong> {c.content}
                  </span>
                  <button onClick={() => delComment(c._id, p._id)} style={{ background: "transparent", color: "#b91c1c", border: "1px solid #b91c1c", padding: "3px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit", flexShrink: 0 }}>حذف</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
