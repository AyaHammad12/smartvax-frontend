import React, { useState } from "react";
import "../styles/BookAppointmentPage.css";

const BookAppointmentPage = () => {
  const [date, setDate] = useState("");
  const [center, setCenter] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();
    console.log(`Appointment booked at ${center} on ${date}`);
  };

  return (
    <div className="appointment-container">
      <h2>Book a Vaccination Appointment</h2>
      <form onSubmit={handleBooking} className="appointment-form">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Vaccination Center:</label>
        <select
          value={center}
          onChange={(e) => setCenter(e.target.value)}
          required
        >
          <option value="">Select a center</option>
          <option value="Center A">Center A</option>
          <option value="Center B">Center B</option>
        </select>

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
