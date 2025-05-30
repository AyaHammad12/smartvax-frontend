import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({ day, month, year, status, role, vaccines = [] }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);

  const vaccinations_Status = (() => {
    const statuses = vaccines.map((v) => v.status);

    if (statuses.includes("فائت")) return "missed";
    if (statuses.includes("قادم")) return "upcoming";
    if (statuses.includes("مكتمل")) return "completed";
    return "";
  })();


  const handleClick = (vaccineId) => {
    if (!vaccineId && role !== "healthworker") {
      console.warn("لا يوجد تطعيم مسجل لهذا اليوم.");
      return;
    }

    const fullDate = `${year}-${month}-${String(day).padStart(2, "0")}`;

    if (role === "parent" && vaccineId) {
      navigate(`/vaccine-info/${vaccineId}`);
    }

    if (role === "healthworker") {
      navigate(`/hw-appointment-scheduling/${fullDate}`);
    }
  };

  return (
      <div
          className={`day-cell ${vaccinations_Status}`}
          title={"اضغط لرؤية تفاصيل اليوم"}
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
          style={{ cursor: vaccines.length > 0 || role === "healthworker" ? "pointer" : "default" }}
      >
        <span className="day-number">{day}</span>

        {/* ✅ عرض اسم المجموعة الأولى فقط كبداية */}
        {vaccines.length > 0 && (
            <span className="vaccine-name">
          {vaccines[0].groupName?.length > 18
              ? vaccines[0].groupName.slice(0, 15) + "..."
              : vaccines[0].groupName}
        </span>
        )}

        {/* ✅ عرض القائمة عند التحويم */}
        {showPopup && vaccines.length > 0 && (
            <div className="vaccine-popup">
              {vaccines.map((v, index) => (
                  <div
                      key={index}
                      className="vaccine-popup-item"
                      onClick={() => handleClick(v.id)}
                  >
                    💉 {v.name}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default DayCell;
