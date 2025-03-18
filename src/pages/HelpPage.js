import React from "react";
import "../styles/HelpPage.css"; // تأكد من وجود ملف CSS مناسب

const HelpPage = () => {
  return (
    <div className="help-container">
      <h2>Help & Support</h2>
      <p>Find answers to common questions and learn how to use SmartVax.</p>

      <div className="faq-section">
        <h3>Frequently Asked Questions (FAQs)</h3>
        <details>
          <summary>How do I book a vaccination appointment?</summary>
          <p>
            To book an appointment, go to the "Parent Appointment" page, select
            the desired date and vaccination, and confirm your booking.
          </p>
        </details>

        <details>
          <summary>How can I search for a specific vaccination?</summary>
          <p>
            Use the "Search Vax" feature in the navigation menu to find detailed
            information about any vaccine.
          </p>
        </details>

        <details>
          <summary>How do I update my account details?</summary>
          <p>
            Navigate to the "Account" page where you can update your email,
            phone number, and address. Username and role cannot be changed.
          </p>
        </details>

        <details>
          <summary>
            What should I do if I missed a scheduled vaccination?
          </summary>
          <p>
            If you missed a vaccination, go to the "Scheduled Vax" page and
            check the missed status. Contact your healthcare provider for
            rescheduling.
          </p>
        </details>

        <details>
          <summary>How can I contact support?</summary>
          <p>
            You can reach our support team via email at support@smartvax.com or
            call our helpline at +123456789.
          </p>
        </details>
      </div>

      <h3>Need More Help?</h3>
      <p>
        If you need further assistance, feel free to contact our support team.
      </p>
      <button className="contact-btn">Contact Support</button>
    </div>
  );
};

export default HelpPage;
