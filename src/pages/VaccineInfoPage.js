import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/VaccineInfoPage.css";

const VaccineInfoPage = () => {
  const { vaccineName } = useParams();
  const navigate = useNavigate();

  // تنظيف اسم اللقاح
  const cleanVaccineName = vaccineName.split("/")[0];

  const vaccineData = {
    "التهاب الكبد B": {
      name: "لقاح التهاب الكبد B",
      age: "عند الولادة، شهر واحد، 6 أشهر",
      purpose: "الوقاية من التهاب الكبد B.",
      description: "يحمي من فيروس التهاب الكبد B الذي يؤثر على الكبد.",
      sideEffects: "ألم في موقع الحقن، حمى خفيفة.",
      treatment: "وضع كمادات باردة واستخدام خافض للحرارة إذا لزم الأمر.",
    },
    "شلل الأطفال": {
      name: "لقاح شلل الأطفال",
      age: "5 أشهر",
      purpose: "الوقاية من مرض شلل الأطفال.",
      description: "لقاح يُعطى في 3 جرعات متتالية.",
      sideEffects: "حمى خفيفة، ألم في موقع الحقن.",
      treatment: "وضع كمادات باردة واستخدام خافض للحرارة إذا لزم الأمر.",
    },
    "جدري الماء": {
      name: "لقاح جدري الماء",
      age: "12-18 شهرًا",
      purpose: "الحماية من فيروس جدري الماء.",
      description: "يوفر حماية ضد العدوى التي تسبب طفحًا جلديًا وحكة.",
      sideEffects: "ألم خفيف، انتفاخ في موقع الحقن، حمى طفيفة.",
      treatment: "الراحة واستخدام كمادات باردة عند الحاجة.",
    },
  };
  const vaccine = vaccineData[cleanVaccineName] || null;

  return (
    <div className="vaccine-info-container" dir="rtl">
      {vaccine ? (
        <>
          <h1 className="vaccine-title">معلومات اللقاح</h1>
          <div className="vaccine-card">
            <div className="vaccine-details">
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>اسم اللقاح:</strong> <span>{vaccine.name}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>العمر الموصى به:</strong> <span>{vaccine.age}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>الغرض:</strong> <span>{vaccine.purpose}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>الوصف:</strong> <span>{vaccine.description}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>الآثار الجانبية:</strong>{" "}
                <span>{vaccine.sideEffects}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>العلاج:</strong> <span>{vaccine.treatment}</span>
              </div>
            </div>
          </div>

          <button
            className="vaccine-button"
            onClick={() =>
              navigate(`/vaccine-appointments?vaccine=${cleanVaccineName}`)
            }
          >
            حجز موعد
          </button>
          <button
            className="vaccine-button review"
            onClick={() => {
              console.log("التنقل إلى صفحة المراجعات للقاح:", cleanVaccineName);
              navigate(`/reviews/${encodeURIComponent(cleanVaccineName)}`);
            }}
          >
            عرض التقييمات والملاحظات
          </button>
        </>
      ) : (
        <h2>معلومات اللقاح غير متوفرة.</h2>
      )}
    </div>
  );
};

export default VaccineInfoPage;
