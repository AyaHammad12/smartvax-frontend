import React, { useEffect, useState } from "react";
import "../styles/HealthWorkerReminders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faExclamationTriangle,
  faExclamationCircle,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

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
            setReminders([]);
          }
        })
        .catch(() => setReminders([]));
  }, []);

  const handleReminder = async (reminderId) => {
    try {
      const response = await fetch(
          `http://localhost:8080/api/reminders/mark-handled/${reminderId}`,
          { method: "PATCH", credentials: "include" }
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
      }
    } catch {}
  };

  // لون لكل نوع تذكير
  const getIconAndColor = (msg) => {
    if (msg.includes("نفس التطعيم مرتين"))
      return { icon: faExclamationCircle, color: "#ff9933", label: "تنبيه مهم" };
    if (msg.includes("3 مواعيد"))
      return { icon: faExclamationTriangle, color: "#e53935", label: "حالة خطر" };
    return { icon: faBell, color: "#297fff", label: "تذكير" };
  };

  return (
      <div className="reminders-wrapper">
        <div className="reminders-title-row">
          <FontAwesomeIcon icon={faBell} className="reminders-main-icon" />
          <h2>التذكيرات الخاصة بك</h2>
        </div>

        {reminders.length === 0 ? (
            <div className="no-reminders">
              <FontAwesomeIcon icon={faCheckCircle} color="#28a745" size="lg" />{" "}
              <span>لا يوجد تذكيرات حالياً</span>
            </div>
        ) : (
            <div className="reminders-list">
              {reminders.map((reminder) => {
                const { icon, color, label } = getIconAndColor(reminder.messageText);
                const isHandled = reminder.handledByWorker && reminder.handledDate;
                return (
                    <div className={`reminder-card${isHandled ? " handled" : ""}`} key={reminder.id}>
                      <div className="reminder-card-header">
                        <FontAwesomeIcon icon={icon} className="reminder-type-icon" style={{ color }} />
                        <span className="reminder-type-label" style={{ color }}>{label}</span>
                      </div>

                      <div className="reminder-card-body">
                        <span>{reminder.messageText}</span>
                      </div>

                      <div className="reminder-footer-row">
                        <div className="reminder-date">
                          <FontAwesomeIcon icon={faClock} className="date-icon" />
                          {new Date(reminder.scheduledDate).toLocaleDateString("ar-EG")}
                        </div>

                        {isHandled ? (
                            <div className="handled-info">
                              <FontAwesomeIcon icon={faCheckCircle} /> تم التعامل معها
                              <span className="handled-date">
                        {" "}
                                ({new Date(reminder.handledDate).toLocaleDateString("ar-EG")})
                      </span>
                            </div>
                        ) : (
                            <button className="handle-btn" onClick={() => handleReminder(reminder.id)}>
                              <FontAwesomeIcon icon={faCheckCircle} /> تم التعامل معها
                            </button>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
};

export default HealthWorkerReminders;
