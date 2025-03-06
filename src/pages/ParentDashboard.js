import React from "react";
import "../styles/HomePage.css";
import Calendar from "../components/Calendar";
import { FaBell } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome parent to SmartVax</h1>
      <br></br>

      {/* قسم التذكير بالتطعيم */}
      <div className="reminder-container">
        <FaBell className="icon" />
        <p>Upcoming Vaccination: 23th January</p>
      </div>
      <br></br>

      {/* جدول التطعيمات */}
      <Calendar role="parent" />

      {/* مفتاح الألوان (Legend) */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-box upcoming"></span> Upcoming
        </div>
        <div className="legend-item">
          <span className="legend-box completed"></span> Completed
        </div>
        <div className="legend-item">
          <span className="legend-box missed"></span> Missed
        </div>
      </div>
    </div>
  );
};

export default HomePage;
