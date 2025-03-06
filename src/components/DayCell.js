// import React from "react";
// import "../styles/DayCell.css";

// const DayCell = ({ day, status, vaccineName }) => {
//   return (
//     <div
//       className={`day-cell ${status}`}
//       title={vaccineName || "لا يوجد تطعيم"}
//     >
//       <span className="day-number">{day}</span>
//       {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
//     </div>
//   );
// };

// export default DayCell;

// import React from "react";
// import "../styles/DayCell.css";

// const DayCell = ({ day, status, vaccineName }) => {
//   return (
//     <div className={`day-cell ${status}`}>
//       <span className="day-number">{day}</span>
//       {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
//     </div>
//   );
// };

// export default DayCell;

// import React from "react";
// import "../styles/DayCell.css";

// const DayCell = ({ day, status, vaccineName }) => {
//   return (
//     <div
//       className={`day-cell ${status}`}
//       title={vaccineName || "No Vaccination"}
//     >
//       <span className="day-number">{day}</span>
//       {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
//     </div>
//   );
// };

// export default DayCell;

// import React from "react";
// import "../styles/DayCell.css";

// const DayCell = ({ day, status, vaccineName }) => {
//   return (
//     <div
//       className={`day-cell ${status}`} // إضافة الـ status هنا
//       title={vaccineName || "No Vaccination"}
//     >
//       <span className="day-number">{day}</span>
//       {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
//     </div>
//   );
// };

// export default DayCell;

import React from "react";
import { useNavigate } from "react-router-dom"; // استخدام useNavigate بدلاً من useHistory
import "../styles/DayCell.css";

const DayCell = ({ day, status, vaccineName, role }) => {
  const navigate = useNavigate(); // الحصول على الدالة الخاصة بالتنقل

  const handleClick = () => {
    if (role === "parent") {
      // إرسال vaccineName عبر الرابط إلى صفحة معلومات اللقاح
      navigate(`/vaccine-info/:${vaccineName}/:${day}`);
    } else if (role === "health worker") {
      // إرسال day عبر الرابط إلى صفحة تحديد المواعيد
      navigate(`/appointment-scheduling/:${day}/:${vaccineName}`);
    }
  };

  return (
    <div
      className={`day-cell ${status}`}
      title={vaccineName || "No Vaccination"}
      onClick={handleClick} // عند الضغط على اليوم، يتم استدعاء الدالة
    >
      <span className="day-number">{day}</span>
      {vaccineName && <span className="vaccine-name">{vaccineName}</span>}
    </div>
  );
};

export default DayCell;
