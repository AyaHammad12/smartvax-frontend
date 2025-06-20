import React, { useState, useEffect } from "react";
import "../styles/ManegmentRequestsAppointment.css";
import { useNavigate } from "react-router-dom";

const allowedStatuses = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  reshdualing: "طلب تأجيل",
  trlocation: "طلب تغيير موقع",
  completed: "تم التطعيم",
  missed: "فائت", // ✅ أضف هذا السطر
  cancelled: "تم الإلغاء",
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in localStorage");
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    fetch("http://localhost:8080/api/vaccine-types")
        .then((res) => res.json())
        .then((data) => setAllVaccines(data))
        .catch((err) => console.error("❌ Failed to load vaccine types:", err));
  }, []);

  const translateStatus = (status) => {
    console.log(`translateStatus input: [${status}]`);
    if (!status) return "غير معروف";
    const key = status.trim().toLowerCase();
    console.log(`key after trim and toLowerCase: [${key}]`);
    return allowedStatuses[key] || "غير معروف";
  };



  const markAsCompleted = (appointmentId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("لم يتم العثور على userId في localStorage");
      return;
    }

    const url = `http://localhost:8080/api/appointments/${appointmentId}/mark-completed?userId=${userId}`;
    console.log("🔗 URL:", url);

    fetch(url, {
      method: "PATCH",
    })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((updated) => {
          console.log("✅ Appointment marked as completed", updated);
          setAppointments((prev) =>
              prev.map((a) => (a.id === appointmentId ? { ...a, status: updated.status } : a))
          );
        })
        .catch((err) => {
          console.error("❌ Error updating appointment:", err);
          alert("فشل تحديث حالة الموعد إلى 'تم التطعيم'.");
        });
  };

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
            {Object.entries(allowedStatuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
            ))}
          </select>

          <label>تصفية حسب نوع اللقاح:</label>
          <select value={filterVaccine} onChange={(e) => setFilterVaccine(e.target.value)}>
            <option value="الكل">الكل</option>
            {allVaccines.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
            ))}
          </select>

          <label>تصفية حسب التاريخ:</label>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />

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
              filteredAppointments.map((appointment) => {
                const dateObj = new Date(appointment.appointmentDate);
                const datePart = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
                const timePart = dateObj.toISOString().slice(11, 16); // HH:mm

                return (
                    <div
                        key={appointment.id}
                        className={`appointment-card ${appointment.status?.toLowerCase()}`}
                    >
                      <h3> اسم الطفل: {appointment.child?.name || "غير معروف"}</h3>
                      <p>
                        <strong>رقم هوية الطفل:</strong> {appointment.child?.id || "---"}
                      </p>
                      <div>
                        <strong>أنواع اللقاحات:</strong>
                        {appointment.scheduleVaccinations?.length > 0 ? (
                            <ul>
                              {appointment.scheduleVaccinations.map((s, idx) => (
                                  <li key={idx}>• {s.vaccination?.vaccineType?.name || "غير معروف"}</li>
                              ))}
                            </ul>
                        ) : (
                            "غير معروف"
                        )}
                      </div>
                      <p>
                        <strong>التاريخ:</strong> {datePart}
                      </p>
                      <p>
                        <strong>الساعة:</strong> {timePart}
                      </p>
                      <p>
                        <strong>الحالة:</strong>{" "}
                        <span className="status">{translateStatus(appointment.status)}</span>
                      </p>

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
      </div>
  );
};

export default ManegmentRequestsAppointment;
