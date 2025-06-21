import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUser,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaCalendarCheck,
  FaClipboardList,
  FaBell,
  FaChild,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import smartVaxLogo from "../../img/icon1.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const HealthWorkerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // دالة لتبديل حالة القائمة الجانبية
  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderLinks = (links) => {
    return links.map((link, index) => (
      <li key={index}>
        <Link to={link.path} title={link.title}>
          {link.icon}
          <span className={isOpen ? "show" : "hide"}>{link.label}</span>
        </Link>
      </li>
    ));
  };

  const healthWorkerLinks = [
    {
      path: "/dashboard/healthworker",
      title: "الرئيسية",
      label: "الرئيسية",
      icon: <FaHome className="icon" />,
    },
    {
      path: "/Search-Child-By-ID",
      title: "بحث عن طفل برقم الهوية",
      label: "بحث عن طفل",
      icon: <MdMedicalInformation className="icon" />,
    },
    {
      path: "/Manegment-Requests-Appointment",
      title: "إدارة طلبات المواعيد",
      label: "إدارة المواعيد",
      icon: <FaCalendarCheck className="icon" />,
    },
    {
      path: "/feedback",
      title: "التقييمات",
      label: "التقييمات",
      icon: <FaClipboardList className="icon" />,
    },
    {
      path: "/health-worker-account",
      title: "الحساب",
      label: "الحساب",
      icon: <FaUser className="icon" />,
    },
    {
 
        path: "/heal_thworker_reminder",
        title: "تذكيرات العامل الصحي",
        label: "تذكيرات العامل",
        icon: <FaBell className="icon" />
    },
    {
      path: "/help",
      title: "المساعدة",
      label: "المساعدة",
      icon: <FaQuestionCircle className="icon" />,
    },
    {
      path: "/login",
      title: "تسجيل الدخول",
      label: "تسجيل الدخول",
      icon: <FaSignInAlt className="icon" />,
    },
    {
      path: "/logout",
      title: "تسجيل الخروج",
      label: "تسجيل الخروج",
      icon: <FaSignOutAlt className="icon" />,
    },
    {
      path: "/register",
      title: "إنشاء حساب",
      label: "إنشاء حساب",
      icon: <FaUserPlus className="icon" />,
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* أيقونة القائمة */}
      <div className="menu-icon" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* شعار SmartVax */}
      <div className="logo-container">
        <img src={smartVaxLogo} alt="SmartVax Logo" className="logo" />
        <span className={isOpen ? "nav-title" : "hide"}>SmartVax</span>
      </div>

      {/* الروابط */}
      <ul className="nav-links">{renderLinks(healthWorkerLinks)}</ul>
    </div>
  );
};

export default HealthWorkerNavbar;
