import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [childProfile, setChildProfile] = useState({
    name: "",
    id: "",
    dob: "",
    gender: "",
    weight: "—",  // يظهر من growth-records
    height: "—",  // يظهر من growth-records
    parentName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndGrowth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/child-profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const child = await res.json();
        setChildProfile(prev => ({ ...prev, ...child }));

        // ⬇️ جلب آخر قياس للطول والوزن
        const growthRes = await fetch(`http://localhost:8080/api/growth-analysis/${child.id}`);
        if (growthRes.ok) {
          const data = await growthRes.json();
          const sorted = data.sort((a, b) => a.ageInDays - b.ageInDays);
          const latest = sorted.at(-1);

          if (latest) {
            setChildProfile(prev => ({
              ...prev,
              height: latest.height ?? "—",
              weight: latest.weight ?? "—",
            }));
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading profile or growth", err);
        setLoading(false);
      }
    };

    fetchProfileAndGrowth();
  }, []);

  if (loading) return <div>...جاري تحميل البيانات</div>;

  return (
      <div className="profile-container" dir="rtl">
        <h2>الملف الشخصي للطفل</h2>
        <div className="profile-card">
          <p><strong>اسم الطفل:</strong> {childProfile.name}</p>
          <p><strong>رقم الهوية:</strong> {childProfile.id}</p>
          <p><strong>تاريخ الميلاد:</strong> {childProfile.dob}</p>
          <p>
            <strong>الجنس:</strong>{" "}
            {childProfile.gender?.toLowerCase() === "male"
                ? "ذكر"
                : childProfile.gender?.toLowerCase() === "female"
                    ? "أنثى"
                    : "غير معروف"}
          </p>

          <label>الوزن (كجم):</label>
          <input
              type="text"
              name="weight"
              value={childProfile.weight}
              disabled
          />

          <label>الطول (سم):</label>
          <input
              type="text"
              name="height"
              value={childProfile.height}
              disabled
          />

          <label>اسم ولي الأمر:</label>
          <input
              type="text"
              name="parentName"
              value={childProfile.parentName}
              disabled
          />

          <label>رقم الهاتف:</label>
          <input
              type="text"
              name="phone"
              value={childProfile.phone}
              disabled
          />

          <label>العنوان:</label>
          <input
              type="text"
              name="address"
              value={childProfile.address}
              disabled
          />
        </div>
      </div>
  );
};

export default ProfilePage;
