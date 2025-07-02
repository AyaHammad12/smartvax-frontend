import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import loginImage from "../img/logo.png"; // شعار التطبيق
import "../styles/LoginPage.css"; // ملف التنسيق

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

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(
        "🔵 محاولة تسجيل الدخول باستخدام",
        username,
        password,
        rememberMe
    );

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // يحفظ الجلسة
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(
            "فشل تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة"
        );
      }

      const data = await response.json();
      const { id, username: user, role, referenceId } = data; // ✅

      localStorage.setItem("userId", id);
      localStorage.setItem("username", user);
      localStorage.setItem("role", mapRoleToFrontend(role));

      if (role.toUpperCase() === "PARENT") {
        localStorage.setItem("parentId", referenceId); // ✅ هنا يتم الحل
      }

      if (rememberMe) {
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("password");
      }


      // التوجيه حسب الدور
      switch (role.toLowerCase()) {
        case "admin":
          navigate("/dashboard/manager");
          break;
        case "parent":
          navigate("/dashboard/parent");
          break;
        case "health_worker":
          navigate("/dashboard/healthworker");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ خطأ أثناء تسجيل الدخول:", error);
      alert(error.message || "حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  };

  const mapRoleToFrontend = (role) => {
    switch (role.toUpperCase()) {
      case "PARENT":
        return "parent";
      case "ADMIN":
        return "admin";
      case "HEALTH_WORKER":
        return "healthworker";
      default:
        return "user";
    }
  };

  return (
      <div className="login-container" dir="rtl">
        <div className="login-card">
          <div className="login-image">
            <img src={loginImage} alt="SmartVAX Logo" />
          </div>
          <div className="login-form">
            <h1 style={{ color: "#1565c0" }}>مرحبًا بك!</h1>
            <p className="subtitle" style={{ color: "#1565c0" }}>
              ابدأ رحلة التطعيم من هنا
            </p>
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
                <label htmlFor="rememberMe" style={{ color: "#1565c0" }}>
                  حفظ بيانات الدخول
                </label>
              </div>
              <button type="submit" className="login-btn">
                تسجيل الدخول
              </button>
            </form>
            <div className="login-links">
            <span
                onClick={() => navigate("/register")}
                style={{ color: "#1565c0", cursor: "pointer" }}
            >
              إنشاء حساب
            </span>
              {" | "}
              <span style={{ color: "#1565c0", cursor: "pointer" }}>
              نسيت كلمة المرور؟
            </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
