import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/VaccineInfoPage.css";

const VaccineInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaccine, setVaccine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVaccineData = async () => {
    const token = localStorage.getItem('token');
    console.log("🛡️ التوكن المستخدم:", token);
    console.log("🔵 ID المطلوب:", id);

    if (!token) {
      setError("⚠️ لم يتم العثور على رمز الدخول. يرجى تسجيل الدخول مجددًا.");
      setLoading(false);
      return;
    }

    if (!id || isNaN(id)) {
      setError("⚠️ المعرف (ID) غير صالح أو مفقود.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/vaccinations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("❌ اللقاح غير موجود.");
        }
        if (response.status === 400) {
          throw new Error("⚠️ الطلب غير صحيح. تحقق من رقم المعرف.");
        }
        if (response.status === 401) {
          throw new Error("⚠️ غير مصرح لك. يرجى تسجيل الدخول.");
        }
        throw new Error(`❌ فشل التحميل: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setVaccine(data);
    } catch (error) {
      console.error('❌ خطأ أثناء تحميل اللقاح:', error);
      setError(error.message || 'حدث خطأ غير متوقع أثناء التحميل.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccineData();
  }, [id]);

  if (loading) {
    return <div className="vaccine-info-container" dir="rtl"><p>جاري تحميل البيانات...</p></div>;
  }

  if (error) {
    return <div className="vaccine-info-container" dir="rtl"><p className="error-message">{error}</p></div>;
  }

  if (!vaccine) {
    return <div className="vaccine-info-container" dir="rtl"><h2>معلومات اللقاح غير متوفرة.</h2></div>;
  }

  return (
      <div className="vaccine-info-container" dir="rtl">
        <h1 className="vaccine-title">معلومات اللقاح</h1>
        <div className="vaccine-card">
          <div className="vaccine-details">
            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>اسم اللقاح:</strong> <span>{vaccine.name || "غير متوفر"}</span>
            </div>

            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>نوع اللقاح:</strong> <span>{vaccine.type || "غير متوفر"}</span>
            </div>

            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>تاريخ الإعطاء:</strong> <span>{vaccine.dateGiven || "غير متوفر"}</span>
            </div>

            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>العمر المستهدف (بالأشهر):</strong> <span>{vaccine.targetAge != null ? `${vaccine.targetAge} أشهر` : "غير متوفر"}</span>
            </div>

            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>الآثار الجانبية:</strong> <span>{vaccine.sideEffects || "غير متوفر"}</span>
            </div>

            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>الحالة:</strong> <span>{vaccine.status || "غير متوفر"}</span>
            </div>

            <div className="vaccine-row">
              <FaCheckCircle className="vaccine-icon" />
              <strong>العلاج:</strong> <span>{vaccine.treatment || "غير متوفر"}</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
              className="vaccine-button"
              onClick={() => navigate(`/vaccine-appointments?vaccineId=${id}`)}
          >
            حجز موعد
          </button>

          <button
              className="vaccine-button write-review"
              onClick={() => navigate(`/write-review/${id}`)}
          >
            ✍️ اكتب تجربتك
          </button>
        </div>
      </div>
  );
};

export default VaccineInfoPage;
