import React from "react";
import "../styles/ParentDashboard.css";

const ParentDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Parent Dashboard</h2>
      <ul>
        <li>View Child's Vaccination History</li>
        <li>Schedule New Appointment</li>
        <li>Check Vaccine Information</li>
      </ul>
    </div>
  );
};

export default ParentDashboard;
