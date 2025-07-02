import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faUserCircle, // This is intentionally commented out/removed
  faIdCard,
  faCalendarAlt,
  faVenusMars,
  faWeight,
  faRulerVertical,
  faUserShield,
  faPhone,
  faMapMarkerAlt,
  faSave,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const [childProfile, setChildProfile] = useState({
    name: "",
    id: "",
    dob: "",
    gender: "",
    weight: "",
    height: "",
    parentName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/child-profile", {
      method: "GET",
      credentials: "include",
    })
        .then((res) => {
          if (!res.ok) throw new Error("فشل في تحميل الملف الشخصي");
          return res.json();
        })
        .then((data) => {
          setChildProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ خطأ في تحميل الملف الشخصي", err);
          setMessage({
            type: "error",
            text: "فشل في تحميل الملف الشخصي. يرجى المحاولة مرة أخرى.",
          });
          setLoading(false);
        });
  }, []);

  const handleProfileChange = (e) => {
    setChildProfile({ ...childProfile, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setMessage(null);

    const updateDto = {
      id: childProfile.id,
      weight: parseFloat(childProfile.weight) || 0,
      height: parseFloat(childProfile.height) || 0,
    };

    try {
      const res = await fetch("http://localhost:8080/api/update-child-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateDto),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "فشل في حفظ التغييرات");
      }

      const successMessage = await res.text();
      setMessage({ type: "success", text: successMessage || "تم حفظ التعديلات بنجاح!" });
    } catch (err) {
      console.error("❌ خطأ في حفظ الملف الشخصي", err);
      setMessage({ type: "error", text: err.message || "فشل في حفظ التغييرات" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#007bff" />
          <p>...جاري تحميل البيانات</p>
        </div>
    );
  }

  return (
      <div className="profile-container" dir="rtl">
        <div className="profile-header">
          <h2>الملف الشخصي للطفل</h2>
          <p className="profile-subtitle">إدارة بيانات طفلك وتحديثها بسهولة. يمكنك تحديث **الطول والوزن** فقط.</p>
        </div>

        {message && (
            <div className={`message-banner ${message.type}`}>
              {message.text}
            </div>
        )}

        {/* Flex container for the two cards */}
        <div className="cards-wrapper">
          {/* Card for Child Data */}
          <div className="profile-card child-data-card">
            <div className="profile-section-title">
              {/* Removed faUserCircle from here */}
              <h3>بيانات الطفل</h3>
            </div>
            <div className="profile-grid">
              <div className="profile-item">
                <label>
                  {/* Removed faUserCircle from here */}
                  اسم الطفل:
                </label>
                <p>{childProfile.name}</p>
              </div>
              <div className="profile-item">
                <label>
                  <FontAwesomeIcon icon={faIdCard} /> رقم الهوية:
                </label>
                <p>{childProfile.id}</p>
              </div>
              <div className="profile-item">
                <label>
                  <FontAwesomeIcon icon={faCalendarAlt} /> تاريخ الميلاد:
                </label>
                <p>{childProfile.dob}</p>
              </div>
              <div className="profile-item">
                <label>
                  <FontAwesomeIcon icon={faVenusMars} /> الجنس:
                </label>
                <p>{childProfile.gender}</p>
              </div>

              <div className="profile-item editable">
                <label htmlFor="weight">
                  <FontAwesomeIcon icon={faWeight} /> الوزن (كجم):
                </label>
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={childProfile.weight}
                    onChange={handleProfileChange}
                    placeholder="أدخل الوزن"
                />
              </div>

              <div className="profile-item editable">
                <label htmlFor="height">
                  <FontAwesomeIcon icon={faRulerVertical} /> الطول (سم):
                </label>
                <input
                    type="number"
                    id="height"
                    name="height"
                    value={childProfile.height}
                    onChange={handleProfileChange}
                    placeholder="أدخل الطول"
                />
              </div>
            </div>
          </div>

          {/* Card for Parent Data */}
          <div className="profile-card parent-data-card">
            <div className="profile-section-title">
              <h3><FontAwesomeIcon icon={faUserShield} /> بيانات ولي الأمر</h3>
            </div>
            <div className="profile-grid">
              <div className="profile-item">
                <label>
                  <FontAwesomeIcon icon={faUserShield} /> اسم ولي الأمر:
                </label>
                <input
                    type="text"
                    name="parentName"
                    value={childProfile.parentName}
                    disabled
                    className="disabled-input"
                />
              </div>
              <div className="profile-item">
                <label>
                  <FontAwesomeIcon icon={faPhone} /> رقم الهاتف:
                </label>
                <input
                    type="text"
                    name="phone"
                    value={childProfile.phone}
                    disabled
                    className="disabled-input"
                />
              </div>
              <div className="profile-item full-width">
                <label>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> العنوان:
                </label>
                <input
                    type="text"
                    name="address"
                    value={childProfile.address}
                    disabled
                    className="disabled-input"
                />
              </div>
            </div>
          </div>
        </div> {/* End of cards-wrapper */}

        <button className="save-btn" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> جاري الحفظ...
              </>
          ) : (
              <>
                <FontAwesomeIcon icon={faSave} /> حفظ التعديلات
              </>
          )}
        </button>
      </div>
  );
};

export default ProfilePage;