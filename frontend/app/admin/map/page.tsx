"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import { authHeaders } from "@/app/lib/adminFetch";
import { MAP_SVG, DEFAULT_POINTS, PAGE_OPTIONS, COLOR_SWATCHES, MapPoint } from "@/app/lib/mapSvg";

/* إدارة خريطة الموقع — ضع النقاط في أي مكان على البحر (سيناء، جزر، السواحل)،
   رقّم كل نقطة، واختر لها الصفحة. اضغط على البحر لإضافة نقطة، اسحبها لتحريكها. */

export default function AdminMapPage() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [sel, setSel] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ idx: number; moved: boolean } | null>(null);
  const suppress = useRef(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => r.json())
      .then((d) => {
        const mp = d.settings?.mapPoints;
        setPoints(Array.isArray(mp) && mp.length > 0 ? mp : DEFAULT_POINTS);
      })
      .catch(() => setPoints(DEFAULT_POINTS))
      .finally(() => setLoading(false));
  }, []);

  const coords = (clientX: number, clientY: number) => {
    const rect = mapRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(360, Math.round(((clientX - rect.left) / rect.width) * 360)));
    const y = Math.max(0, Math.min(680, Math.round(((clientY - rect.top) / rect.height) * 680)));
    return { x, y };
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      dragging.current.moved = true;
      const { x, y } = coords(e.clientX, e.clientY);
      const idx = dragging.current.idx;
      setPoints((ps) => ps.map((p, i) => (i === idx ? { ...p, x, y } : p)));
    };
    const up = () => {
      if (dragging.current?.moved) suppress.current = true;
      dragging.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const onMapClick = (e: React.MouseEvent) => {
    if (suppress.current) { suppress.current = false; return; }
    if ((e.target as HTMLElement).closest("[data-dot]")) return;
    const { x, y } = coords(e.clientX, e.clientY);
    const n = points.reduce((m, p) => Math.max(m, p.n || 0), 0) + 1;
    const np: MapPoint = { n, x, y, label: "نقطة جديدة", href: "/community", color: COLOR_SWATCHES[(n - 1) % COLOR_SWATCHES.length], icon: "📍" };
    setPoints((p) => [...p, np]);
    setSel(points.length);
  };

  const patch = (p: Partial<MapPoint>) => setPoints((ps) => ps.map((pt, i) => (i === sel ? { ...pt, ...p } : pt)));
  const del = (i: number) => { setPoints((ps) => ps.filter((_, j) => j !== i)); setSel(-1); };

  const pickPage = (href: string) => {
    const opt = PAGE_OPTIONS.find((o) => o.href === href);
    const cur = points[sel];
    const upd: Partial<MapPoint> = { href };
    if (opt && (!cur.label || cur.label === "نقطة جديدة")) { upd.label = opt.label; upd.icon = opt.icon; }
    patch(upd);
  };

  const save = async () => {
    setSaved("");
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ mapPoints: points }) });
      if (res.ok) { setSaved("تم الحفظ ✓"); fetch("/api/revalidate", { method: "POST" }).catch(() => {}); setTimeout(() => setSaved(""), 2500); }
      else setSaved("فشل الحفظ — تأكد أنك مسجّل دخول كأدمن");
    } catch { setSaved("تعذّر الاتصال"); }
  };

  const selPt = sel >= 0 && sel < points.length ? points[sel] : null;
  const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px" };
  const field: React.CSSProperties = { width: "100%", padding: "9px 11px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--text)", fontFamily: "inherit", fontSize: "14px" };
  const lbl: React.CSSProperties = { display: "block", color: "var(--muted)", fontSize: "12.5px", fontWeight: 700, margin: "10px 0 4px" };

  if (loading) return <p style={{ padding: "40px", color: "var(--muted)" }}>جارٍ التحميل...</p>;

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", padding: "8px 4px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
        <div>
          <h1 style={{ color: "var(--ink, var(--navy))", fontSize: "24px", fontWeight: 900 }}>🗺️ إدارة خريطة الموقع</h1>
          <p style={{ color: "var(--muted)", fontSize: "13.5px", marginTop: "4px" }}>اضغط على البحر لإضافة نقطة · اسحب النقطة لتحريكها · اضغط عليها لتحريرها</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {saved && <span style={{ color: saved.includes("✓") ? "#16a34a" : "#dc2626", fontWeight: 700, fontSize: "14px" }}>{saved}</span>}
          <button onClick={() => { setPoints(DEFAULT_POINTS); setSel(-1); }} style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>استعادة الافتراضي</button>
          <button onClick={save} style={{ background: "var(--gold)", border: "none", color: "#04121f", padding: "10px 22px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 800 }}>💾 حفظ</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 420px) 1fr", gap: "20px", alignItems: "start" }}>
        {/* الخريطة */}
        <div style={{ background: "radial-gradient(ellipse at 50% 30%, #0a2240 0%, #040d1a 65%)", borderRadius: "16px", padding: "14px", border: "1px solid var(--border)" }}>
          <div ref={mapRef} onClick={onMapClick} style={{ position: "relative", width: "100%", aspectRatio: "360 / 680", cursor: "crosshair" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", filter: "drop-shadow(0 0 30px rgba(8,145,178,0.3))" }} dangerouslySetInnerHTML={{ __html: MAP_SVG }} />
            {points.map((p, i) => (
              <div key={i} data-dot
                onMouseDown={(e) => { e.stopPropagation(); dragging.current = { idx: i, moved: false }; setSel(i); }}
                style={{ position: "absolute", left: `${(p.x / 360) * 100}%`, top: `${(p.y / 680) * 100}%`, transform: "translate(-50%,-50%)", width: "22px", height: "22px", borderRadius: "50%", background: p.color || "#06b6d4", border: sel === i ? "3px solid #fff" : "2px solid rgba(255,255,255,0.6)", boxShadow: sel === i ? "0 0 0 4px rgba(255,255,255,0.25)" : "0 0 8px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#04121f", fontWeight: 900, fontSize: "11px", cursor: "grab", zIndex: sel === i ? 20 : 10 }}>
                {p.n}
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11.5px", textAlign: "center", marginTop: "8px" }}>الأرقام هي ترتيب النقاط · إجمالي {points.length} نقطة</p>
        </div>

        {/* اللوحة */}
        <div>
          {selPt ? (
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <h2 style={{ color: "var(--ink, var(--navy))", fontSize: "18px", fontWeight: 800 }}>تحرير النقطة رقم {selPt.n}</h2>
                <button onClick={() => del(sel)} style={{ background: "#fee2e2", color: "#b91c1c", border: "none", padding: "7px 14px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "13px" }}>🗑️ حذف</button>
              </div>

              <label style={lbl}>الصفحة المرتبطة</label>
              <select value={selPt.href} onChange={(e) => pickPage(e.target.value)} style={{ ...field, cursor: "pointer" }}>
                {PAGE_OPTIONS.map((o) => <option key={o.href} value={o.href}>{o.icon} {o.label} ({o.href})</option>)}
              </select>

              <label style={lbl}>الاسم الظاهر على الخريطة</label>
              <input value={selPt.label} onChange={(e) => patch({ label: e.target.value })} style={field} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div><label style={lbl}>الرقم</label><input type="number" value={selPt.n} onChange={(e) => patch({ n: Number(e.target.value) })} style={field} /></div>
                <div><label style={lbl}>X (0–360)</label><input type="number" value={selPt.x} onChange={(e) => patch({ x: Number(e.target.value) })} style={field} /></div>
                <div><label style={lbl}>Y (0–680)</label><input type="number" value={selPt.y} onChange={(e) => patch({ y: Number(e.target.value) })} style={field} /></div>
              </div>

              <label style={lbl}>الأيقونة (إيموجي)</label>
              <input value={selPt.icon} onChange={(e) => patch({ icon: e.target.value })} style={{ ...field, width: "90px", textAlign: "center", fontSize: "18px" }} />

              <label style={lbl}>اللون</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {COLOR_SWATCHES.map((c) => (
                  <button key={c} onClick={() => patch({ color: c })} style={{ width: "30px", height: "30px", borderRadius: "50%", background: c, border: selPt.color === c ? "3px solid var(--text)" : "1px solid var(--border)", cursor: "pointer" }} />
                ))}
              </div>

              <label style={lbl}>سطر فرعي (اختياري)</label>
              <input value={selPt.subtitle || ""} onChange={(e) => patch({ subtitle: e.target.value })} style={field} placeholder="مثال: 180+ موقع موثّق" />

              <label style={lbl}>وصف مختصر (اختياري)</label>
              <textarea value={selPt.desc || ""} onChange={(e) => patch({ desc: e.target.value })} rows={3} style={{ ...field, resize: "vertical" }} placeholder="يظهر في بطاقة النقطة عند المرور عليها" />
            </div>
          ) : (
            <div style={{ ...card, textAlign: "center", color: "var(--muted)", padding: "40px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>👆</div>
              <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>اضغط على أي نقطة لتحريرها</p>
              <p style={{ fontSize: "13.5px" }}>أو اضغط على أي مكان على البحر لإضافة نقطة جديدة (سيناء، وسط البحر كجزيرة، أو على السواحل)</p>
            </div>
          )}

          {/* قائمة سريعة */}
          <div style={{ ...card, marginTop: "16px" }}>
            <h3 style={{ color: "var(--ink, var(--navy))", fontSize: "15px", fontWeight: 800, marginBottom: "10px" }}>كل النقاط ({points.length})</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {points.map((p, i) => (
                <button key={i} onClick={() => setSel(i)} style={{ display: "flex", alignItems: "center", gap: "6px", background: sel === i ? "var(--mid)" : "var(--background)", color: sel === i ? "#fff" : "var(--text)", border: "1px solid var(--border)", borderRadius: "20px", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
                  <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: p.color || "#06b6d4", color: "#04121f", fontSize: "9px", fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{p.n}</span>
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
