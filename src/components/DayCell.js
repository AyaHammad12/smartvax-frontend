import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({ day, month, year, status, role, id, vaccineName }) => {
  const navigate = useNavigate();

  const vaccinations_Status = (() => {
    switch ((status || "").trim()) {
      case "فائت":
        return "missed";
      case "مكتمل":
        return "completed";
      case "قادم":
        return "upcoming";
      default:
        return "";
    }
  })();

  // const handleClick = () => {
  //   if (!id) {
  //     console.warn("لا يوجد تطعيم مسجل لهذا اليوم.");
  //     return;
  //   }
  //   if (role === "parent" && id) {
  //     navigate(`/vaccine-info/${id}`); // توجيه للصفحة مع معرف التطعيم
  //   }
  //   if (role === "health_worker") {
  //     const fullDate = `${year}-${month}-${String(day).padStart(2, "0")}`;
  //     navigate(`/hw-appointment-scheduling/${fullDate}`);
  //   }
  // };

  const handleClick = () => {
    if (!id && role !== "healthworker") {
      console.warn("لا يوجد تطعيم مسجل لهذا اليوم.");
      return;
    }

    const fullDate = `${year}-${month}-${String(day).padStart(2, "0")}`;

    if (role === "parent" && id) {
      navigate(`/vaccine-info/${id}`);
    }

    if (role === "healthworker") {
      navigate(`/hw-appointment-scheduling/${fullDate}`);
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

      {/* ✅ عرض اسم التطعيم */}
      {vaccineName && (
        <span className="vaccine-name">
          {vaccineName.length > 18
            ? vaccineName.slice(0, 15) + "..."
            : vaccineName}
        </span>
      )}
    </div>
  );
};

export default DayCell;
