import "../styles/HealthWorkerDashboard.css";
import Calendar from "../components/Calendar";
import { FaBell } from "react-icons/fa";

import React, { useEffect, useState } from "react";

const HealthWorkerDashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // جلب الدور من localStorage
    setRole(storedRole);
  }, []);

  console.log("الدور في لوحة تحكم العامل الصحي:", role);

  return (
    <div className="home-container" dir="rtl">
      <h1>مرحبًا بك في لوحة تحكم العامل الصحي</h1>
      <br />
      <div className="reminder-container">
        <FaBell className="icon" />
        <p>التطعيم القادم: 23 يناير</p>
      </div>
      <br />
      <Calendar role={role} /> {/* تمرير الدور هنا */}
    </div>
  );
};

export default HealthWorkerDashboard;
