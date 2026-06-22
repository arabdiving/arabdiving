import React from "react";

const SPLIT = /(https?:\/\/[^\s]+)/g;
const ISURL = /^https?:\/\//;

// Renders text with any http(s) URL turned into a clickable link. No external libs.
export default function Linkify({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split(SPLIT).map((part, i) =>
        ISURL.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "#2e75b6", textDecoration: "underline", fontWeight: "bold", wordBreak: "break-all" }}>
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
