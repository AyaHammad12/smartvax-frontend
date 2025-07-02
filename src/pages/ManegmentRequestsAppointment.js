import React, { useState, useEffect } from "react";
import "../styles/ManegmentRequestsAppointment.css";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserAlt, FaSyringe, FaCheckCircle, FaTimesCircle, FaClock, FaRedo, FaMapMarkerAlt, FaBan } from "react-icons/fa";

// Define allowed statuses and their translations
const allowedStatuses = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  reshdualing: "طلب تأجيل",
  trlocation: "طلب تغيير موقع",
  completed: "تم التطعيم",
  missed: "فائت",
  cancelled: "تم الإلغاء",
};

// Metadata for each status (color, background, icon)
const statusMeta = {
  pending:   { color: "#f2994a", bg: "#fff8e3", icon: <FaClock /> }, // Adjusted bg to match CSS
  confirmed: { color: "#3498db", bg: "#eaf6ff", icon: <FaCheckCircle /> },
  reshdualing: { color: "#d50e7f", bg: "#fff0fa", icon: <FaRedo /> }, // Adjusted bg to match CSS
  trlocation: { color: "#14289f", bg: "#f1f5ff", icon: <FaMapMarkerAlt /> }, // Adjusted bg to match CSS
  completed: { color: "#18b356", bg: "#e9ffe9", icon: <FaCheckCircle /> }, // Adjusted color & bg to match CSS
  missed:    { color: "#ff5353", bg: "#fff0f1", icon: <FaTimesCircle /> }, // Adjusted color & bg to match CSS
  cancelled: { color: "#868e96", bg: "#f6f6f6", icon: <FaBan /> },
};

const ManegmentRequestsAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [filterVaccine, setFilterVaccine] = useState("الكل");
  const [filterDate, setFilterDate] = useState("");
  const [filterChildID, setFilterChildID] = useState("");
  const [loading, setLoading] = useState(true);
  const [allVaccines, setAllVaccines] = useState([]);
  const navigate = useNavigate();

  // Fetch health worker and appointments
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("No userId found in localStorage. Cannot fetch appointments.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/health-workers/by-user/${userId}`)
        .then((res) => {
          if (!res.ok) {
            if (res.status === 404) throw new Error("Health worker not found for this user.");
            throw new Error(`Failed to fetch health worker: ${res.statusText}`);
          }
          return res.json();
        })
        .then((hw) => {
          if (!hw.vaccinationCenter?.id) {
            console.warn("Health worker is not linked to a vaccination center.");
            setAppointments([]); // No center, no appointments
            setLoading(false);
            return;
          }
          const centerId = hw.vaccinationCenter.id;
          return fetch(`http://localhost:8080/api/appointments/by-center/${centerId}`);
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch appointments: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setAppointments(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
  }, []);

  // Fetch all vaccine types
  useEffect(() => {
    fetch("http://localhost:8080/api/vaccine-types")
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch vaccine types: ${res.statusText}`);
          return res.json();
        })
        .then((data) => setAllVaccines(data))
        .catch((err) => console.error("Error fetching vaccine types:", err));
  }, []);

  // Helper functions for status translation and meta
  const translateStatus = (status) => allowedStatuses[status?.trim()?.toLowerCase()] || "غير معروف";
  const getMeta = (status) => statusMeta[status?.trim()?.toLowerCase()] || { color: "#666", bg: "#f7f7f7", icon: <FaClock /> };

  // Filter appointments based on selected criteria
  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch =
        filterStatus === "الكل" || appointment.status?.toLowerCase() === filterStatus.toLowerCase();
    const vaccineMatch =
        filterVaccine === "الكل" ||
        appointment.scheduleVaccinations?.some(
            (s) => s.vaccination?.vaccineType?.name === filterVaccine
        );
    const dateMatch =
        !filterDate ||
        new Date(appointment.appointmentDate).toISOString().slice(0, 10) === filterDate;
    const childIDMatch =
        !filterChildID || appointment.child?.id?.includes(filterChildID);
    return statusMatch && vaccineMatch && dateMatch && childIDMatch;
  });

  return (
      <div className="appointments-container" dir="rtl">
        <h1 className="main-title">
          <FaCalendarAlt className="main-title-icon" /> إدارة طلبات المواعيد
        </h1>

        <div className="filter-container">
          <div className="filter-item"> {/* Changed from filter-group */}
            <label>الحالة:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="الكل">الكل</option>
              {Object.entries(allowedStatuses).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="filter-item"> {/* Changed from filter-group */}
            <label>نوع اللقاح:</label>
            <select value={filterVaccine} onChange={(e) => setFilterVaccine(e.target.value)}>
              <option value="الكل">الكل</option>
              {allVaccines.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-item"> {/* Changed from filter-group */}
            <label>التاريخ:</label>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="filter-item"> {/* Changed from filter-group */}
            <label>رقم هوية الطفل:</label>
            <input
                type="text"
                placeholder="رقم هوية الطفل..."
                value={filterChildID}
                onChange={(e) => setFilterChildID(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
            <div className="loading-indicator">
              <FaClock className="spin" /> جاري تحميل البيانات...
            </div>
        ) : (
            <div className="appointments-list">
              {filteredAppointments.length === 0 ? (
                  <p className="no-appointments">لا توجد مواعيد متاحة حالياً.</p>
              ) : (
                  filteredAppointments.map((appointment) => {
                    const dateObj = new Date(appointment.appointmentDate);
                    // Format date and time for Arabic locale
                    const datePart = dateObj.toLocaleDateString("ar-EG", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    const timePart = dateObj.toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true // Use 12-hour format with AM/PM for Arabic
                    });
                    const meta = getMeta(appointment.status);

                    return (
                        <div
                            key={appointment.id}
                            className={`appointment-card ${appointment.status?.toLowerCase()}`} // Apply status class for specific CSS
                            style={{
                              borderRightColor: meta.color, // Apply border color from meta
                              background: meta.bg, // Apply background color from meta
                            }}
                        >
                          <div className="appointment-header">
                            <span className="status-icon" style={{ color: meta.color }}>{meta.icon}</span>
                            <span className="status-label" style={{ color: meta.color }}>
                              {translateStatus(appointment.status)}
                            </span>
                          </div>
                          <div className="appointment-info">
                            {/* Each info item is a div for flex alignment */}
                            <div><FaUserAlt className="info-icon" /> <strong>الطفل:</strong> {appointment.child?.name || "غير معروف"}</div>
                            <div><FaUserAlt className="info-icon" /> <strong>الهوية:</strong> {appointment.child?.id || "---"}</div>
                            <div>
                              <FaSyringe className="info-icon" />
                              <strong>اللقاحات:</strong>{" "}
                              {appointment.scheduleVaccinations?.length > 0
                                  ? appointment.scheduleVaccinations.map((s, idx) => (
                                      <span key={idx}>
                                        {s.vaccination?.vaccineType?.name || "غير معروف"}
                                        {idx < appointment.scheduleVaccinations.length - 1 ? "، " : ""}
                                      </span>
                                  ))
                                  : "غير معروف"}
                            </div>
                            <div><FaCalendarAlt className="info-icon" /> <strong>التاريخ:</strong> {datePart}</div>
                            <div><FaClock className="info-icon" /> <strong>الساعة:</strong> {timePart}</div>
                          </div>
                          <div className="action-buttons">
                            <button
                                className="manage-btn"
                                onClick={() => navigate(`/appointment-management/${appointment.id}`)}
                            >
                              إدارة الموعد
                            </button>
                          </div>
                        </div>
                    );
                  })
              )}
            </div>
        )}
      </div>
  );
};

export default ManegmentRequestsAppointment;