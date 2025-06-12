import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const statusLabels = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    reshdualing: "طلب تأجيل",
    trlocation: "طلب تغيير موقع",
    completed: "تم التطعيم",
    missed: "فائت", // ✅ أضف هذا السطر
};


const HWAppointmentScheduling = () => {
    const { day } = useParams(); // اليوم المأخوذ من الرابط
    const [appointments, setAppointments] = useState([]);

    const translateStatus = (status) => {
        if (!status) return "غير معروف";
        return statusLabels[status.toLowerCase()] || status;
    };

    useEffect(() => {
        const healthWorkerId = localStorage.getItem("userId");

        const fetchAppointments = async () => {
            try {

                const response = await fetch(

                    `http://localhost:8080/api/appointments/health-worker/${healthWorkerId}/appointments-by-date?date=${day}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) throw new Error("فشل في جلب المواعيد");

                const data = await response.json();
                console.log("📅 المواعيد المسترجعة:", data);
                console.log("👶 الطفل:", data[0]?.child);

                setAppointments(data);
            } catch (error) {
                console.error("❌ خطأ في جلب المواعيد:", error);
            }
        };

        fetchAppointments();
    }, [day]);

    return (
        <div dir="rtl" style={{ padding: "20px", fontFamily: "Tahoma" }}>
            <h2>🗓️ المواعيد المجدولة ليوم {day}</h2>
            <hr />

            {appointments.length === 0 ? (
                <p>لا توجد مواعيد لهذا اليوم.</p>
            ) : (
                <ul style={{listStyleType: "none", padding: 0}}>
                    {appointments.map((app) => (
                        <li
                            key={app.id}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <p>👶 الطفل: <strong>{app.child?.name || "غير معروف"}</strong></p>
                            <p>🆔 رقم الهوية: <strong>{app.child?.id || "غير متوفر"}</strong></p>

                            <p>
                                💉 أنواع التطعيم:{" "}
                                {app.scheduleVaccinations?.length > 0 ? (
                                    app.scheduleVaccinations.map((s, index) => (
                                        <span key={index}>
              {s.vaccination?.vaccineType?.name || "غير معروف"}
                                            {index < app.scheduleVaccinations.length - 1 ? "، " : ""}
            </span>
                                    ))
                                ) : (
                                    <span>لا يوجد</span>
                                )}
                            </p>

                            <p>⏰ الساعة: {new Date(app.appointmentDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                            <p>📌 الحالة: <strong>{translateStatus(app.status)}</strong></p>
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
};

export default HWAppointmentScheduling;
