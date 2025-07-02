import React, { useEffect, useState } from "react";
import "../styles/HealthWorkerDashboard.css";
import Calendar from "../components/Calendar";

const HealthWorkerDashboard = () => {
    const [workerProfile, setWorkerProfile] = useState({
        name: "",
        center: "",
    });

    useEffect(() => {
        // جلب بيانات العامل الصحي (ممكن تعدل الرابط حسب API عندك)
        fetch("http://localhost:8080/api/worker-profile", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setWorkerProfile(data))
            .catch(() =>
                setWorkerProfile({ name: "العامل الصحي", center: "المركز" })
            );
    }, []);

    return (
        <div className="dashboard-container" dir="rtl">
            <h1
                className="dashboard-title"
                style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}
            >
                مرحبًا {workerProfile.name} 👨‍⚕️ |

            </h1>
            <p
                style={{
                    color: "#2c3e50",
                    fontWeight: "500",
                    fontSize: "1em",
                    margin: "6px 0 18px 0"
                }}
            >
                عند النقر على أي يوم في الكاليندر، ستنتقل مباشرة لرؤية جميع تطعيمات الأطفال المجدولة في ذلك اليوم.
            </p>




            {/* الكاليندر فقط */}
            <div className="calendar-section">
                <Calendar role="health_worker" />
            </div>
        </div>
    );
};

export default HealthWorkerDashboard;
