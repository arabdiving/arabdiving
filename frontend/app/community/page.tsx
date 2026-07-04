"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { API_BASE } from "@/app/lib/api";
import { uploadImage } from "@/app/lib/uploadImage";
import ShareButtons from "../components/ShareButtons";
import VideoEmbed from "../components/VideoEmbed";
import LinkPreviewCard, { LinkPreview } from "../components/LinkPreviewCard";

const API = API_BASE;

const STORY_RINGS = ["linear-gradient(135deg,#e11d48,#f43f5e)","linear-gradient(135deg,#a855f7,#c084fc)","linear-gradient(135deg,#059669,#34d399)","linear-gradient(135deg,#0891b2,#22d3ee)","linear-gradient(135deg,#2563eb,#60a5fa)","linear-gradient(135deg,#7c3aed,#a855f7)","linear-gradient(135deg,#c9952a,#e8a830)","linear-gradient(135deg,#db2777,#f472b6)"];

interface User { _id: string; name: string; role?: string; }
interface Comment { _id: string; content: string; user?: User; }
interface Post {
  _id: string; content: string; image?: string; video?: string;
  linkPreview?: LinkPreview; user?: User; likes: string[]; createdAt: string;
}

function extractUrl(text: string): string {
  const m = text.match(/https?:\/\/[^\s]+/);
  return m ? m[0] : "";
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "images" | "videos">("all");
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
  const [postVideo, setPostVideo] = useState("");
  const [editPostVideo, setEditPostVideo] = useState("");
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDismissed, setPreviewDismissed] = useState(false);
  const lastFetchedUrl = useRef("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const getCurrentUser = (): User | null => {
    try { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; } catch { return null; }
  };
  const getToken = () => localStorage.getItem("token");
  const currentUser = typeof window !== "undefined" ? getCurrentUser() : null;

  const loadComments = async (postId: string) => {
    try {
      const res = await fetch(`${API}/api/comments/post/${postId}`);
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
    } catch (e) { console.error(e); }
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
    } catch { setError("تعذّر تحميل منشورات المجتمع."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadPosts();
    fetch(`${API}/api/settings`).then((r) => r.json())
      .then((d) => setCommentsEnabled(d.settings?.commentsEnabled ?? true)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPreview = useCallback(async (url: string) => {
    if (!url || url === lastFetchedUrl.current) return;
    lastFetchedUrl.current = url;
    setPreviewLoading(true);
    setPreviewDismissed(false);
    try {
      const res = await fetch(`${API}/api/og-preview?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.success && data.preview?.title) setLinkPreview(data.preview);
      else setLinkPreview(null);
    } catch { setLinkPreview(null); }
    finally { setPreviewLoading(false); }
  }, []);

  const handleContentChange = (val: string) => {
    setContent(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const url = extractUrl(val);
    if (!url) { setLinkPreview(null); lastFetchedUrl.current = ""; return; }
    if (!previewDismissed) {
      debounceRef.current = setTimeout(() => fetchPreview(url), 800);
    }
  };

  const pickImage = async (file: File | undefined, setter: (url: string) => void) => {
    if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setter(url); }
    catch (e: any) { alert(e.message || "تعذّر رفع الصورة"); }
    finally { setUploading(false); }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) { setError("يرجى تسجيل الدخول لنشر مشاركة."); return; }
    if (!content.trim() && !postImage && !postVideo) return;
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          content, image: postImage, video: postVideo,
          linkPreview: (!previewDismissed && linkPreview) ? linkPreview : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(""); setPostImage(""); setPostVideo(""); setLinkPreview(null);
        lastFetchedUrl.current = ""; setPreviewDismissed(false);
        if (fileRef.current) fileRef.current.value = "";
        loadPosts();
      }
    } catch { setError("تعذّر النشر."); }
  };

  const savePostEdit = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API}/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: editPostText, image: editPostImage, video: editPostVideo }),
    });
    const data = await res.json();
    if (data.success) { setEditingPost(null); loadPosts(); }
    else alert(data.message || "تعذّر تعديل المنشور.");
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
    if (!token) { alert("يرجى تسجيل الدخول أولًا."); return; }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    const res = await fetch(`${API}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ postId, content: text }),
    });
    const data = await res.json();
    if (data.success) { setCommentInputs((prev) => ({ ...prev, [postId]: "" })); loadComments(postId); }
    else alert(data.message || "تعذّر إضافة التعليق.");
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
    if (data.success) { setEditingComment(null); setEditingCommentText(""); loadComments(postId); }
    else alert(data.message || "تعذّر تعديل التعليق.");
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>جارٍ التحميل...</div>;
  if (error) return <div style={{ padding: "40px", textAlign: "center", color: "#c0392b" }}>{error}</div>;

  const btn = (bg: string): React.CSSProperties => ({
    background: bg, color: "#fff", border: "none", padding: "8px 15px",
    borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
  });

  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      part.match(urlRegex)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "#2e75b6", textDecoration: "underline", fontWeight: "bold", wordBreak: "break-all" }}>{part}</a>
        : part
    );
  };

  const myPosts = posts.filter((p) => p.user?._id === currentUser?._id);
  const authors = Array.from(new Map(posts.filter((p) => p.user).map((p) => [p.user!._id, p.user!] as [string, User])).values()).slice(0, 8);
  const shownPosts = posts.filter((p) => (filter === "images" ? !!p.image : filter === "videos" ? !!p.video : true));

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 18px 60px" }}>
      <div style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 80% 0%, #1a2f5e 0%, #0a1428 62%)", color: "white", borderRadius: "24px", padding: "44px 32px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.35)", color: "#c084fc", fontSize: "13px", fontWeight: 700, padding: "7px 16px", borderRadius: "30px", marginBottom: "16px" }}>● 12,000+ غوّاص من 18 دولة</span>
        <h1 style={{ margin: 0, fontSize: "clamp(28px,6vw,46px)", fontWeight: 900, letterSpacing: "-1px" }}>مجتمع الغوّاصين العرب</h1>
        <p style={{ margin: "12px 0 22px", color: "rgba(255,255,255,0.65)", fontSize: "clamp(15px,3vw,18px)", maxWidth: "520px", lineHeight: 1.8 }}>شارك تجاربك، تواصل مع غوّاصين، اكتشف مواقع جديدة.</p>
        <a href="#composer" style={{ background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", padding: "13px 28px", borderRadius: "12px", fontWeight: 800, fontSize: "15px", boxShadow: "0 8px 24px rgba(201,149,42,0.4)" }}>📸 شارك تجربتك</a>
      </div>

      <div className="community-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "22px", alignItems: "start" }}>
        <aside style={{ position: "sticky", top: "90px", display: "grid", gap: "16px" }}>
          {currentUser ? (
            <div style={{ background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", borderRadius: "18px", padding: "20px", backdropFilter: "blur(14px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "22px", flexShrink: 0 }}>{(currentUser.name || "؟").trim().charAt(0)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: "17px" }}>أهلًا، {currentUser.name}!</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>عضو مجتمع الغوص</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "center", marginBottom: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "12px 6px" }}><div style={{ color: "#22d3ee", fontWeight: 900, fontSize: "20px" }}>{myPosts.length}</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11.5px" }}>منشوراتي</div></div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "12px 6px" }}><div style={{ color: "#34d399", fontWeight: 900, fontSize: "20px" }}>{posts.length}</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11.5px" }}>منشورات المجتمع</div></div>
              </div>
              <a href="/profile" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "11px", borderRadius: "11px", fontWeight: 700, fontSize: "14px" }}>عرض ملفي الشخصي</a>
            </div>
          ) : (
            <div style={{ background: "var(--glass-bg,rgba(8,20,48,0.78))", border: "1px solid var(--glass-border,rgba(255,255,255,0.08))", borderRadius: "18px", padding: "22px", textAlign: "center", backdropFilter: "blur(14px)" }}>
              <div style={{ fontSize: "38px", marginBottom: "8px" }}>🤿</div>
              <p style={{ color: "#fff", fontWeight: 700, marginBottom: "12px" }}>انضم لمجتمع الغوّاصين</p>
              <a href="/register" style={{ display: "block", background: "linear-gradient(135deg,#c9952a,#e8a830)", color: "#04121f", padding: "11px", borderRadius: "11px", fontWeight: 800, marginBottom: "8px" }}>أنشئ حساب</a>
              <a href="/login" style={{ display: "block", color: "#22d3ee", fontWeight: 700, fontSize: "14px" }}>تسجيل الدخول</a>
            </div>
          )}
        </aside>

        <div style={{ minWidth: 0 }}>
          {authors.length > 0 && (
            <div style={{ display: "flex", gap: "14px", overflowX: "auto", padding: "4px 2px 16px" }}>
              {authors.map((a, i) => (
                <div key={a._id} style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ width: "58px", height: "58px", borderRadius: "50%", padding: "2px", background: STORY_RINGS[i % STORY_RINGS.length] }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0a1428", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "20px" }}>{(a.name || "؟").trim().charAt(0)}</div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginTop: "5px", maxWidth: "62px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
            {([["all", "🌊 كل المنشورات"], ["images", "📷 صور"], ["videos", "🎬 فيديو"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ background: filter === k ? "var(--mid)" : "rgba(255,255,255,0.05)", color: filter === k ? "#04121f" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "22px", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: 700 }}>{l}</button>
            ))}
          </div>

      <form id="composer" onSubmit={createPost} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #eef2f6", marginBottom: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
        <textarea rows={3} placeholder="شارك تجربتك في الغوص... أو الصق رابطًا" value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontFamily: "inherit" }} />

        {previewLoading && <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>جارٍ جلب معاينة الرابط...</p>}
        {linkPreview && !previewDismissed && !previewLoading && (
          <LinkPreviewCard preview={linkPreview} onRemove={() => { setPreviewDismissed(true); setLinkPreview(null); }} />
        )}

        {postImage && <img src={postImage} alt="" style={{ maxHeight: "180px", borderRadius: "10px", marginTop: "10px" }} />}
        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <input value={postVideo} onChange={(e) => setPostVideo(e.target.value)} placeholder="رابط فيديو (YouTube/Vimeo) أو ارفع ملفًا"
            style={{ flex: "1 1 220px", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", fontFamily: "inherit" }} />
          <label style={{ ...btn("#64748b"), display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            رفع فيديو <input type="file" accept="video/*" hidden onChange={(e) => pickImage(e.target.files?.[0], setPostVideo)} />
          </label>
          {postVideo && <button type="button" onClick={() => setPostVideo("")} style={{ ...btn("#b91c1c"), padding: "6px 12px", fontSize: "13px" }}>إزالة الفيديو</button>}
        </div>
        {postVideo && <div style={{ marginTop: "10px" }}><VideoEmbed src={postVideo} /></div>}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px", flexWrap: "wrap" }}>
          <label style={{ ...btn("#64748b"), display: "inline-flex", alignItems: "center", gap: "6px" }}>
            اضافة صورة <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0], setPostImage)} />
          </label>
          {postImage && <button type="button" onClick={() => setPostImage("")} style={{ ...btn("#b91c1c"), padding: "6px 12px", fontSize: "13px" }}>إزالة الصورة</button>}
          {uploading && <span style={{ color: "#666", fontSize: "13px" }}>جارٍ الرفع...</span>}
          <button type="submit" style={{ ...btn("#0f3d75"), marginInlineStart: "auto", padding: "10px 18px" }}>نشر</button>
        </div>
      </form>

      {shownPosts.map((post) => {
        const canManage = currentUser?.role === "admin" || currentUser?._id === post.user?._id;
        const isEditing = editingPost === post._id;
        return (
          <div key={post._id} style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg,#2e75b6,#0d2c54)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px", flexShrink: 0 }}>
                {(post.user?.name || "؟").trim().charAt(0)}
              </div>
              <h3 style={{ color: "var(--navy)", margin: 0 }}>{post.user?.name || "عضو غير معروف"}</h3>
            </div>

            {isEditing ? (
              <div style={{ marginTop: "10px" }}>
                <textarea rows={3} value={editPostText} onChange={(e) => setEditPostText(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", fontFamily: "inherit" }} />
                {editPostImage && <img src={editPostImage} alt="" style={{ maxHeight: "160px", borderRadius: "10px", marginTop: "8px" }} />}
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <input value={editPostVideo} onChange={(e) => setEditPostVideo(e.target.value)} placeholder="رابط فيديو"
                    style={{ flex: "1 1 200px", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit" }} />
                  <label style={{ ...btn("#64748b"), padding: "6px 12px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    رفع فيديو <input type="file" accept="video/*" hidden onChange={(e) => pickImage(e.target.files?.[0], setEditPostVideo)} />
                  </label>
                  {editPostVideo && <button onClick={() => setEditPostVideo("")} style={{ ...btn("#b91c1c"), padding: "6px 12px", fontSize: "13px" }}>إزالة</button>}
                </div>
                {editPostVideo && <div style={{ marginTop: "8px" }}><VideoEmbed src={editPostVideo} /></div>}
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                  <label style={{ ...btn("#64748b"), padding: "6px 12px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    تغيير الصورة <input type="file" accept="image/*" hidden onChange={(e) => pickImage(e.target.files?.[0], setEditPostImage)} />
                  </label>
                  {editPostImage && <button onClick={() => setEditPostImage("")} style={{ ...btn("#b91c1c"), padding: "6px 12px", fontSize: "13px" }}>إزالة</button>}
                  <button onClick={() => savePostEdit(post._id)} style={{ ...btn("#1e7e34"), padding: "6px 14px", fontSize: "13px" }}>حفظ</button>
                  <button onClick={() => setEditingPost(null)} style={{ ...btn("#64748b"), padding: "6px 14px", fontSize: "13px" }}>إلغاء</button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ marginTop: "10px", marginBottom: "12px", whiteSpace: "pre-wrap" }}>{renderTextWithLinks(post.content)}</p>
                {post.image && <img src={post.image} alt="" style={{ width: "100%", maxHeight: "420px", objectFit: "cover", borderRadius: "12px", marginBottom: "12px" }} />}
                {post.video && <div style={{ marginBottom: "12px" }}><VideoEmbed src={post.video} /></div>}
                {post.linkPreview?.url && <LinkPreviewCard preview={post.linkPreview} />}
              </>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" }}>
              <button onClick={() => likePost(post._id)} style={btn("#0f3d75")}>❤️ {post.likes?.length || 0}</button>
              {canManage && !isEditing && (
                <>
                  <button onClick={() => { setEditingPost(post._id); setEditPostText(post.content); setEditPostImage(post.image || ""); setEditPostVideo(post.video || ""); }} style={btn("#2e75b6")}>✏️ تعديل</button>
                  <button onClick={() => deletePost(post._id)} style={btn("#b91c1c")}>حذف</button>
                </>
              )}
              <div style={{ marginInlineStart: "auto" }}>
                <ShareButtons title={post.content?.slice(0, 60)} url={`${typeof window !== "undefined" ? window.location.origin : ""}/community/${post._id}`} compact />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4>التعليقات</h4>
              {commentsEnabled ? (
                <>
                  <input type="text" placeholder="اكتب تعليقًا..." value={commentInputs[post._id] || ""}
                    onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))}
                    style={{ width: "100%", padding: "10px", marginTop: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit" }} />
                  <button onClick={() => createComment(post._id)} style={btn("#0f3d75")}>اضف تعليقًا</button>
                </>
              ) : <p style={{ color: "#9a6f1f", marginTop: "10px" }}>التعليقات معطّلة حاليًا.</p>}
              <div style={{ marginTop: "15px" }}>
                {comments[post._id]?.length ? comments[post._id].map((c) => {
                  const canEdit = currentUser?.role === "admin" || currentUser?._id === c.user?._id;
                  const editing = editingComment === c._id;
                  return (
                    <div key={c._id} style={{ borderTop: "1px solid #eee", padding: "10px 0" }}>
                      <strong>{c.user?.name || "عضو"}</strong>
                      {editing ? (
                        <div style={{ marginTop: "6px" }}>
                          <input value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "inherit", marginBottom: "8px" }} />
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => saveCommentEdit(post._id, c._id)} style={{ ...btn("#1e7e34"), padding: "6px 14px", fontSize: "13px" }}>حفظ</button>
                            <button onClick={() => { setEditingComment(null); setEditingCommentText(""); }} style={{ ...btn("#64748b"), padding: "6px 14px", fontSize: "13px" }}>الغاء</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p style={{ whiteSpace: "pre-wrap" }}>{renderTextWithLinks(c.content)}</p>
                          {canEdit && <button onClick={() => { setEditingComment(c._id); setEditingCommentText(c.content); }} style={{ background: "transparent", color: "var(--mid)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", padding: 0 }}>تعديل</button>}
                        </>
                      )}
                    </div>
                  );
                }) : <p style={{ color: "#666" }}>كن اول غوّاص يعلّق.</p>}
              </div>
            </div>
            <br />
            <small style={{ color: "#888" }}>{new Date(post.createdAt).toLocaleString("ar-EG")}</small>
          </div>
        );
      })}
        </div>
      </div>
    </div>
  );
}
