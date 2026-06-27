import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

async function getFeaturedCenters() {
  try {
    const res = await fetch(`${API_BASE}/api/partner-centers?featured=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const TIER_BADGE: Record<string, string> = {
  platinum: "💎 بلاتيني",
  gold:     "🥇 ذهبي",
  silver:   "🥈 فضي",
};

const BADGES_AR: Record<string, string> = {
  womenStaff:          "🧕 طاقم نسائي",
  privateTrip:         "🛥️ رحلة خاصة",
  family:              "👨‍👩‍👧‍👦 عائلات",
  separateFacilities:  "🚿 مرافق مستقلة",
  sanitizedGear:       "✨ معدات معقّمة",
  technical:           "⚙️ تقني",
  ecoFriendly:         "🪸 بيئي",
};

interface Center {
  _id: string;
  name: string;
  city?: string;
  country?: string;
  image?: string;
  rating?: number;
  priceFrom?: number;
  currency?: string;
  tier?: string;
  badges?: Record<string, boolean>;
}

function resolveImage(img?: string) {
  if (!img) return null;
  return /^https?:\/\//.test(img) ? img : `/images/${img}`;
}

export default async function HomeDiveCenters() {
  const centers: Center[] = await getFeaturedCenters();

  if (centers.length === 0) return null;

  return (
    <section style={{ padding: "60px 0", background: "white" }}>
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
            }}>مراكز الغوص</span>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,32px)", color: "var(--navy)", margin: 0 }}>
              مراكزنا الشريكة المعتمدة
            </h2>
          </div>
          <Link href="/partner-centers" style={{
            background: "var(--navy)", color: "#fff", padding: "10px 22px",
            borderRadius: "10px", textDecoration: "none", fontWeight: 600,
            fontSize: "14px", whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(13,44,84,0.25)",
          }}>
            كل المراكز ←
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
          {centers.map((center) => {
            const src = resolveImage(center.image);
            const activeBadges = Object.entries(center.badges || {})
              .filter(([, v]) => v)
              .map(([k]) => BADGES_AR[k])
              .filter(Boolean)
              .slice(0, 3);

            return (
              <div key={center._id} style={{
                flex: "0 0 280px",
                scrollSnapAlign: "start",
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                border: "1px solid #e8eef6",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Image */}
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={center.name}
                    style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "100%", height: "160px",
                    background: "linear-gradient(135deg,#0d2c54,#2e75b6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "42px",
                  }}>🤿</div>
                )}

                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  {/* Tier badge */}
                  {center.tier && (
                    <span style={{ fontSize: "11px", color: "#c9a84c", fontWeight: 600 }}>
                      {TIER_BADGE[center.tier] || ""}
                    </span>
                  )}

                  <h3 style={{ margin: 0, color: "var(--navy)", fontSize: "15px", fontWeight: 700 }}>
                    {center.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    📍 {center.city}{center.country ? ` · ${center.country}` : ""}
                  </p>

                  {/* Rating + price */}
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    ⭐ {center.rating?.toFixed(1) || "0.0"}
                    {center.priceFrom ? ` · من ${center.priceFrom} ${center.currency || "$"}` : ""}
                  </p>

                  {/* Badges */}
                  {activeBadges.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                      {activeBadges.map((b, i) => (
                        <span key={i} style={{
                          background: "#f0f5ff", color: "var(--navy)",
                          fontSize: "10px", padding: "3px 8px", borderRadius: "20px", fontWeight: 600,
                        }}>{b}</span>
                      ))}
                    </div>
                  )}

                  <Link href={`/partner-centers/${center._id}`} style={{
                    display: "inline-block", marginTop: "auto", paddingTop: "10px",
                    color: "var(--mid)", fontSize: "13px", fontWeight: 600, textDecoration: "none",
                  }}>
                    احجز الآن ←
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
