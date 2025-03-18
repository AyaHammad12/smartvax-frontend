import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/AuthPage.css"; // استيراد ملف CSS
import loginImage from "../img/logo.png"; // استيراد الصورة

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState(null); // حالة لتخزين نوع المستخدم
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

    let userRole = null;

    if (username === "parent" && password === "parent123") {
      userRole = "parent";
    } else if (username === "healthworker" && password === "health123") {
      userRole = "healthworker";
    } else if (username === "manager" && password === "manager123") {
      userRole = "manager";
    } else {
      alert("Invalid credentials ...try again");
      return;
    }

    // ✅ تخزين الدور في localStorage
    localStorage.setItem("role", userRole);
    console.log(
      "✅ Role stored in localStorage:",
      localStorage.getItem("role")
    ); // تحقق من التخزين

    // ✅ تخزين بيانات المستخدم إذا تم تحديد "تذكرني"
    if (rememberMe) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    }

    // ✅ توجيه المستخدم بناءً على دوره
    navigate(
      userRole === "manager" ? "/dashboard/manager" : `/dashboard/${userRole}`
    );
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   console.log("Logging in with", username, password, rememberMe);

  //   // تحقق من بيانات تسجيل الدخول
  //   // هنا يمكن إضافة تحقق من نوع المستخدم بناءً على username أو أي بيانات أخرى
  //   if (username === "parent" && password === "parentPassword") {
  //     setRole("parent");
  //   } else if (username === "healthworker" && password === "healthPassword") {
  //     setRole("healthworker");
  //   } else {
  //     alert("Invalid credentials ...try again");
  //     return;
  //   }

  //   // حفظ البيانات في localStorage إذا تم اختيار "تذكرني"
  //   if (rememberMe) {
  //     localStorage.setItem("username", username);
  //     localStorage.setItem("password", password);
  //   }

  //   //    navigate("/home", { state: { role } });
  //   //  // إرسال المزيد من المعطيات مع الـ state عند التوجيه
  //   // navigate("/home", { state: { role, username, rememberMe } });

  //   // التوجيه بناءً على نوع المستخدم
  //   if (role === "parent") {
  //     navigate("/dashboard/parent", { state: { role } }); // إعادة التوجيه إلى صفحة الأب
  //     console.log("log in role : ", { role });
  //   } else if (role === "healthworker") {
  //     navigate("/dashboard/healthworker", { state: { role } }); // إعادة التوجيه إلى صفحة موظف الصحة
  //     console.log("log in role : ", { role });
  //   }
  // };

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
