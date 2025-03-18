import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/AuthPage.css"; // استيراد ملف CSS
import loginImage from "../img/logo.png"; // استيراد الصورة

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("username") && localStorage.getItem("password")) {
      setUsername(localStorage.getItem("username"));
      setPassword(localStorage.getItem("password"));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("تسجيل الدخول باستخدام", username, password, rememberMe);

    let userRole = null;

    if (username === "parent" && password === "parent123") {
      userRole = "parent";
    } else if (username === "healthworker" && password === "health123") {
      userRole = "healthworker";
    } else if (username === "manager" && password === "manager123") {
      userRole = "manager";
    } else {
      alert("بيانات الاعتماد غير صحيحة ... حاول مرة أخرى");
      return;
    }

    localStorage.setItem("role", userRole);
    console.log(
      "✅ تم تخزين الدور في localStorage:",
      localStorage.getItem("role")
    );

    if (rememberMe) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    }

    navigate(
      userRole === "manager" ? "/dashboard/manager" : `/dashboard/${userRole}`
    );
  };

  return (
    <div className="auth-container" dir="rtl">
      <div className="auth-card">
        <div className="auth-image">
          <img src={loginImage} alt="تسجيل الدخول" />
        </div>
        <div className="auth-form">
          <h1 className="bold">
            مرحبًا بك في <span className="title">SmartVAX</span>
          </h1>
          <br />
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="colorWord">
                تذكرني
              </label>
            </div>

            <button type="submit" className="login-btn">
              تسجيل الدخول
            </button>
          </form>

          <p className="register-link">
            لا تملك حسابًا؟{" "}
            <span className="title" onClick={() => navigate("/register")}>
              إنشاء حساب
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
