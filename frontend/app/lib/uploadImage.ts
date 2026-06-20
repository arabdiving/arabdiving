import { API_BASE } from "@/app/lib/api";

// Uploads an image to the backend (Cloudinary) and returns its URL.
export async function uploadImage(file: File): Promise<string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const d = await res.json();
  if (!d.success) throw new Error(d.message || "تعذّر رفع الصورة");
  return d.url as string;
}
