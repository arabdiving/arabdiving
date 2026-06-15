import Link from "next/link";
import { siteImageSrc, imagePlaceholder } from "@/app/lib/image";
import { difficultyAr } from "@/app/lib/labels";

export default function DiveSiteCard({ site }: any) {
  const src = siteImageSrc(site.image);
  return (
    <Link
      href={`/dive-sites/${site._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          background: "white",
          cursor: "pointer",
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={site.name}
            style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
          />
        ) : (
          <div
            style={{
              width: "300px",
              height: "200px",
              borderRadius: "10px",
              background: imagePlaceholder,
              flexShrink: 0,
            }}
          />
        )}

        <div>
          <h2 style={{ color: "var(--navy)" }}>{site.name}</h2>
          <p>📍 {site.city}، {site.country}</p>
          <p style={{ color: "#555", lineHeight: 1.7 }}>{site.description}</p>
          <p>🌊 العمق: {site.depth} متر</p>
          <p>🎚 {difficultyAr(site.difficulty)}</p>
        </div>
      </div>
    </Link>
  );
}
