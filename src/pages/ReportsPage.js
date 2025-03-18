import React from "react";
import "../styles/ReportsPage.css";

const ReportsPage = () => {
  return (
    <div className="reports-container">
      <h1>System Reports</h1>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Health Workers</td>
            <td>10</td>
            <td>+5%</td>
          </tr>
          <tr>
            <td>Total Appointments</td>
            <td>200</td>
            <td>-2%</td>
          </tr>
          <tr>
            <td>Cancelled Appointments</td>
            <td>15</td>
            <td>+1%</td>
          </tr>
          <tr>
            <td>Positive Feedback</td>
            <td>90%</td>
            <td>+3%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;
