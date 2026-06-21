"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/app/lib/api";

export default function EditProfilePage() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [certificationLevel, setCertificationLevel] = useState("");
  const [divesCount, setDivesCount] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photoPrivacy, setPhotoPrivacy] = useState("public");
  const [infoPrivacy, setInfoPrivacy] = useState("public");
  const [showInColor, setShowInColor] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_BASE}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data.user;
        if (!user) return;
        setCountry(user.country || "");
        setCity(user.city || "");
        setCertificationLevel(user.certificationLevel || "");
        setDivesCount(user.divesCount || 0);
        setBio(user.bio || "");
        setDateOfBirth(user.dateOfBirth || "");
        setPhotoPrivacy(user.privacy?.photo || "public");
        setInfoPrivacy(user.privacy?.info || "public");
        setShowInColor(!!user.showInColor);
      })
      .catch(() => setError("تعذّر تحميل بيانات الملف الشخصي"));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    const token = localStorage.getItem("token");

    if (newPassword && newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      setSaving(false);
      return;
    }

    try {
      const profileRes = await fetch(`${API_BASE}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ country, city, dateOfBirth, certificationLevel, divesCount, bio, showInColor, privacy: { photo: photoPrivacy, info: infoPrivacy }, ...(newPassword ? { currentPassword, newPassword } : {}) }),
      });

      const profileData = await profileRes.json();

      if (!profileData.success) {
        setError(profileData.message || "تعذّر حفظ التغييرات");
        setSaving(false);
        return;
      }

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        await fetch(`${API_BASE}/api/users/profile/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      setMessage("تم تحديث الملف الشخصي بنجاح ✅");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1200);
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #d4dae3",
    fontFamily: "inherit",
  } as const;

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "var(--navy)",
  } as const;

  return (
    <div style={{ maxWidth: "560px", margin: "50px auto", padding: "0 20px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "40px 34px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
        }}
      >
        <h1 style={{ color: "var(--navy)", fontSize: "30px", marginBottom: "26px" }}>
          تعديل الملف الشخصي
        </h1>

        <form onSubmit={handleSave}>
          <label style={labelStyle}>الدولة</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="مثال: السعودية"
            style={inputStyle}
          />

          <label style={labelStyle}>المدينة</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="مثال: جدة"
            style={inputStyle}
          />

          <label style={labelStyle}>تاريخ الميلاد</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>مستوى الشهادة</label>
          <input
            value={certificationLevel}
            onChange={(e) => setCertificationLevel(e.target.value)}
            placeholder="مثال: أوبن ووتر"
            style={inputStyle}
          />

          <label style={labelStyle}>عدد الغوصات</label>
          <input
            type="number"
            min={0}
            value={divesCount}
            onChange={(e) => setDivesCount(Number(e.target.value))}
            placeholder="0"
            style={inputStyle}
          />

          <label style={labelStyle}>الصورة الشخصية</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ ...inputStyle, padding: "9px" }}
          />

          <label style={labelStyle}>نبذة عنك (Bio)</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} placeholder="عرّف بنفسك للأعضاء الآخرين..." style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />

          <div style={{ borderTop: "1px solid #eef2f6", margin: "6px 0 18px", paddingTop: "18px" }}>
            <h3 style={{ color: "var(--navy)", fontSize: "17px", marginBottom: "12px" }}>👁️ الخصوصية</h3>
            <label style={labelStyle}>من يرى صورتي الشخصية؟</label>
            <select value={photoPrivacy} onChange={(e) => setPhotoPrivacy(e.target.value)} style={inputStyle}>
              <option value="public">الجميع</option>
              <option value="friends">الأصدقاء فقط</option>
              <option value="hidden">إخفاء تمامًا</option>
            </select>
            <label style={labelStyle}>من يرى بياناتي (الدولة، الشهادة، النبذة)؟</label>
            <select value={infoPrivacy} onChange={(e) => setInfoPrivacy(e.target.value)} style={inputStyle}>
              <option value="public">الجميع</option>
              <option value="friends">الأصدقاء فقط</option>
              <option value="hidden">إخفاء تمامًا</option>
            </select>
            <label style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px", color: "#444" }}>
              <input type="checkbox" checked={showInColor} onChange={(e) => setShowInColor(e.target.checked)} /> أرغب في الانضمام لمجتمع نمطي اللوني (يظهر اسمي في صفحة المجتمعات)
            </label>
          </div>

          <div style={{ borderTop: "1px solid #eef2f6", margin: "6px 0 18px", paddingTop: "18px" }}>
            <h3 style={{ color: "var(--navy)", fontSize: "17px", marginBottom: "12px" }}>🔒 تغيير كلمة المرور (اختياري)</h3>
            <label style={labelStyle}>كلمة المرور الحالية</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="اتركها فارغة إن لم ترغب بالتغيير" style={inputStyle} autoComplete="current-password" />
            <label style={labelStyle}>كلمة المرور الجديدة</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="6 أحرف على الأقل" style={inputStyle} autoComplete="new-password" />
            <label style={labelStyle}>تأكيد كلمة المرور الجديدة</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px",
              background: "var(--mid)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#c0392b", marginTop: "16px", textAlign: "center" }}>{error}</p>
        )}
        {message && (
          <p style={{ color: "#1e7e34", marginTop: "16px", textAlign: "center" }}>{message}</p>
        )}
      </div>
    </div>
  );
}
