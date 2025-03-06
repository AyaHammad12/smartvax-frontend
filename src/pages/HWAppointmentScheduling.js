import React from "react";
import { useParams } from "react-router-dom";

const HWAppointmentScheduling = () => {
  const { day } = useParams(); // استلام اليوم من الرابط

  return (
    <div>
      <h1>Appointment Scheduling for {day}</h1>
      {/* هنا يمكنك إضافة المواعيد الخاصة بهذا اليوم */}
    </div>
  );
};

export default HWAppointmentScheduling;
