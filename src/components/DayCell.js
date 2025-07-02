import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DayCell.css";

const DayCell = ({
                     day,
                     month,
                     year,
                     status,
                     role,
                     vaccines = [],
                     appointments = [],
                     onClick,
                     isSelected = false,
                     hasVaccination = false,
                     isToday = false,
                     isYesterday = false,
                     isTomorrow = false,
                 }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = React.useState(false);

    // تحديد حالة اليوم (لون الخلية بناء على حالة التطعيم)
    const vaccinations_Status = (() => {
        const statuses = vaccines.map((v) => v.rawStatus?.trim().toLowerCase());
        if (statuses.includes("completed")) return "completed";
        if (statuses.includes("missed")) return "missed";
        if (
            statuses.includes("pending") ||
            statuses.includes("reshdualing") ||
            statuses.includes("trlocation")
        ) {
            return "upcoming";
        }
        return "other";
    })();

    // بناء الكلاسات للخلية
    let cellClass = `day-cell ${vaccinations_Status} ${isSelected ? "selected" : ""}`;
    if (role === "healthworker" && hasVaccination) cellClass += " has-vaccination";
    if (role === "healthworker" && isToday) cellClass += " today-cell";
    if (role === "healthworker" && isYesterday) cellClass += " yesterday-cell";
    if (role === "healthworker" && isTomorrow) cellClass += " tomorrow-cell";

    const handleCellClick = (e) => {
        if (role === "healthworker") {
            if (onClick) onClick();
            return;
        }
        if (role === "parent") {
            if (vaccines.length > 0) {
                setShowPopup(true);
            } else {
                setShowPopup(false);
            }
        }
    };

    const handleMouseLeave = () => {
        setShowPopup(false);
    };

    const handleVaccineClick = (e, vaccineId) => {
        e.stopPropagation();
        if (role === "parent" && vaccineId) {
            navigate(`/vaccine-info/${vaccineId}`);
            setShowPopup(false);
        }
    };

    return (
        <div
            className={cellClass}
            title={vaccines.length > 0 ? "اضغط لرؤية تفاصيل التطعيمات" : ""}
            onClick={handleCellClick}
            onMouseLeave={handleMouseLeave}
            style={{
                cursor:
                    (role === "parent" && vaccines.length > 0) ||
                    (role === "healthworker" && onClick)
                        ? "pointer"
                        : "default",
            }}
        >
            <span className="day-number">{day}</span>
            {/* فقط لو parent وبدك تظهر البوب أب */}
            {role === "parent" && showPopup && vaccines.length > 0 && (
                <div className="vaccine-popup">
                    {vaccines.map((v, index) => (
                        <div
                            key={index}
                            className="vaccine-popup-item"
                            onClick={(e) => handleVaccineClick(e, v.id)}
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
