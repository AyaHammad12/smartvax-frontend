import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";
import {
  FaSyringe,
  FaChild,
  FaCalendarDay,
  FaNotesMedical,
  FaSearch,
  FaHeartbeat,
  FaExclamationTriangle,
} from "react-icons/fa";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const navigate = useNavigate();

  // جلب بيانات التطعيمات
  const fetchVaccines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/vaccinations", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("فشل في تحميل بيانات اللقاحات");
      const data = await response.json();
      setVaccines(data);
      setFilteredVaccines(data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      setVaccines([]);
      setFilteredVaccines([]);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  // فلترة حسب البحث
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
        {/* عنوان واضح وكبير */}
        <h2 className="main-title">
          <FaHeartbeat className="main-icon" />
          التطعيمات الأساسية لطفلك من
          <span className="highlight-age">عمر يوم واحد</span>
          حتى
          <span className="highlight-age">15 سنة</span>
        </h2>
        <p className="main-subtitle">
          ابحث عن معلومات حول التطعيمات المتوفرة، الأنواع، الأعمار المستهدفة، طرق
          الإعطاء، والأعراض الجانبية، لتضمن صحة أفضل لطفلك.
        </p>
        {/* سيرش بار مميز */}
        <div className="search-bar-wrap">
          <FaSearch className="search-icon" />
          <input
              type="text"
              placeholder="ابحث باسم اللقاح (مثال: الحصبة، شلل الأطفال)..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input special-search"
          />
        </div>
        <div className="results-container">
          {filteredVaccines.length > 0 ? (
              filteredVaccines.map((vaccine) => (
                  <div key={vaccine.id} className="vaccine-card modern-card">
                    <h3
                        className="clickable-title"
                        onClick={() => navigate(`/search-vaccine-info/${vaccine.id}`)}
                        title="معلومات تفصيلية"
                    >
                      {/* تم تبديل الترتيب: الأيقونة أولاً ثم اسم اللقاح */}
                      <FaSyringe className="icon-title vaccine" /> {vaccine.name}
                    </h3>
                    <div className="card-row">
                      <FaChild className="icon-detail age" />
                      <span>
                  <strong>العمر:</strong> {vaccine.targetAgeDays} يوم
                </span>
                    </div>
                    <div className="card-row">
                      <FaCalendarDay className="icon-detail type" />
                      <span>
                  <strong>النوع:</strong>{" "}
                        {vaccine.vaccineTypeName || "غير معروف"}
                </span>
                    </div>
                    <div className="card-row">
                      <FaNotesMedical className="icon-detail route" />
                      <span>
                  <strong>طريقة الإعطاء:</strong>{" "}
                        {vaccine.routeOfAdministration || "غير متوفرة"}
                </span>
                    </div>
                    <div className="card-row">
                      <FaExclamationTriangle className="icon-detail side-effect" />
                      <span>
                  <strong>الأعراض الجانبية:</strong>{" "}
                        {vaccine.sideEffects || "غير متوفرة"}
                </span>
                    </div>
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