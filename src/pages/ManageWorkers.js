import React, { useState } from "react";
import "../styles/ManageWorkers.css"; // استيراد ملف التصميم

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([
    { id: 1, name: "د. أحمد", email: "ahmed@example.com" },
    { id: 2, name: "د. سارة", email: "sara@example.com" },
  ]);

  const addWorker = () => {
    const name = prompt("أدخل اسم العامل الصحي:");
    const email = prompt("أدخل البريد الإلكتروني للعامل الصحي:");
    if (name && email) {
      setWorkers([...workers, { id: workers.length + 1, name, email }]);
    }
  };

  const removeWorker = (id) => {
    setWorkers(workers.filter((worker) => worker.id !== id));
  };

  return (
    <div className="manage-container" dir="rtl">
      <h1>إدارة العاملين الصحيين</h1>
      <button onClick={addWorker} className="btn-add">
        + إضافة عامل صحي
      </button>
      <div className="worker-list">
        {workers.map((worker) => (
          <div key={worker.id} className="worker-card">
            <h3>{worker.name}</h3>
            <p>{worker.email}</p>
            <button
              onClick={() => removeWorker(worker.id)}
              className="btn-remove"
            >
              إزالة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageWorkers;
