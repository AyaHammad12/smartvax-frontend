import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchAdditionalVaccines.css";

const SearchAdditionalVaccines = () => {
    const [childId, setChildId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!childId) return alert("يرجى إدخال رقم هوية الطفل");

        const role = localStorage.getItem("role"); // ✅ الحصول على الدور من التخزين المحلي

        // ✅ التوجيه إلى route الصحيح مع تمرير الدور في state
        navigate(`/additional-vaccines/certificate/${childId}`, {
            state: { role },
        });
    };

    return (
        <div className="search-vaccine-wrapper" dir="rtl">
            <div className="search-vaccine-container">
                <img src="/moh.png" alt="شعار وزارة الصحة" className="logo" />
                <h1 className="title">التطعيمات الإضافية</h1>
                <form onSubmit={handleSubmit} className="search-form-row">
                    <label htmlFor="childId">أدخل رقم هوية الطفل:</label>
                    <input
                        type="text"
                        id="childId"
                        value={childId}
                        onChange={(e) => setChildId(e.target.value)}
                        placeholder="رقم الهوية"
                    />
                    <button type="submit">بحث</button>
                </form>
            </div>
        </div>
    );
};

export default SearchAdditionalVaccines;
