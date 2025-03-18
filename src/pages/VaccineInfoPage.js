import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/VaccineInfoPage.css";

const VaccineInfoPage = () => {
  const { vaccineName } = useParams();
  const navigate = useNavigate();

  // تنظيف اسم اللقاح
  const cleanVaccineName = vaccineName.split("/")[0];

  const vaccineData = {
    HepB: {
      name: "Hepatitis B Vaccine",
      age: "At birth, 1 month, 6 months",
      purpose: "Prevention of Hepatitis B infection.",
      description:
        "Protects against hepatitis B virus, which affects the liver.",
      sideEffects: "Pain at injection site, mild fever.",
      treatment: "Apply cold compress and use fever reducer if needed.",
    },
    Polio: {
      name: "Polio Vaccine",
      age: "5 months",
      purpose: "Prevention of polio disease.",
      description: "A vaccine administered in 3 consecutive doses.",
      sideEffects: "Mild fever, pain at the injection site.",
      treatment: "Apply cold compress and use fever reducer if needed.",
    },
    MMR: {
      name: "MMR Vaccine",
      age: "12-15 months, booster at 4-6 years",
      purpose: "Protection against measles, mumps, and rubella.",
      description: "Protects against three serious diseases in one shot.",
      sideEffects: "Mild rash, fever, joint pain.",
      treatment: "Monitor for fever and apply cooling compress if needed.",
    },
  };

  const vaccine = vaccineData[cleanVaccineName] || null;

  return (
    <div className="vaccine-info-container">
      {vaccine ? (
        <>
          <h1 className="vaccine-title">Vaccine Information</h1>
          <div className="vaccine-card">
            <div className="vaccine-details">
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>Vaccine Name:</strong> <span>{vaccine.name}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>Age:</strong> <span>{vaccine.age}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>Purpose:</strong> <span>{vaccine.purpose}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>Description:</strong> <span>{vaccine.description}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>Side Effects:</strong>{" "}
                <span>{vaccine.sideEffects}</span>
              </div>
              <div className="vaccine-row">
                <FaCheckCircle className="vaccine-icon" />
                <strong>Treatments:</strong> <span>{vaccine.treatment}</span>
              </div>
            </div>
          </div>

          <button
            className="vaccine-button"
            onClick={() =>
              navigate(`/vaccine-appointments?vaccine=${cleanVaccineName}`)
            }
          >
            Book Appointment
          </button>
          <button
            className="vaccine-button review"
            onClick={() => {
              console.log(
                "Navigating to reviews page for vaccine:",
                cleanVaccineName
              );
              navigate(`/reviews/${encodeURIComponent(cleanVaccineName)}`);
            }}
          >
            View Reviews & Feedback
          </button>

          {/* <button
            className="vaccine-button review"
            onClick={() => {
              console.log(
                "Navigating to reviews page for vaccine:",
                vaccine.name
              );
              navigate(`/reviews/${vaccine.name}`);
            }}
          >
            View Reviews & Feedback
          </button> */}
        </>
      ) : (
        <h2>Vaccine information not available.</h2>
      )}
    </div>
  );
};

export default VaccineInfoPage;
