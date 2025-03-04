import React from "react";
import "../styles/HealthWorkerDashboard.css";

const HealthWorkerDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Health Worker Dashboard</h2>
      <ul>
        <li>Manage Vaccine Status</li>
        <li>View Appointment Requests</li>
        <li>Update Vaccination Records</li>
      </ul>
    </div>
  );
};

export default HealthWorkerDashboard;
