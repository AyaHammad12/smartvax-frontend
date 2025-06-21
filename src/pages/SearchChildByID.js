import React, { useState } from "react";
import axios from "axios";
import "../styles/SearchChildByID.css";

const SearchChildByID = () => {
  const [searchID, setSearchID] = useState("");
  const [childData, setChildData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchID.trim()) {
      setError("يرجى إدخال رقم الهوية.");
      return;
    }

    try {
      const response = await axios.get(
        `/api/children/profile/${searchID.trim()}`
      );
      setChildData(response.data);
      setError("");
    } catch (err) {
      setChildData(null);
      setError("لم يتم العثور على الطفل. يرجى التحقق من رقم الهوية.");
    }
  };

  return (
    <div className="search-child-container" dir="rtl">
      <h2>البحث عن طفل بواسطة رقم الهوية</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="أدخل رقم هوية الطفل..."
          value={searchID}
          onChange={(e) => setSearchID(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          بحث
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {childData && (
        <div className="child-info">
          <h3>معلومات الطفل</h3>
          <p>
            <strong>الاسم:</strong> {childData.name}
          </p>
          <p>
            <strong>تاريخ الميلاد:</strong> {childData.dob}
          </p>
          <p>
            <strong>الجنس:</strong> {childData.gender}
          </p>
          <p>
            <strong>الوزن:</strong> {childData.weight} كجم
          </p>
          <p>
            <strong>الطول:</strong> {childData.height} سم
          </p>
          <p>
            <strong>المركز الصحي:</strong> {childData.address}
          </p>
          <p>
            <strong>اسم ولي الأمر:</strong> {childData.parentName}
          </p>
          <p>
            <strong>رقم الهاتف:</strong> {childData.phone}
          </p>

          <h3>سجل التطعيمات</h3>
          <div className="vaccination-list">
            {childData.vaccinations?.length > 0 ? (
              childData.vaccinations.map((vaccine, index) => (
                <div
                  key={index}
                  className={`vaccination-card ${vaccine.status?.toLowerCase()}`}
                >
                  <p>
                    <strong>اسم التطعيم:</strong> {vaccine.vaccination?.name}
                  </p>
                  <p>
                    <strong>التاريخ:</strong> {vaccine.scheduledDate}
                  </p>
                  <p>
                    <strong>الحالة:</strong>{" "}
                    <span className="status">{vaccine.status}</span>
                  </p>
                </div>
              ))
            ) : (
              <p>لا يوجد سجل تطعيمات.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchChildByID;
