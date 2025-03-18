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
      <h1>Manager Dashboard</h1>
      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          onClick={() => navigate("/manage-workers")}
        >
          <FaUsers className="dashboard-icon" />
          <h3>Total Health Workers</h3>
          <p>10</p>
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/appointments")}
        >
          <FaCalendarCheck className="dashboard-icon" />
          <h3>Appointments Scheduled</h3>
          <p>200</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/reports")}>
          <FaChartBar className="dashboard-icon" />
          <h3>View Reports</h3>
          <p>Click to see details</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
