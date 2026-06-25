"use client";

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
}

interface Props {
  preview: LinkPreview;
  onRemove?: () => void;
}

export default function LinkPreviewCard({ preview, onRemove }: Props) {
  if (!preview?.url) return null;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        border: "1px solid #d1dbe8",
        borderRadius: "12px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        marginTop: "12px",
        background: "#f8fafc",
        position: "relative",
        transition: "box-shadow 0.2s",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "26px",
            height: "26px",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
          aria-label="إزالة المعاينة"
        >
          ✕
        </button>
      )}

      {preview.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt={preview.title || ""}
          style={{
            width: "100%",
            maxHeight: "220px",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}

      <div style={{ padding: "12px 14px" }}>
        {preview.siteName && (
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {preview.siteName}
          </p>
        )}
        {preview.title && (
          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "15px", color: "#0d2c54", lineHeight: 1.4 }}>
            {preview.title.length > 100 ? preview.title.slice(0, 100) + "…" : preview.title}
          </p>
        )}
        {preview.description && (
          <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.6 }}>
            {preview.description.length > 160 ? preview.description.slice(0, 160) + "…" : preview.description}
          </p>
        )}
      </div>
    </a>
  );
}
