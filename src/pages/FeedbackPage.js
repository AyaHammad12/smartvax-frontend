import React, { useState } from "react";
import "../styles/FeedbackPage.css";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("تم إرسال الملاحظات:", feedback);
    setFeedback("");
    alert("تم إرسال ملاحظاتك بنجاح!");
  };

  return (
    <div className="feedback-container" dir="rtl">
      <h2>إرسال ملاحظاتك</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          placeholder="اكتب ملاحظاتك هنا..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
        <button type="submit">إرسال</button>
      </form>
    </div>
  );
};

export default FeedbackPage;
