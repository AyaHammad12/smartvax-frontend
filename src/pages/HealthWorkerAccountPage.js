import React, { useEffect, useState } from "react";
import "../styles/AccountPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faHospital,
  faBriefcase,
  faLock,
  faCheckCircle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

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
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
            "http://localhost:8080/api/health-worker-account",
            { credentials: "include" }
        );
        if (!res.ok) throw new Error("فشل تحميل بيانات الحساب");
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
        setMessage({
          type: "error",
          text: err.message || "تعذر تحميل بيانات الحساب!"
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (
        accountInfo.password &&
        accountInfo.password !== accountInfo.confirmPassword
    ) {
      setMessage({ type: "error", text: "❌ كلمات المرور غير متطابقة!" });
      setIsSaving(false);
      return;
    }

    const payload = { phone: accountInfo.phone };
    if (accountInfo.password) {
      payload.password = accountInfo.password;
    }

    try {
      const response = await fetch(
          "http://localhost:8080/api/health-worker-account",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "✅ تم حفظ التعديلات بنجاح!" });
        setAccountInfo((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        setMessage({ type: "error", text: "❌ حدث خطأ أثناء التحديث" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ حدث خطأ في الشبكة." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="loading-message">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#007bff" />
          <p>جاري تحميل البيانات...</p>
        </div>
    );
  }

  return (
      <div className="account-container">
        <div className="account-header">
          <h2>حساب العامل الصحي</h2>
          <p>قم بإدارة معلومات حسابك وتحديث كلمة المرور الخاصة بك.</p>
        </div>

        {message && (
            <div className={`alert-message ${message.type}`}>{message.text}</div>
        )}

        <form className="account-form" onSubmit={handleSaveChanges}>
          <div className="form-group">
            <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} /> اسم المستخدم:
            </label>
            <input
                type="text"
                name="username"
                id="username"
                value={accountInfo.username}
                disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FontAwesomeIcon icon={faPhone} /> رقم الهاتف:
            </label>
            <input
                type="text"
                name="phone"
                id="phone"
                value={accountInfo.phone}
                onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vaccinationCenterName">
              <FontAwesomeIcon icon={faHospital} /> المركز الصحي:
            </label>
            <input
                type="text"
                name="vaccinationCenterName"
                id="vaccinationCenterName"
                value={accountInfo.vaccinationCenterName}
                disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <FontAwesomeIcon icon={faBriefcase} /> الدور:
            </label>
            <input
                type="text"
                name="role"
                id="role"
                value={accountInfo.role}
                disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> كلمة مرور جديدة (اختياري):
            </label>
            <input
                type="password"
                name="password"
                id="password"
                value={accountInfo.password}
                onChange={handleChange}
                autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FontAwesomeIcon icon={faLock} /> تأكيد كلمة المرور:
            </label>
            <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={accountInfo.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
            />
          </div>

          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> جاري الحفظ...
                </>
            ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} /> حفظ التعديلات
                </>
            )}
          </button>
        </form>
      </div>
  );
};

export default HealthWorkerAccountPage;
