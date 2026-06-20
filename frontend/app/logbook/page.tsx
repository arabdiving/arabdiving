"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

interface Entry {
  _id: string;
  depth: number;
  duration: number;
  date: string;
  notes?: string;
  diveSite?: { name?: string; city?: string };
}

export default function LogbookPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [sites, setSites] = useState<any[]>([]);

  const [diveSite, setDiveSite] = useState("");
  const [date, setDate] = useState("");
  const [depth, setDepth] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadEntries = async () => {
    const res = await fetch(`${API_BASE}/api/logbook/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEntries(data.entries || []);
  };

  const loadSites = async () => {
    const res = await fetch(`${API_BASE}/api/dive-sites`);
    const data = await res.json();
    setSites(data.data || []);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
    loadEntries();
    loadSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitDive = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/logbook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diveSite,
          date,
          depth: Number(depth),
          duration: Number(duration),
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("تمت إضافة الغوصة ✅");
        setDepth("");
        setDuration("");
        setNotes("");
        loadEntries();
      } else {
        setMsg(data.message || "تعذّر إضافة الغوصة.");
      }
    } catch {
      setMsg("تعذّر الاتصال بالخادم.");
    }
  };

  const maxDepth = entries.length ? Math.max(...entries.map((e) => e.depth)) : 0;
  const totalTime = entries.reduce((s, e) => s + e.duration, 0);
  const avgDepth = entries.length
    ? (entries.reduce((s, e) => s + e.depth, 0) / entries.length).toFixed(1)
    : 0;

  const stat = (label: string, value: string | number) => (
    <div style={{ background: "var(--navy)", color: "white", padding: "25px", borderRadius: "15px" }}>
      <p style={{ opacity: 0.85 }}>{label}</p>
      <h2 style={{ fontSize: "30px" }}>{value}</h2>
    </div>
  );

  const field = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d4dae3",
    fontFamily: "inherit",
    marginBottom: "16px",
  } as const;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px" }}>
      <h1 style={{ color: "var(--navy)", marginBottom: "20px" }}>سجل غوصاتي</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {stat("إجمالي الغوصات", entries.length)}
        {stat("أقصى عمق", `${maxDepth} م`)}
        {stat("إجمالي زمن القاع", `${totalTime} دقيقة`)}
        {stat("متوسط العمق", `${avgDepth} م`)}
      </div>

      <form
        onSubmit={submitDive}
        style={{
          border: "1px solid #e2e8f0",
          padding: "24px",
          borderRadius: "15px",
          marginBottom: "40px",
          background: "white",
          maxWidth: "560px",
        }}
      >
        <h3 style={{ color: "var(--navy)", marginBottom: "16px" }}>إضافة غوصة</h3>

        <select
          value={diveSite}
          onChange={(e) => setDiveSite(e.target.value)}
          required
          style={field}
        >
          <option value="">اختر موقع الغوص</option>
          {sites.map((site: any) => (
            <option key={site._id} value={site._id}>
              {site.name}
            </option>
          ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={field} />
        <input type="number" placeholder="العمق (متر)" value={depth} onChange={(e) => setDepth(e.target.value)} required style={field} />
        <input type="number" placeholder="المدة (دقيقة)" value={duration} onChange={(e) => setDuration(e.target.value)} required style={field} />
        <textarea placeholder="ملاحظات" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...field, resize: "vertical" }} />

        <button
          type="submit"
          style={{
            background: "var(--mid)",
            color: "white",
            border: "none",
            padding: "11px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "15px",
          }}
        >
          حفظ الغوصة
        </button>

        {msg && <p style={{ marginTop: "12px", color: msg.includes("✅") ? "#1e7e34" : "#c0392b" }}>{msg}</p>}
      </form>

      <h2 style={{ color: "var(--navy)", marginBottom: "16px" }}>غوصاتي</h2>

      {entries.length === 0 ? (
        <p style={{ color: "#666" }}>لم تسجّل أي غوصات بعد.</p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry._id}
            style={{
              border: "1px solid #e2e8f0",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              background: "white",
            }}
          >
            <h3 style={{ color: "var(--navy)" }}>{entry.diveSite?.name || "موقع غير معروف"}</h3>
            <p>📍 {entry.diveSite?.city || "—"}</p>
            <p>🌊 العمق: {entry.depth} متر</p>
            <p>⏱ المدة: {entry.duration} دقيقة</p>
            {entry.notes && <p>{entry.notes}</p>}
            <p>📅 {new Date(entry.date).toLocaleDateString("ar-EG")}</p>
          </div>
        ))
      )}
    </div>
  );
}
