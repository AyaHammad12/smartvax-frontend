import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ReschedulePage.css";

const ReschedulePage = ({ appointments, setAppointments }) => {
  const { appointmentId } = useParams();
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleReschedule = () => {
    if (!reason) {
      alert("يرجى إدخال سبب إعادة الجدولة.");
      return;
    }

    const today = new Date();
    const newDate = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];

    alert(`تمت إعادة جدولة الموعد إلى: ${newDate}`);

    setAppointments(
      appointments.map((appt) =>
        appt.id === Number(appointmentId)
          ? {
              ...appt,
              status: "معاد جدولته",
              date: newDate,
              rescheduleReason: reason,
            }
          : appt
      )
    );

    navigate("/appointments");
  };

  return (
    <div className="reschedule-container" dir="rtl">
      <h1>إعادة جدولة الموعد</h1>
      <p>يرجى إدخال سبب إعادة الجدولة:</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="أدخل السبب..."
      />
      <button onClick={handleReschedule} className="reschedule-btn">
        إعادة الجدولة
      </button>
    </div>
  );
};

export default ReschedulePage;
