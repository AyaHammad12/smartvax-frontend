// ... (محتوى ملف SearchChildByID.jsx هو نفسه بدون تغيير)
import React, { useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaWeight,
  FaRulerVertical,
  FaHome,
  FaPhoneAlt,
  FaUserCircle,
  FaShieldAlt,
  FaTimesCircle,
  FaClock,
  FaInfoCircle
} from "react-icons/fa";
import "../styles/SearchChildByID.css";

const iconMap = {
  completed: <FaShieldAlt className="text-green-500 inline ml-2" size={20} />,
  missed: <FaTimesCircle className="text-red-500 inline ml-2" size={20} />,
  upcoming: <FaClock className="text-blue-500 inline ml-2" size={20} />,
};

const genderIcon = (gender) =>
    gender === "ذكر" ? (
        <FaUser className="text-blue-500 inline ml-2" size={18} />
    ) : (
        <FaVenusMars className="text-pink-500 inline ml-2" size={18} />
    );

const SearchChildByID = () => {
  const [searchID, setSearchID] = useState("");
  const [childData, setChildData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setChildData(null);
    if (!searchID.trim()) {
      setError("يرجى إدخال رقم الهوية للبحث.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/children/profile/${searchID.trim()}`);
      setChildData(response.data);
    } catch (err) {
      console.error("Search error:", err);
      if (err.response && err.response.status === 404) {
        setError("لم يتم العثور على طفل بهذا الرقم. يرجى التحقق من الهوية.");
      } else {
        setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى لاحقاً.");
      }
    }
  };

  return (
      <div className="search-child-page-container" dir="rtl">
        <div className="search-child-main-card">
          <h2 className="main-title">
            <FaUserCircle size={32} className="main-title-icon" />
            البحث عن طفل بواسطة رقم الهوية
          </h2>

          <div className="search-input-group">
            <input
                type="text"
                placeholder="أدخل رقم هوية الطفل..."
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
                className="search-input-field"
            />
            <button
                onClick={handleSearch}
                className="search-button"
            >
              <FaSearch size={20} /> بحث
            </button>
          </div>

          {error && (
              <p className="error-message">
                <FaInfoCircle className="error-icon" /> {error}
              </p>
          )}

          {childData && (
              <div className="child-data-section">
                <h3 className="section-title">
                  <FaUser className="section-title-icon" /> معلومات الطفل
                </h3>
                <div className="child-details-grid">
                  <p><FaUser className="inline-icon" /> <strong>الاسم:</strong> {childData.name}</p>
                  <p><FaBirthdayCake className="inline-icon" /> <strong>تاريخ الميلاد:</strong> {childData.dob}</p>
                  <p>{genderIcon(childData.gender)} <strong>الجنس:</strong> {childData.gender}</p>
                  <p><FaWeight className="inline-icon" /> <strong>الوزن:</strong> {childData.weight} كجم</p>
                  <p><FaRulerVertical className="inline-icon" /> <strong>الطول:</strong> {childData.height} سم</p>
                  <p><FaHome className="inline-icon" /> <strong>المركز الصحي:</strong> {childData.address}</p>
                  <p><FaUserCircle className="inline-icon" /> <strong>اسم ولي الأمر:</strong> {childData.parentName}</p>
                  <p><FaPhoneAlt className="inline-icon" /> <strong>رقم الهاتف:</strong> {childData.phone}</p>
                </div>

                <h3 className="section-title mt-6">
                  <FaShieldAlt className="section-title-icon" /> سجل التطعيمات
                </h3>
                <div className="vaccination-history-list">
                  {childData.vaccinations?.length > 0 ? (
                      childData.vaccinations.map((vaccine, idx) => (
                          <div
                              key={idx}
                              className={`vaccination-entry-card ${
                                  vaccine.status?.toLowerCase() === "completed"
                                      ? "border-green-500"
                                      : vaccine.status?.toLowerCase() === "missed"
                                          ? "border-red-500"
                                          : "border-blue-500"
                              }`}
                          >
                            <div className="flex items-center gap-2 mb-2 md:mb-0">
                              {iconMap[vaccine.status?.toLowerCase()]}
                              <span className="font-semibold text-gray-800">
                                <strong>اسم التطعيم:</strong> {vaccine.vaccination?.name}
                              </span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 text-sm text-gray-600">
                              <span>
                                <strong>التاريخ:</strong> {vaccine.scheduledDate}
                              </span>
                              <span>
                                <strong>الحالة:</strong>
                                <span className={`font-bold mr-1 ${
                                    vaccine.status === "completed"
                                        ? "text-green-600"
                                        : vaccine.status === "missed"
                                            ? "text-red-600"
                                            : "text-blue-600"
                                }`}>
                                  {vaccine.status === "completed"
                                      ? "تم"
                                      : vaccine.status === "missed"
                                          ? "مفقود"
                                          : "قادم"}
                                </span>
                              </span>
                            </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-gray-500 text-center py-4">لا يوجد سجل تطعيمات لعرضه.</p>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default SearchChildByID;