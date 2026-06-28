import Link from "next/link";
import { API_BASE } from "@/app/lib/api";
import { siteImageSrc, imagePlaceholder } from "@/app/lib/image";
import { difficultyAr } from "@/app/lib/labels";

async function getFeaturedSites() {
  try {
    const res = await fetch(`${API_BASE}/api/dive-sites?featured=true`, {
      next: { revalidate: 60 },
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
  const sites: Site[] = await getFeaturedSites();

  if (sites.length === 0) return null;

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
            }}>مواقع الغوص</span>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,32px)", color: "var(--navy)", margin: 0 }}>
              أشهر مواقع الغوص
            </h2>
          </div>
          <Link href="/dive-sites" style={{
            background: "var(--navy)", color: "#fff", padding: "10px 22px",
            borderRadius: "10px", textDecoration: "none", fontWeight: 600,
            fontSize: "14px", whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(13,44,84,0.25)",
          }}>
            كل المواقع ←
          </Link>
        </div>

        {/* Horizontal scroll row */}
        <div style={{
          display: "flex",
          gap: "18px",
          overflowX: "auto",
          paddingBottom: "16px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}>
          {sites.map((site) => {
            const src = siteImageSrc(site.image);
            return (
              <div key={site._id} style={{
                flex: "0 0 280px",
                scrollSnapAlign: "start",
                background: "var(--surface)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
              }}>
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={site.name}
                    style={{ width: "100%", height: "170px", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "170px", background: imagePlaceholder }} />
                )}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <h3 style={{ margin: 0, color: "var(--navy)", fontSize: "15px", fontWeight: 700 }}>
                    {site.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    📍 {site.city} &nbsp;·&nbsp; 🌊 {site.depth}م
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    ⭐ {site.averageRating?.toFixed(1) || "0.0"} &nbsp;·&nbsp; {difficultyAr(site.difficulty)}
                  </p>
                  <Link href={`/dive-sites/${site._id}`} style={{
                    display: "inline-block", marginTop: "auto", paddingTop: "10px",
                    color: "var(--mid)", fontSize: "13px", fontWeight: 600, textDecoration: "none",
                  }}>
                    عرض التفاصيل ←
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
