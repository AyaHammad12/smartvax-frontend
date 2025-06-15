import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [childProfile, setChildProfile] = useState({
    name: "",
    id: "",
    dob: "",
    gender: "",
    weight: "",
    height: "",
    parentName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔄 Load child profile data on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/child-profile", {
      method: "GET",
      credentials: "include", // مهم جدًا عشان يبعث الكوكي الخاصة بالجلسة
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setChildProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading profile", err);
        setLoading(false);
      });
  }, []);

  const handleProfileChange = (e) => {
    setChildProfile({ ...childProfile, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    const updateDto = {
      id: childProfile.id,
      weight: parseFloat(childProfile.weight) || 0,
      height: parseFloat(childProfile.height) || 0,
    };

    fetch("http://localhost:8080/api/update-child-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updateDto),
    })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
      })
      .catch((err) => {
        console.error("❌ Error saving profile", err);
        alert("فشل في حفظ التغييرات");
      });
  };

  if (loading) return <div>...جاري تحميل البيانات</div>;

  return (
    <div className="profile-container" dir="rtl">
      <h2>الملف الشخصي للطفل</h2>
      <div className="profile-card">
        <p>
          <strong>اسم الطفل:</strong> {childProfile.name}
        </p>
        <p>
          <strong>رقم الهوية:</strong> {childProfile.id}
        </p>
        <p>
          <strong>تاريخ الميلاد:</strong> {childProfile.dob}
        </p>
        <p>
          <strong>الجنس:</strong> {childProfile.gender}
        </p>

        <label>الوزن (كجم):</label>
        <input
          type="text"
          name="weight"
          value={childProfile.weight}
          onChange={handleProfileChange}
        />

        <label>الطول (سم):</label>
        <input
          type="text"
          name="height"
          value={childProfile.height}
          onChange={handleProfileChange}
        />

        <label>اسم ولي الأمر:</label>
        <input
          type="text"
          name="parentName"
          value={childProfile.parentName}
          disabled
        />

        <label>رقم الهاتف:</label>
        <input type="text" name="phone" value={childProfile.phone} disabled />

        <label>العنوان:</label>
        <input
          type="text"
          name="address"
          value={childProfile.address}
          disabled
        />
      </div>

      <button className="save-btn" onClick={handleSaveChanges}>
        حفظ التعديلات
      </button>
    </div>
  );
};

export default ProfilePage;
