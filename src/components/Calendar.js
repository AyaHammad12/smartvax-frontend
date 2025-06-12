import React, { useState, useEffect } from "react";
import DayCell from "./DayCell";
import { useParams } from "react-router-dom";
import "../styles/Calendar.css";

const Calendar = ({ role: propRole }) => {
  const role = propRole || localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const parentId = localStorage.getItem("parentId");
  const { date: urlDate } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [scheduleData, setScheduleData] = useState([]);
  const [parentAppointments, setParentAppointments] = useState([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [healthWorker, setHealthWorker] = useState(null);

  const currentDate = new Date(currentYear, currentMonth, 1);
  const monthName = currentDate.toLocaleString("ar-EG", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.split("T")[0];
  };

  const translateStatus = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "قادم";
      case "COMPLETED":
        return "مكتمل";
      case "MISSED":
        return "فائت";
      default:
        return "غير معروف";
    }
  };

  const fetchHealthWorker = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/health-workers/by-user/${userId}`);
      if (!response.ok) throw new Error("فشل تحميل بيانات العامل الصحي");
      const data = await response.json();
      setHealthWorker(data);
    } catch (error) {
      console.error("❌ خطأ أثناء جلب بيانات العامل الصحي:", error);
    }
  };

  const fetchAppointmentsByDate = async (dateKey, centerId) => {
    try {
      const cleanedDate = dateKey.trim();
      const response = await fetch(`http://localhost:8080/api/appointments/by-center-with-details/${centerId}`);
      if (!response.ok) throw new Error("فشل جلب مواعيد المركز الصحي");
      const data = await response.json();
      const filtered = data.filter((app) => {
        const d = new Date(app.appointmentDate);
        const formatted = d.toISOString().split("T")[0];
        return formatted === cleanedDate;
      });
      setSelectedDayAppointments(filtered);
    } catch (error) {
      console.error("📛 فشل جلب مواعيد ليوم:", error);
    }
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
      setScheduleData(data);
    } catch (error) {
      console.error("❌ خطأ أثناء تحميل جدول التطعيمات:", error);
    }
  };

  const fetchParentAppointments = async () => {
    if (!parentId) {
      console.warn("❗ parentId غير موجود في localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/appointments/by-parent-with-schedules/${parentId}`);
      if (!response.ok) throw new Error("فشل جلب مواعيد الأب");
      const data = await response.json();
      setParentAppointments(data);
    } catch (error) {
      console.error("❌ خطأ أثناء جلب مواعيد الأب:", error);
    }
  };


  useEffect(() => {
    if (role === "HEALTH_WORKER") {
      fetchHealthWorker();
    } else {
      fetchScheduleData();
      fetchParentAppointments();
    }
  }, [role]);

  useEffect(() => {
    if (role === "HEALTH_WORKER" && urlDate && healthWorker?.vaccinationCenter?.id) {
      setSelectedDate(urlDate);
      fetchAppointmentsByDate(urlDate, healthWorker.vaccinationCenter.id);
    }
  }, [healthWorker, urlDate, role]);

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

  const handleDayClick = (dateKey) => {
    setSelectedDate(dateKey);
    if (role === "HEALTH_WORKER" && healthWorker?.vaccinationCenter?.id) {
      fetchAppointmentsByDate(dateKey, healthWorker.vaccinationCenter.id);
    }
  };

  if (role === "HEALTH_WORKER" && (!healthWorker || !healthWorker.vaccinationCenter?.id)) {
    return <div className="loading">جاري تحميل بيانات العامل الصحي...</div>;
  }

  const generateDays = () => {
    let days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const day = String(i).padStart(2, "0");
      const month = String(currentMonth + 1).padStart(2, "0");
      const dateKey = `${currentYear}-${month}-${day}`;

      if (role === "HEALTH_WORKER") {
        days.push(
            <DayCell
                key={`day-${dateKey}`}
                day={i}
                month={month}
                year={currentYear}
                role={role}
                onClick={() => handleDayClick(dateKey)}
            />
        );
      } else {
        const vaccines = scheduleData
            .filter((item) => normalizeDate(item.scheduledDate) === dateKey)
            .map((item) => {
              const appointment = parentAppointments.find(appt =>
                  appt.schedules?.some(sv => sv.id === item.id)
              );
              const finalStatus = appointment ? appointment.status : item.status;
              return {
                id: item.vaccination?.id,
                name: item.vaccination?.name,
                groupName: item.vaccination?.group?.name || "",
                status: translateStatus(finalStatus),
                rawStatus: finalStatus,
              };
            });

        days.push(
            <DayCell
                key={`day-${dateKey}`}
                day={i}
                month={month}
                year={currentYear}
                role={role}
                vaccines={vaccines}
                onClick={() => handleDayClick(dateKey)}
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

        {role === "HEALTH_WORKER" && selectedDate && (
            <div className="appointments-list">
              <h3>مواعيد هذا اليوم:</h3>
              {selectedDayAppointments.length > 0 ? (
                  <ul>
                    {selectedDayAppointments.map((appt) => (
                        <li key={appt.id}>
                          الطفل: {appt.child?.fullName || "غير معروف"} <br />
                          الحالة: {translateStatus(appt.status)} <br />
                          المركز: {appt.vaccinationCenter?.name || "غير محدد"}
                        </li>
                    ))}
                  </ul>
              ) : (
                  <p>لا توجد مواعيد في هذا اليوم.</p>
              )}
            </div>
        )}
      </div>
  );
};

export default Calendar;
