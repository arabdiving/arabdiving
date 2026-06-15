"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import DiveSiteCard from "../components/DiveSiteCard";

export default function DiveSitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/dive-sites`)
      .then((res) => res.json())
      .then((data) => setSites(data.data || []))
      .catch(() => setSites([]));
  }, []);

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = country === "" || site.country === country;
    const matchesCity = city === "" || site.city === city;
    const matchesDifficulty = difficulty === "" || site.difficulty === difficulty;
    return matchesSearch && matchesCountry && matchesCity && matchesDifficulty;
  });

  const countries = [...new Set(sites.map((s) => s.country).filter(Boolean))];
  // Cities shown depend on the selected country (if any).
  const cities = [
    ...new Set(
      sites
        .filter((s) => country === "" || s.country === country)
        .map((s) => s.city)
        .filter(Boolean)
    ),
  ];

  const sel = { padding: "10px", borderRadius: "8px", border: "1px solid #d4dae3", fontFamily: "inherit" } as const;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px" }}>
      <h1 style={{ color: "var(--navy)" }}>مواقع الغوص</h1>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="ابحث عن موقع غوص"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...sel, minWidth: "240px" }}
        />

        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setCity(""); // reset city when country changes
          }}
          style={sel}
        >
          <option value="">كل الدول</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={city} onChange={(e) => setCity(e.target.value)} style={sel}>
          <option value="">كل المدن / المناطق</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={sel}>
          <option value="">كل المستويات</option>
          <option value="Beginner">مبتدئ</option>
          <option value="Intermediate">متوسط</option>
          <option value="Advanced">متقدّم</option>
        </select>
      </div>

      <p style={{ color: "#666", marginBottom: "18px" }}>
        عدد النتائج: {filteredSites.length}
      </p>

      {filteredSites.length === 0 ? (
        <p style={{ color: "#666" }}>لا توجد مواقع مطابقة.</p>
      ) : (
        filteredSites.map((site: any) => <DiveSiteCard key={site._id} site={site} />)
      )}
    </div>
  );
}
