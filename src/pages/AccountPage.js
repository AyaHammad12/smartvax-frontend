import React, { useState } from "react";
import "../styles/AccountPage.css"; // تأكد من أن ملف CSS موجود

const AccountPage = () => {
  const [accountInfo, setAccountInfo] = useState({
    username: "john_doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    address: "123 Main Street, City",
    role: "Parent", // ✅ لا يمكن تعديله لأنه محدد مسبقًا
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
      alert("Passwords do not match!");
      return;
    }

    alert("Account details updated successfully!");
    console.log("Updated Account Info:", accountInfo);
  };

  return (
    <div className="account-container">
      <h2>My Account</h2>
      <form className="account-form" onSubmit={handleSaveChanges}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={accountInfo.username}
          disabled
        />{" "}
        {/* غير قابل للتعديل */}
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={accountInfo.email}
          onChange={handleChange}
          required
        />
        <label>Phone Number:</label>
        <input
          type="text"
          name="phone"
          value={accountInfo.phone}
          onChange={handleChange}
          required
        />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={accountInfo.address}
          onChange={handleChange}
          required
        />
        <label>Role:</label>
        <input type="text" name="role" value={accountInfo.role} disabled />{" "}
        {/* غير قابل للتعديل */}
        <label>New Password (Optional):</label>
        <input
          type="password"
          name="password"
          value={accountInfo.password}
          onChange={handleChange}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={accountInfo.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
