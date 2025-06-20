// 📄 src/pages/ReminderPage.js
import React, { useEffect, useState } from "react";
import "../styles/ReminderPage.css";

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/reminders/by-session",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          setReminders(data);
        } else {
          console.warn("⚠️ الرد لم يكن مصفوفة:", data);
          setReminders([]);
        }
      } catch (error) {
        console.error("❌ خطأ في تحميل التذكيرات:", error);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="reminder-container" dir="rtl">
      <h2 className="title">🔔 تذكيرات مواعيد التطعيم</h2>
      {reminders.length === 0 ? (
        <p className="no-reminder">لا يوجد تذكيرات حالياً.</p>
      ) : (
        <ul className="reminder-list">
          {reminders.map((reminder) => {
            const isUpcoming = new Date(reminder.scheduledDate) > new Date();
            return (
              <li
                key={reminder.id}
                className={`reminder-item ${
                  reminder.sent ? "sent" : "pending"
                } ${isUpcoming ? "upcoming" : ""}`}
              >
                <p>
                  📆 <strong>{reminder.messageText}</strong>
                </p>
                <p>
                  🕒 التاريخ:{" "}
                  {new Date(reminder.scheduledDate).toLocaleDateString("ar-EG")}

                </p>
                <p className="status">
                  الحالة:{" "}
                  {reminder.sent ? (
                    <span className="sent-status">✅ تم الإرسال</span>
                  ) : (
                    <span className="pending-status">⌛ بانتظار الإرسال</span>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReminderPage;
