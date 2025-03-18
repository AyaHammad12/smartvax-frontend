import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ParentAppointments.css";
import { Link } from "react-router-dom";

const ParentAppointments = ({ appointments, setAppointments }) => {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const availableCenters = ["Center A", "Center B", "Center C"];

  const confirmAppointment = (id) => {
    setSelectedAppointment(id); // تحديد الموعد المطلوب تأكيده
  };

  const handleConfirmWithCenter = (id) => {
    if (!selectedCenter[id]) {
      alert("Please select a vaccination center.");
      return;
    }

    setAppointments(
      appointments.map((appt) =>
        appt.id === id
          ? { ...appt, status: "confirmed", center: selectedCenter[id] }
          : appt
      )
    );

    setSelectedAppointment(null); // إغلاق `Dropdown`
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "scheduled-card";
      case "confirmed":
        return "confirmed-card";
      case "rescheduled":
        return "rescheduled-card";
      default:
        return "";
    }
  };

  return (
    <div className="appointments-container">
      <h1>Upcoming Appointments</h1>
      <div className="appointments-grid">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className={`appointment-card ${getStatusClass(appt.status)}`}
          >
            <h3>
              <Link to={`/vaccine-info/${appt.vaccine}`}>{appt.vaccine}</Link>
            </h3>
            <p>
              <strong>Date:</strong> {appt.date}
            </p>
            <p>
              <strong>Center:</strong> {appt.center || "Not selected"}
            </p>
            <p>
              <strong>Status:</strong> {appt.status}
            </p>
            {appt.status === "scheduled" && (
              <>
                {selectedAppointment === appt.id ? (
                  <div className="dropdown-container">
                    <select
                      value={selectedCenter[appt.id] || ""}
                      onChange={(e) =>
                        setSelectedCenter({
                          ...selectedCenter,
                          [appt.id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a center</option>
                      {availableCenters.map((center, index) => (
                        <option key={index} value={center}>
                          {center}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleConfirmWithCenter(appt.id)}
                      className="confirm-btn"
                    >
                      Confirm Appointment
                    </button>
                    <button
                      onClick={() => setSelectedAppointment(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => confirmAppointment(appt.id)}
                    className="confirm-btn"
                  >
                    Confirm
                  </button>
                )}
                <button
                  onClick={() => navigate(`/reschedule/${appt.id}`)}
                  className="reschedule-btn"
                >
                  Reschedule
                </button>
              </>
            )}
            {appt.status === "rescheduled" && (
              <>
                <p>
                  <strong>Reason:</strong> {appt.rescheduleReason}
                </p>
                <button
                  onClick={() => confirmAppointment(appt.id)}
                  className="confirm-btn"
                >
                  Reconfirm
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentAppointments;
