import React from "react";
import "../styles/ReportsPage.css";

const ReportsPage = () => {
  return (
    <div className="reports-container" dir="rtl">
      <h1>التقارير النظامية</h1>
      <table className="reports-table">
        <thead>
          <tr>
            <th>الفئة</th>
            <th>العدد</th>
            <th>التغيير (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>إجمالي العاملين الصحيين</td>
            <td>10</td>
            <td>+5%</td>
          </tr>
          <tr>
            <td>إجمالي المواعيد</td>
            <td>200</td>
            <td>-2%</td>
          </tr>
          <tr>
            <td>المواعيد الملغاة</td>
            <td>15</td>
            <td>+1%</td>
          </tr>
          <tr>
            <td>التقييمات الإيجابية</td>
            <td>90%</td>
            <td>+3%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;
