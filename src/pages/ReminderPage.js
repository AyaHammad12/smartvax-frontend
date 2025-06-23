import React, { useEffect, useState } from "react";
import "../styles/ReminderPage.css";
import { useNavigate } from "react-router-dom";

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);
  const [openedIds, setOpenedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reminders/by-session", {
          credentials: "include",
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setReminders(data);
        } else {
          setReminders([]);
        }
      } catch (error) {
        console.error("❌ خطأ في تحميل التذكيرات:", error);
      }
    };

    fetchReminders();
  }, []);

  const toggleReminder = async (id, parentViewed) => {
    setOpenedIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );

    if (!parentViewed) {
      try {
        await fetch(`http://localhost:8080/api/reminders/mark-parent-viewed/${id}`, {
          method: "PATCH",
          credentials: "include",
        });
        setReminders((prevReminders) =>
          prevReminders.map((reminder) =>
            reminder.id === id ? { ...reminder, parentViewed: true } : reminder
          )
        );
      } catch (error) {
        console.error("خطأ في تحديث حالة التذكير:", error);
      }
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case "UPCOMING":
        return "upcoming";
      case "MISSED":
        return "missed";
      case "POST_VACCINE":
        return "completed";
      default:
        return "";
    }
  };

  return (
    <div className="reminder-container" dir="rtl">
      <div className="title">
        <span className="title-icon">🔔</span>
        تذكيرات التطعيم
      </div>

      {reminders.length === 0 ? (
        <p className="no-reminder">لا يوجد تذكيرات حالياً.</p>
      ) : (
        <ul className="reminder-list">
          {reminders.map((reminder) => {
            const isOpen = openedIds.includes(reminder.id);
            const typeClass = getTypeClass(reminder.type);

            return (
              <li
                key={reminder.id}
                className={`reminder-summary ${typeClass} ${
                  reminder.parentViewed ? "read" : "unread"
                }`}
                onClick={() =>
                  toggleReminder(reminder.id, reminder.parentViewed)
                }
              >
                <div className="reminder-header">
                  <span className="message-text">📌 {reminder.messageText}</span>
                  {!reminder.parentViewed && (
                    <span className="unread-badge">جديد</span>
                  )}
                </div>

                {isOpen && (
                  <div className="reminder-details">
                    <p>
                      🗓️ التاريخ:{" "}
                      {new Date(reminder.scheduledDate).toLocaleDateString("ar-EG")}
                    </p>
                    <p className="status">
                      الحالة:{" "}
                      {reminder.sent ? (
                        <span className="sent-status">✅ تم الإرسال</span>
                      ) : (
                        <span className="pending-status">⌛ لم يُرسل بعد</span>
                      )}
                    </p>

                    {reminder.type === "POST_VACCINE" && (
                      <button
                        className="ai-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/ai-analyzer");
                        }}
                      >
                        🤖 ابدأ تحليل الأعراض
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReminderPage;
