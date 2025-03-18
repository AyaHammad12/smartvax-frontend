import React, { useState } from "react";
import "../styles/SearchChildByID.css"; // تأكد من وجود ملف CSS مناسب

// بيانات تجريبية للأطفال (يتم استبدالها ببيانات من قاعدة البيانات لاحقًا)
const mockChildrenData = [
  {
    id: "123456",
    name: "Ali Ahmed",
    dob: "2020-05-15",
    gender: "Male",
    weight: "12 kg",
    height: "90 cm",
    bloodType: "O+",
    vaccinations: [
      { name: "Polio", date: "2024-04-15", status: "Completed" },
      { name: "Hepatitis B", date: "2023-05-20", status: "Missed" },
    ],
  },
  {
    id: "654321",
    name: "Sara Mohammed",
    dob: "2019-08-22",
    gender: "Female",
    weight: "14 kg",
    height: "95 cm",
    bloodType: "A+",
    vaccinations: [
      { name: "MMR", date: "2024-06-10", status: "Completed" },
      { name: "DTP", date: "2024-05-05", status: "Upcoming" },
    ],
  },
];

const SearchChildByID = () => {
  const [searchID, setSearchID] = useState("");
  const [childData, setChildData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const foundChild = mockChildrenData.find(
      (child) => child.id === searchID.trim()
    );

    if (foundChild) {
      setChildData(foundChild);
      setError("");
    } else {
      setChildData(null);
      setError("Child not found. Please check the ID.");
    }
  };

  return (
    <div className="search-child-container">
      <h2>Search Child by ID</h2>
      <input
        type="text"
        placeholder="Enter Child ID..."
        value={searchID}
        onChange={(e) => setSearchID(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-btn">
        Search
      </button>

      {error && <p className="error-message">{error}</p>}

      {childData && (
        <div className="child-info">
          <h3>Child Information</h3>
          <p>
            <strong>Name:</strong> {childData.name}
          </p>
          <p>
            <strong>Date of Birth:</strong> {childData.dob}
          </p>
          <p>
            <strong>Gender:</strong> {childData.gender}
          </p>
          <p>
            <strong>Weight:</strong> {childData.weight}
          </p>
          <p>
            <strong>Height:</strong> {childData.height}
          </p>
          <p>
            <strong>Blood Type:</strong> {childData.bloodType}
          </p>

          <h3>Vaccination History</h3>
          <div className="vaccination-list">
            {childData.vaccinations.map((vaccine, index) => (
              <div
                key={index}
                className={`vaccination-card ${vaccine.status.toLowerCase()}`}
              >
                <p>
                  <strong>{vaccine.name}</strong>
                </p>
                <p>Date: {vaccine.date}</p>
                <p>
                  Status: <span className="status">{vaccine.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchChildByID;
