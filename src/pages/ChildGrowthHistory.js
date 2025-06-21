import React, { useEffect, useState } from "react";
import "../styles/ChildGrowthForm.css"; // استخدام نفس تنسيق الفورم

const ChildGrowthHistory = () => {
    const childId = localStorage.getItem("childId"); // ✅ أخذ المعرف مباشرة
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecords = async () => {
            if (!childId || childId === "unknown") {
                setError("❌ لم يتم العثور على معرف الطفل.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/growth-analysis/${childId}`);
                if (!res.ok) {
                    setError("⚠️ فشل في تحميل السجل.");
                    setLoading(false);
                    return;
                }

                const text = await res.text();
                const data = text ? JSON.parse(text) : [];
                setRecords(data);
            } catch (err) {
                setError("⚠️ حدث خطأ أثناء الاتصال بالسيرفر.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [childId]);

    return (
        <div className="container" dir="rtl">
            <h2>سجل قياسات الطفل</h2>

            {loading && <p>⏳ جارٍ تحميل السجل...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && records.length === 0 && (
                <p style={{ textAlign: "center", fontWeight: "500" }}>
                    لا توجد قياسات سابقة لهذا الطفل.
                </p>
            )}

            {!loading && !error && records.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>الوزن (كغم)</th>
                        <th>الطول (سم)</th>
                        <th>تاريخ التسجيل</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((r, idx) => (
                        <tr key={idx}>
                            <td>{r.weight}</td>
                            <td>{r.height}</td>
                            <td>{new Date(r.dateRecorded).toLocaleDateString("ar-EG")}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ChildGrowthHistory;
