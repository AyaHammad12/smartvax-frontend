import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css"; // تأكد من أن المسار صحيح
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
      alert("Passwords do not match!");
      return;
    }

    // عرض رسالة تأكيد قبل التوجيه
    alert("Registration successful! Redirecting to Login Page...");

    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image">
          <img src={registerImage} alt="Register" />
        </div>
        <div className="auth-form">
          <h1 className="bold">
            Welcome to <span className="title">SmartVAX</span>
          </h1>
          <br></br>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <i className="fa fa-user input-icon"></i> {/* أيقونة المستخدم */}
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
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
                placeholder="Childe ID"
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
                placeholder="Phone Number"
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
                placeholder="Password"
                required
              />
            </div>

            <div className="input-group">
              <i className="fa fa-lock input-icon"></i> {/* أيقونة كلمة السر */}
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
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
                I agree to the <span className="title">Terms</span> &{" "}
                <span className="title">Conditions</span>
              </label>
            </div>

            <button type="submit" className="login-btn">
              Sign Up
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
