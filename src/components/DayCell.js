import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({ day, month, year, status, vaccineName, role }) => {
  const navigate = useNavigate();

  // ✅ تحديد لون `status` بناءً على القيم القادمة من `props`
  const vaccinations_Status = (() => {
    switch (status) {
      case "فائت":
        return "missed"; // 🔴 لون أحمر
      case "مكتمل":
        return "completed"; // 🟢 لون أخضر
      case "قادم":
        return "upcoming"; // 🟠 لون برتقالي
      default:
        return "";
    }
  })();

  const handleClick = () => {
    console.log("اليوم المحدد:", day);
    console.log("الشهر:", month);
    console.log("السنة:", year);
    console.log("اسم اللقاح:", vaccineName);
    console.log("الدور:", role);
    console.log("status : ", status);
    console.log("vaccin name :", vaccineName);

    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (role === "parent" && vaccineName) {
      navigate(`/vaccine-info/${encodeURIComponent(vaccineName)}`);
    } else if (role === "health worker") {
      navigate(`/Manegment-Requests-Appointment?date=${dateString}`);
    }
  };

  return (
    <div
      className={`day-cell ${vaccinations_Status}`} // ✅ الآن يتم تحديد اللون بشكل صحيح
      title={vaccineName || "لا يوجد تطعيم"}
      onClick={handleClick}
    >
      <span className="day-number">{day}</span>
      {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
    </div>
  );
};

export default DayCell;
