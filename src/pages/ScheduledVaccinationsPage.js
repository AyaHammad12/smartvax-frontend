import React, { useState } from "react";
import "../styles/ScheduledVaccinationsPage.css"; // تأكد من أن ملف CSS موجود

const scheduledVaccinations = [
  { id: 1, name: "Polio", date: "2024-04-15", status: "Upcoming" },
  { id: 2, name: "MMR", date: "2024-06-10", status: "Completed" },

  { id: 3, name: "Hepatitis B", date: "2023-05-20", status: "Missed" },
  { id: 5, name: "Rotavirus", date: "2024-07-20", status: "Upcoming" },
  { id: 4, name: "DTP", date: "2024-05-05", status: "In-Progress" },
].filter((vaccine) => vaccine.name && vaccine.date && vaccine.status); // ✅ تصفية البيانات الفارغة

const ScheduledVaccinationsPage = () => {
  const [vaccinations] = useState(scheduledVaccinations);

  return (
    <div className="scheduled-vaccinations-container">
      <h2>Scheduled Vaccinations</h2>

      {vaccinations.length === 0 ? (
        <p className="no-vaccinations">No scheduled vaccinations available.</p>
      ) : (
        <div className="vaccination-list">
          {vaccinations.map((vaccination) => {
            console.log(
              `✅ Rendering ID: ${vaccination.id}, Name: ${vaccination.name}, Status: ${vaccination.status}`
            );

            return (
              <div
                key={vaccination.id}
                className={`vaccination-card ${vaccination.status.toLowerCase()}`}
                style={{ display: "block", visibility: "visible" }} // ✅ تأكد من أن العنصر مرئي
              >
                <h3>{vaccination.name}</h3>
                <p>
                  <strong>Scheduled Date:</strong> {vaccination.date}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status">{vaccination.status}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduledVaccinationsPage;
