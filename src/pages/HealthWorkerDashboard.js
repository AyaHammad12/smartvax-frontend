import "../styles/HealthWorkerDashboard.css";
import Calendar from "../components/Calendar";
import { FaBell } from "react-icons/fa";

import React, { useEffect, useState } from "react";

// const HealthWorkerDashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <h2>Health Worker Dashboard</h2>
//       <ul>
//         <li>Manage Vaccine Status</li>
//         <li>View Appointment Requests</li>
//         <li>Update Vaccination Records</li>
//       </ul>
//     </div>
//   );
// };

// export default HealthWorkerDashboard;

// const HealthWorkerDashboard = ({ role }) => {
//   return (
//     <div className="home-container">
//       <h1>Welcome to Health worker </h1>
//       <br></br>
//       {console.log("HealthWorkerDashboard  role : ", { role })}
//       {/* قسم التذكير بالتطعيم */}
//       <div className="reminder-container">
//         <FaBell className="icon" />
//         <p>Vaccination: 23th January</p>
//       </div>
//       <br></br>
//       {/* جدول التطعيمات */}
//       <Calendar />
//     </div>
//   );
// };

// export default HealthWorkerDashboard;

const HealthWorkerDashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // جلب الـ role من localStorage
    setRole(storedRole);
  }, []);

  console.log("HealthWorkerDashboard role:", role);

  return (
    <div className="home-container">
      <h1>Welcome to Health worker</h1>
      <br />
      <div className="reminder-container">
        <FaBell className="icon" />
        <p>Vaccination: 23th January</p>
      </div>
      <br />
      <Calendar />
    </div>
  );
};

export default HealthWorkerDashboard;
