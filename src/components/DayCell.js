import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({ day, month, year, status, vaccineName, role }) => {
  const navigate = useNavigate(); // الحصول على الدالة الخاصة بالتنقل

  const handleClick = () => {
    console.log("Clicked Day:", day);
    console.log("Month:", month);
    console.log("Year:", year);
    console.log("Vaccine Name:", vaccineName);
    console.log("Role:", role);

    const dateString = `${year}-${month}-${String(day).padStart(2, "0")}`;

    if (role === "parent" && vaccineName) {
      navigate(`/vaccine-info/${encodeURIComponent(vaccineName)}`);
    } else if (role === "health worker") {
      // السماح بالتنقل حتى لو vaccineName غير موجود
      // navigate(`/appointment-scheduling/${dateString}`);
      navigate(`/Manegment-Requests-Appointment?date=${dateString}`);
    }
  };

  return (
    <div
      className={`day-cell ${status}`}
      title={vaccineName || "No Vaccination"}
      onClick={handleClick} // عند الضغط على اليوم، يتم استدعاء الدالة
    >
      <span className="day-number">{day}</span>
      {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
    </div>
  );
};

export default DayCell;
