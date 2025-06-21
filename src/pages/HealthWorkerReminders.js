import React, { useEffect, useState } from "react";
import "../styles/HealthWorkerReminders.css";

const HealthWorkerReminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reminders/reminders/by-type/HEALTH_WORKER")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReminders(data);
        } else {
          console.warn("⚠️ البيانات غير متوقعة:", data);
          setReminders([]);
        }
      })
      .catch((err) => {
        console.error("❌ فشل تحميل التذكيرات:", err);
        setReminders([]);
      });
  }, []);

  const getIconAndLabel = (message) => {
    if (message.includes("نفس التطعيم مرتين")) {
      return { icon: "⚠️", label: "تنبيه مهم" };
    } else if (message.includes("3 مواعيد")) {
      return { icon: "🚨", label: "حالة خطر" };
    } else {
      return { icon: "🔔", label: "تذكير" };
    }
  };

  return (
    <div className="reminders-wrapper">
      <h2>🔔 التذكيرات الخاصة بك</h2>

      {reminders.length === 0 ? (
        <p className="no-reminders">لا يوجد تذكيرات حالياً</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reminders.map((reminder, index) => {
            const { icon, label } = getIconAndLabel(reminder.messageText);
            return (
              <li key={index} className="reminder-card">
                <div className="reminder-text">
                  <span className="icon">{icon}</span>
                  <strong>{label}:</strong> {reminder.messageText}
                </div>
                <div className="reminder-date">
                  🕒 {new Date(reminder.scheduledDate).toLocaleString("ar-EG")}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HealthWorkerReminders;
