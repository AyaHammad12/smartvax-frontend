import { useParams } from "react-router-dom";

const HWAppointmentScheduling = () => {
  const { day } = useParams();

  console.log("Received Day:", day);

  return (
    <div>
      <h1>Schedule Appointments for Day {day}</h1>
    </div>
  );
};

export default HWAppointmentScheduling;
