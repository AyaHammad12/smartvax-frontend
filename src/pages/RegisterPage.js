import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css"; // تأكد من صحة المسار
import registerImage from "../img/logo.png"; // استيراد الصورة
import "font-awesome/css/font-awesome.min.css"; // استيراد Font Awesome

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    id: "",
    dob: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, agreeTerms: e.target.checked });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("كلمات المرور غير متطابقة!");
      return;
    }

    // عرض رسالة تأكيد قبل التوجيه
    alert("تم التسجيل بنجاح! جارٍ إعادة التوجيه إلى صفحة تسجيل الدخول...");

    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image">
          <img src={registerImage} alt="التسجيل" />
        </div>
        <div className="auth-form">
          <h1 className="bold">
            مرحبًا بك في <span className="title">SmartVAX</span>
          </h1>
          <br />
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <i className="fa fa-user input-icon"></i> {/* أيقونة المستخدم */}
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="اسم المستخدم"
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-id-card input-icon"></i> {/* أيقونة الهوية */}
              <input
                name="id"
                type="text"
                value={formData.id}
                onChange={handleChange}
                placeholder="رقم الهوية"
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-calendar input-icon"></i>{" "}
              {/* أيقونة التاريخ */}
              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-phone input-icon"></i> {/* أيقونة الهاتف */}
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="رقم الهاتف"
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-lock input-icon"></i> {/* أيقونة كلمة السر */}
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="كلمة المرور"
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-lock input-icon"></i>{" "}
              {/* أيقونة تأكيد كلمة السر */}
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="تأكيد كلمة المرور"
                required
              />
            </div>

            <div className="terms-conditions">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleCheckboxChange}
              />
              <label>
                أوافق على <span className="title">الشروط</span> و{" "}
                <span className="title">الأحكام</span>
              </label>
            </div>

            <button type="submit" className="login-btn">
              إنشاء حساب
            </button>
          </form>

          <p className="login-link">
            لديك حساب بالفعل؟{" "}
            <span onClick={() => navigate("/login")}>تسجيل الدخول</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
