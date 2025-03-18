import React, { useState } from "react";
import "../styles/SearchChildByID.css"; // تأكد من وجود ملف CSS مناسب

// بيانات تجريبية للأطفال (يتم استبدالها ببيانات من قاعدة البيانات لاحقًا)
const mockChildrenData = [
  {
    id: "123456",
    name: "علي أحمد",
    dob: "2020-05-15",
    gender: "ذكر",
    weight: "12 كجم",
    height: "90 سم",
    bloodType: "O+",
    vaccinations: [
      { name: "شلل الأطفال", date: "2024-04-15", status: "مكتمل" },
      { name: "التهاب الكبد B", date: "2023-05-20", status: "فائت" },
    ],
  },
  {
    id: "654321",
    name: "سارة محمد",
    dob: "2019-08-22",
    gender: "أنثى",
    weight: "14 كجم",
    height: "95 سم",
    bloodType: "A+",
    vaccinations: [
      {
        name: "الحصبة والنكاف والحصبة الألمانية",
        date: "2024-06-10",
        status: "مكتمل",
      },
      {
        name: "الدفتيريا والتيتانوس والسعال الديكي",
        date: "2024-05-05",
        status: "قادم",
      },
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
      setError("لم يتم العثور على الطفل. يرجى التحقق من رقم الهوية.");
    }
  };

  return (
    <div className="search-child-container" dir="rtl">
      <h2>البحث عن طفل بواسطة رقم الهوية</h2>
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
            <strong>الوزن:</strong> {childData.weight}
          </p>
          <p>
            <strong>الطول:</strong> {childData.height}
          </p>
          <p>
            <strong>فصيلة الدم:</strong> {childData.bloodType}
          </p>

          <h3>سجل التطعيمات</h3>
          <div className="vaccination-list">
            {childData.vaccinations.map((vaccine, index) => (
              <div
                key={index}
                className={`vaccination-card ${vaccine.status.toLowerCase()}`}
              >
                <p>
                  <strong>{vaccine.name}</strong>
                </p>
                <p>التاريخ: {vaccine.date}</p>
                <p>
                  الحالة: <span className="status">{vaccine.status}</span>
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
