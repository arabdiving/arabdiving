"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import LinkPreviewCard, { LinkPreview } from "../LinkPreviewCard";
import VideoEmbed from "../VideoEmbed";

interface Post {
  _id: string;
  content: string;
  image?: string;
  video?: string;
  linkPreview?: LinkPreview;
  user?: { _id: string; name: string };
  likes: string[];
  createdAt: string;
}

/** نفس دالة صفحة المجتمع — تحوّل الروابط في النص إلى <a> قابلة للضغط */
function renderTextWithLinks(text: string) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) =>
    part.match(urlRegex)
      ? (
        <a
          key={i} href={part} target="_blank" rel="noopener noreferrer"
          style={{ color: "#2e75b6", textDecoration: "underline", fontWeight: "bold", wordBreak: "break-all" }}
          onClick={(e) => e.stopPropagation()}  // يمنع فتح البوست بدل الرابط
        >
          {part}
        </a>
      )
      : part
  );
}

export default function HomeCommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/posts`)
      .then((r) => r.json())
      .then((d) => setPosts((d.posts || []).slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: "60px 0", background: "var(--background)" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "28px",
          flexWrap: "wrap", gap: "12px",
        }}>
          <div>
            <span style={{
              display: "inline-block", background: "rgba(46,117,182,0.12)",
              color: "var(--mid)", padding: "5px 16px", borderRadius: "30px",
              fontSize: "13px", marginBottom: "8px",
            }}>المجتمع</span>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,32px)", color: "var(--navy)", margin: 0 }}>
              آخر ما شاركه الغوّاصون
            </h2>
          </div>
          <Link href="/community" style={{
            background: "var(--navy)", color: "#fff", padding: "10px 22px",
            borderRadius: "10px", textDecoration: "none", fontWeight: 600,
            fontSize: "14px", whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(13,44,84,0.25)",
          }}>
            انضم للمجتمع ←
          </Link>
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "#888", padding: "30px 0" }}>جارٍ التحميل...</div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", color: "#888", padding: "30px 0" }}>
            <p style={{ fontSize: "17px", marginBottom: "10px" }}>كن أول من يشارك تجربته!</p>
            <Link href="/community" style={{ color: "var(--mid)", fontWeight: 600 }}>ابدأ المشاركة ←</Link>
          </div>
        )}

        {/* Horizontal scroll row */}
        {posts.length > 0 && (
          <>
            <div style={{
              display: "flex",
              alignItems: "flex-start",   /* ← كل كارت يأخذ ارتفاعه الطبيعي فقط */
              gap: "18px",
              overflowX: "auto",
              paddingBottom: "16px",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "thin",
            }}>
              {posts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    flex: "0 0 300px",
                    scrollSnapAlign: "start",
                    background: "var(--surface)",
                    borderRadius: "16px",
                    padding: "18px",
                    border: "1px solid #dde8f4",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "linear-gradient(135deg,#2e75b6,#0d2c54)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 700, fontSize: "15px", flexShrink: 0,
                    }}>
                      {(post.user?.name || "؟").charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: "var(--navy)", fontSize: "14px" }}>
                        {post.user?.name || "عضو"}
                      </p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                        {new Date(post.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>

                  {/* Content — truncated to 4 lines with links clickable */}
                  {post.content && (
                    <p style={{
                      margin: 0, color: "#444", lineHeight: 1.7, fontSize: "14px",
                      display: "-webkit-box", WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                      whiteSpace: "pre-wrap",
                    }}>
                      {renderTextWithLinks(post.content)}
                    </p>
                  )}

                  {/* Image */}
                  {post.image && !post.video && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image} alt=""
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px" }} />
                  )}

                  {/* Video */}
                  {post.video && <VideoEmbed src={post.video} />}

                  {/* Link preview */}
                  {post.linkPreview?.url && !post.image && !post.video && (
                    <LinkPreviewCard preview={post.linkPreview} />
                  )}

                  {/* Footer */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginTop: "auto",
                  }}>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>❤️ {post.likes?.length || 0}</span>
                    <Link href={`/community/${post._id}`}
                      style={{ color: "var(--mid)", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                      عرض ←
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Link href="/community" style={{
                display: "inline-block", background: "var(--surface)", color: "var(--navy)",
                border: "2px solid var(--navy)", padding: "10px 28px",
                borderRadius: "10px", fontWeight: 600, textDecoration: "none", fontSize: "14px",
              }}>
                عرض كل المنشورات
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
