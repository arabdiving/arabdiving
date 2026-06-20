import React from "react";

// Renders a video from a URL: YouTube/Vimeo embeds, or a direct/Cloudinary video file.
function parse(src: string): { type: "iframe" | "file" | "none"; url: string } {
  if (!src) return { type: "none", url: "" };
  const s = src.trim();

  const yt = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (yt) return { type: "iframe", url: `https://www.youtube.com/embed/${yt[1]}` };

  const vm = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", url: `https://player.vimeo.com/video/${vm[1]}` };

  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(s) || /\/video\/upload\//.test(s)) {
    return { type: "file", url: s };
  }
  return { type: "none", url: "" };
}

export default function VideoEmbed({ src, title = "فيديو" }: { src?: string; title?: string }) {
  const { type, url } = parse(src || "");
  if (type === "none") return null;

  // Uploaded files: keep natural aspect ratio (portrait or landscape) — never crop.
  if (type === "file") {
    return (
      <video
        src={url}
        controls
        playsInline
        style={{ display: "block", margin: "0 auto", maxWidth: "100%", maxHeight: "75vh", borderRadius: "14px", background: "#000" }}
      />
    );
  }

  // Embeds (YouTube/Vimeo): responsive 16:9 frame.
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "14px", overflow: "hidden", background: "#000" }}>
      <iframe
        src={url}
        title={title}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
