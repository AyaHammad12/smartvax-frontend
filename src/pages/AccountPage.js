import React, { useState } from "react";
import "../styles/AccountPage.css"; // تأكد من أن ملف CSS موجود

const AccountPage = () => {
  const [accountInfo, setAccountInfo] = useState({
    username: "john_doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    address: "123 شارع رئيسي، المدينة",
    role: "ولي أمر", // ✅ لا يمكن تعديله لأنه محدد مسبقًا
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    // ✅ التأكد من أن كلمة المرور والتأكيد متطابقان
    if (
      accountInfo.password &&
      accountInfo.password !== accountInfo.confirmPassword
    ) {
      alert("كلمات المرور غير متطابقة!");
      return;
    }

    alert("تم تحديث بيانات الحساب بنجاح!");
    console.log("بيانات الحساب المحدثة:", accountInfo);
  };

  return (
    <div className="account-container">
      <h2>حسابي</h2>
      <form className="account-form" onSubmit={handleSaveChanges}>
        <label>اسم المستخدم:</label>
        <input
          type="text"
          name="username"
          value={accountInfo.username}
          disabled
        />

        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          name="email"
          value={accountInfo.email}
          onChange={handleChange}
          required
        />

        <label>رقم الهاتف:</label>
        <input
          type="text"
          name="phone"
          value={accountInfo.phone}
          onChange={handleChange}
          required
        />

        <label>العنوان:</label>
        <input
          type="text"
          name="address"
          value={accountInfo.address}
          onChange={handleChange}
          required
        />

        <label>الدور:</label>
        <input type="text" name="role" value={accountInfo.role} disabled />

        <label>كلمة مرور جديدة (اختياري):</label>
        <input
          type="password"
          name="password"
          value={accountInfo.password}
          onChange={handleChange}
        />

        <label>تأكيد كلمة المرور:</label>
        <input
          type="password"
          name="confirmPassword"
          value={accountInfo.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" className="save-btn">
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
