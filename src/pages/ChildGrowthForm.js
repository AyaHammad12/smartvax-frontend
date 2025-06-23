import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer
} from "recharts";
import "../styles/ChildGrowthForm.css";

const ChildGrowthForm = () => {
    const [childId, setChildId] = useState("unknown");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [result, setResult] = useState("");
    const [records, setRecords] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedId = localStorage.getItem("childId");
        if (storedId) {
            setChildId(storedId);
            fetchGrowthRecords(storedId);
        }
    }, []);

    const fetchGrowthRecords = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/growth-analysis/${id}`);
            const rawData = await response.json();

            // 1. ترتيب السجلات حسب العمر بالأيام
            const sorted = rawData.sort((a, b) => a.ageInDays - b.ageInDays);

            // 2. إزالة التكرار: نحتفظ فقط بآخر إدخال لكل عمر
            const uniqueByAge = new Map();
            sorted.forEach(item => {
                if (item.ageInDays !== undefined) {
                    uniqueByAge.set(item.ageInDays, item);
                }
            });

            // 3. تحويل النتيجة إلى مصفوفة واستخدامها
            const uniqueRecords = Array.from(uniqueByAge.values());
            setRecords(uniqueRecords);

        } catch (error) {
            console.error("❌ فشل في تحميل السجل:", error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!childId || childId === "unknown") {
            alert("❌ لم يتم العثور على معرف الطفل");
            return;
        }

        const response = await fetch("http://localhost:8080/api/growth-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ childId, weight, height }),
        });

        const data = await response.text();
        setResult(data);
        fetchGrowthRecords(childId);
    };

    const latest = records.at(-1);

    const formatAge = (days) => {
        const months = Math.floor(days / 30);
        const extra = days % 30;
        return months > 0
            ? `${months} شهر${extra > 0 ? ` و${extra} يوم` : ""}`
            : `${days} يوم`;
    };

    const renderLine = (text, isWarning) => (
        <p className={`result-line ${isWarning ? "warning" : "success"}`}>
            {isWarning ? "⚠️" : "✅"} {text}.
        </p>
    );


    return (
        <div className="growth-container" dir="rtl">
            <div className="growth-form">
                <h2 className="section-title">تحليل الطول والوزن</h2>
                <form onSubmit={handleSubmit}>
                    <label>قم بإدخال الطول (سم):</label>
                    <input
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />

                    <label>قم بإدخال الوزن (كغم):</label>
                    <input
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />

                    <button type="submit">افحص</button>
                </form>

                {result && latest && (
                    <>
                        <table className="growth-table">
                            <thead>
                            <tr>
                                <th>الطول الحالي</th>
                                <th>الحد الأدنى</th>
                                <th>الحد الأعلى</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{latest.height}</td>
                                <td>{latest.minHeight?.toFixed(1)}</td>
                                <td>{latest.maxHeight?.toFixed(1)}</td>
                            </tr>
                            </tbody>
                        </table>
                        {renderLine(
                            result.split(".").find(r => r.includes("طول")),
                            result.includes("طول") && (result.includes("أعلى") || result.includes("أقل"))
                        )}


                        <table className="growth-table">
                            <thead>
                            <tr>
                                <th>الوزن الحالي</th>
                                <th>الحد الأدنى</th>
                                <th>الحد الأعلى</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{latest.weight}</td>
                                <td>{latest.minWeight?.toFixed(1)}</td>
                                <td>{latest.maxWeight?.toFixed(1)}</td>
                            </tr>
                            </tbody>
                        </table>
                        {renderLine(
                            result.split(".").find(r => r.includes("وزن")),
                            result.includes("وزن") && (result.includes("أعلى") || result.includes("أقل"))
                        )}
                    </>
                )}
            </div>

            <div className="growth-visuals">
                <h2 className="section-title">سجل قياسات الطفل</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={records}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageInDays" tickFormatter={formatAge} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="height" stroke="#00bcd4" name="   طول الطفل" dot={{ r: 4 }} />
                        <Line dataKey="weight" stroke="#9c27b0" name="   وزن الطفل" dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>

                <table className="growth-table">
                    <thead>
                    <tr>
                        <th><strong>التاريخ</strong></th>
                        <th><strong>الوزن</strong></th>
                        <th><strong>الطول</strong></th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((r, i) => (
                        <tr key={i}>
                            <td>{r.dateRecorded ? new Date(r.dateRecorded).toLocaleDateString() : "—"}</td>
                            <td>{r.weight}</td>
                            <td>{r.height}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChildGrowthForm;
