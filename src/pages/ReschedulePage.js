import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ReschedulePage.css";

const ReschedulePage = ({ appointments, setAppointments }) => {
  const { appointmentId } = useParams();
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleReschedule = () => {
    if (!reason) {
      alert("Please provide a reason for rescheduling.");
      return;
    }

    const today = new Date();
    const newDate = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];

    alert(`The appointment has been rescheduled to: ${newDate}`);

    setAppointments(
      appointments.map((appt) =>
        appt.id === Number(appointmentId)
          ? {
              ...appt,
              status: "rescheduled",
              date: newDate,
              rescheduleReason: reason,
            }
          : appt
      )
    );

    navigate("/appointments");
  };

  return (
    <div className="reschedule-container">
      <h1>Reschedule Appointment</h1>
      <p>Please enter the reason for rescheduling:</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter reason..."
      />
      <button onClick={handleReschedule} className="reschedule-btn">
        Reschedule
      </button>
    </div>
  );
};

export default ReschedulePage;
