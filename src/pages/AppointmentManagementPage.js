import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AppointmentManagementPage.css";

const translateStatus = (status) => {
    const map = {
        pending: "قيد الانتظار",
        confirmed: "مؤكد",
        reshdualing: "طلب تأجيل",
        trlocation: "طلب تغيير موقع",
        completed: "تم التطعيم",
        cancelled: "تم الإلغاء",
    };
    return map[status?.toLowerCase()] || "غير معروف";
};

const AppointmentManagementPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDate, setNewDate] = useState(""); // ✅ تاريخ التأجيل

    useEffect(() => {
        fetch(`http://localhost:8080/api/appointments/${appointmentId}`)
            .then((res) => {
                if (!res.ok) throw new Error("فشل في جلب بيانات الموعد");
                return res.json();
            })
            .then((data) => {
                setAppointment(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [appointmentId]);

    const acceptRequest = () => {
        let url = "";

        if (appointment.status.toLowerCase() === "trlocation") {
            url = `http://localhost:8080/api/appointments/${appointmentId}/accept-location-change`;
        } else if (appointment.status.toLowerCase() === "reshdualing") {
            if (!newDate) {
                alert("يرجى اختيار تاريخ جديد للتأجيل");
                return;
            }
            url = `http://localhost:8080/api/appointments/${appointmentId}/accept-reschedule?newDate=${newDate}`;
        } else {
            alert("لا يمكن تأكيد هذا النوع من الطلبات");
            return;
        }

        fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (!res.ok) throw new Error("فشل في تحديث الموعد");
                return res.json();
            })
            .then((updated) => {
                setAppointment(updated);
                alert("✅ تم تأكيد الطلب بنجاح");
            })
            .catch((err) => {
                console.error(err);
                alert("حدث خطأ أثناء التأكيد");
            });
    };

    const rejectRequest = () => {
        fetch(`http://localhost:8080/api/appointments/${appointmentId}/reject-request`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (!res.ok) throw new Error("فشل رفض الطلب");
                return res.json();
            })
            .then((updated) => {
                setAppointment(updated);
                alert("تم رفض الطلب والعودة إلى الحالة قيد الانتظار");
            })
            .catch((err) => alert("خطأ: " + err.message));
    };

    const markAsCompleted = () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("لم يتم العثور على userId");
            return;
        }

        const url = `http://localhost:8080/api/appointments/${appointmentId}/mark-completed?userId=${userId}`;
        fetch(url, {
            method: "PATCH",
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then((updated) => {
                setAppointment(updated);
                alert("تم تحديث الموعد إلى تم التطعيم");
            })
            .catch((err) => {
                console.error(err);
                alert("فشل تحديث الموعد");
            });
    };

    if (loading) return <p>...جاري تحميل بيانات الموعد</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!appointment) return <p>الموعد غير موجود</p>;

    const {
        child,
        appointmentDate,
        status,
        scheduleVaccinations,
        requestedNewCenter,
        rescheduleReason,
        healthWorker,
    } = appointment;

    return (
        <div className="appointment-management-container" dir="rtl">
            <h2>تفاصيل إدارة الموعد</h2>

            <div className="appointment-details">
                <p><strong>اسم الطفل:</strong> {child?.name || "غير معروف"}</p>
                <p><strong>رقم هوية الطفل:</strong> {child?.id || "---"}</p>
                <p>
                    <strong>أنواع اللقاحات:</strong>{" "}
                    {scheduleVaccinations?.length > 0
                        ? scheduleVaccinations.map((s) => s.vaccination?.vaccineType?.name).join("، ")
                        : "غير معروف"}
                </p>
                <p><strong>تاريخ الموعد:</strong> {new Date(appointmentDate).toLocaleString("ar-EG")}</p>
                <p><strong>الحالة:</strong> {translateStatus(status)}</p>

                {status.toLowerCase() === "completed" && healthWorker?.name && (
                    <p><strong>تم التطعيم بواسطة:</strong> {healthWorker.name}</p>
                )}

                {status.toLowerCase() === "trlocation" && requestedNewCenter && (
                    <p><strong>موقع التطعيم الجديد المطلوب:</strong> {requestedNewCenter.name}</p>
                )}

                {status.toLowerCase() === "reshdualing" && rescheduleReason && (
                    <p><strong>سبب طلب التأجيل:</strong> {rescheduleReason}</p>
                )}

                {/* ✅ التقويم إذا الموعد طلب تأجيل */}
                {status.toLowerCase() === "reshdualing" && (
                    <div className="date-picker">
                        <label><strong>اختر التاريخ الجديد:</strong></label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="actions">
                {(status.toLowerCase() === "trlocation" || status.toLowerCase() === "reshdualing") && (
                    <>
                        <button className="confirm-btn" onClick={acceptRequest}>تأكيد الطلب</button>
                        <button className="reject-btn" onClick={rejectRequest}>رفض الطلب</button>
                    </>
                )}

                {status.toLowerCase() !== "completed" && (
                    <button className="complete-btn" onClick={markAsCompleted}>تم التطعيم</button>
                )}

                <button className="back-btn" onClick={() => navigate(-1)}>رجوع</button>
            </div>
        </div>
    );
};

export default AppointmentManagementPage;
