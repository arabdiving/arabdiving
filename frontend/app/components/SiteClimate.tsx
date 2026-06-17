"use client";

import { useEffect, useState } from "react";
import { matchCity } from "@/app/lib/cityWeather";
import YearlyTempChart from "./YearlyTempChart";

export default function SiteClimate({ city }: { city?: string }) {
  const info = matchCity(city);
  const [air, setAir] = useState<number | null>(null);
  const [sea, setSea] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!info) { setLoading(false); return; }
    const { lat, lon } = info;
    Promise.allSettled([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`).then((r) => r.json()),
      fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=sea_surface_temperature`).then((r) => r.json()),
    ]).then(([a, s]) => {
      if (a.status === "fulfilled" && a.value?.current?.temperature_2m != null) setAir(Math.round(a.value.current.temperature_2m));
      if (s.status === "fulfilled" && s.value?.current?.sea_surface_temperature != null) setSea(Math.round(s.value.current.sea_surface_temperature));
    }).finally(() => setLoading(false));
  }, [info]);

  if (!info) return null;

  const pill = (bg: string, label: string, val: number | null, unit = "°") => (
    <div style={{ background: bg, color: "white", borderRadius: "12px", padding: "12px 18px", minWidth: "120px", textAlign: "center" }}>
      <div style={{ fontSize: "13px", opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: 800 }}>{val != null ? `${val}${unit}` : (loading ? "…" : "—")}</div>
    </div>
  );

  return (
    <div style={{ margin: "10px 0 26px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "18px" }}>
        {pill("#e67e22", "🌡️ حرارة الهواء الآن", air)}
        {pill("#2e75b6", "🌊 حرارة الماء الآن", sea)}
        <span style={{ color: "#94a3b8", fontSize: "13px" }}>📍 {info.label} · بيانات لحظية من Open‑Meteo</span>
      </div>
      <YearlyTempChart cityKey={info.key} />
    </div>
  );
}
