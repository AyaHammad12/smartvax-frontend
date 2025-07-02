import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaSyringe,
    FaCalendarAlt,
    FaVial,
    FaPills,
    FaHandHoldingMedical,
    FaExclamationTriangle,
    FaPenFancy,
    FaRobot,         // أيقونة الذكاء الاصطناعي
    FaUsers,         // أيقونة مجتمع الأهالي
    FaLightbulb,     // أيقونة فائدة/إلهام
    FaCheckCircle,   // أيقونة لصفوف المعلومات
} from "react-icons/fa";

import "../styles/VaccineInfoPage.css";

const VaccineInfoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaccine, setVaccine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVaccineData = useCallback(async () => {
        if (!id) {
            setError("⚠️ المعرف (ID) غير صالح أو مفقود.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:8080/api/vaccinations/${id}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                let errorMessage = `❌ فشل التحميل: ${response.status} ${response.statusText}`;
                if (response.status === 404) {
                    errorMessage = "❌ اللقاح المطلوب غير موجود.";
                } else if (response.status === 403 || response.status === 401) {
                    errorMessage =
                        "⚠️ غير مصرح لك بالوصول إلى هذا المورد. يرجى تسجيل الدخول.";
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setVaccine(data);
        } catch (err) {
            console.error("❌ خطأ أثناء تحميل اللقاح:", err);
            setError(err.message || "حدث خطأ غير متوقع أثناء التحميل.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchVaccineData();
    }, [fetchVaccineData]);

    if (loading) {
        return (
            <div className="vaccine-page-main-wrapper loading-state" dir="rtl">
                <div className="loader"></div>
                <p className="loading-message">جاري تحميل بيانات اللقاح...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vaccine-page-main-wrapper error-state" dir="rtl">
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={fetchVaccineData}>
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (!vaccine) {
        return (
            <div className="vaccine-page-main-wrapper no-data-state" dir="rtl">
                <h2>معلومات اللقاح غير متوفرة حاليًا.</h2>
                <p>يرجى التأكد من صحة المعرف والمحاولة مرة أخرى.</p>
            </div>
        );
    }

    return (
        // الحاوية الرئيسية التي تضم صندوق الذكاء الاصطناعي وصندوق معلومات اللقاح
        <div className="vaccine-page-main-wrapper" dir="rtl">
            {/* بوكس الذكاء الاصطناعي وتجارب الأهالي - يظهر على اليسار */}
            <div className="ai-box">
                <div className="ai-box-header">
                    <FaRobot className="ai-icon" />
                    <h2 className="ai-title">أداة الذكاء الاصطناعي وتجارب الأهالي</h2>
                </div>
                <p className="ai-box-description">
                    احصل على <span className="highlight">تحليل ذكي فوري</span> لأعراض طفلك بعد لقاح <span className="highlight">{vaccine?.name || "هذا اللقاح"}</span>، مستند إلى أحدث تقنيات الذكاء الاصطناعي وملهم من تجارب مئات الأهالي الفعلية. كل مشاركة منك تساهم في تطوير الأداة وتفيد غيرك!
                </p>
                <div className="ai-benefits-list">
                    <span><FaUsers /> مجتمع داعم</span>
                    <span>
  <FaLightbulb style={{marginLeft: "7px", color: "#FFD600"}} />
  توصيات من الذكاء الاصطناعي لمتابعة صحة طفلك
</span>
                    <span><FaPenFancy /> شارك تجربتك</span>
                </div>
                <button
                    className="share-experience-btn"
                    onClick={() => navigate(`/write-review/${id}`)}
                >
                    <FaPenFancy className="button-icon" />
                    شارك تجربتك واستفد من تجربة غيرك!
                </button>
            </div>

            {/* البوكس الأصلي لمعلومات اللقاح - يظهر على اليمين */}
            <div className="vaccine-info-container">
                <h1 className="vaccine-title">معلومات لقاح {vaccine?.name || "غير متوفر"}</h1>
                <div className="vaccine-card">
                    <div className="vaccine-details">
                        <InfoRow label="اسم اللقاح" value={vaccine.name} />
                        <InfoRow
                            label="العمر المستهدف (بالأيام)"
                            value={vaccine.targetAgeDays ? `${vaccine.targetAgeDays} يومًا` : "غير متوفر"}
                        />
                        <InfoRow
                            label="طريقة الإعطاء"
                            value={vaccine.routeOfAdministration}
                        />
                        <InfoRow label="الجرعة" value={vaccine.dose} />
                        <InfoRow label="طرق علاج مقترحة" value={vaccine.treatment} />
                        <InfoRow label="الآثار الجانبية" value={vaccine.sideEffects} />
                    </div>
                </div>

                {/* 🚨 تم إزالة div.button-group بالكامل بما فيه زر "اكتب تجربتك" */}
                {/*
                <div className="button-group">
                    <button
                        className="vaccine-button write-review"
                        onClick={() => navigate(`/write-review/${id}`)}
                    >
                        ✍️ اكتب تجربتك
                    </button>
                </div>
                */}
            </div>
        </div>
    );
};

// مكون فرعي لصفوف المعلومات
const InfoRow = ({ label, value }) => (
    <div className="vaccine-row">
        <FaCheckCircle className="vaccine-icon" />
        <strong>{label}:</strong> <span>{value || "غير متوفر"}</span>
    </div>
);

export default VaccineInfoPage;
