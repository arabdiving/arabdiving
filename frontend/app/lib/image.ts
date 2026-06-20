// Resolves a dive-site image value to a usable <img src>.
// - Absolute URLs (e.g. Cloudinary) are used as-is.
// - Bare filenames map to the local /images folder.
// - Empty/missing returns null so the UI can show a placeholder.
export function siteImageSrc(image?: string | null): string | null {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `/images/${image}`;
}

// A soft brand gradient used when no image is available.
export const imagePlaceholder =
  "linear-gradient(135deg, #0d2c54 0%, #2e75b6 100%)";
