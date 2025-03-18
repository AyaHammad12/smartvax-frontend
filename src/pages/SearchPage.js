import React, { useState } from "react";
import "../styles/SearchPage.css"; // تأكد من أن ملف الـ CSS موجود ومهيأ

// بيانات تجريبية للتطعيمات (يمكن استبدالها ببيانات حقيقية من API)
const mockVaccines = [
  {
    id: 1,
    name: "شلل الأطفال",
    age: "عمر شهرين",
    description: "لقاح شلل الأطفال للرضع",
  },
  {
    id: 2,
    name: "الحصبة والنكاف والحصبة الألمانية",
    age: "عمر 12 شهرًا",
    description: "لقاح الحصبة، النكاف، والحصبة الألمانية",
  },
  {
    id: 3,
    name: "التهاب الكبد B",
    age: "عند الولادة",
    description: "يحمي من التهاب الكبد B",
  },
  {
    id: 4,
    name: "الدفتيريا والتيتانوس والسعال الديكي",
    age: "عمر 6 أسابيع",
    description: "لقاح ضد الدفتيريا والتيتانوس والسعال الديكي",
  },
  {
    id: 5,
    name: "فيروس الروتا",
    age: "عمر شهرين",
    description: "يحمي من فيروس الروتا",
  },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // لحفظ قيمة البحث
  const [filteredVaccines, setFilteredVaccines] = useState(mockVaccines); // لحفظ النتائج

  // دالة البحث عن التطعيمات
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase(); // تحويل البحث لحروف صغيرة لتجنب الحساسية لحالة الأحرف
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
      <h2>البحث عن لقاح</h2>
      <input
        type="text"
        placeholder="أدخل اسم اللقاح..."
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
                <strong>العمر الموصى به:</strong> {vaccine.age}
              </p>
              <p>{vaccine.description}</p>
            </div>
          ))
        ) : (
          <p className="no-results">
            لم يتم العثور على لقاحات باسم "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
