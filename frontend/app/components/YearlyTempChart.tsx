import React from "react";
import { CITY_TEMPS, MONTHS_AR, CITIES } from "@/app/lib/cityWeather";

// Pure SVG line chart of monthly air + sea averages for a city.
export default function YearlyTempChart({ cityKey, title }: { cityKey: string; title?: string }) {
  const data = CITY_TEMPS[cityKey];
  if (!data) return null;
  const label = title || CITIES.find((c) => c.key === cityKey)?.label || "";

  const W = 720, H = 320, padX = 38, padTop = 28, padBottom = 46;
  const min = 14, max = 36;
  const x = (i: number) => padX + (i * (W - padX * 2)) / 11;
  const y = (v: number) => padTop + ((max - v) * (H - padTop - padBottom)) / (max - min);
  const line = (arr: number[]) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  const gridVals = [15, 20, 25, 30, 35];

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
        <strong style={{ color: "var(--navy)" }}>🌡️ متوسط الحرارة على مدار السنة — {label}</strong>
        <span style={{ fontSize: "13px" }}>
          <span style={{ color: "#e67e22" }}>● الهواء</span> &nbsp; <span style={{ color: "#2e75b6" }}>● الماء</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label={`درجات الحرارة في ${label}`}>
        {gridVals.map((g) => (
          <g key={g}>
            <line x1={padX} y1={y(g)} x2={W - padX} y2={y(g)} stroke="#eef2f6" strokeWidth={1} />
            <text x={W - padX + 4} y={y(g) + 4} fontSize={11} fill="#94a3b8">{g}°</text>
          </g>
        ))}
        <polyline points={line(data.sea)} fill="none" stroke="#2e75b6" strokeWidth={2.5} strokeLinejoin="round" />
        <polyline points={line(data.air)} fill="none" stroke="#e67e22" strokeWidth={2.5} strokeLinejoin="round" />
        {data.air.map((v, i) => <circle key={"a" + i} cx={x(i)} cy={y(v)} r={3} fill="#e67e22" />)}
        {data.sea.map((v, i) => <circle key={"s" + i} cx={x(i)} cy={y(v)} r={3} fill="#2e75b6" />)}
        {MONTHS_AR.map((m, i) => (
          <text key={m} x={x(i)} y={H - 22} fontSize={12} fill="#475569" textAnchor="middle">{m}</text>
        ))}
      </svg>
      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 4px 0", textAlign: "center" }}>متوسطات تقريبية بالدرجة المئوية (°C)</p>
    </div>
  );
}
