import React, { useState, useEffect } from "react";
import DayCell from "./DayCell";
import "../styles/Calendar.css";

const Calendar = () => {
  const role = localStorage.getItem("role");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [scheduleData, setScheduleData] = useState([]);

  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("ar-EG", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (typeof dateStr === "string") return dateStr.split("T")[0];
    return null;
  };

  const fetchScheduleData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/schedule-vaccinations", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("فشل تحميل بيانات جدول التطعيمات");

      const data = await response.json();
      console.log("Fetched scheduleData:", data);
      setScheduleData(data);
    } catch (error) {
      console.error("❌ خطأ أثناء تحميل جدول التطعيمات:", error);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const statusMapping = {
    SCHEDULED: "قادم",
    COMPLETED: "مكتمل",
    MISSED: "فائت",
  };

  const generateDays = () => {
    const today = new Date().toISOString().split("T")[0];
    let days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const month = String(currentMonth + 1).padStart(2, "0");
      const dateKey = `${currentYear}-${month}-${String(i).padStart(2, "0")}`;

      const dayData = scheduleData.find((item) => {
        if (!item.scheduledDate) return false;
        const normalized = normalizeDate(item.scheduledDate);
        console.log(`Calendar Day: ${dateKey} Checking against: ${normalized}`);
        return normalized === dateKey;
      });

      const dayStatus = (() => {
        if (!dayData) return "default";
        const scheduled = normalizeDate(dayData.scheduledDate);
        if (scheduled < today) return "مكتمل";
        return statusMapping[dayData.status] || "default";
      })();

      days.push(
          <DayCell
              key={i}
              day={i}
              month={month}
              year={currentYear}
              status={role === "parent" ? dayStatus : "default"}
              role={role}
              id={dayData?.vaccination?.id}
              vaccineName={dayData?.vaccination?.name}
          />
      );
    }

    return days;
  };

  return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>{"<"}</button>
          <h2>
            {monthName} {currentYear}
          </h2>
          <button onClick={() => changeMonth(1)}>{">"}</button>
        </div>
        <div className="calendar-grid">
          <div className="day-label">الأحد</div>
          <div className="day-label">الإثنين</div>
          <div className="day-label">الثلاثاء</div>
          <div className="day-label">الأربعاء</div>
          <div className="day-label">الخميس</div>
          <div className="day-label">الجمعة</div>
          <div className="day-label">السبت</div>
          {generateDays()}
        </div>
      </div>
  );
};

export default Calendar;
