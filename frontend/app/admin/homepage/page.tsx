"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

interface Block {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

const LABELS: Record<string, string> = {
  hero:           "الهيرو الرئيسي",
  community_feed: "فيد المجتمع",
  gulf_focus:     "لماذا الخليج؟",
  stats:          "إحصائيات الموقع",
  segments:       "أقسام المجتمع",
  dive_centers:   "مراكز الغوص الشريكة",
  featured_sites: "مواقع الغوص المميزة",
};

const ICONS: Record<string, string> = {
  hero: "🏠", community_feed: "💬", gulf_focus: "🌊",
  stats: "📊", segments: "👥", dive_centers: "🤿", featured_sites: "📍",
};

export default function HomepageBlocksAdmin() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const hb: Block[] = d.settings?.homeBlocks;
        if (hb && hb.length > 0) {
          const enriched = hb.map((b, i) => ({
            ...b,
            label: LABELS[b.key] || b.label || b.key,
            order: typeof b.order === "number" ? b.order : i,
          }));
          setBlocks([...enriched].sort((a, b) => a.order - b.order));
        } else {
          // seed defaults
          const defaults: Block[] = Object.keys(LABELS).map((key, i) => ({
            key, label: LABELS[key], visible: true, order: i,
          }));
          setBlocks(defaults);
        }
      })
      .catch(() => setError("تعذّر تحميل الإعدادات"));
  }, []);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...blocks];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setBlocks(next.map((b, i) => ({ ...b, order: i })));
    setSaved(false);
  };

  const toggle = (idx: number) => {
    const next = [...blocks];
    next[idx] = { ...next[idx], visible: !next[idx].visible };
    setBlocks(next);
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const payload = blocks.map((b, i) => ({ key: b.key, label: b.label, visible: b.visible, order: i }));
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ homeBlocks: payload }),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setError(data.message || "خطأ في الحفظ");
    } catch { setError("تعذّر الاتصال بالخادم"); }
    finally { setSaving(false); }
  };

  const th: React.CSSProperties = {
    background: "var(--navy)", color: "#fff", padding: "12px 16px",
    textAlign: "right", fontWeight: 600, fontSize: "14px",
  };
  const td: React.CSSProperties = {
    padding: "14px 16px", borderBottom: "1px solid #eef2f6",
    verticalAlign: "middle",
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ color: "var(--navy)", fontSize: "26px", marginBottom: "8px" }}>
        إدارة بلوكات الصفحة الرئيسية
      </h1>
      <p style={{ color: "#666", marginBottom: "28px", lineHeight: 1.7 }}>
        تحكّم في ترتيب وظهور كل قسم على صفحة البداية. رتّب بأزرار الأسهم وأظهر/أخفِ حسب الحاجة.
      </p>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: "10px", padding: "12px 16px", color: "#b91c1c", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #dde8f4", boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: "48px" }}>#</th>
              <th style={th}>البلوك</th>
              <th style={{ ...th, width: "110px", textAlign: "center" }}>الظهور</th>
              <th style={{ ...th, width: "100px", textAlign: "center" }}>الترتيب</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b, i) => (
              <tr key={b.key} style={{ background: b.visible ? "#fff" : "#f8fafc", opacity: b.visible ? 1 : 0.6 }}>
                <td style={{ ...td, textAlign: "center", color: "#aaa", fontWeight: 700 }}>{i + 1}</td>
                <td style={td}>
                  <span style={{ fontSize: "22px", marginInlineEnd: "10px" }}>{ICONS[b.key] || "📦"}</span>
                  <span style={{ color: "var(--navy)", fontWeight: 600 }}>{LABELS[b.key] || b.label}</span>
                </td>
                <td style={{ ...td, textAlign: "center" }}>
                  <button
                    onClick={() => toggle(i)}
                    style={{
                      background: b.visible ? "#dcfce7" : "#f1f5f9",
                      color: b.visible ? "#16a34a" : "#64748b",
                      border: "none", borderRadius: "20px", padding: "6px 14px",
                      cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "13px",
                    }}
                  >
                    {b.visible ? "ظاهر" : "مخفي"}
                  </button>
                </td>
                <td style={{ ...td, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    <button onClick={() => move(i, -1)} disabled={i === 0}
                      style={{ background: i === 0 ? "#f1f5f9" : "var(--navy)", color: i === 0 ? "#ccc" : "#fff", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: i === 0 ? "default" : "pointer", fontSize: "14px" }}>
                      ↑
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1}
                      style={{ background: i === blocks.length - 1 ? "#f1f5f9" : "var(--navy)", color: i === blocks.length - 1 ? "#ccc" : "#fff", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: i === blocks.length - 1 ? "default" : "pointer", fontSize: "14px" }}>
                      ↓
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: saving ? "#94a3b8" : "var(--navy)", color: "#fff",
            border: "none", borderRadius: "12px", padding: "12px 28px",
            cursor: saving ? "default" : "pointer", fontFamily: "inherit",
            fontWeight: 600, fontSize: "15px", boxShadow: "0 4px 14px rgba(13,44,84,0.25)",
          }}
        >
          {saving ? "جارٍ الحفظ..." : "حفظ الترتيب"}
        </button>
        {saved && (
          <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "14px" }}>
            ✅ تم الحفظ بنجاح
          </span>
        )}
      </div>

      <div style={{ marginTop: "28px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "14px 18px" }}>
        <p style={{ margin: 0, color: "#92400e", fontSize: "13px", lineHeight: 1.8 }}>
          <strong>ملاحظة:</strong> التغييرات تظهر فور حفظها على الصفحة الرئيسية. لا حاجة لإعادة النشر.
        </p>
      </div>
    </div>
  );
}
