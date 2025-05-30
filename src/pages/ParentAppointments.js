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
    "pending": "قيد الانتظار",
    "confirmed": "مؤكد",
    "reshdualing": "طلب تأجيل",
    "trlocation": "طلب تغيير موقع",
    "completed": "تم التطعيم",
  };


  // جلب المراكز الصحية عند التحميل
  useEffect(() => {
    fetch("http://localhost:8080/api/vaccination-centers", {
      credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
          setAvailableCenters(data);
          console.log("✅ المراكز الصحية:", data);
        })
        .catch((err) => console.error("❌ خطأ في تحميل المراكز الصحية:", err));
  }, []);

  // جلب parentId بناءً على userId من localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("🔍 userId:", userId);
    if (!userId) return;

    fetch(`http://localhost:8080/api/appointments/parent-id/by-user/${userId}`, {
      credentials: "include",
    })
        .then((res) => {
          if (!res.ok) throw new Error("لم يتم العثور على parentId");
          return res.json();
        })
        .then((pid) => {
          console.log("✅ parentId:", pid);
          setParentId(pid);
        })
        .catch((err) => console.error("❌ خطأ في جلب parentId:", err));
  }, []);

  // جلب المواعيد بناءً على parentId
  useEffect(() => {
    if (!parentId) return;

    fetch(`http://localhost:8080/api/appointments/by-parent/${parentId}`, {
      credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ المواعيد المحملة (raw):", data);

          if (Array.isArray(data)) {
            setAppointments(data);
          } else if (data.content && Array.isArray(data.content)) {
            setAppointments(data.content);
          } else {
            console.error("⚠️ صيغة المواعيد غير متوقعة:", data);
            setAppointments([]);
          }
        })
        .catch((err) => console.error("❌ خطأ في جلب المواعيد:", err));
  }, [parentId]);

  // التحكم بنوع الإجراء لكل موعد
  const handleAction = (id, type) => {
    setActionType((prev) => ({ ...prev, [id]: type }));
  };

  // اختيار مركز صحي جديد لكل موعد
  const handleCenterSelection = (id, centerName) => {
    setSelectedCenter((prev) => ({ ...prev, [id]: centerName }));
  };

  // تغيير سبب التأجيل لكل موعد
  const handleReasonChange = (id, reason) => {
    setRescheduleReasons((prev) => ({ ...prev, [id]: reason }));
  };

  // إرسال التحديث إلى السيرفر
  const submitRequest = async (id) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    let updated = { ...appt };

    if (actionType[id] === "confirm") {
      updated.status = "confirmed";
    } else if (actionType[id] === "reschedule") {
      updated.status = "reshdualing"; // تأجيل
      updated.rescheduleReason = rescheduleReasons[id] || "";
    } else if (actionType[id] === "change-location") {
      const selected = availableCenters.find((c) => c.name === selectedCenter[id]);
      if (!selected) {
        alert("يرجى اختيار مركز صحي.");
        return;
      }
      updated.requestedNewCenter = { id: selected.id };
      updated.status = "trlocation";
    }

    if (!updated.id) {
      alert("لا يمكن تحديث موعد بدون معرف ID");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("فشل في إرسال التحديث");

      const updatedFromServer = await res.json();
      console.log("رد السيرفر بعد التحديث:", updatedFromServer);

      const updatedList = appointments.map((a) => (a.id === id ? updatedFromServer : a));
      setAppointments(updatedList);

      setActionType((prev) => ({ ...prev, [id]: null }));
      setRescheduleReasons((prev) => ({ ...prev, [id]: "" }));
      setSelectedCenter((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("❌ خطأ في إرسال التحديث:", err);
      alert("حدث خطأ أثناء إرسال الطلب.");
    }
  };

  return (
      <div className="appointments-container">
        <h1>مواعيدي</h1>
        {appointments.length === 0 ? (
            <p>لا توجد مواعيد حاليا.</p>
        ) : (
            <div className="appointments-grid">
              {appointments.map((appt) => {
                const vaccinesList = appt.scheduleVaccinations
                    ?.map((sv) => sv.vaccination?.name)
                    .join("، ");

                const formattedDate = new Date(appt.appointmentDate).toLocaleDateString();

                return (
                    <div key={appt.id} className="appointment-card">
                      <h3>{vaccinesList || "تطعيم غير معروف"}</h3>
                      <p>
                        <strong>التاريخ:</strong> {formattedDate}
                      </p>
                      <p>
                        <strong>المركز:</strong> {appt.vaccinationCenter?.name || "غير محدد"}
                      </p>
                      <p>
                        <strong>الحالة:</strong> {statusLabels[appt.status] || appt.status}
                      </p>

                      {actionType[appt.id] === "change-location" && (
                          <select
                              value={selectedCenter[appt.id] || ""}
                              onChange={(e) => handleCenterSelection(appt.id, e.target.value)}
                          >
                            <option value="">اختر مركزًا صحيًا</option>
                            {availableCenters.map((center) => (
                                <option key={center.id} value={center.name}>
                                  {center.name}
                                </option>
                            ))}
                          </select>
                      )}

                      {actionType[appt.id] === "reschedule" && (
                          <textarea
                              className="reschedule-textarea"
                              placeholder="يرجى كتابة سبب طلب التأجيل"
                              value={rescheduleReasons[appt.id] || ""}
                              onChange={(e) => handleReasonChange(appt.id, e.target.value)}
                          ></textarea>
                      )}

                      <div className="actions">
                        <button className="confirm-btn" onClick={() => handleAction(appt.id, "confirm")}>
                          تأكيد الموعد
                        </button>
                        <button className="reschedule-btn" onClick={() => handleAction(appt.id, "reschedule")}>
                          طلب تأجيل
                        </button>
                        <button className="location-btn" onClick={() => handleAction(appt.id, "change-location")}>
                          طلب تغيير موقع
                        </button>
                        {actionType[appt.id] && (
                            <button className="submit-btn" onClick={() => submitRequest(appt.id)}>
                              إرسال الطلب
                            </button>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
};

export default ParentAppointments;
