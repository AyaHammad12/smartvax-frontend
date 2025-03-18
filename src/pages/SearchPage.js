import React, { useState } from "react";
import "../styles/SearchPage.css"; // تأكد من أن ملف الـ CSS موجود ومهيأ

// بيانات تطعيمات تجريبية (يمكن استبدالها ببيانات حقيقية من API)
const mockVaccines = [
  {
    id: 1,
    name: "Polio",
    age: "2 months",
    description: "Polio vaccine for infants",
  },
  {
    id: 2,
    name: "MMR",
    age: "12 months",
    description: "Measles, Mumps, and Rubella vaccine",
  },
  {
    id: 3,
    name: "Hepatitis B",
    age: "At birth",
    description: "Protects against Hepatitis B",
  },
  {
    id: 4,
    name: "DTP",
    age: "6 weeks",
    description: "Diphtheria, Tetanus, and Pertussis vaccine",
  },
  {
    id: 5,
    name: "Rotavirus",
    age: "2 months",
    description: "Protects against Rotavirus infection",
  },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // لحفظ قيمة البحث
  const [filteredVaccines, setFilteredVaccines] = useState(mockVaccines); // لحفظ النتائج

  // دالة البحث عن التطعيمات
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase(); // تحويل البحث لحروف صغيرة لتجنب الحساسية للحروف الكبيرة والصغيرة
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredVaccines(mockVaccines); // إرجاع جميع اللقاحات إذا لم يتم إدخال نص
    } else {
      const results = mockVaccines.filter((vaccine) =>
        vaccine.name.toLowerCase().includes(query)
      );
      setFilteredVaccines(results);
    }
  };

  return (
    <div className="search-container">
      <h2>Search for a Vaccine</h2>
      <input
        type="text"
        placeholder="Enter vaccine name..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="results-container">
        {filteredVaccines.length > 0 ? (
          filteredVaccines.map((vaccine) => (
            <div key={vaccine.id} className="vaccine-card">
              <h3>{vaccine.name}</h3>
              <p>
                <strong>Recommended Age:</strong> {vaccine.age}
              </p>
              <p>{vaccine.description}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No vaccines found for "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
