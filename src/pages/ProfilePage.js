import React, { useState } from "react";
import "../styles/ProfilePage.css"; // تأكد من وجود ملف CSS للتنسيق

const ProfilePage = () => {
  // بيانات الطفل الأساسية (لا يمكن تعديل الاسم، رقم الهوية، تاريخ الميلاد، والجنس)
  const [childProfile, setChildProfile] = useState({
    name: "Ali Ahmed",
    id: "CHD123456",
    dob: "2020-05-15",
    gender: "Male",
    weight: "12 kg",
    height: "90 cm",
    parentName: "Ahmed Hassan",
    phone: "+123456789",
    address: "123 Main St, City",
  });

  // بيانات السجل الصحي (قابلة للتعديل)
  const [healthRecord, setHealthRecord] = useState({
    sensitivity_to_anything: "None",
    diabetes: "No",
    high_blood_pressure: "No",
    genetic_diseases: "None",
    blood_type: "O+",
  });

  // تحديث الحقول القابلة للتعديل
  const handleProfileChange = (e) => {
    setChildProfile({ ...childProfile, [e.target.name]: e.target.value });
  };

  const handleHealthRecordChange = (e) => {
    setHealthRecord({ ...healthRecord, [e.target.name]: e.target.value });
  };

  // حفظ التعديلات (يمكن ربطه بـ API لاحقًا)
  const handleSaveChanges = () => {
    alert("Profile updated successfully!");
    console.log("Updated Profile:", childProfile);
    console.log("Updated Health Record:", healthRecord);
  };

  return (
    <div className="profile-container">
      <h2>Child Profile</h2>
      <div className="profile-card">
        <p>
          <strong>Child Name:</strong> {childProfile.name}
        </p>
        <p>
          <strong>Child ID:</strong> {childProfile.id}
        </p>
        <p>
          <strong>Date of Birth:</strong> {childProfile.dob}
        </p>
        <p>
          <strong>Gender:</strong> {childProfile.gender}
        </p>

        <label>Weight (kg):</label>
        <input
          type="text"
          name="weight"
          value={childProfile.weight}
          onChange={handleProfileChange}
        />

        <label>Height (cm):</label>
        <input
          type="text"
          name="height"
          value={childProfile.height}
          onChange={handleProfileChange}
        />

        <label>Parent Name:</label>
        <input
          type="text"
          name="parentName"
          value={childProfile.parentName}
          onChange={handleProfileChange}
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={childProfile.phone}
          onChange={handleProfileChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={childProfile.address}
          onChange={handleProfileChange}
        />
      </div>

      <h2>Health Record</h2>
      <div className="profile-card">
        <label>Sensitivity to Anything:</label>
        <input
          type="text"
          name="sensitivity_to_anything"
          value={healthRecord.sensitivity_to_anything}
          onChange={handleHealthRecordChange}
        />

        <label>Diabetes:</label>
        <select
          name="diabetes"
          value={healthRecord.diabetes}
          onChange={handleHealthRecordChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>High Blood Pressure:</label>
        <select
          name="high_blood_pressure"
          value={healthRecord.high_blood_pressure}
          onChange={handleHealthRecordChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Genetic Diseases:</label>
        <input
          type="text"
          name="genetic_diseases"
          value={healthRecord.genetic_diseases}
          onChange={handleHealthRecordChange}
        />

        <label>Blood Type:</label>
        <select
          name="blood_type"
          value={healthRecord.blood_type}
          onChange={handleHealthRecordChange}
        >
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <button className="save-btn" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePage;
