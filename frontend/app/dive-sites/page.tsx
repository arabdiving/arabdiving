"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";
import DiveSiteCard from "../components/DiveSiteCard";

export default function DiveSitesPage() {
  const [sites, setSites] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/dive-sites`)
      .then((res) => res.json())
      .then((data) => {
        setSites(data.data);
      });
  }, []);

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCountry =
      country === "" ||
      site.country === country;

    const matchesDifficulty =
      difficulty === "" ||
      site.difficulty === difficulty;

    return (
      matchesSearch &&
      matchesCountry &&
      matchesDifficulty
    );
  });

  const countries = [
    ...new Set(
      sites.map((site) => site.country)
    ),
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>مواقع الغوص</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="ابحث عن موقع غوص"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "10px",
            minWidth: "250px",
          }}
        />

        <select
          value={country}
          onChange={(e) =>
            setCountry(e.target.value)
          }
          style={{
            padding: "10px",
          }}
        >
          <option value="">
            كل الدول
          </option>

          {countries.map((country) => (
            <option
              key={country}
              value={country}
            >
              {country}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          style={{
            padding: "10px",
          }}
        >
          <option value="">
            كل المستويات
          </option>

          <option value="Beginner">مبتدئ</option>

          <option value="Intermediate">متوسط</option>

          <option value="Advanced">متقدّم</option>
        </select>
      </div>

      <p>
        عدد النتائج:{" "}
        {filteredSites.length}
      </p>

      {filteredSites.map((site: any) => (
        <DiveSiteCard
          key={site._id}
          site={site}
        />
      ))}
    </div>
  );
}
