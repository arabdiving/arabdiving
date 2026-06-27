"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

interface Block {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

// Single source of truth for ALL available blocks
const BLOCK_REGISTRY: Record<string, { label: string; icon: string; desc: string }> = {
  hero:              { label: "الهيرو الرئيسي",          icon: "🏠", desc: "الصورة الكبيرة والعنوان الرئيسي" },
  community_feed:    { label: "فيد المجتمع",              icon: "💬", desc: "آخر منشورات الغوّاصين" },
  gulf_focus:        { label: "لماذا الخليج؟",            icon: "🌊", desc: "مزايا الغوص في المنطقة العربية" },
  stats:             { label: "إحصائيات الموقع",          icon: "📊", desc: "أعداد الأعضاء والمواقع والتقييمات" },
  segments:          { label: "أقسام المجتمع",            icon: "👥", desc: "أطفال، بنات، رجال، تقني" },
  dive_centers:      { label: "مراكز الغوص الشريكة",     icon: "🤿", desc: "صف أفقي بالمراكز المميزة" },
  featured_sites:    { label: "مواقع الغوص المميزة",     icon: "📍", desc: "صف أفقي بمواقع الغوص المختارة" },
  weight_calculator: { label: "حاسبة وزن الحزام",        icon: "⚖️", desc: "أداة تفاعلية لحساب وزن الرصاص" },
  community_survey:  { label: "استطلاع المجتمع",         icon: "📋", desc: "تصويت للغوّاصين على سؤال أسبوعي" },
};

export default function HomepageBlocksAdmin() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const hb: Block[] = d.settings?.homeBlocks || [];
        const dbKeys = new Set(hb.map((b) => b.key));

        // Enrich labels + merge missing blocks from registry (hidden by default)
        const enriched: Block[] = hb.map((b, i) => ({
          ...b,
          label: BLOCK_REGISTRY[b.key]?.label || b.label || b.key,
          order: typeof b.order === "number" ? b.order : i,
        }));

        const missing: Block[] = Object.entries(BLOCK_REGISTRY)
          .filter(([key]) => !dbKeys.has(key))
          .map(([key, cfg], i) => ({
            key,
            label: cfg.label,
            visible: false,
            order: enriched.length + i,
          }));

        const all = [...enriched, ...missing].sort((a, b) => a.order - b.order);
        setBlocks(all);
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

  const removeBlock = (idx: number) => {
    if (!confirm("هل تريد حذف هذا البلوك؟ يمكنك إخفاؤه بدلاً من ذلك.")) return;
    setBlocks((prev) => prev.filter((_, i) => i !== idx).map((b, i) => ({ ...b, order: i })));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const payload = blocks.map((b, i) => ({
        key: b.key,
        label: BLOCK_REGISTRY[b.key]?.label || b.label,
        visible: b.visible,
        order: i,
      }));
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ homeBlocks: payload }),
      });
      const data = await res.json();
      if (data.success) {
        // Immediately bust the Next.js ISR cache so homepage updates now
        await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else setError(data.message || "خطأ في الحفظ");
    } catch { setError("تعذّر الاتصال بالخادم"); }
    finally { setSaving(false); }
  };

  // Blocks not yet in the current list
  const activeKeys = new Set(blocks.map((b) => b.key));
  const addableBlocks = Object.entries(BLOCK_REGISTRY).filter(([key]) => !activeKeys.has(key));

  const addBlock = (key: string) => {
    const cfg = BLOCK_REGISTRY[key];
    if (!cfg) return;
    setBlocks((prev) => [
      ...prev,
      { key, label: cfg.label, visible: false, order: prev.length },
    ]);
    setShowAdd(false);
    setSaved(false);
  };

  const th: React.CSSProperties = {
    background: "var(--navy)", color: "#fff", padding: "12px 16px",
    textAlign: "right", fontWeight: 600, fontSize: "14px",
  };
  const td: React.CSSProperties = {
    padding: "14px 16px", borderBottom: "1px solid #eef2f6", verticalAlign: "middle",
  };

  const visibleCount = blocks.filter((b) => b.visible).length;

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ color: "var(--navy)", fontSize: "26px", marginBottom: "6px" }}>
        إدارة بلوكات الصفحة الرئيسية
      </h1>
      <p style={{ color: "#666", marginBottom: "28px", lineHeight: 1.7 }}>
        تحكّم في ترتيب وظهور كل قسم. {visibleCount} بلوك ظاهر حالياً.
      </p>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: "10px", padding: "12px 16px", color: "#b91c1c", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #dde8f4", boxShadow: "0 4px 18px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: "42px" }}>#</th>
              <th style={th}>البلوك</th>
              <th style={{ ...th, width: "120px", textAlign: "center" }}>الظهور</th>
              <th style={{ ...th, width: "108px", textAlign: "center" }}>الترتيب</th>
              <th style={{ ...th, width: "52px", textAlign: "center" }}>حذف</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b, i) => {
              const reg = BLOCK_REGISTRY[b.key];
              return (
                <tr key={b.key} style={{ background: b.visible ? "#fff" : "#f8fafc", opacity: b.visible ? 1 : 0.65 }}>
                  <td style={{ ...td, textAlign: "center", color: "#bbb", fontWeight: 700, fontSize: "13px" }}>{i + 1}</td>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "22px", flexShrink: 0 }}>{reg?.icon || "📦"}</span>
                      <div>
                        <p style={{ margin: 0, color: "var(--navy)", fontWeight: 600, fontSize: "14px" }}>
                          {reg?.label || b.label}
                        </p>
                        {reg?.desc && (
                          <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>{reg.desc}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    <button
                      onClick={() => toggle(i)}
                      style={{
                        background: b.visible ? "#dcfce7" : "#f1f5f9",
                        color: b.visible ? "#16a34a" : "#64748b",
                        border: "none", borderRadius: "20px", padding: "6px 16px",
                        cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "13px",
                      }}
                    >
                      {b.visible ? "✅ ظاهر" : "⊘ مخفي"}
                    </button>
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                      <button onClick={() => move(i, -1)} disabled={i === 0}
                        style={{ background: i === 0 ? "#f1f5f9" : "var(--navy)", color: i === 0 ? "#ccc" : "#fff", border: "none", borderRadius: "7px", width: "30px", height: "30px", cursor: i === 0 ? "default" : "pointer", fontSize: "13px" }}>↑</button>
                      <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1}
                        style={{ background: i === blocks.length - 1 ? "#f1f5f9" : "var(--navy)", color: i === blocks.length - 1 ? "#ccc" : "#fff", border: "none", borderRadius: "7px", width: "30px", height: "30px", cursor: i === blocks.length - 1 ? "default" : "pointer", fontSize: "13px" }}>↓</button>
                    </div>
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    <button onClick={() => removeBlock(i)}
                      style={{ background: "transparent", border: "none", color: "#ccc", cursor: "pointer", fontSize: "16px", padding: "4px 8px" }}
                      title="حذف من القائمة">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add block button */}
      {addableBlocks.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{
              background: "#f0f5ff", color: "var(--navy)",
              border: "2px dashed #b8d0f0", borderRadius: "12px",
              padding: "12px 24px", cursor: "pointer", fontFamily: "inherit",
              fontWeight: 600, fontSize: "14px", width: "100%",
            }}
          >
            {showAdd ? "✕ إغلاق" : "＋ إضافة بلوك جديد للصفحة"}
          </button>

          {showAdd && (
            <div style={{
              marginTop: "12px", background: "#fff", borderRadius: "14px",
              border: "1px solid #dde8f4", padding: "18px",
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "10px",
            }}>
              {addableBlocks.map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => addBlock(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: "#f8fafc", border: "1px solid #e2eaf4",
                    borderRadius: "10px", padding: "12px 14px",
                    cursor: "pointer", fontFamily: "inherit", textAlign: "right",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{cfg.icon}</span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, color: "var(--navy)", fontWeight: 600, fontSize: "14px" }}>{cfg.label}</p>
                    <p style={{ margin: 0, color: "#aaa", fontSize: "11px" }}>{cfg.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save bar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: saving ? "#94a3b8" : "var(--navy)", color: "#fff",
            border: "none", borderRadius: "12px", padding: "13px 32px",
            cursor: saving ? "default" : "pointer", fontFamily: "inherit",
            fontWeight: 600, fontSize: "15px",
            boxShadow: saving ? "none" : "0 4px 14px rgba(13,44,84,0.25)",
          }}
        >
          {saving ? "جارٍ الحفظ..." : "💾 حفظ الترتيب"}
        </button>
        {saved && <span style={{ color: "#16a34a", fontWeight: 600 }}>✅ تم الحفظ بنجاح</span>}
      </div>

      <div style={{ marginTop: "24px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "14px 18px" }}>
        <p style={{ margin: 0, color: "#92400e", fontSize: "13px", lineHeight: 1.8 }}>
          <strong>💡 نصيحة:</strong> البلوكات المخفية لا تظهر للزوار لكنها محفوظة في الترتيب.
          يمكن إظهارها في أي وقت دون إعادة ترتيب.
          التغييرات تظهر خلال 60 ثانية على الموقع.
        </p>
      </div>
    </div>
  );
}
