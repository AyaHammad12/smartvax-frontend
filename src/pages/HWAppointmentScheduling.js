import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const HWAppointmentScheduling = () => {
  const { day } = useParams(); // اليوم المحدد من الرابط
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const healthWorkerId = localStorage.getItem("userId"); // تأكد إنه محفوظ بعد تسجيل الدخول
    console.log(localStorage.getItem("userId"));

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/appointments/health-worker/${healthWorkerId}/appointments-by-date?date=${day}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            credentials: "include", // تأكد إنه موجود 👍
          }
        );

        if (!response.ok) throw new Error("فشل في جلب المواعيد");

        const data = await response.json();
        console.log("📅 المواعيد المسترجعة:", data);
        setAppointments(data);
      } catch (error) {
        console.error("❌ خطأ في جلب المواعيد:", error);
      }
    };

    fetchAppointments();
  }, [day]);

  return (
    <div dir="rtl" style={{ padding: "20px" }}>
      <h2>🗓️ المواعيد المحجوزة ليوم {day}</h2>
      <br />
      {appointments.length === 0 ? (
        <p>لا توجد مواعيد لهذا اليوم.</p>
      ) : (
        <ul>
          {appointments.map((app) => (
            <li key={app.id} style={{ marginBottom: "15px" }}>
              👶 الطفل: {app.child?.name} <br />
              💉 التطعيم: {app.schedule?.vaccination?.name} <br />⏰ الساعة:{" "}
              {new Date(app.appointmentDate).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HWAppointmentScheduling;
