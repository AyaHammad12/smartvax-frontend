// 📄 src/pages/VaccinationCertificate.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/VaccinationCertificate.css";

const VaccinationCertificate = () => {
    const { childId } = useParams();
    const [child, setChild] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [additionalVaccines, setAdditionalVaccines] = useState([]);

    useEffect(() => {
        const fetchChildId = async () => {
            const storedChildId = localStorage.getItem("childId");
            const parentId = localStorage.getItem("parentId");

            if (!storedChildId || storedChildId === "unknown") {
                try {
                    const response = await fetch(`http://localhost:8080/api/children/by-parent/${parentId}`);
                    const data = await response.json();
                    if (data.length > 0) {
                        localStorage.setItem("childId", data[0].id);
                        window.location.href = `/certificate/${data[0].id}`;
                    } else {
                        console.warn("⚠️ لا يوجد أطفال لهذا المستخدم");
                    }
                } catch (err) {
                    console.error("❌ خطأ في جلب بيانات الطفل:", err);
                }
            }
        };

        fetchChildId();
    }, []);

    useEffect(() => {
        if (!childId || childId === "unknown") return;

        const fetchData = async () => {
            try {
                // ✅ جلب بيانات الطفل
                const childRes = await fetch(`http://localhost:8080/api/children/${childId}`);
                const childData = await childRes.json();
                setChild(childData);

                // ✅ جلب مواعيد التطعيم المكتملة من جدول appointments
                const parentId = childData.parent?.id;
                const apptRes = await fetch(`http://localhost:8080/api/appointments/by-parent-with-schedules/${parentId}`);
                const apptData = await apptRes.json();

                const completedAppointments = apptData.filter(
                    (a) =>
                        a.status?.toUpperCase() === "COMPLETED" &&
                        a.child?.id?.toString() === childId
                );
                setAppointments(completedAppointments);

                // ✅ جلب التطعيمات الإضافية المكتملة من جدول additional_vaccine_child
                const additionalRes = await fetch(`http://localhost:8080/api/additional-vaccine-child/by-child/${childId}`);
                const additionalData = await additionalRes.json();

                const completedAdditional = additionalData
                    .filter((item) => item.status === "COMPLETED")
                    .map((item) => ({
                        name: item.additionalVaccine?.name || "غير معروف",
                        date: item.dateOfAdministration || "غير معروف",
                    }));

                setAdditionalVaccines(completedAdditional);
            } catch (error) {
                console.error("❌ خطأ في تحميل بيانات الشهادة:", error);
            }
        };

        fetchData();
    }, [childId]);

    if (!child) {
        return <p className="loading">جاري تحميل الشهادة...</p>;
    }
    console.log("🧒 بيانات الطفل:", child);

    const today = new Date().toLocaleDateString("ar-EG");

    return (
        <div className="certificate-wrapper">
            <div className="certificate-page" dir="rtl">
                <div className="certificate-header">
                    <img src="/moh.png" alt="شعار وزارة الصحة" className="logo" />
                    <h1>شهادة تطعيم</h1>
                </div>

                <div className="info-section">
                    <div className="info-row">
                        <span><strong>الاسم:</strong></span>
                        <span>{child.name}</span>
                    </div>
                    <div className="info-row">
                        <span><strong>تاريخ الميلاد:</strong></span>
                        <span>{child.dob}</span>
                    </div>
                    <div className="info-row">
                        <span><strong>اسم الأب:</strong></span>
                        <span>{child.parent?.name}</span>
                    </div>
                    <div className="info-row">
                        <span><strong>الجنس:</strong></span>
                        <span>{child.gender?.toUpperCase() === "MALE" ? "ذكر" : "أنثى"}</span>
                    </div>
                    <div className="info-row">
                        <span><strong>رقم الهوية:</strong></span>
                        <span>{child.id}</span>
                    </div>
                </div>

                <table className="certificate-table">
                    <thead>
                    <tr>
                        <th><strong>اسم التطعيم / المعلومات</strong></th>
                        <th><strong>المركز</strong></th>
                        <th><strong>تاريخ الإعطاء</strong></th>
                        <th><strong>الحالة</strong></th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.length === 0 && additionalVaccines.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                لا توجد تطعيمات مكتملة حتى الآن
                            </td>
                        </tr>
                    ) : (
                        <>
                            {appointments.map((appt) =>
                                appt.scheduleVaccinations?.map((s, index) => (
                                    <tr key={`${appt.id}-${index}`}>
                                        <td>{s.vaccination?.name || "غير معروف"}</td>
                                        <td>{appt.vaccinationCenter?.name || "غير معروف"}</td>
                                        <td>{appt.appointmentDate?.split("T")[0]}</td>
                                        <td>تم التطعيم</td>
                                    </tr>
                                ))
                            )}
                            {additionalVaccines.map((v, index) => (
                                <tr key={`add-${index}`}>
                                    <td>{v.name}</td>
                                    <td>{child?.vaccinationCenter?.name || "غير معروف"}</td> {/* ✅ هذا السطر المهم */}
                                    <td>{v.date}</td>
                                    <td>تم التطعيم</td>
                                </tr>
                            ))}
                        </>
                    )}
                    </tbody>
                </table>

                <p className="issue-date"><strong>تاريخ الإصدار:</strong> {today}</p>

                <button className="print-btn" onClick={() => window.print()}>
                    🖨️ طباعة الشهادة
                </button>
            </div>
        </div>
    );
};

export default VaccinationCertificate;
