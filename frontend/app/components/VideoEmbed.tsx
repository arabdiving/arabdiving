import React from "react";

// Renders a video from a URL: YouTube/Vimeo embeds, or a direct/Cloudinary video file.
function parse(src: string): { type: "iframe" | "file" | "none"; url: string } {
  if (!src) return { type: "none", url: "" };
  const s = src.trim();

  // YouTube
  const yt = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (yt) return { type: "iframe", url: `https://www.youtube.com/embed/${yt[1]}` };

  // Vimeo
  const vm = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", url: `https://player.vimeo.com/video/${vm[1]}` };

  // Direct video file or Cloudinary video
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(s) || /\/video\/upload\//.test(s)) {
    return { type: "file", url: s };
  }
  return { type: "none", url: "" };
}

export default function VideoEmbed({ src, title = "فيديو" }: { src?: string; title?: string }) {
  const { type, url } = parse(src || "");
  if (type === "none") return null;

  const frame: React.CSSProperties = { position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "14px", overflow: "hidden", background: "#000" };
  const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" };

  return (
    <div style={frame}>
      {type === "iframe" ? (
        <iframe src={url} title={title} style={fill} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <video src={url} controls playsInline style={{ ...fill, objectFit: "cover" }} />
      )}
    </div>
  );
}
