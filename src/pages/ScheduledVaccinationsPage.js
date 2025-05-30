import React, { useState, useEffect } from "react";
import "../styles/ScheduledVaccinationsPage.css";

// ✅ خريطة ترجمة الحالة إلى كلاس CSS
const statusMapping = {
    قادم: "upcoming",
    مكتمل: "completed",
    فائت: "missed",
    "قيد التنفيذ": "in-progress",
    ملغاة: "canceled",
};

// ✅ ترجمة الحالة من الإنجليزي إلى العربي
const translateStatus = (status) => {
    switch (status) {
        case "PENDING":
            return "قادم";
        case "COMPLETED":
            return "مكتمل";
        case "MISSED":
            return "فائت";
        case "IN_PROGRESS":
            return "قيد التنفيذ";
        case "CANCELED":
            return "ملغاة";
        default:
            return "غير معروف";
    }
};

const ScheduledVaccinationsPage = () => {
    const [vaccinationsByDate, setVaccinationsByDate] = useState({});

    useEffect(() => {
        fetch("http://localhost:8080/api/schedule-vaccinations", {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("فشل في جلب المواعيد");
                return res.json();
            })
            .then((data) => {
                const grouped = {};

                data.forEach((v) => {
                    if (
                        v.vaccination?.group?.name &&
                        v.scheduledDate &&
                        v.status
                    ) {
                        const date = v.scheduledDate;
                        const groupName = v.vaccination.group.name;
                        const translatedStatus = translateStatus(v.status);

                        if (!grouped[date]) {
                            grouped[date] = {
                                name: groupName,
                                date,
                                status: translatedStatus,
                            };
                        }
                    }
                });

                setVaccinationsByDate(grouped);
            })
            .catch((err) => {
                console.error(err);
                alert("❌ حدث خطأ أثناء جلب التطعيمات المجدولة");
            });
    }, []);

    const vaccinations = Object.values(vaccinationsByDate);

    return (
        <div className="scheduled-vaccinations-container" dir="rtl">
            <h2>📅 التطعيمات المجدولة</h2>

            {vaccinations.length === 0 ? (
                <p className="no-vaccinations">لا توجد تطعيمات مجدولة.</p>
            ) : (
                <div className="vaccination-list">
                    {vaccinations.map((vaccination) => {
                        const cssClass = statusMapping[vaccination.status] || "default";

                        return (
                            <div
                                key={vaccination.date}
                                className={`vaccination-card ${cssClass}`}
                            >
                                <h3>{vaccination.name}</h3>
                                <p>
                                    <strong>📅 التاريخ:</strong> {vaccination.date}
                                </p>
                                <p>
                                    <strong>الحالة:</strong>{" "}
                                    <span className="status">{vaccination.status}</span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ScheduledVaccinationsPage;
