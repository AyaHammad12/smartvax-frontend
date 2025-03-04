import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/AuthPage.css"; // استيراد ملف CSS
import loginImage from "../img/image.png"; // استيراد الصورة

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // عند تحميل الصفحة، إذا كانت البيانات موجودة في localStorage، نقوم بإظهارها
  useEffect(() => {
    if (localStorage.getItem("username") && localStorage.getItem("password")) {
      setUsername(localStorage.getItem("username"));
      setPassword(localStorage.getItem("password"));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", username, password, rememberMe);

    if (rememberMe) {
      // حفظ البيانات في localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    }

    navigate("/dashboard/parent");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image">
          <img src={loginImage} alt="Login" />
        </div>
        <div className="auth-form">
          <h1 className="bold">
            Welcome to <span className="title ">SmartVAX</span>
          </h1>
          <br></br>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
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
                Remember me
              </label>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="register-link">
            Don't have an account?{" "}
            <span className="title" onClick={() => navigate("/register")}>
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
