import React from "react";
import "../styles/HomePage.css";
import Calendar from "../components/Calendar";
import { FaBell } from "react-icons/fa";

const ParentDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">مرحبًا بك في لوحة تحكم الوالدين</h1>

      {/* ✅ قسم التذكير بالتطعيم */}
      <div className="reminder-box">
        <FaBell className="reminder-icon" />
        <p className="reminder-text">التطعيم القادم: 23 يناير</p>
      </div>

      {/* ✅ جدول التطعيمات */}
      <div className="calendar-section">
        <Calendar role="parent" />
      </div>

      {/* ✅ مفتاح الألوان */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-box upcoming"></span> قادم
        </div>
        <div className="legend-item">
          <span className="legend-box completed"></span> مكتمل
        </div>
        <div className="legend-item">
          <span className="legend-box missed"></span> فائت
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
