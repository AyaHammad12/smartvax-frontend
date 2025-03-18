import React, { useState } from "react";
import "../styles/ManageWorkers.css"; // استيراد ملف التصميم
// import "../styles/HomePage.css";
const ManageWorkers = () => {
  const [workers, setWorkers] = useState([
    { id: 1, name: "Dr. Ahmed", email: "ahmed@example.com" },
    { id: 2, name: "Dr. Sara", email: "sara@example.com" },
  ]);

  const addWorker = () => {
    const name = prompt("Enter Health Worker Name:");
    const email = prompt("Enter Health Worker Email:");
    if (name && email) {
      setWorkers([...workers, { id: workers.length + 1, name, email }]);
    }
  };

  const removeWorker = (id) => {
    setWorkers(workers.filter((worker) => worker.id !== id));
  };

  return (
    <div className="manage-container">
      <h1>Manage Health Workers</h1>
      <button onClick={addWorker} className="btn-add">
        + Add Health Worker
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
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageWorkers;
