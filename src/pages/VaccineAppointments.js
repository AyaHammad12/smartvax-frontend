import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ParentAppointments.css";

const VaccineAppointments = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const vaccineName = queryParams.get("vaccine");    // مثلا شلل الأطفال
  const vaccineId = queryParams.get("vaccineId");    // مثلا 1500
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState({});

  // 💬 تحديد العنوان حسب المتاح
  const displayName = vaccineName ? vaccineName : vaccineId ? `لقاح رقم ${vaccineId}` : "غير معروف";

  useEffect(() => {
    if (vaccineName || vaccineId) {
      // ✅ إذا متوفر اسم أو رقم اللقاح، ضع مواعيد افتراضية
      setAppointments([
        {
          id: 1,
          vaccine: vaccineName || `ID: ${vaccineId}`,
          date: "2024-04-15",
          status: "مجدول",
          center: "",
        },
        {
          id: 2,
          vaccine: vaccineName || `ID: ${vaccineId}`,
          date: "2024-06-10",
          status: "مجدول",
          center: "",
        },
      ]);
    }
  }, [vaccineName, vaccineId]);

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

        <div className="appointments-grid">
          {appointments.map((appt) => (
              <div key={appt.id} className={`appointment-card scheduled-card`}>
                <h3>{appt.vaccine}</h3>
                <p><strong>التاريخ:</strong> {appt.date}</p>
                <p><strong>المركز:</strong> {appt.center || "لم يتم تحديده"}</p>
                <p><strong>الحالة:</strong> {appt.status}</p>

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
