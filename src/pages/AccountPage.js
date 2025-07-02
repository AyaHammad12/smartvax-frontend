import React, { useEffect, useState } from "react";
import "../styles/AccountPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faBriefcase,
  faHospital,
  faLock,
  faCheckCircle,
  faTimesCircle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons"; // Import necessary icons

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
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // State for success/error messages

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

        if (!accountRes.ok) throw new Error("فشل في تحميل بيانات الحساب");
        if (!centersRes.ok) throw new Error("فشل في تحميل المراكز الصحية");

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
        setMessage({
          type: "error",
          text: err.message || "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقًا."
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
    setMessage(null); // Clear previous messages

    if (
        accountInfo.password &&
        accountInfo.password !== accountInfo.confirmPassword
    ) {
      setMessage({ type: "error", text: "❌ كلمات المرور غير متطابقة!" });
      setIsSaving(false);
      return;
    }

    const payload = {
      phone: accountInfo.phone,
      // Only include vaccinationCenterId if role is relevant or if it's explicitly allowed to be changed
      // For a parent account, this might be read-only or not applicable.
      // Based on your original code, it seems intended to be sent, so keeping it.
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
        setMessage({ type: "success", text: "✅ تم حفظ التعديلات بنجاح!" });
        setAccountInfo((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        const errorText = await response.text();
        setMessage({ type: "error", text: errorText || "❌ حدث خطأ أثناء التحديث!" });
      }
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      setMessage({ type: "error", text: "❌ حدث خطأ في الشبكة. يرجى التحقق من اتصالك." });
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
          <h2>حسابي</h2>
          <p>قم بإدارة معلومات حسابك وتحديث كلمة المرور الخاصة بك.</p>
        </div>

        {message && (
            <div className={`alert-message ${message.type}`}>
              {message.text}
            </div>
        )}

        <form className="account-form" onSubmit={handleSaveChanges}>
          <div className="form-group">
            <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} /> اسم المستخدم:
            </label>
            <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
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
                id="phone"
                name="phone"
                value={accountInfo.phone}
                onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <FontAwesomeIcon icon={faBriefcase} /> الدور:
            </label>
            <input type="text" id="role" name="role" value={accountInfo.role} disabled />
          </div>

          {/* Display Vaccination Center selection only if the role requires it and there are centers */}
          {accountInfo.role && (accountInfo.role === "admin" || accountInfo.role === "manager") && centers.length > 0 && (
              <div className="form-group">
                <label htmlFor="vaccinationCenterId">
                  <FontAwesomeIcon icon={faHospital} /> المركز الصحي:
                </label>
                <select
                    id="vaccinationCenterId"
                    name="vaccinationCenterId"
                    value={accountInfo.vaccinationCenterId}
                    onChange={handleChange}
                    // You might want to disable this if the role is parent and it's not meant to be changed by them
                    // disabled={accountInfo.role === "parent"}
                >
                  <option value="">اختر مركزًا صحيًا</option>
                  {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                  ))}
                </select>
              </div>
          )}

          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> كلمة مرور جديدة (اختياري):
            </label>
            <input
                type="password"
                id="password"
                name="password"
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
                id="confirmPassword"
                name="confirmPassword"
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

export default AccountPage;