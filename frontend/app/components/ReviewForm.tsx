"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

export default function ReviewForm({ diveSiteId }: { diveSiteId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => setEnabled(d.settings?.commentsEnabled ?? true))
      .catch(() => {});
  }, []);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("يرجى تسجيل الدخول أولًا لإضافة تقييم.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ diveSiteId, rating, comment }),
      });
      const data = await res.json();
      if (data.success) window.location.reload();
      else setMsg(data.message || "تعذّر إضافة التقييم.");
    } catch {
      setMsg("تعذّر الاتصال بالخادم.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!enabled) {
    return (
      <p style={{ background: "#fff4e5", color: "#9a6f1f", border: "1px solid #f0d9b5", borderRadius: "12px", padding: "14px 18px", maxWidth: "520px" }}>
        التقييمات معطّلة حاليًا من قبل الإدارة.
      </p>
    );
  }

  const field = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d4dae3", fontFamily: "inherit", marginBottom: "14px" } as const;

  return (
    <form onSubmit={submitReview} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "22px", maxWidth: "520px", marginBottom: "10px" }}>
      <h3 style={{ color: "var(--navy)", marginBottom: "14px" }}>أضف تقييمك</h3>
      <label style={{ display: "block", marginBottom: "6px", color: "var(--navy)" }}>التقييم</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={field}>
        <option value={5}>5 ⭐</option>
        <option value={4}>4 ⭐</option>
        <option value={3}>3 ⭐</option>
        <option value={2}>2 ⭐</option>
        <option value={1}>1 ⭐</option>
      </select>
      <label style={{ display: "block", marginBottom: "6px", color: "var(--navy)" }}>تعليقك</label>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب رأيك عن الموقع..." rows={3} style={{ ...field, resize: "vertical" }} />
      <button type="submit" disabled={submitting} style={{ background: "var(--mid)", color: "white", border: "none", padding: "11px 24px", borderRadius: "10px", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "inherit", fontSize: "15px" }}>
        {submitting ? "جارٍ الإرسال..." : "إرسال التقييم"}
      </button>
      {msg && <p style={{ color: "#c0392b", marginTop: "12px" }}>{msg}</p>}
    </form>
  );
}
