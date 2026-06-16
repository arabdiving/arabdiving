import ReviewForm from "../../components/ReviewForm";
import { API_BASE } from "@/app/lib/api";
import Gallery from "../../components/Gallery";
import ShareButtons from "../../components/ShareButtons";
import { difficultyAr } from "@/app/lib/labels";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_BASE}/api/dive-sites/${id}`, { cache: "no-store" });
    const d = await res.json();
    const s = d?.diveSite;
    if (!s) return { title: "موقع غوص" };
    const img = (s.images && s.images[0]) || s.image;
    const ogImage = img ? (/^https?:\/\//.test(img) ? img : `/images/${img}`) : "/og-default.png";
    const desc = s.description || "موقع غوص في البحر الأحمر";
    return {
      title: s.name,
      description: desc,
      openGraph: { title: `${s.name} | ArabDiving`, description: desc, images: [ogImage] },
      twitter: { card: "summary_large_image", title: `${s.name} | ArabDiving`, description: desc, images: [ogImage] },
    };
  } catch {
    return { title: "موقع غوص" };
  }
}

async function getDiveSite(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/dive-sites/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getReviews(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/reviews/site/${id}`, { cache: "no-store" });
    if (!res.ok) return { reviews: [] };
    return res.json();
  } catch {
    return { reviews: [] };
  }
}

export default async function DiveSiteDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getDiveSite(id);
  const reviewsData = await getReviews(id);
  const site = data?.diveSite;

  if (!site) {
    return (
      <div style={{ maxWidth: "700px", margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ color: "var(--navy)", marginBottom: "12px" }}>تعذّر العثور على الموقع</h1>
        <p style={{ color: "#666" }}>
          ربما تم حذف هذا الموقع أو أن الخادم غير متاح حاليًا.
        </p>
      </div>
    );
  }

  const gallery = site.images && site.images.length ? site.images : site.image ? [site.image] : [];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
      <Gallery images={gallery} alt={site.name} />

      <h1 style={{ marginTop: "30px", fontSize: "42px", color: "var(--navy)" }}>{site.name}</h1>

      <h3>📍 {site.city}، {site.country}</h3>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px", marginBottom: "20px" }}>
        <span>⭐ {site.averageRating?.toFixed(1) || "0.0"}</span>
        <span>📝 {site.reviewsCount || 0} تقييم</span>
      </div>

      <div style={{ margin: "6px 0 22px" }}>
        <ShareButtons title={site.name} />
      </div>

      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>{site.description}</p>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div style={{ padding: "15px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          🌊 العمق: {site.depth} متر
        </div>
        <div style={{ padding: "15px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
          🎚 {difficultyAr(site.difficulty)}
        </div>
      </div>

      <h2 style={{ marginTop: "50px", marginBottom: "20px", color: "var(--navy)" }}>التقييمات</h2>

      <ReviewForm diveSiteId={site._id} />

      <div style={{ marginTop: "24px" }}>
        {reviewsData.reviews?.length > 0 ? (
          reviewsData.reviews.map((review: any) => (
            <div
              key={review._id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <h4>{review.user?.name || "غواص"}</h4>
              <p>⭐ {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>لا توجد تقييمات بعد. كن أول من يضيف تقييمًا!</p>
        )}
      </div>
    </div>
  );
}
