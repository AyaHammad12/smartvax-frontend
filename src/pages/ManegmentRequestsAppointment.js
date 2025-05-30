import React, { useState, useEffect } from "react";
import "../styles/ManegmentRequestsAppointment.css";

const ManegmentRequestsAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [filterVaccine, setFilterVaccine] = useState("الكل");
  const [filterDate, setFilterDate] = useState("");
  const [filterChildID, setFilterChildID] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage");
      setLoading(false);
      return;
    }
   // console.log("userId:", userId);

    // 1. جلب بيانات health worker بواسطة userId
    fetch(`http://localhost:8080/api/health-workers/by-user/${userId}`)

        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch health worker");
          return res.json();
        })
        .then((hw) => {
          if (!hw.vaccinationCenter || !hw.vaccinationCenter.id) {
            throw new Error("Health worker is not linked to a vaccination center");
          }
          const centerId = hw.vaccinationCenter.id;

          // 2. جلب المواعيد للمركز الصحي
          return fetch(`http://localhost:8080/api/appointments/by-center/${centerId}`);
        })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch appointments");
          return res.json();
        })
        .then((data) => {
          setAppointments(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
  }, []);

  const updateAppointmentStatus = (id, newStatus) => {
    const updatedStatus = { id, status: newStatus };
    fetch(`http://localhost:8080/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(updatedStatus),
    })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update appointment status");
          return res.json();
        })
        .then((updated) => {
          setAppointments((prev) =>
              prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a))
          );
        })
        .catch((err) => console.error("Error updating appointment:", err));
  };

  const translateStatus = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "مجدول";
      case "COMPLETED":
        return "مكتمل";
      case "CANCELLED":
        return "ملغى";
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch = filterStatus === "الكل" || appointment.status === filterStatus;
    const vaccineMatch =
        filterVaccine === "الكل" ||
        appointment.schedule?.vaccination?.name === filterVaccine;
    const dateMatch =
        !filterDate ||
        new Date(appointment.appointmentDate).toISOString().slice(0, 10) === filterDate;
    const childIDMatch =
        !filterChildID || appointment.child?.id.includes(filterChildID);

    return statusMatch && vaccineMatch && dateMatch && childIDMatch;
  });

  if (loading) {
    return <p>...جاري تحميل البيانات</p>;
  }

  return (
      <div className="appointments-container" dir="rtl">
        <h1>إدارة طلبات المواعيد</h1>

        <div className="filter-container">
          <label>تصفية حسب الحالة:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="الكل">الكل</option>
            <option value="SCHEDULED">مجدول</option>
            <option value="COMPLETED">مكتمل</option>
            <option value="CANCELLED">ملغى</option>
          </select>

          <label>تصفية حسب اللقاح:</label>
          <select value={filterVaccine} onChange={(e) => setFilterVaccine(e.target.value)}>
            <option value="الكل">الكل</option>
            {[...new Set(appointments.map((a) => a.schedule?.vaccination?.name))]
                .filter(Boolean)
                .map((vaccineName) => (
                    <option key={vaccineName} value={vaccineName}>
                      {vaccineName}
                    </option>
                ))}
          </select>

          <label>تصفية حسب التاريخ:</label>
          <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
          />

          <label>تصفية حسب رقم هوية الطفل:</label>
          <input
              type="text"
              placeholder="أدخل رقم هوية الطفل..."
              value={filterChildID}
              onChange={(e) => setFilterChildID(e.target.value)}
          />
        </div>

        <div className="appointments-list">
          {filteredAppointments.length === 0 ? (
              <p className="no-appointments">لا توجد مواعيد متاحة.</p>
          ) : (
              filteredAppointments.map((appointment) => (
                  <div
                      key={appointment.id}
                      className={`appointment-card ${appointment.status.toLowerCase()}`}
                  >
                    <h3>{appointment.child?.name}</h3>
                    <p>
                      <strong>رقم هوية الطفل:</strong> {appointment.child?.id}
                    </p>
                    <p>
                      <strong>اللقاح:</strong> {appointment.schedule?.vaccination?.name}
                    </p>
                    <p>
                      <strong>التاريخ:</strong>{" "}
                      {new Date(appointment.appointmentDate).toISOString().slice(0, 16).replace("T", " ")}
                    </p>
                    <p>
                      <strong>الحالة:</strong>{" "}
                      <span className="status">{translateStatus(appointment.status)}</span>
                    </p>

                    {appointment.status === "SCHEDULED" && (
                        <div className="action-buttons">
                          <button
                              className="accept-btn"
                              onClick={() => updateAppointmentStatus(appointment.id, "COMPLETED")}
                          >
                            اكتمال
                          </button>
                          <button
                              className="reject-btn"
                              onClick={() => updateAppointmentStatus(appointment.id, "CANCELLED")}
                          >
                            إلغاء
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
