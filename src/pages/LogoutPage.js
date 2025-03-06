import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // إزالة بيانات المستخدم عند تحميل الصفحة
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    // إعادة التوجيه إلى صفحة تسجيل الدخول
    navigate("/login");
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
    </div>
  );
};

export default LogoutPage;
