import React, { useState, useEffect } from "react";
import "../styles/ScheduledVaccinationsPage.css";

const statusMapping = {
    قادم: { class: "upcoming", icon: "⏳" },
    مكتمل: { class: "completed", icon: "✅" },
    فائت: { class: "missed", icon: "❌" },
    "قيد التنفيذ": { class: "in-progress", icon: "🕒" },
    ملغاة: { class: "canceled", icon: "🚫" }
};

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
            credentials: "include"
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
                                status: translatedStatus
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
            <h2 className="main-title" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "1.5em", marginLeft: "10px" }}>📅</span>
                التطعيمات المجدولة
            </h2>
            <p className="page-desc">
                هنا يمكنك الإطلاع على جميع التطعيمات المجدولة القادمة والسابقة.
            </p>

            {vaccinations.length === 0 ? (
                <p className="no-vaccinations">لا توجد تطعيمات مجدولة حالياً.</p>
            ) : (
                <div className="vaccination-list">
                    {vaccinations.map((vaccination) => {
                        const statusObj = statusMapping[vaccination.status] || { class: "default", icon: "❔" };

                        return (
                            <div key={vaccination.date} className={`vaccination-card ${statusObj.class}`}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "9px",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <span style={{ fontSize: "1.18em" }}>💉</span>
                                    <span style={{ fontWeight: "bold", color: "#174ea6", fontSize: "1.14em" }}>{vaccination.name}</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "8px",
                                        marginBottom: "6px"
                                    }}
                                >
                                    <span style={{ fontSize: "1.13em" }}>📅</span>
                                    <span>
                    <strong>التاريخ:</strong> {vaccination.date}
                  </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "8px"
                                    }}
                                >


                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ScheduledVaccinationsPage;
