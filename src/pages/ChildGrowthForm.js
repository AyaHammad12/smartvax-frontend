import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer
} from "recharts";
import "../styles/ChildGrowthForm.css";
// Import icons
import { FaWeight, FaChild, FaRulerCombined, FaChartLine, FaClipboardList, FaBaby } from 'react-icons/fa';


// Custom Tooltip for the Recharts graph
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Find height and weight data points
        const heightData = payload.find(p => p.dataKey === 'height');
        const weightData = payload.find(p => p.dataKey === 'weight');

        // Format age from days to months and days
        const formatAge = (days) => {
            const months = Math.floor(days / 30);
            const extraDays = days % 30;
            if (months === 0) return `${extraDays} يوم`;
            if (extraDays === 0) return `${months} شهر`;
            return `${months} شهر و ${extraDays} يوم`;
        };

        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">العمر: <strong>{formatAge(label)}</strong></p>
                {heightData && (
                    <p className="tooltip-value" style={{ color: heightData.stroke }}>
                        الطول: <strong>{heightData.value} سم</strong>
                    </p>
                )}
                {weightData && (
                    <p className="tooltip-value" style={{ color: weightData.stroke }}>
                        الوزن: <strong>{weightData.value} كغم</strong>
                    </p>
                )}
            </div>
        );
    }
    return null;
};


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
        <div className="growth-page-container" dir="rtl"> {/* New container for description and main content */}
            <p className="page-description">
                تتبع نمو طفلك بسهولة ودقة. أدخل قياسات الطول والوزن وشاهد تحليلًا فوريًا لنموه، بالإضافة إلى سجل تفصيلي للقياسات السابقة لمتابعة التقدم.
            </p>
            <div className="growth-container">
                <div className="growth-form">
                    <h2 className="section-title">
                        <FaRulerCombined className="section-icon" />
                        تحليل الطول والوزن
                    </h2>
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
                        <div className="result-box">
                            <h3 className="result-title">
                                <FaBaby className="result-icon" />
                                ملخص التحليل
                            </h3>
                            <table className="growth-table minimal-table"> {/* Added minimal-table class */}
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


                            <table className="growth-table minimal-table"> {/* Added minimal-table class */}
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
                        </div>
                    )}
                </div>

                <div className="growth-visuals">
                    <h2 className="section-title">
                        <FaChartLine className="section-icon" />
                        سجل قياسات الطفل
                    </h2>

                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={records} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                            <XAxis dataKey="ageInDays" tickFormatter={formatAge} axisLine={{ stroke: '#555' }} tickLine={false} padding={{ left: 20, right: 20 }} tick={{ fill: '#555' }} /> {/* Colored X-axis */}
                            <YAxis axisLine={{ stroke: '#555' }} tickLine={false} tick={{ fill: '#555' }} /> {/* Colored Y-axis */}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="height" stroke="#28a745" strokeWidth={3} name="   طول الطفل (سم)" dot={{ r: 5, fill: '#28a745', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8, strokeWidth: 2, fill: '#fff', stroke: '#28a745' }} /> {/* Green line for height */}
                            <Line type="monotone" dataKey="weight" stroke="#dc3545" strokeWidth={3} name="   وزن الطفل (كغم)" dot={{ r: 5, fill: '#dc3545', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8, strokeWidth: 2, fill: '#fff', stroke: '#dc3545' }} /> {/* Red line for weight */}
                        </LineChart>
                    </ResponsiveContainer>

                    <h3 className="sub-section-title">
                        <FaClipboardList className="sub-section-icon" />
                        القياسات السابقة
                    </h3>
                    <div className="growth-table-wrapper">
                        <table className="growth-table">
                            <thead>
                            <tr>
                                <th><strong>التاريخ</strong></th>
                                <th><strong>الوزن (كغم)</strong></th>
                                <th><strong>الطول (سم)</strong></th>
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
            </div>
        </div>
    );
};

export default ChildGrowthForm;