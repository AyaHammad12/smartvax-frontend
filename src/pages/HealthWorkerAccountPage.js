import React, { useEffect, useState } from "react";
import "../styles/AccountPage.css"; // إعادة استخدام نفس CSS

const HealthWorkerAccountPage = () => {
  const [accountInfo, setAccountInfo] = useState({
    username: "",
    phone: "",
    role: "",
    vaccinationCenterName: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  // 📌 تحميل بيانات حساب العامل الصحي
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/health-worker-account",
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        setAccountInfo((prev) => ({
          ...prev,
          username: data.username,
          phone: data.phone || "",
          role: data.role,
          vaccinationCenterName: data.vaccinationCenterName || "غير محدد",
        }));
        setLoading(false);
      } catch (err) {
        console.error("فشل تحميل بيانات الحساب:", err);
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

    const payload = {
      phone: accountInfo.phone,
    };

    if (accountInfo.password) {
      payload.password = accountInfo.password;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/health-worker-account",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

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

        <label>المركز الصحي:</label>
        <input
          type="text"
          name="vaccinationCenterName"
          value={accountInfo.vaccinationCenterName}
          disabled
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

export default HealthWorkerAccountPage;
