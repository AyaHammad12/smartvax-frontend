import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchAdditionalVaccines.css";

const SearchAdditionalVaccines = () => {
    const [childId, setChildId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!childId.trim()) return alert("يرجى إدخال رقم هوية الطفل");
        const role = localStorage.getItem("role");
        navigate(`/additional-vaccines/certificate/${childId}`, {
            state: { role },
        });
    };

    return (
        <div className="search-vaccine-wrapper" dir="rtl">
            <div className="search-vaccine-container">
                <div className="title-row">
                    <img src="/moh.png" alt="شعار وزارة الصحة" className="logo" />
                    <h1 className="title">التطعيمات الإضافية</h1>
                </div>
                <form onSubmit={handleSubmit} className="search-form-row">
                    <input
                        type="text"
                        id="childId"
                        value={childId}
                        onChange={(e) => setChildId(e.target.value)}
                        placeholder="رقم هوية الطفل"
                        autoFocus
                    />
                    <button type="submit">بحث</button>
                </form>
            </div>
        </div>
    );
};

export default SearchAdditionalVaccines;
