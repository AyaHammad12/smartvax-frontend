import React, { useState } from "react";
import "../styles/ProfilePage.css"; // تأكد من وجود ملف CSS للتنسيق

const ProfilePage = () => {
  // بيانات الطفل الأساسية (لا يمكن تعديل الاسم، رقم الهوية، تاريخ الميلاد، والجنس)
  const [childProfile, setChildProfile] = useState({
    name: "علي أحمد",
    id: "CHD123456",
    dob: "2020-05-15",
    gender: "ذكر",
    weight: "12 كجم",
    height: "90 سم",
    parentName: "أحمد حسن",
    phone: "+123456789",
    address: "123 شارع رئيسي، المدينة",
  });

  // تحديث الحقول القابلة للتعديل
  const handleProfileChange = (e) => {
    setChildProfile({ ...childProfile, [e.target.name]: e.target.value });
  };

  // حفظ التعديلات
  const handleSaveChanges = () => {
    alert("تم تحديث الملف الشخصي بنجاح!");
    console.log("الملف الشخصي المحدث:", childProfile);
  };

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
          onChange={handleProfileChange}
        />

        <label>رقم الهاتف:</label>
        <input
          type="text"
          name="phone"
          value={childProfile.phone}
          onChange={handleProfileChange}
        />

        <label>العنوان:</label>
        <input
          type="text"
          name="address"
          value={childProfile.address}
          onChange={handleProfileChange}
        />
      </div>

      <button className="save-btn" onClick={handleSaveChanges}>
        حفظ التعديلات
      </button>
    </div>
  );
};

export default ProfilePage;
