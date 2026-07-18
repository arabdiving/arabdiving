"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, authHeaders } from "@/app/lib/adminFetch";
import { siteImageSrc } from "@/app/lib/image";

/*
  مراجعة طلبات المدربين — الموافقة المبدئية:
  الإدارة تفحص صور الكارنيه (وش وضهر) وبيانات الاعتماد ثم توافق/ترفض.
  المعتمد فقط يظهر في دليل المدربين. التوثيق ✅ خطوة إضافية بعد التحقق من رقم المدرب.
*/

const resolve = (u: string) => (u ? (/^https?:\/\//.test(u) ? u : `/images/${u}`) : "");

export default function AdminInstructorApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [zoom, setZoom] = useState<string | null>(null); // صورة كارنيه مكبّرة

  const load = () => {
    fetch(`${API_BASE}/api/instructors/admin/applications`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setApps(d.applications || []))
      .catch(() => setMsg("تعذّر تحميل الطلبات"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setStatus = async (id: string, body: any) => {
    const res = await fetch(`${API_BASE}/api/instructors/admin/applications/${id}`, {
      method: "PATCH", headers: authHeaders(), body: JSON.stringify(body),
    });
    const d = await res.json();
    if (d.success) { setMsg("تم التحديث ✅"); load(); } else setMsg(d.message || "تعذّر التحديث");
  };

  const badge = (st: string) =>
    st === "pending" ? { label: "⏳ قيد المراجعة", bg: "#fff7e0", color: "#b45309" }
    : st === "rejected" ? { label: "✋ مرفوض", bg: "#fef2f2", color: "#b91c1c" }
    : { label: "✅ معتمد", bg: "#ecf7f0", color: "#1e7e34" };

  const pendingCount = apps.filter((a) => a.applicationStatus === "pending").length;

  return (
    <div style={{ maxWidth: "860px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "6px" }}>طلبات المدربين — الموافقة المبدئية</h1>
      <p style={{ color: "#666", marginBottom: "18px", fontSize: "14.5px", lineHeight: 1.8 }}>
        افحص صور الكارنيه وبيانات الاعتماد ثم وافق مبدئيًا. المعتمد فقط يظهر في <Link href="/instructors" style={{ color: "var(--mid)" }}>دليل المدربين</Link>.
        {pendingCount > 0 && <strong style={{ color: "#b45309" }}> — {pendingCount} طلب بانتظارك</strong>}
      </p>
      {msg && <p style={{ color: msg.includes("✅") ? "#1e7e34" : "#c0392b", marginBottom: "12px" }}>{msg}</p>}

      {loading ? <p style={{ color: "#666" }}>جارٍ التحميل...</p>
        : apps.length === 0 ? <p style={{ color: "#888" }}>لا توجد طلبات بعد.</p>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {apps.map((a) => {
              const b = badge(a.applicationStatus);
              const img = siteImageSrc(a.user?.profileImage);
              return (
                <div key={a._id} style={{ background: "white", borderRadius: "14px", padding: "18px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: a.applicationStatus === "pending" ? "2px solid #fcd34d" : "1px solid #eef2f6" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover" }} />
                      ) : <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#eef4fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🧑‍🏫</div>}
                      <div>
                        <strong style={{ color: "var(--navy)", fontSize: "15px" }}>{a.user?.name || "—"} {a.verified && "✅"}</strong>
                        <div style={{ color: "#777", fontSize: "12.5px" }}>{a.user?.email}</div>
                        <div style={{ color: "#555", fontSize: "12.5px", marginTop: "2px" }}>
                          {a.agency} · {a.rank || "—"} · رقم: <span dir="ltr">{a.instructorNumber || "—"}</span> · منذ {a.sinceYear || "—"} · 📍 {a.city || "—"}
                        </div>
                      </div>
                    </div>
                    <span style={{ background: b.bg, color: b.color, borderRadius: "20px", padding: "5px 14px", fontSize: "12.5px", fontWeight: 800 }}>{b.label}</span>
                  </div>

                  {/* 🪪 صور الكارنيه */}
                  {a.cardImages?.length > 0 ? (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                      {a.cardImages.map((u: string, i: number) => (
                        <button key={i} onClick={() => setZoom(resolve(u))} style={{ border: "1px solid #d4dae3", borderRadius: "9px", padding: 0, cursor: "zoom-in", background: "none", overflow: "hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolve(u)} alt={`كارنيه ${i + 1}`} style={{ width: "110px", height: "70px", objectFit: "cover", display: "block" }} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#b45309", fontSize: "13px", marginBottom: "12px" }}>⚠️ لم يرفع صور كارنيه</p>
                  )}

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {a.applicationStatus !== "approved" && (
                      <button onClick={() => setStatus(a._id, { status: "approved" })}
                        style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "9px", padding: "9px 20px", fontWeight: 800, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
                        موافقة مبدئية ✅
                      </button>
                    )}
                    {a.applicationStatus !== "rejected" && (
                      <button onClick={() => setStatus(a._id, { status: "rejected" })}
                        style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: "9px", padding: "9px 18px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
                        رفض ✋
                      </button>
                    )}
                    <button onClick={() => setStatus(a._id, { verified: !a.verified })}
                      style={{ background: a.verified ? "#f1f5f9" : "#eef4fa", color: a.verified ? "#64748b" : "#0d6cb0", border: "1px solid #d4dae3", borderRadius: "9px", padding: "9px 18px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
                      {a.verified ? "إلغاء التوثيق" : "توثيق ✅ (بعد التحقق من الرقم)"}
                    </button>
                    <Link href={`/instructors/${a.slug || a._id}`} style={{ color: "var(--mid)", fontSize: "13px", padding: "9px 6px", fontWeight: 700 }}>عرض البروفايل ←</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* مكبّر صور الكارنيه */}
      {zoom && (
        <div onClick={() => setZoom(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", cursor: "zoom-out" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="" style={{ maxWidth: "92vw", maxHeight: "88vh", borderRadius: "12px" }} />
        </div>
      )}
    </div>
  );
}
