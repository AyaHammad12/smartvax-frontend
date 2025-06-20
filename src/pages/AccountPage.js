import React, { useEffect, useState } from "react";
import "../styles/AccountPage.css";

const AccountPage = () => {
  const [accountInfo, setAccountInfo] = useState({
    username: "",
    phone: "",
    role: "",
    vaccinationCenterId: "",
    password: "",
    confirmPassword: "",
  });

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 تحميل بيانات الحساب والمراكز الصحية
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountRes, centersRes] = await Promise.all([
          fetch("http://localhost:8080/api/parent-account", {
            credentials: "include",
          }),
          fetch("http://localhost:8080/api/vaccination-centers", {
            credentials: "include",
          }),
        ]);

        const accountData = await accountRes.json();
        const centersData = await centersRes.json();

        setAccountInfo((prev) => ({
          ...prev,
          username: accountData.username,
          phone: accountData.phone || "",
          role: accountData.role,
          vaccinationCenterId: accountData.vaccinationCenterId || "",
        }));

        setCenters(centersData);
        setLoading(false);
      } catch (err) {
        console.error("فشل تحميل البيانات:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (
      accountInfo.password &&
      accountInfo.password !== accountInfo.confirmPassword
    ) {
      alert("❌ كلمات المرور غير متطابقة!");
      return;
    }

    // إعداد البيانات للإرسال: فقط الحقول التي يمكن تعديلها
    const payload = {
      phone: accountInfo.phone,
      vaccinationCenterId: accountInfo.vaccinationCenterId,
    };

    if (accountInfo.password) {
      payload.password = accountInfo.password;
    }

    try {
      const response = await fetch("http://localhost:8080/api/parent-account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ تم حفظ التعديلات بنجاح");
        setAccountInfo((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        alert("❌ حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
    }
  };

  if (loading) return <p>جاري تحميل البيانات...</p>;

  return (
    <div className="account-container">
      <h2>حسابي</h2>
      <form className="account-form" onSubmit={handleSaveChanges}>
        <label>اسم المستخدم:</label>
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={accountInfo.username}
          disabled
        />

        <label>رقم الهاتف:</label>
        <input
          type="text"
          name="phone"
          value={accountInfo.phone}
          onChange={handleChange}
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
