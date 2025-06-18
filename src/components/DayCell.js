import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({ day, month, year, status, role, vaccines = [], appointments = [], onClick }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);

  vaccines.forEach((v) => {
    console.log(`Vaccine "${v.name}" rawStatus:`, v.rawStatus);
  });

  const vaccinations_Status = (() => {
    const statuses = vaccines
        .map((v) => v.rawStatus?.trim().toLowerCase());

    console.log(`Statuses array for day ${day}:`, statuses);

    // الأولوية: completed أولاً ثم missed ثم upcoming
    if (statuses.includes("completed")) return "completed";
    if (statuses.includes("missed")) return "missed";
    if (
        statuses.includes("pending") ||
        statuses.includes("reshdualing") ||
        statuses.includes("trlocation")
    ) {
      return "upcoming";
    }
    return "other"; // الحالة الافتراضية لو ما في شي
  })();

  console.log("Vaccinations status for day", day, "is", vaccinations_Status);

  const handleClick = (vaccineId) => {
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
          onClick={() => {
            if (role === "healthworker") {
              const fullDate = `${year}-${month}-${String(day).padStart(2, "0")}`;
              navigate(`/hw-appointment-scheduling/${fullDate}`);
              if (onClick) onClick();
            }
          }}
          style={{ cursor: vaccines.length > 0 || appointments.length > 0 || role === "healthworker" ? "pointer" : "default" }}
      >
        <span className="day-number">{day}</span>

        {vaccines.length > 0 && (
            <span className="vaccine-name">
          {vaccines[0].groupName?.length > 18
              ? vaccines[0].groupName.slice(0, 15) + "..."
              : vaccines[0].groupName}
        </span>
        )}

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
