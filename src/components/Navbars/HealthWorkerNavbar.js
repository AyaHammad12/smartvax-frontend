import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaQuestionCircle,
  FaCalendarCheck
} from "react-icons/fa";
import smartVaxLogo from "../../img/icon1.png";
import "../../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md"; // أيقونة جديدة للتطعيمات الإضافية

const HealthWorkerNavbar = () => {
  const healthWorkerLinks = [
    { path: "/dashboard/healthworker", title: "الرئيسية", label: "الرئيسية", icon: <FaHome className="icon" /> },
    { path: "/Search-Child-By-ID", title: "بحث عن طفل برقم الهوية", label: "بحث عن طفل", icon: <MdMedicalInformation className="icon" /> },
    { path: "/Manegment-Requests-Appointment", title: "إدارة طلبات المواعيد", label: "إدارة المواعيد", icon: <FaCalendarCheck className="icon" /> },
    // هنا عدّلنا المسار 👇
    { path: "/SearchAdditionalVaccines", title: "إدارة التطعيمات الإضافية", label: "إدارة التطعيمات الإضافية", icon: <MdAddCircleOutline className="icon" /> },
    { path: "/health-worker-account", title: "الحساب", label: "الحساب", icon: <FaUser className="icon" /> },
    { path: "/heal_thworker_reminder", title: "تذكيرات العامل الصحي", label: "تذكيرات العامل", icon: <FaBell className="icon" /> },
    { path: "/help", title: "المساعدة", label: "المساعدة", icon: <FaQuestionCircle className="icon" /> },
    { path: "/logout", title: "تسجيل الخروج", label: "تسجيل الخروج", icon: <FaSignOutAlt className="icon" /> },
  ];


  return (
      <div className="sidebar open">
        <div className="logo-container">
          <img src={smartVaxLogo} alt="SmartVax Logo" className="logo" />
          <span className="logo-text">SmartVax</span>
        </div>
        <ul className="nav-links">
          {healthWorkerLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} title={link.title}>
                  {link.icon}
                  <span className="show">{link.label}</span>
                </Link>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default HealthWorkerNavbar;
