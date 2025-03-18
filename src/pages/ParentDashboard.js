import React from "react";
import "../styles/HomePage.css";
import Calendar from "../components/Calendar";
import { FaBell } from "react-icons/fa";

const ParentDashboard = () => {
  return (
    <div className="home-container">
      <h1>مرحبًا بك في لوحة تحكم الوالدين</h1>
      <br />

      {/* قسم التذكير بالتطعيم */}
      <div className="reminder-container">
        <FaBell className="icon" />
        <p>التطعيم القادم: 23 يناير</p>
      </div>
      <br />

      {/* جدول التطعيمات */}
      <Calendar role="parent" />

      {/* مفتاح الألوان (Legend) */}
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
