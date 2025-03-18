import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ParentAppointments.css";

const VaccineAppointments = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vaccineName = queryParams.get("vaccine") || "Unknown";
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (vaccineName !== "Unknown") {
      // إضافة مواعيد افتراضية لهذا التطعيم
      setAppointments([
        {
          id: 1,
          vaccine: vaccineName,
          date: "2024-04-15",
          status: "scheduled",
          center: "",
        },
        {
          id: 2,
          vaccine: vaccineName,
          date: "2024-06-10",
          status: "scheduled",
          center: "",
        },
      ]);
    }
  }, [vaccineName]);

  const availableCenters = ["Center A", "Center B", "Center C"];
  const [selectedCenter, setSelectedCenter] = useState({});

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
  };

  return (
    <div className="appointments-container">
      <h1>Appointments for {vaccineName}</h1>
      <div className="appointments-grid">
        {appointments.map((appt) => (
          <div key={appt.id} className={`appointment-card scheduled-card`}>
            <h3>{appt.vaccine}</h3>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaccineAppointments;
