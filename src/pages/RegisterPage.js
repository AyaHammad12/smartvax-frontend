import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";
import registerImage from "../img/logo.png";
import "font-awesome/css/font-awesome.min.css";

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ كلمات المرور غير متطابقة!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("❗ يجب الموافقة على الشروط والأحكام!");
      return;
    }

    try {
      const payload = {
        name: formData.username,
        phone: formData.phone,
        dob: formData.dob ? formData.dob : null,
        role: "ROLE_PARENT",
      };

      const response = await fetch("/api/parents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🛑 خطأ في السيرفر:", errorData);
        throw new Error(errorData.detail || "❌ فشل إنشاء الحساب.");
      }

      alert("✅ تم إنشاء الحساب بنجاح!");
      navigate("/login");
    } catch (error) {
      console.error("❌ خطأ أثناء عملية التسجيل:", error);
      alert(error.message || "حدث خطأ غير متوقع أثناء التسجيل.");
    }
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
              {/* إدخال اسم المستخدم */}
              <div className="input-group">
                <i className="fa fa-user input-icon"></i>
                <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="اسم المستخدم"
                    required
                />
              </div>

              {/* إدخال رقم الهوية */}
              <div className="input-group">
                <i className="fa fa-id-card input-icon"></i>
                <input
                    name="id"
                    type="text"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="رقم الهوية"
                    required
                />
              </div>

              {/* إدخال تاريخ الميلاد */}
              <div className="input-group">
                <i className="fa fa-calendar input-icon"></i>
                <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                />
              </div>

              {/* إدخال رقم الهاتف */}
              <div className="input-group">
                <i className="fa fa-phone input-icon"></i>
                <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="رقم الهاتف"
                    required
                />
              </div>

              {/* إدخال كلمة المرور */}
              <div className="input-group">
                <i className="fa fa-lock input-icon"></i>
                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="كلمة المرور"
                    required
                />
              </div>

              {/* تأكيد كلمة المرور */}
              <div className="input-group">
                <i className="fa fa-lock input-icon"></i>
                <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="تأكيد كلمة المرور"
                    required
                />
              </div>

              {/* الموافقة على الشروط */}
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
