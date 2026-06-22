forceupdate
5252029
frontend\app\community\[postId]\page.tsx
import Linkify from "../../components/Linkify";
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