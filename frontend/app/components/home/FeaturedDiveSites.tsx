import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc, imagePlaceholder } from "@/app/lib/image";
import { difficultyAr } from "@/app/lib/labels";

async function getHomeContent() {
  try {
    const res = await fetch(`${API_BASE}/api/content/home`, { cache: "no-store" });
    if (!res.ok) return null;
    const d = await res.json();
    return d.data;
  } catch {
    return null;
  }
}

async function getDiveSites() {
  try {
    const res = await fetch(`${API_BASE}/api/dive-sites`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

interface Site {
  _id: string;
  name: string;
  city?: string;
  depth?: number;
  difficulty?: string;
  image?: string;
  averageRating?: number;
  reviewsCount?: number;
}

export default async function FeaturedDiveSites() {
  const sites: Site[] = await getDiveSites();
  const home = await getHomeContent();
  const featuredTitle = home?.featuredTitle || "أشهر مواقع الغوص";

  return (
    <section style={{ padding: "80px 40px", background: "#f8fafc" }}>
      <h2 style={{ textAlign: "center", fontSize: "38px", marginBottom: "50px", color: "var(--navy)" }}>
        {featuredTitle}
      </h2>

      {sites.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          لا تتوفر مواقع غوص حاليًا. تأكد من تشغيل الخادم أو حاول لاحقًا.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
            gap: "30px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {sites.map((site) => {
            const src = siteImageSrc(site.image);
            return (
              <div
                key={site._id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                }}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={site.name}
                    style={{ width: "100%", height: "250px", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "250px", background: imagePlaceholder }} />
                )}

                <div style={{ padding: "25px" }}>
                  <h3 style={{ marginBottom: "10px", color: "var(--navy)" }}>{site.name}</h3>
                  <p>⭐ {site.averageRating?.toFixed(1) || "0.0"}</p>
                  <p>📝 {site.reviewsCount || 0} تقييم</p>
                  <p>📍 {site.city}</p>
                  <p>🌊 العمق: {site.depth} متر</p>
                  <p>🎚 {difficultyAr(site.difficulty)}</p>

                  <Link
                    href={`/dive-sites/${site._id}`}
                    style={{
                      display: "inline-block",
                      marginTop: "15px",
                      background: "#0f3d75",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "10px",
                    }}
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
