import React from "react";
import {
  FaUserPlus,
  FaCalendarCheck,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/ManagerDashboard.css";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>لوحة تحكم المدير</h1>
      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          onClick={() => navigate("/manage-workers")}
        >
          <FaUsers className="dashboard-icon" />
          <h3>إجمالي العاملين الصحيين</h3>
          <p>10</p>
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/appointments")}
        >
          <FaCalendarCheck className="dashboard-icon" />
          <h3>المواعيد المجدولة</h3>
          <p>200</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/reports")}>
          <FaChartBar className="dashboard-icon" />
          <h3>عرض التقارير</h3>
          <p>اضغط لرؤية التفاصيل</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
