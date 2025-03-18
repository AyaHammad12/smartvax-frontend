import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ManegmentRequestsAppointment.css"; // تأكد من وجود ملف CSS مناسب

// بيانات تجريبية لطلبات المواعيد
const mockAppointments = [
  {
    id: 1,
    childID: "CHD123456",
    childName: "علي أحمد",
    vaccine: "شلل الأطفال",
    date: "2025-04-15",
    status: "قيد الانتظار",
  },
  {
    id: 2,
    childID: "CHD654321",
    childName: "سارة محمد",
    vaccine: "الحصبة والنكاف والحصبة الألمانية",
    date: "2025-06-10",
    status: "قيد الانتظار",
  },
  {
    id: 3,
    childID: "CHD987654",
    childName: "عمر خالد",
    vaccine: "التهاب الكبد B",
    date: "2025-05-20",
    status: "مقبول",
  },
  {
    id: 4,
    childID: "CHD567890",
    childName: "مايا نور",
    vaccine: "الدفتيريا والتيتانوس والسعال الديكي",
    date: "2025-05-05",
    status: "مرفوض",
  },
];

const ManegmentRequestsAppointment = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDate = queryParams.get("date") || "";

  const [appointments, setAppointments] = useState(mockAppointments);
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [filterVaccine, setFilterVaccine] = useState("الكل");
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
      filterStatus === "الكل" || appointment.status === filterStatus;
    const vaccineMatch =
      filterVaccine === "الكل" || appointment.vaccine === filterVaccine;
    const dateMatch = !filterDate || appointment.date === filterDate;
    const childIDMatch =
      !filterChildID || appointment.childID.includes(filterChildID);

    return statusMatch && vaccineMatch && dateMatch && childIDMatch;
  });

  return (
    <div className="appointments-container" dir="rtl">
      <h2>إدارة طلبات المواعيد</h2>

      {/* الفلاتر */}
      <div className="filter-container">
        <label>تصفية حسب الحالة:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="الكل">الكل</option>
          <option value="قيد الانتظار">قيد الانتظار</option>
          <option value="مقبول">مقبول</option>
          <option value="مرفوض">مرفوض</option>
        </select>

        <label>تصفية حسب اللقاح:</label>
        <select
          value={filterVaccine}
          onChange={(e) => setFilterVaccine(e.target.value)}
        >
          <option value="الكل">الكل</option>
          <option value="شلل الأطفال">شلل الأطفال</option>
          <option value="الحصبة والنكاف والحصبة الألمانية">
            الحصبة والنكاف والحصبة الألمانية
          </option>
          <option value="التهاب الكبد B">التهاب الكبد B</option>
          <option value="الدفتيريا والتيتانوس والسعال الديكي">
            الدفتيريا والتيتانوس والسعال الديكي
          </option>
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

      {/* قائمة الطلبات */}
      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <p className="no-appointments">لا توجد مواعيد متاحة.</p>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`appointment-card ${appointment.status.toLowerCase()}`}
            >
              <h3>{appointment.childName}</h3>
              <p>
                <strong>رقم هوية الطفل:</strong> {appointment.childID}
              </p>
              <p>
                <strong>اللقاح:</strong> {appointment.vaccine}
              </p>
              <p>
                <strong>التاريخ:</strong> {appointment.date}
              </p>
              <p>
                <strong>الحالة:</strong>{" "}
                <span className="status">{appointment.status}</span>
              </p>

              {appointment.status === "قيد الانتظار" && (
                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={() =>
                      updateAppointmentStatus(appointment.id, "مقبول")
                    }
                  >
                    قبول
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateAppointmentStatus(appointment.id, "مرفوض")
                    }
                  >
                    رفض
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
