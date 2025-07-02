import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaUser, FaIdCard, FaSyringe, FaCalendarAlt, FaCheckCircle,
    FaClock, FaClinicMedical, FaInfoCircle, FaRedo, FaMapMarkedAlt, FaArrowLeft,
    FaTimesCircle           // 👈 أضف هذه هنا!
} from "react-icons/fa";

import "../styles/AppointmentManagementPage.css";

const iconColor = "#2ab7ca"; // لون موحد للأيقونات

const translateStatus = (status) => {
    const map = {
        pending: "قيد الانتظار",
        confirmed: "مؤكد",
        reshdualing: "طلب تأجيل",
        trlocation: "طلب تغيير موقع",
        completed: "تم التطعيم",
        cancelled: "تم الإلغاء",
        missed: "فائت",
    };
    return map[status?.toLowerCase()] || "غير معروف";
};

const statusIcon = (status) => {
    const map = {
        pending: <FaInfoCircle color="#fbbf24" className="icon" />,
        confirmed: <FaCheckCircle color="#298bfb" className="icon" />,
        reshdualing: <FaRedo color="#c026d3" className="icon" />,
        trlocation: <FaMapMarkedAlt color="#3498db" className="icon" />,
        completed: <FaCheckCircle color="#22c55e" className="icon" />,
        cancelled: <FaTimesCircle color="#a0aec0" className="icon" />,
        missed: <FaTimesCircle color="#ff5757" className="icon" />,
    };
    return map[status?.toLowerCase()] || <FaInfoCircle color="#a0aec0" className="icon" />;
};

const AppointmentManagementPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDate, setNewDate] = useState("");

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

    if (loading) return <p className="loading">...جاري تحميل بيانات الموعد</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!appointment) return <p className="error-message">الموعد غير موجود</p>;

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
            <h2>
                <FaCalendarAlt style={{ color: "#3498db", marginLeft: 7 }} />
                تفاصيل إدارة الموعد
            </h2>
            <div className="appointment-details">
                <p>
                    <FaUser color="#3498db" className="icon" />
                    <strong>اسم الطفل:</strong> {child?.name || "غير معروف"}
                </p>
                <p>
                    <FaIdCard color="#fbbf24" className="icon" />
                    <strong>رقم هوية الطفل:</strong> {child?.id || "---"}
                </p>
                <p>
                    <FaSyringe color="#db2777" className="icon" />
                    <strong>أنواع اللقاحات:</strong>{" "}
                    {scheduleVaccinations?.length > 0
                        ? scheduleVaccinations.map((s) => s.vaccination?.vaccineType?.name).join("، ")
                        : "غير معروف"}
                </p>
                <p>
                    <FaCalendarAlt color="#22c55e" className="icon" />
                    <strong>تاريخ الموعد:</strong>{" "}
                    {new Date(appointmentDate).toLocaleDateString("ar-EG")}
                </p>
                <p>
                    <FaClock color="#2ab7ca" className="icon" />
                    <strong>الساعة:</strong>{" "}
                    {new Date(appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
                <p>
                    {statusIcon(status)}
                    <strong>الحالة:</strong>{" "}
                    <span className={status?.toLowerCase() === "completed" ? "status-completed" : ""}>
            {translateStatus(status)}
          </span>
                </p>
                {status?.toLowerCase() === "completed" && healthWorker?.name && (
                    <p>
                        <FaClinicMedical color="#298bfb" className="icon" />
                        <strong>تم التطعيم بواسطة:</strong> {healthWorker.name}
                    </p>
                )}
                {status?.toLowerCase() === "trlocation" && requestedNewCenter && (
                    <p>
                        <FaMapMarkedAlt color="#6366f1" className="icon" />
                        <strong>موقع التطعيم الجديد المطلوب:</strong> {requestedNewCenter.name}
                    </p>
                )}
                {status?.toLowerCase() === "reshdualing" && rescheduleReason && (
                    <p>
                        <FaRedo color="#a21caf" className="icon" />
                        <strong>سبب طلب التأجيل:</strong> {rescheduleReason}
                    </p>
                )}
                {status?.toLowerCase() === "reshdualing" && (
                    <div className="date-picker" style={{ marginTop: 10 }}>
                        <label>
                            <FaCalendarAlt color="#2ab7ca" className="icon" style={{ marginLeft: 6 }} />
                            <strong>اختر التاريخ الجديد:</strong>
                        </label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <div className="actions">
                {status.toLowerCase() === "completed" ? (
                    <p className="status-completed">
                        <FaCheckCircle color="#22c55e" />
                        تم إكمال هذا الموعد ولا يمكن إجراء تغييرات إضافية.
                    </p>

                ) : (
                    <>
                        {(status.toLowerCase() === "trlocation" ||
                            status.toLowerCase() === "reshdualing") && (
                            <>
                                <button className="confirm-btn" onClick={acceptRequest}>
                                    <FaCheckCircle style={{ marginLeft: 5 }} /> تأكيد الطلب
                                </button>
                                <button className="reject-btn" onClick={rejectRequest}>
                                    <FaTimesCircle style={{ marginLeft: 5 }} /> رفض الطلب
                                </button>
                            </>
                        )}
                        {status.toLowerCase() !== "completed" && (
                            <button className="complete-btn" onClick={markAsCompleted}>
                                <FaCheckCircle style={{ marginLeft: 5 }} /> تم التطعيم
                            </button>
                        )}
                    </>
                )}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft style={{ marginLeft: 6 }} />
                    رجوع
                </button>
            </div>
        </div>
    );
};

export default AppointmentManagementPage;
