import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ParentAppointments.css";
import { Link } from "react-router-dom";

const ParentAppointments = ({ appointments, setAppointments }) => {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const availableCenters = ["المركز أ", "المركز ب", "المركز ج"];

  const confirmAppointment = (id) => {
    setSelectedAppointment(id); // تحديد الموعد المطلوب تأكيده
  };

  const handleConfirmWithCenter = (id) => {
    if (!selectedCenter[id]) {
      alert("يرجى اختيار مركز تطعيم.");
      return;
    }

    setAppointments(
      appointments.map((appt) =>
        appt.id === id
          ? { ...appt, status: "مؤكد", center: selectedCenter[id] }
          : appt
      )
    );

    setSelectedAppointment(null); // إغلاق `Dropdown`
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "مجدول":
        return "scheduled-card";
      case "مؤكد":
        return "confirmed-card";
      case "معاد جدولته":
        return "rescheduled-card";
      default:
        return "";
    }
  };

  return (
    <div className="appointments-container">
      <h1>المواعيد القادمة</h1>
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
              <strong>التاريخ:</strong> {appt.date}
            </p>
            <p>
              <strong>المركز:</strong> {appt.center || "لم يتم تحديده"}
            </p>
            <p>
              <strong>الحالة:</strong> {appt.status}
            </p>
            {appt.status === "مجدول" && (
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
                      <option value="">اختر مركزًا</option>
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
                      تأكيد الموعد
                    </button>
                    <button
                      onClick={() => setSelectedAppointment(null)}
                      className="cancel-btn"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => confirmAppointment(appt.id)}
                    className="confirm-btn"
                  >
                    تأكيد
                  </button>
                )}
                <button
                  onClick={() => navigate(`/reschedule/${appt.id}`)}
                  className="reschedule-btn"
                >
                  إعادة الجدولة
                </button>
              </>
            )}
            {appt.status === "معاد جدولته" && (
              <>
                <p>
                  <strong>السبب:</strong> {appt.rescheduleReason}
                </p>
                <button
                  onClick={() => confirmAppointment(appt.id)}
                  className="confirm-btn"
                >
                  إعادة التأكيد
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
