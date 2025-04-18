import React, { useState, useEffect } from "react";
import "../styles/SearchPage.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vaccines, setVaccines] = useState([]); // حفظ جميع اللقاحات الأصلية
  const [filteredVaccines, setFilteredVaccines] = useState([]); // حفظ النتائج بعد البحث

  // 📡 دالة لجلب اللقاحات من السيرفر
  const fetchVaccines = async () => {
    try {
      const token = localStorage.getItem('token'); // احضار التوكن من التخزين

      const response = await fetch("http://localhost:8080/api/vaccinations", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل بيانات اللقاحات');
      }

      const data = await response.json();
      setVaccines(data); // حفظ كل اللقاحات
      setFilteredVaccines(data); // مبدئيًا عرض كل اللقاحات
    } catch (error) {
      console.error('❌ خطأ أثناء تحميل اللقاحات:', error);
    }
  };

  // 📦 تحميل اللقاحات عند تحميل الصفحة
  useEffect(() => {
    fetchVaccines();
  }, []);

  // 🔍 دالة البحث
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredVaccines(vaccines); // إذا البحث فارغ، عرض الكل
    } else {
      const results = vaccines.filter((vaccine) =>
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
                      <strong>العمر الموصى به:</strong> {vaccine.targetAge}
                    </p>
                    <p>asma</p>
                    <p>{vaccine.sideEffects}</p>
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
