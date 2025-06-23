import React, { useEffect, useState } from "react";
import "../styles/HealthWorkerReminders.css";

const HealthWorkerReminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reminders/reminders/by-type/HEALTH_WORKER", {
      credentials: "include",
    })
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

  const handleReminder = async (reminderId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reminders/mark-handled/${reminderId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (response.ok) {
        setReminders((prev) =>
          prev.map((r) =>
            r.id === reminderId
              ? {
                  ...r,
                  handledByWorker: { id: "current" },
                  handledDate: new Date().toISOString(),
                }
              : r
          )
        );
      } else {
        console.warn("⚠️ فشل في تحديث التذكير");
      }
    } catch (err) {
      console.error("❌ خطأ أثناء المعالجة:", err);
    }
  };

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
            const isHandled =
              reminder.handledByWorker && reminder.handledDate;

            return (
              <li key={index} className="reminder-card">
                <div className="reminder-text">
                  <span className="icon">{icon}</span>
                  <strong>{label}:</strong> {reminder.messageText}
                </div>

                <div className="reminder-date">
                  🕒{" "}
                  {new Date(reminder.scheduledDate).toLocaleDateString("ar-EG")}
                </div>

                {isHandled ? (
                  <p className="handled-info">
                    ✅ تم التعامل معها بتاريخ{" "}
                    {new Date(reminder.handledDate).toLocaleDateString("ar-EG")}
                  </p>
                ) : (
                  <button
                    className="handle-btn"
                    onClick={() => handleReminder(reminder.id)}
                  >
                    ✅ تم التعامل معها
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HealthWorkerReminders;
