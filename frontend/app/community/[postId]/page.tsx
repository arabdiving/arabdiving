import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import ShareButtons from "../../components/ShareButtons";
import VideoEmbed from "../../components/VideoEmbed";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arabdiving.com";

async function getPost(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/posts/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const d = await res.json();
    return d?.post || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getPost(postId);
  if (!post) return { title: "منشور" };
  const text = (post.content || "منشور في مجتمع ArabDiving").slice(0, 80);
  const img = post.image || `${SITE_URL}/og-default.png`;
  return {
    title: text,
    description: post.content || "منشور في مجتمع الغوص العربي",
    openGraph: { title: `${post.user?.name || "عضو"} في ArabDiving`, description: text, images: [img] },
    twitter: { card: "summary_large_image", title: `${post.user?.name || "عضو"} في ArabDiving`, description: text, images: [img] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getPost(postId);

  if (!post) {
    return (
      <div style={{ maxWidth: "700px", margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ color: "var(--navy)", marginBottom: "12px" }}>المنشور غير موجود</h1>
        <Link href="/community" style={{ color: "var(--mid)" }}>← العودة إلى المجتمع</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "clamp(20px, 5vw, 40px) 16px" }}>
      <Link href="/community" style={{ color: "var(--mid)", fontSize: "14px" }}>← كل المنشورات</Link>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "22px", marginTop: "16px" }}>
        <h3 style={{ color: "var(--navy)" }}>{post.user?.name || "عضو"}</h3>
        <p style={{ margin: "12px 0", lineHeight: 1.9, fontSize: "17px" }}>{post.content}</p>
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt="" style={{ width: "100%", maxWidth: "100%", borderRadius: "12px", marginBottom: "12px" }} />
        )}
        {post.video && (
          <div style={{ marginBottom: "12px" }}>
            <VideoEmbed src={post.video} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ color: "#666" }}>❤️ {post.likes?.length || 0}</span>
          <div style={{ marginInlineStart: "auto" }}>
            <ShareButtons title={(post.content || "").slice(0, 60)} />
          </div>
        </div>
      </div>
    </div>
  );
}
