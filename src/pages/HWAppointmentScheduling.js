import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FaUser,
    FaSyringe,
    FaClock,
    FaIdCard,
    FaExclamationCircle,
    FaCalendarDay // تم إضافة FaCalendarDay هنا
} from "react-icons/fa"; // تم استيراد أيقونات react-icons
import "../styles/HWAppointmentScheduling.css"; // تأكد من وجود الملف

const statusLabels = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    reshdualing: "طلب تأجيل",
    trlocation: "طلب تغيير موقع",
    completed: "تم التطعيم",
    missed: "فائت"
};

const statusColors = {
    pending: "upcoming",
    confirmed: "upcoming",
    reshdualing: "in-progress",
    trlocation: "in-progress",
    completed: "completed",
    missed: "missed"
};

const HWAppointmentScheduling = () => {
    const { day } = useParams();
    const [appointments, setAppointments] = useState([]);

    const translateStatus = (status) => {
        if (!status) return "غير معروف";
        return statusLabels[status.toLowerCase()] || status;
    };

    const getStatusColor = (status) => {
        if (!status) return "default";
        return statusColors[status.toLowerCase()] || "default";
    };

    useEffect(() => {
        const healthWorkerId = localStorage.getItem("userId");
        const fetchAppointments = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/appointments/health-worker/${healthWorkerId}/appointments-by-date?date=${day}`,
                    {
                        method: "GET",
                        headers: { Accept: "application/json" },
                        credentials: "include"
                    }
                );
                if (!response.ok) throw new Error("فشل في جلب المواعيد");
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error); // Added error logging
                setAppointments([]);
            }
        };
        fetchAppointments();
    }, [day]);

    return (
        // تم إعادة wrapper div هنا لضمان عدم تأثير الستايلات على الصفحات الأخرى
        <div className="hw-appointments-page-wrapper" dir="rtl">
            <div className="scheduled-vaccinations-container">
                <h2 className="main-title">
                    {/* استخدام أيقونة FaCalendarDay من react-icons */}
                    <FaCalendarDay className="main-title-icon" />
                    مواعيد تطعيمات الأطفال ليوم {day}
                </h2>
                <div className="page-desc">
                    في هذه الصفحة يمكنك الإطلاع على كل التطعيمات المجدولة للأطفال في هذا اليوم.
                    اضغط على كل بطاقة لمزيد من التفاصيل عند الحاجة.
                </div>
                <hr style={{ margin: "18px 0 30px 0", border: "0", borderTop: "2px solid #e2eaff" }} />
                {appointments.length === 0 ? (
                    <div className="no-vaccinations">
                        <FaExclamationCircle className="icon" style={{ marginLeft: "7px", color: "#adb5bd" }} />
                        لا توجد مواعيد لهذا اليوم.
                    </div>
                ) : (
                    <div className="vaccination-list">
                        {appointments.map((app) => (
                            <div
                                className={`vaccination-card ${getStatusColor(app.status)}`}
                                key={app.id}
                            >
                                <h3 className="card-row">
                                    <FaUser className="icon user-icon" />
                                    الطفل: {app.child?.name || "غير معروف"}
                                </h3>
                                <div className="card-row">
                                    <FaIdCard className="icon id-icon" />
                                    رقم الهوية: <span style={{ fontWeight: "bold" }}>{app.child?.id || "غير متوفر"}</span>
                                </div>
                                <div className="card-row">
                                    <FaSyringe className="icon syringe-icon" />
                                    أنواع التطعيم:{" "}
                                    {app.scheduleVaccinations?.length > 0 ? (
                                        app.scheduleVaccinations.map((s, idx) => (
                                            <span key={idx}>
                                                {s.vaccination?.vaccineType?.name || s.vaccination?.name || "غير معروف"}
                                                {idx < app.scheduleVaccinations.length - 1 ? "، " : ""}
                                            </span>
                                        ))
                                    ) : (
                                        <span>لا يوجد</span>
                                    )}
                                </div>
                                <div className="card-row">
                                    <FaClock className="icon clock-icon" />
                                    الساعة:{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                        {app.appointmentDate
                                            ? new Date(app.appointmentDate).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                            : "--:--"}
                                    </span>
                                </div>
                                <div className="card-row">
                                    الحالة:{" "}
                                    <span className={`status-${getStatusColor(app.status)}`}>
                                        {translateStatus(app.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HWAppointmentScheduling;