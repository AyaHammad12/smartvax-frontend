import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const navigate = useNavigate();

  // 📡 جلب بيانات التطعيمات
  const fetchVaccines = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/vaccinations", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("فشل في تحميل بيانات اللقاحات");
      }

      const data = await response.json();
      setVaccines(data);
      setFilteredVaccines(data);
    } catch (error) {
      console.error("❌ خطأ أثناء تحميل اللقاحات:", error);
    }
  };

  // 📦 عند تحميل الصفحة
  useEffect(() => {
    fetchVaccines();
  }, []);

  // 🔍 فلترة البحث
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredVaccines(vaccines);
    } else {
      const results = vaccines.filter((vaccine) =>
        vaccine.name.toLowerCase().includes(query)
      );
      setFilteredVaccines(results);
    }
  };

  return (
    <div className="search-container" dir="rtl">
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
              <h3
                className="clickable-title"
                onClick={() => navigate(`/search-vaccine-info/${vaccine.id}`)}
                // /search-vaccine-info/:id
              >
                {vaccine.name}
              </h3>
              <p>
                <strong>النوع:</strong> {vaccine.vaccineTypeName || "غير معروف"}
              </p>
              <p>
                <strong>العمر المستهدف:</strong> {vaccine.targetAgeDays} يوم
              </p>
              <p>
                <strong>طريقة الإعطاء:</strong>{" "}
                {vaccine.routeOfAdministration || "غير متوفر"}
              </p>
              <p>
                <strong>الأعراض الجانبية:</strong>{" "}
                {vaccine.sideEffects || "غير متوفرة"}
              </p>
            </div>
          ))
        ) : (
          <p className="no-results">
            {searchQuery
              ? `لم يتم العثور على لقاحات باسم "${searchQuery}"`
              : "لا توجد لقاحات حاليًا"}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
