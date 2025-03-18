import React from "react";
import { useParams } from "react-router-dom";
import "../styles/ReviewsPage.css"; // تأكد من وجود ملف CSS مناسب

// ✅ تحديث بيانات التجريبية وضمان أن أسماء اللقاحات تتطابق مع `VaccineInfoPage`
const feedbackData = {
  HepB: {
    sideEffects: [
      { effect: "Mild Fever", percentage: "70%" },
      { effect: "Pain at injection site", percentage: "50%" },
      { effect: "Swelling at the injection site", percentage: "30%" },
    ],
    treatments: [
      { treatment: "Cold compress", percentage: "60%" },
      { treatment: "Fever reducer", percentage: "40%" },
      { treatment: "Hydration", percentage: "20%" },
    ],
    reviews: [
      {
        name: "Lina M",
        comment:
          "My daughter had a low-grade fever for two days, but she recovered quickly. The nurse’s advice to keep her hydrated really helped.",
      },
      {
        name: "Yasmeen H.",
        comment:
          "I was nervous at first, but seeing how smoothly everything went reassured me. My child only needed some rest after the shot.",
      },
    ],
  },
};

const ReviewsPage = () => {
  const { vaccineName } = useParams(); // ✅ جلب اسم اللقاح من الـ URL
  const formattedVaccineName = decodeURIComponent(vaccineName.trim()); // ✅ إزالة الترميز والمسافات

  console.log("Looking for reviews for:", formattedVaccineName);

  const data = feedbackData[formattedVaccineName];

  if (!data) {
    return (
      <h2 className="error-message">No reviews available for this vaccine.</h2>
    );
  }

  return (
    <div className="reviews-container">
      <h2>Review and Feedback Analysis</h2>

      <div className="vaccine-info">
        <span className="vaccine-label">Vaccine Name:</span>
        <span className="vaccine-name">{formattedVaccineName}</span>
      </div>

      <p>
        The tables below represent the most common side effects and treatments
        experienced and recommended by parents using SmartVax.
      </p>

      <div className="tables-container">
        <div className="table-box">
          <h3>Table 1: Most common side effects</h3>
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
          <h3>Table 2: Most common treatments</h3>
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

      <h3>Parents Reviews</h3>
      <div className="reviews-box">
        {data.reviews.map((review, index) => (
          <div key={index} className="review">
            <strong>{review.name}</strong>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="submit-feedback">
        <p>Share your experience with us</p>
        <textarea placeholder="Write your feedback here..." />
        <button className="submit-btn">Submit</button>
      </div>
    </div>
  );
};

export default ReviewsPage;
