// 📄 src/pages/AdditionalVaccineCertificate.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../styles/AdditionalVaccineCertificate.css";

const AdditionalVaccineCertificate = () => {
    const { childId } = useParams();
    const { state } = useLocation();
    const role = (state?.role || "PARENT").toUpperCase();
    console.log("🚩 ROLE:", role);
    const [child, setChild] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statuses, setStatuses] = useState({});

    const today = new Date().toLocaleDateString("ar-EG");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const childRes = await fetch(`http://localhost:8080/api/children/${childId}`);
                const childData = await childRes.json();
                setChild(childData);

                const availableRes = await fetch("http://localhost:8080/api/additional-vaccines");
                const availableVaccines = await availableRes.json();

                const takenRes = await fetch(`http://localhost:8080/api/additional-vaccine-child/by-child/${childId}`);
                const takenVaccines = await takenRes.json();

                const merged = availableVaccines.map(v => {
                    const taken = takenVaccines.find(t => t.additionalVaccine?.id === v.id);
                    return {
                        id: v.id,
                        name: v.name,
                        minAge: v.minAgeMonths,
                        doseCount: v.doseCount,
                        notes: v.notes,
                        status: taken?.status || "PENDING",
                        date: taken?.dateOfAdministration || null
                    };
                });

                setVaccines(merged);
            } catch (err) {
                console.error("❌ خطأ في تحميل الشهادة:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [childId]);

    const handleConfirm = async (vaccineId) => {
        const today = new Date().toISOString().split("T")[0];
        try {
            await fetch("http://localhost:8080/api/additional-vaccine-child", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    child: { id: childId }, // ✅ مهم جدًا
                    additionalVaccine: { id: vaccineId }, // ✅ مهم جدًا
                    status: "COMPLETED",
                    dateOfAdministration: today,
                }),
            });


            alert("✅ تم تأكيد التطعيم بنجاح");

            setVaccines(prev =>
                prev.map(v =>
                    v.id === vaccineId ? { ...v, status: "COMPLETED", date: today } : v
                )
            );
        } catch (err) {
            alert("❌ حدث خطأ أثناء تأكيد التطعيم");
        }
    };

    if (loading || !child || !vaccines) {
        return <p className="loading">جاري تحميل الشهادة...</p>;
    }

    return (
        <div className="additional-certificate-wrapper">
            <div className="certificate-page" dir="rtl">
                <div className="certificate-header">
                    <img src="/moh.png" alt="شعار وزارة الصحة" className="logo"/>
                    <h1>التطعيمات الإضافية</h1>
                </div>

                <div className="info-section">
                    <p><strong>الاسم:</strong> {child?.name || "غير معروف"}</p>
                    <p><strong>رقم الهوية:</strong> {child?.id || "غير متوفر"}</p>
                </div>

                <table className="additional-table">
                    <thead>
                    <tr>
                        <th>اسم التطعيم / المعلومات</th>
                        <th>الحد الأدنى لعمر الإعطاء (شهر)</th>
                        <th>عدد الجرعات</th>
                        <th>الحالة</th>
                        <th>ملاحظات</th>
                        <th>تاريخ الإعطاء</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vaccines.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{textAlign: "center"}}>
                                لا توجد تطعيمات إضافية حتى الآن
                            </td>
                        </tr>
                    ) : (
                        vaccines.map((v, index) => (
                            <tr key={index}>
                                <td>{v?.name || "غير معروف"}</td>
                                <td>{v?.minAge || "-"}</td>
                                <td>{v?.doseCount || "-"}</td>
                                <td>
                                    {role === "HEALTHWORKER" ? (
                                        v.status === "COMPLETED" ? (
                                            "تم التطعيم"
                                        ) : (
                                            <select
                                                className="status-dropdown"
                                                value={statuses[v.id] || "PENDING"}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setStatuses(prev => ({...prev, [v.id]: value}));
                                                    if (value === "COMPLETED") {
                                                        handleConfirm(v.id);
                                                    }
                                                }}
                                            >
                                                <option value="PENDING">قيد الانتظار</option>
                                                <option value="COMPLETED">تم التطعيم</option>
                                            </select>
                                        )
                                    ) : (
                                        v.status === "COMPLETED" ? "تم التطعيم" : "قيد الانتظار"
                                    )}
                                </td>
                                <td>{v?.notes || "-"}</td>
                                <td>{v?.date ? v.date.split("T")[0] : "-"}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <p className="footer-note">
                    جميع التطعيمات بالجدول أعلاه موثقة من قبل وزارة الصحة الفلسطينية
                </p>
                <p className="issue-date"><strong>تاريخ الإصدار:</strong> {today}</p>
                <button className="print-btn" onClick={() => window.print()}>
                    🖨️ طباعة الشهادة
                </button>
            </div>
        </div>
    );
};

export default AdditionalVaccineCertificate;
