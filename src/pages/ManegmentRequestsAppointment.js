import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ManegmentRequestsAppointment.css"; // تأكد من وجود ملف CSS مناسب

// بيانات تجريبية لطلبات المواعيد
const mockAppointments = [
  {
    id: 1,
    childID: "CHD123456",
    childName: "Ali Ahmed",
    vaccine: "Polio",
    date: "2025-04-15",
    status: "Pending",
  },
  {
    id: 2,
    childID: "CHD654321",
    childName: "Sara Mohammed",
    vaccine: "MMR",
    date: "2025-06-10",
    status: "Pending",
  },
  {
    id: 3,
    childID: "CHD987654",
    childName: "Omar Khalid",
    vaccine: "Hepatitis B",
    date: "2025-05-20",
    status: "Accepted",
  },
  {
    id: 4,
    childID: "CHD567890",
    childName: "Maya Noor",
    vaccine: "DTP",
    date: "2025-05-05",
    status: "Rejected",
  },
];

const ManegmentRequestsAppointment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDate = queryParams.get("date") || "";

  const [appointments, setAppointments] = useState(mockAppointments);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVaccine, setFilterVaccine] = useState("All");
  const [filterDate, setFilterDate] = useState(initialDate);
  const [filterChildID, setFilterChildID] = useState("");

  useEffect(() => {
    if (initialDate) {
      setFilterDate(initialDate);
    }
  }, [initialDate]);

  // تغيير حالة الموعد عند القبول أو الرفض
  const updateAppointmentStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id
        ? { ...appointment, status: newStatus }
        : appointment
    );
    setAppointments(updatedAppointments);
  };

  // تصفية الطلبات بناءً على الفلاتر المختارة
  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch =
      filterStatus === "All" || appointment.status === filterStatus;
    const vaccineMatch =
      filterVaccine === "All" || appointment.vaccine === filterVaccine;
    const dateMatch = !filterDate || appointment.date === filterDate;
    const childIDMatch =
      !filterChildID || appointment.childID.includes(filterChildID);

    return statusMatch && vaccineMatch && dateMatch && childIDMatch;
  });

  return (
    <div className="appointments-container">
      <h2>Manage Appointment Requests</h2>

      {/* الفلاتر */}
      <div className="filter-container">
        <label>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <label>Filter by Vaccine:</label>
        <select
          value={filterVaccine}
          onChange={(e) => setFilterVaccine(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Polio">Polio</option>
          <option value="MMR">MMR</option>
          <option value="Hepatitis B">Hepatitis B</option>
          <option value="DTP">DTP</option>
        </select>

        <label>Filter by Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        <label>Filter by Child ID:</label>
        <input
          type="text"
          placeholder="Enter Child ID..."
          value={filterChildID}
          onChange={(e) => setFilterChildID(e.target.value)}
        />
      </div>

      {/* قائمة الطلبات */}
      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <p className="no-appointments">No appointments available.</p>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`appointment-card ${appointment.status.toLowerCase()}`}
            >
              <h3>{appointment.childName}</h3>
              <p>
                <strong>Child ID:</strong> {appointment.childID}
              </p>
              <p>
                <strong>Vaccine:</strong> {appointment.vaccine}
              </p>
              <p>
                <strong>Date:</strong> {appointment.date}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="status">{appointment.status}</span>
              </p>

              {appointment.status === "Pending" && (
                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={() =>
                      updateAppointmentStatus(appointment.id, "Accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateAppointmentStatus(appointment.id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManegmentRequestsAppointment;
