import React, { useState, useEffect } from "react";
import "../styles/ParentAppointments.css";

const ParentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableCenters, setAvailableCenters] = useState([]);
  const [actionType, setActionType] = useState({});
  const [selectedCenter, setSelectedCenter] = useState({});
  const [rescheduleReasons, setRescheduleReasons] = useState({});
  const [parentId, setParentId] = useState(null);

  const statusLabels = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    reshdualing: "طلب تأجيل",
    trlocation: "طلب تغيير موقع",
    completed: "تم التطعيم",
    missed: "فائت",
    cancelled: "تم الإلغاء",
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/vaccination-centers", {
      credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => setAvailableCenters(data))
        .catch((err) => console.error("❌ خطأ في تحميل المراكز:", err));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(
        `http://localhost:8080/api/appointments/parent-id/by-user/${userId}`,
        {
          credentials: "include",
        }
    )
        .then((res) => res.json())
        .then((pid) => setParentId(pid))
        .catch((err) => console.error("❌ خطأ في جلب parentId:", err));
  }, []);

  useEffect(() => {
    if (!parentId) return;
    fetch(
        `http://localhost:8080/api/appointments/by-parent-with-schedules/${parentId}`,
        {
          credentials: "include",
        }
    )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAppointments(data);
          } else if (data.content && Array.isArray(data.content)) {
            setAppointments(data.content);
          } else {
            setAppointments([]);
          }
        })
        .catch((err) => console.error("❌ خطأ في جلب المواعيد:", err));
  }, [parentId]);

  const handleAction = (id, type) => {
    setActionType((prev) => ({ ...prev, [id]: type }));
  };

  const handleCenterSelection = (id, centerName) => {
    setSelectedCenter((prev) => ({ ...prev, [id]: centerName }));
  };

  const handleReasonChange = (id, reason) => {
    setRescheduleReasons((prev) => ({ ...prev, [id]: reason }));
  };

  const submitRequest = async (id) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    let updated = { ...appt };

    if (actionType[id] === "confirm") {
      updated.status = "confirmed";
    } else if (actionType[id] === "reschedule") {
      updated.status = "reshdualing";
      updated.rescheduleReason = rescheduleReasons[id] || "";
    } else if (actionType[id] === "change-location") {
      const selected = availableCenters.find(
          (c) => c.name === selectedCenter[id]
      );
      if (!selected) {
        alert("يرجى اختيار مركز صحي.");
        return;
      }
      updated.requestedNewCenter = { id: selected.id };
      updated.status = "trlocation";
    }

    if (!updated.id) {
      alert("لا يمكن تحديث موعد بدون معرف");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("فشل في التحديث");

      const updatedFromServer = await res.json();
      const updatedList = appointments.map((a) =>
          a.id === id ? updatedFromServer : a
      );
      setAppointments(updatedList);

      setActionType((prev) => ({ ...prev, [id]: null }));
      setRescheduleReasons((prev) => ({ ...prev, [id]: "" }));
      setSelectedCenter((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("❌ خطأ في إرسال الطلب:", err);
      alert("حدث خطأ أثناء إرسال الطلب.");
    }
  };

  return (
      <div className="appointments-container" dir="rtl">
        <h1>مواعيد التطعيم</h1>
        <div className="page-desc">
          يمكنك رؤية جميع <b>المواعيد القريبة</b> لتطعيم طفلك، مع إمكانية تأكيد الموعد أو طلب تأجيله أو تغيير مركز التطعيم بكل سهولة.
        </div>
        {appointments.length === 0 ? (
            <p className="no-appointments">لا توجد مواعيد حاليا.</p>
        ) : (
            <div className="appointments-grid">
              {appointments.map((appt) => {
                const vaccinesList = appt.scheduleVaccinations
                    ?.map((sv) => sv.vaccination?.name)
                    .join("، ");
                const formattedDate = new Date(appt.appointmentDate).toLocaleDateString();

                let statusClass = "";
                if (appt.status === "confirmed") statusClass = "confirmed";
                if (appt.status === "reshdualing") statusClass = "rescheduled";
                if (appt.status === "trlocation") statusClass = "requested-location";
                if (appt.status === "pending") statusClass = "pending";
                if (appt.status === "completed") statusClass = "completed";
                if (appt.status === "missed") statusClass = "missed";

                return (
                    <div key={appt.id} className={`appointment-card ${statusClass}`}>
                      <div className="card-header">
                        <strong><span className="icon">💉</span> اسم التطعيم:</strong> {vaccinesList || "تطعيم غير معروف"}
                        <p><span className="icon">📅</span> <strong>التاريخ:</strong> {formattedDate}</p>
                        <p><span className="icon">🏥</span> <strong>المركز:</strong> {appt.vaccinationCenter?.name || "غير محدد"}</p>
                        <p><span className="icon">📌</span> <strong>الحالة:</strong> {statusLabels[appt.status?.toLowerCase()] || "غير معروف"}</p>
                      </div>

                      {(appt.status !== "completed" && appt.status !== "missed") && (
                          <div className="actions">
                            <button
                                className="confirm-btn"
                                onClick={() => handleAction(appt.id, "confirm")}
                            >
                              <span className="icon">✅</span> تأكيد الموعد
                            </button>
                            <button
                                className="reschedule-btn"
                                onClick={() => handleAction(appt.id, "reschedule")}
                            >
                              <span className="icon">🕒</span> طلب تأجيل
                            </button>
                            <button
                                className="location-btn"
                                onClick={() => handleAction(appt.id, "change-location")}
                            >
                              <span className="icon">📍</span> طلب تغيير موقع
                            </button>
                          </div>
                      )}

                      {actionType[appt.id] === "change-location" && (
                          <div className="action-input">
                            <label><span className="icon">🏥</span> اختر مركزًا صحيًا جديدًا:</label>
                            <select
                                value={selectedCenter[appt.id] || ""}
                                onChange={(e) =>
                                    handleCenterSelection(appt.id, e.target.value)
                                }
                            >
                              <option value="">اختر مركزًا صحيًا</option>
                              {availableCenters.map((center) => (
                                  <option key={center.id} value={center.name}>
                                    {center.name}
                                  </option>
                              ))}
                            </select>
                          </div>
                      )}
                      {actionType[appt.id] === "reschedule" && (
                          <div className="action-input">
                            <label><span className="icon">📝</span> سبب طلب التأجيل:</label>
                            <textarea
                                className="reschedule-textarea"
                                placeholder="يرجى كتابة السبب"
                                value={rescheduleReasons[appt.id] || ""}
                                onChange={(e) =>
                                    handleReasonChange(appt.id, e.target.value)
                                }
                            ></textarea>
                          </div>
                      )}
                      {actionType[appt.id] && (
                          <div className="submit-section">
                            <button
                                className="submit-btn"
                                onClick={() => submitRequest(appt.id)}
                            >
                              <span className="icon">📤</span> إرسال الطلب
                            </button>
                          </div>
                      )}
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
};

export default ParentAppointments;
