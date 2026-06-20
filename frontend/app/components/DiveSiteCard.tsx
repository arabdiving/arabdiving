import Link from "next/link";
import { siteImageSrc, imagePlaceholder } from "@/app/lib/image";
import { difficultyAr } from "@/app/lib/labels";

export default function DiveSiteCard({ site }: any) {
  const src = siteImageSrc(site.image);
  return (
    <Link href={`/dive-sites/${site._id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "18px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "18px",
          background: "white",
          cursor: "pointer",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "300px" }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={site.name}
              style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "10px", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "190px", borderRadius: "10px", background: imagePlaceholder }} />
          )}
        </div>

        <div style={{ flex: "1 1 240px", minWidth: 0 }}>
          <h2 style={{ color: "var(--navy)", marginBottom: "8px" }}>{site.name}</h2>
          <p style={{ color: "#666" }}>📍 {site.city}، {site.country}</p>
          <p style={{ color: "#555", lineHeight: 1.7, margin: "8px 0" }}>{site.description}</p>
          <p style={{ color: "#444" }}>🌊 العمق: {site.depth} متر</p>
          <p style={{ color: "#444" }}>🎚 {difficultyAr(site.difficulty)}</p>
        </div>
      </div>
    </Link>
  );
}
