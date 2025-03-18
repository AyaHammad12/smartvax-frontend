import { useParams } from "react-router-dom";

const HWAppointmentScheduling = () => {
  const { day } = useParams();

  console.log("اليوم المحدد:", day);

  return (
    <div>
      <h1>جدولة المواعيد لليوم {day}</h1>
    </div>
  );
};

export default HWAppointmentScheduling;
