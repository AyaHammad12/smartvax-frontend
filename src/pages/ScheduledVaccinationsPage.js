import React, { useState } from "react";
import "../styles/ScheduledVaccinationsPage.css"; // تأكد من أن ملف CSS موجود

// خريطة ترجمة للحالات لضمان تطابقها مع الـ CSS
const statusMapping = {
  قادم: "upcoming",
  مكتمل: "completed",
  فائت: "missed",
  "قيد التنفيذ": "in-progress",
};

const scheduledVaccinations = [
  { id: 1, name: "شلل الأطفال", date: "2024-04-15", status: "قادم" },
  {
    id: 2,
    name: "الحصبة والنكاف والحصبة الألمانية",
    date: "2024-06-10",
    status: "مكتمل",
  },
  { id: 3, name: "التهاب الكبد B", date: "2023-05-20", status: "فائت" },
  { id: 5, name: "فيروس الروتا", date: "2024-07-20", status: "قادم" },
  {
    id: 4,
    name: "الدفتيريا والتيتانوس والسعال الديكي",
    date: "2024-05-05",
    status: "قيد التنفيذ",
  },
].filter((vaccine) => vaccine.name && vaccine.date && vaccine.status); // ✅ تصفية البيانات الفارغة

const ScheduledVaccinationsPage = () => {
  const [vaccinations] = useState(scheduledVaccinations);

  return (
    <div className="scheduled-vaccinations-container" dir="rtl">
      <h2>التطعيمات المجدولة</h2>

      {vaccinations.length === 0 ? (
        <p className="no-vaccinations">لا توجد تطعيمات مجدولة.</p>
      ) : (
        <div className="vaccination-list">
          {vaccinations.map((vaccination) => {
            const englishStatus =
              statusMapping[vaccination.status] || "default"; // ترجمة الحالة

            return (
              <div
                key={vaccination.id}
                className={`vaccination-card ${englishStatus}`}
                style={{ display: "block", visibility: "visible" }} // ✅ تأكد من أن العنصر مرئي
              >
                <h3>{vaccination.name}</h3>
                <p>
                  <strong>التاريخ المجدول:</strong> {vaccination.date}
                </p>
                <p>
                  <strong>الحالة:</strong>{" "}
                  <span className="status">{vaccination.status}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduledVaccinationsPage;
