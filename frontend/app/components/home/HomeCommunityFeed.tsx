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

export default function HomeCommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/posts`)
      .then((r) => r.json())
      .then((d) => setPosts((d.posts || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: "70px 20px", background: "#f0f5fb" }}>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(46,117,182,0.12)", color: "var(--mid)", padding: "6px 18px", borderRadius: "30px", fontSize: "14px", marginBottom: "10px" }}>
              المجتمع
            </span>
            <h2 style={{ fontSize: "clamp(26px,4vw,36px)", color: "var(--navy)", margin: 0 }}>
              آخر ما شاركه الغوّاصون
            </h2>
          </div>
          <Link
            href="/community"
            style={{
              background: "var(--navy)", color: "#fff", padding: "12px 24px",
              borderRadius: "12px", textDecoration: "none", fontWeight: 600,
              fontSize: "15px", whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(13,44,84,0.25)",
            }}
          >
            انضم للمجتمع ←
          </Link>
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>جارٍ التحميل...</div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
            <p style={{ fontSize: "18px", marginBottom: "12px" }}>كن أول من يشارك تجربته في الغوص!</p>
            <Link href="/community" style={{ color: "var(--mid)", fontWeight: 600 }}>ابدأ المشاركة ←</Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "22px" }}>
          {posts.map((post) => (
            <div
              key={post._id}
              style={{
                background: "#fff", borderRadius: "16px", padding: "20px",
                border: "1px solid #dde8f4", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", gap: "12px",
              }}
            >
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#2e75b6,#0d2c54)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "17px", flexShrink: 0,
                }}>
                  {(post.user?.name || "؟").charAt(0)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--navy)", fontSize: "15px" }}>
                    {post.user?.name || "عضو"}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                    {new Date(post.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>

              {/* Content */}
              {post.content && (
                <p style={{ margin: 0, color: "#333", lineHeight: 1.7, fontSize: "15px",
                  display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {post.content}
                </p>
              )}

              {/* Image */}
              {post.image && !post.video && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px" }} />
              )}

              {/* Video */}
              {post.video && <VideoEmbed src={post.video} />}

              {/* Link preview */}
              {post.linkPreview?.url && !post.image && !post.video && (
                <LinkPreviewCard preview={post.linkPreview} />
              )}

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>❤️ {post.likes?.length || 0}</span>
                <Link
                  href={`/community/${post._id}`}
                  style={{ color: "var(--mid)", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                >
                  عرض المنشور ←
                </Link>
              </div>
            </div>
          ))}
        </div>

        {posts.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/community" style={{ display: "inline-block", background: "white", color: "var(--navy)", border: "2px solid var(--navy)", padding: "12px 32px", borderRadius: "12px", fontWeight: 600, textDecoration: "none" }}>
              عرض كل المنشورات
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
