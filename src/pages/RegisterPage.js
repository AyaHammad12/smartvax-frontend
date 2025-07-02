import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaChild,
  FaCalendarAlt,
  FaPhoneAlt,
  FaIdCardAlt,
  FaEnvelope, // تأكد من وجود هذه الأيقونة مستوردة
} from "react-icons/fa";
import { BsCheckCircleFill, BsExclamationCircleFill } from "react-icons/bs";
import loginImage from "../img/logo.png";
import "../styles/RegisterPage.css"; // تأكد أن هذا هو المسار الصحيح لملف الـ CSS

const CustomAlert = ({ message, type, onClose }) => {
  if (!message) return null;

  const alertClass = type === "success" ? "alert-success" : "alert-error";
  const Icon =
      type === "success" ? BsCheckCircleFill : BsExclamationCircleFill;

  return (
      <div className={`custom-alert ${alertClass}`} dir="rtl">
        <div className="alert-content">
          <Icon className="alert-icon" />
          <span>{message}</span>
        </div>
        <button className="alert-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
  );
};

const MultiStepRegister = () => {
  const [step, setStep] = useState(1);
  const [childData, setChildData] = useState({
    name: "",
    id: "",
    dob: "",
    phone: "",
  });
  const [code, setCode] = useState("");
  const [parentInfo, setParentInfo] = useState({
    name: "",
    dob: "",
    email: "", // تم إضافة حقل الإيميل هنا
  });
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [alertInfo, setAlertInfo] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  const showAlert = (message, type) => {
    setAlertInfo({ message, type, isVisible: true });
    setTimeout(() => {
      setAlertInfo({ ...alertInfo, isVisible: false });
    }, 5000);
  };

  const handleChildChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    setParentInfo({ ...parentInfo, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleNextStep = async () => {
    if (!childData.name || !childData.id || !childData.dob || !childData.phone) {
      showAlert("يرجى تعبئة جميع الحقول المطلوبة.", "error");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(childData.phone)) {
      showAlert(
          "📱 رقم الهاتف يجب أن يتكون من 10 أرقام بدون مقدمة دولية.",
          "error"
      );
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(childData.dob)) {
      showAlert("📅 تنسيق تاريخ الميلاد غير صالح. استخدم التاريخ من التقويم فقط.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/validate-child-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      const message = await res.text();

      if (res.status === 200) {
        showAlert("✅ تم التحقق من بيانات الطفل بنجاح. يمكنك المتابعة الآن.", "success");
        setStep(2);
      } else {
        showAlert("❌ " + message, "error");
      }
    } catch (error) {
      console.error("خطأ أثناء التحقق:", error);
      showAlert("حدث خطأ أثناء الاتصال بالخادم. حاول مرة أخرى.", "error");
    }
  };

  const handleVerifyCode = () => {
    if (code !== "1234") {
      showAlert("❌ كود التحقق غير صحيح! يرجى المحاولة مرة أخرى.", "error");
      return;
    }
    showAlert("✅ تم التحقق من الكود بنجاح. أكمل بياناتك.", "success");
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      showAlert("❌ كلمات المرور غير متطابقة! يرجى التحقق.", "error");
      return;
    }
    if (userData.password.length < 6) {
      showAlert("🔒 كلمة المرور يجب أن لا تقل عن 6 أحرف.", "error");
      return;
    }

    // التحقق من تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (parentInfo.email && !emailRegex.test(parentInfo.email)) {
      showAlert("✉️ تنسيق البريد الإلكتروني غير صالح.", "error");
      return;
    }


    try {
      const payload = {
        childId: childData.id,
        childName: childData.name,
        childDob: childData.dob,
        childPhone: childData.phone,
        parentName: parentInfo.name,
        parentDob: parentInfo.dob,
        parentPhone: childData.phone,
        parentEmail: parentInfo.email, // تم إضافة الإيميل هنا
        username: userData.username,
        password: userData.password,
      };

      const res = await fetch("http://localhost:8080/api/register-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "فشل في إنشاء الحساب.");
      }

      showAlert("🎉 تم إنشاء الحساب بنجاح! جارٍ توجيهك لصفحة تسجيل الدخول.", "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("خطأ أثناء التسجيل:", err);
      showAlert(err.message || "حدث خطأ غير متوقع أثناء إنشاء الحساب.", "error");
    }
  };

  const StepIndicator = ({ currentStep }) => (
      <div className="step-indicator">
        <div className={`step-circle ${currentStep >= 1 ? "active" : ""}`}>1</div>
        <div className={`step-line ${currentStep >= 2 ? "active" : ""}`}></div>
        <div className={`step-circle ${currentStep >= 2 ? "active" : ""}`}>2</div>
        <div className={`step-line ${currentStep >= 3 ? "active" : ""}`}></div>
        <div className={`step-circle ${currentStep >= 3 ? "active" : ""}`}>3</div>
      </div>
  );

  return (
      <div className="login-container" dir="rtl">
        {alertInfo.isVisible && (
            <CustomAlert
                message={alertInfo.message}
                type={alertInfo.type}
                onClose={() => setAlertInfo({ ...alertInfo, isVisible: false })}
            />
        )}

        <div className="login-card">
          <div className="login-image">
            <img src={loginImage} alt="SmartVAX" />
          </div>
          <div className="login-form">
            <h1 style={{ color: "#1565c0" }}>إنشاء حساب جديد</h1>

            <StepIndicator currentStep={step} />

            <div className={`form-step ${step === 1 ? 'active-step' : ''}`}>
              <p className="subtitle" style={{ color: "#5c6bc0" }}>بيانات الطفل الأساسية</p>
              <div className="input-group">
                <FaChild className="input-icon" />
                <input
                    type="text"
                    name="name"
                    placeholder="اسم الطفل"
                    value={childData.name}
                    onChange={handleChildChange}
                    required
                />
              </div>
              <div className="input-group">
                <FaIdCardAlt className="input-icon" />
                <input
                    type="text"
                    name="id"
                    placeholder="رقم الهوية / شهادة الميلاد"
                    value={childData.id}
                    onChange={handleChildChange}
                    required
                />
              </div>
              <div className="input-group">
                <FaCalendarAlt className="input-icon" />
                <input
                    type="date"
                    name="dob"
                    value={childData.dob}
                    onChange={handleChildChange}
                    onKeyDown={(e) => e.preventDefault()}
                    required
                />
              </div>
              <div className="input-group">
                <FaPhoneAlt className="input-icon" />
                <input
                    type="text"
                    name="phone"
                    placeholder="رقم هاتف ولي الأمر (للتواصل)"
                    value={childData.phone}
                    onChange={handleChildChange}
                    required
                />
              </div>
              <button onClick={handleNextStep} className="login-btn">
                التالي
              </button>
            </div>

            <div className={`form-step ${step === 2 ? 'active-step' : ''}`}>
              <p className="subtitle" style={{ color: "#5c6bc0" }}>أدخل كود التحقق المرسل إلى هاتفك</p>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                    type="text"
                    placeholder="رمز التحقق"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
              </div>
              <div className="button-group">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="login-btn secondary-btn"
                >
                  ← الرجوع
                </button>
                <button onClick={handleVerifyCode} className="login-btn">
                  تحقق
                </button>
              </div>
            </div>

            <div className={`form-step ${step === 3 ? 'active-step' : ''}`}>
              <form onSubmit={handleSubmit}>
                <p className="subtitle" style={{ color: "#5c6bc0" }}>أكمل بيانات ولي الأمر وأنشئ حسابك</p>

                <div className="input-group">
                  <FaUser className="input-icon" />
                  <input
                      type="text"
                      name="name"
                      placeholder="اسم ولي الأمر كاملاً"
                      value={parentInfo.name}
                      onChange={handleParentChange}
                      required
                  />
                </div>
                <div className="input-group">
                  <FaCalendarAlt className="input-icon" />
                  <input
                      type="date"
                      name="dob"
                      value={parentInfo.dob}
                      onChange={handleParentChange}
                      onKeyDown={(e) => e.preventDefault()}
                      required
                  />
                </div>

                {/* حقل الإيميل الجديد تحت اسم المستخدم */}
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                      type="email"
                      name="email"
                      placeholder="البريد الإلكتروني لولي الأمر"
                      value={parentInfo.email}
                      onChange={handleParentChange}
                      required
                  />
                </div>

                <div className="input-group">
                  <FaUser className="input-icon" />
                  <input
                      type="text"
                      name="username"
                      placeholder="اسم المستخدم (لتسجيل الدخول)"
                      value={userData.username}
                      onChange={handleUserChange}
                      required
                  />
                </div>
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                      type="password"
                      name="password"
                      placeholder="كلمة المرور"
                      value={userData.password}
                      onChange={handleUserChange}
                      required
                  />
                </div>
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                      type="password"
                      name="confirmPassword"
                      placeholder="تأكيد كلمة المرور"
                      value={userData.confirmPassword}
                      onChange={handleUserChange}
                      required
                  />
                </div>

                <div className="button-group">
                  <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="login-btn secondary-btn"
                  >
                    ← الرجوع
                  </button>
                  <button type="submit" className="login-btn">
                    إنشاء الحساب
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MultiStepRegister;