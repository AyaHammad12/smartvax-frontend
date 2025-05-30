import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ParentAppointments.css";

const VaccineAppointments = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const vaccineName = queryParams.get("vaccine");
  const vaccineId = queryParams.get("vaccineId");
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState({});
  const [error, setError] = useState("");

  const displayName = vaccineName || (vaccineId ? `لقاح رقم ${vaccineId}` : "غير معروف");

  useEffect(() => {
    if (vaccineId) {
      fetch(`http://localhost:8080/api/appointments/by-vaccine/${vaccineId}`, {
        credentials: "include",
      })
          .then((res) => {
            if (!res.ok) throw new Error("فشل في تحميل المواعيد");
            return res.json();
          })
          .then((data) => setAppointments(data))
          .catch((err) => {
            console.error("❌ خطأ أثناء تحميل المواعيد:", err);
            setError("فشل في تحميل المواعيد من الخادم.");
          });
    }
  }, [vaccineId]);

  const availableCenters = ["المركز أ", "المركز ب", "المركز ج"];

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
  };

  return (
      <div className="appointments-container" dir="rtl">
        <h1>المواعيد الخاصة بـ {displayName}</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="appointments-grid">
          {appointments.map((appt) => (
              <div key={appt.id} className={`appointment-card scheduled-card`}>
                <h3>{vaccineName || `ID: ${appt.vaccineId}`}</h3>
                <p><strong>📅 التاريخ:</strong> {appt.date}</p>
                <p><strong>🏥 المركز:</strong> {appt.center || "لم يتم تحديده"}</p>
                <p><strong>📌 الحالة:</strong> {appt.status || "مجدول"}</p>

                {appt.status === "مجدول" && (
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
                    </>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default VaccineAppointments;
