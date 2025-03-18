import React, { useState } from "react";
import DayCell from "./DayCell";
import { mockData } from "../data/mockData";
import "../styles/Calendar.css";

const Calendar = ({ role }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // الشهر الحالي
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // السنة الحالية

  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("ar-EG", { month: "long" }); // عرض اسم الشهر بالعربية
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // اليوم الأول في الشهر

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11; // يرجع لديسمبر
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0; // ينتقل ليناير
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const generateDays = () => {
    let days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const month = String(currentMonth + 1).padStart(2, "0"); // الشهر بصيغة رقمية من 01-12
      const year = currentYear; // السنة الحالية
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      const dayData = mockData.find((item) => item.date === dateKey);

      if (role === "parent") {
        // إذا كان الدور Parent، يتم عرض تفاصيل التطعيمات
        days.push(
          <DayCell
            key={i}
            day={i}
            month={month} // 🔹 تمرير الشهر هنا
            year={year}
            status={dayData?.status || "default"}
            vaccineName={dayData?.vaccineName}
            role="parent"
          />
        );
      } else {
        // إذا كان الدور Health Worker، يتم عرض اليوم فقط بدون بيانات
        days.push(
          <DayCell
            key={i}
            day={i}
            month={month} // 🔹 تمرير الشهر هنا
            year={year}
            status="default" // لا حاجة لحالة التطعيم أو اسم التطعيم هنا
            role="health worker"
          />
        );
      }
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
