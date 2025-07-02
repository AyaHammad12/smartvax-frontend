import React, { useEffect, useState } from "react";
import "../styles/ParentDashboard.css";
import Calendar from "../components/Calendar";
import { FaBell } from "react-icons/fa";

const ParentDashboard = () => {
    const [childProfile, setChildProfile] = useState({
        name: "",
        parentName: "",
        // ممكن تضيف خصائص ثانية لو حاب
    });

    useEffect(() => {
        fetch("http://localhost:8080/api/child-profile", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("فشل في تحميل البيانات");
                return res.json();
            })
            .then((data) => {
                setChildProfile(data);
            })
            .catch((err) => {
                setChildProfile({ name: "اسم الطفل", parentName: "ولي الأمر" }); // في حال فشل التحميل
            });
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title" style={{display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap"}}>
                مرحبًا {childProfile.parentName} 👋 |
                <span style={{color:"#158dc7", fontWeight:"bold", marginRight: "6px"}}>
    الطفل: {childProfile.name}
  </span>
                <span style={{color:"#444", fontWeight:"400", marginRight: "12px", fontSize:"0.92em"}}>
،كل تطعيم خطوة لصحة طفلك — ونحن معك دائماً.

  </span>
            </h1>


            <div className="reminder-box">
                <FaBell className="reminder-icon" />
                <p className="reminder-text">التطعيم القادم: يوليو</p>
            </div>

            {/* الكاليندر */}
            <div className="calendar-section">
                <Calendar role="parent" />
                <div className="legend legend-under-calendar">
                    <div className="legend-item">
                        <span className="legend-box upcoming"></span> قادم
                    </div>
                    <div className="legend-item">
                        <span className="legend-box completed"></span> مكتمل
                    </div>
                    <div className="legend-item">
                        <span className="legend-box missed"></span> فائت
                    </div>
                    <div className="legend-item">
                        <span className="legend-box other"></span> لا يوجد تطعيم
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
