"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/app/lib/api";

interface Member {
  _id: string;
  name: string;
  country?: string;
  profileImage?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 24px" }}>
      <h1 style={{ color: "var(--navy)", fontSize: "34px", marginBottom: "8px" }}>
        دليل الأعضاء
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        تعرّف على غواصين من جميع أنحاء العالم العربي
      </p>

      {loading ? (
        <p style={{ color: "#666" }}>جارٍ التحميل...</p>
      ) : members.length === 0 ? (
        <p style={{ color: "#666" }}>لا يوجد أعضاء بعد.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
          }}
        >
          {members.map((member) => (
            <div
              key={member._id}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "var(--mid)",
                  color: "white",
                  fontSize: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  overflow: "hidden",
                }}
              >
                {member.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  (member.name || "؟").charAt(0)
                )}
              </div>

              <h2 style={{ color: "var(--navy)", fontSize: "19px", marginBottom: "4px" }}>
                {member.name}
              </h2>
              <p style={{ color: "#777", marginBottom: "14px" }}>
                {member.country || "—"}
              </p>

              <Link
                href={`/members/${member._id}`}
                style={{
                  display: "inline-block",
                  background: "var(--navy)",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                عرض الملف
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
