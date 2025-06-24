import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer
} from "recharts";
import "../styles/ChildGrowthForm.css";

const ChildGrowthForm = () => {
    const [child, setChild] = useState(null);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [result, setResult] = useState("");
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChild = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/child-profile", {
                    credentials: "include",
                });
                const data = await res.json();
                setChild(data);
                fetchGrowthRecords(data.id);
            } catch (err) {
                console.error("❌ فشل في جلب بيانات الطفل:", err);
            }
        };

        fetchChild();
    }, []);

    const fetchGrowthRecords = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/growth-analysis/${id}`);
            const rawData = await response.json();

            const sorted = rawData.sort((a, b) => a.ageInDays - b.ageInDays);
            const uniqueByAge = new Map();
            sorted.forEach(item => {
                if (item.ageInDays !== undefined) {
                    uniqueByAge.set(item.ageInDays, item);
                }
            });
            const uniqueRecords = Array.from(uniqueByAge.values());
            setRecords(uniqueRecords);
        } catch (error) {
            console.error("❌ فشل في تحميل السجل:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!child?.id) {
            alert("❌ لم يتم العثور على معرف الطفل");
            return;
        }

        const response = await fetch("http://localhost:8080/api/growth-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                childId: child.id,
                weight,
                height
            }),
        });

        const data = await response.text();
        setResult(data);
        fetchGrowthRecords(child.id);
    };

    const latest = records.at(-1);

    const formatAge = (days) => {
        const months = Math.floor(days / 30);
        const extra = days % 30;
        return months > 0
            ? `العمر: ${months} شهر${extra > 0 ? ` و${extra} يوم` : ""}`
            : `العمر: ${days} يوم`;

    };

    const renderLine = (text, isWarning) => (
        <p className={`result-line ${isWarning ? "warning" : "success"}`}>
            {isWarning ? "⚠️" : "✅"} {text}.
        </p>
    );

    if (!child) return <p className="loading">...جاري تحميل بيانات الطفل</p>;
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{formatAge(label)}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="tooltip-value">
                            {entry.name.trim()}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="growth-container" dir="rtl">
            <div className="growth-form">
                <h2 className="section-title">
                    <img src="/rollerprinter.png" alt="أيقونة قياس" className="section-icon" />
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
                        {(() => {
                            const heightMsg = result.split(".").find(r => r.includes("طول")) || "";
                            const isHeightWarning = heightMsg.includes("أعلى") || heightMsg.includes("أقل");
                            return renderLine(heightMsg, isHeightWarning);
                        })()}

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
                        {(() => {
                            const weightMsg = result.split(".").find(r => r.includes("وزن")) || "";
                            const isWeightWarning = weightMsg.includes("أعلى") || weightMsg.includes("أقل");
                            return renderLine(weightMsg, isWeightWarning);
                        })()}
                    </>
                )}
            </div>

            <div className="growth-visuals">
                <h2 className="section-title">
                    <img src="/measurable.png" alt="أيقونة" className="section-icon" />
                    سجل قياسات الطفل
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={records}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageInDays" tickFormatter={formatAge} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line dataKey="height" stroke="#00bcd4" name="   طول الطفل" dot={{ r: 4 }} />
                        <Line dataKey="weight" stroke="#9c27b0" name="   وزن الطفل" dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="growth-table-wrapper">
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
        </div>
    );
};

export default ChildGrowthForm;
