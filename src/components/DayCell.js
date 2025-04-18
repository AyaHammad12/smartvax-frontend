import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({ day, month, year, status, role, id }) => {
  const navigate = useNavigate();

  const vaccinations_Status = (() => {
    switch (status) {
      case "فائت":
        return "missed"; // 🔴 لون أحمر
      case "مكتمل":
        return "completed"; // 🟢 لون أخضر
      case "قادم":
        return "upcoming"; // 🟠 لون برتقالي
      default:
        return ""; // بدون لون إضافي
    }
  })();

  const handleClick = () => {
    if (!id) {
      console.warn("لا يوجد تطعيم مسجل لهذا اليوم.");
      return;
    }
    if (role === "parent" && id) {
      navigate(`/vaccine-info/${id}`);
    } else if (role === "healthworker") {
      // navigate(`/Manegment-Requests-Appointment?date=${dateString}`);
    }
  };

  return (
      <div
          className={`day-cell ${vaccinations_Status}`}
          title={"اضغط لرؤية تفاصيل اليوم"}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
      >
        <span className="day-number">{day}</span>
      </div>
  );
};

export default DayCell;
