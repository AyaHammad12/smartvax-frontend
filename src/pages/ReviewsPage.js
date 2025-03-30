import React from "react";
import { useParams } from "react-router-dom";
import "../styles/ReviewsPage.css"; // تأكد من وجود ملف CSS مناسب

// ✅ تحديث البيانات التجريبية وضمان أن أسماء اللقاحات متطابقة مع `VaccineInfoPage`
const feedbackData = {
  "التهاب الكبد B": {
    sideEffects: [
      { effect: "حمى خفيفة", percentage: "70%" },
      { effect: "ألم في موقع الحقن", percentage: "50%" },
      { effect: "تورم في موقع الحقن", percentage: "30%" },
    ],
    treatments: [
      { treatment: "كمادات باردة", percentage: "60%" },
      { treatment: "خافض حرارة", percentage: "40%" },
      { treatment: "الإكثار من السوائل", percentage: "20%" },
    ],
    reviews: [
      {
        name: "لينا م.",
        comment:
          "ابنتي أصيبت بحمى خفيفة ليومين، لكنها تعافت بسرعة. نصيحة الممرضة بالإكثار من السوائل ساعدت كثيرًا.",
      },
      {
        name: "ياسمين هـ.",
        comment:
          "كنت متوترة في البداية، لكن بعد رؤية مدى سلاسة العملية شعرت بالاطمئنان. احتاج طفلي فقط إلى الراحة بعد التطعيم.",
      },
    ],
  },
};

const ReviewsPage = () => {
  const { vaccineName } = useParams(); // ✅ جلب اسم اللقاح من الـ URL
  const formattedVaccineName = decodeURIComponent(vaccineName.trim()); // ✅ إزالة الترميز والمسافات

  console.log("البحث عن مراجعات للقاح:", formattedVaccineName);

  const data = feedbackData[formattedVaccineName];

  if (!data) {
    return (
      <h2 className="error-message">لا توجد مراجعات متاحة لهذا اللقاح.</h2>
    );
  }

  return (
    <div className="reviews-container" dir="rtl">
      <h2>تحليل التقييمات والملاحظات</h2>

      <div className="vaccine-info">
        <span className="vaccine-label">اسم اللقاح:</span>
        <span className="vaccine-name">{formattedVaccineName}</span>
      </div>

      <p>
        الجداول أدناه تعرض أكثر الأعراض الجانبية والعلاجات الموصى بها من قبل
        الأهالي.
      </p>

      <div className="tables-container">
        <div className="table-box">
          <h3>الجدول 1: الأعراض الجانبية الأكثر شيوعًا</h3>
          <table>
            <tbody>
              {data.sideEffects.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.effect}</strong>
                  </td>
                  <td>{item.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3>الجدول 2: العلاجات الأكثر استخدامًا</h3>
          <table>
            <tbody>
              {data.treatments.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.treatment}</strong>
                  </td>
                  <td>{item.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3>تقييمات الأهالي</h3>
      <div className="reviews-box">
        {data.reviews.map((review, index) => (
          <div key={index} className="review">
            <strong>{review.name}</strong>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="submit-feedback">
        <p>شارك تجربتك معنا</p>
        <textarea placeholder="اكتب ملاحظاتك هنا..." />
        <button className="submit-btn">إرسال</button>
      </div>
    </div>
  );
};

export default ReviewsPage;
