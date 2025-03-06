import React from "react";
import { useParams } from "react-router-dom";

const VaccineInfoPage = () => {
  const { vaccineName } = useParams(); // استلام اسم اللقاح من الرابط

  return (
    <div>
      <h1>Vaccine Information: {vaccineName}</h1>
      {/* هنا يمكنك إضافة المزيد من التفاصيل حول اللقاح حسب الاسم */}
    </div>
  );
};

export default VaccineInfoPage;
