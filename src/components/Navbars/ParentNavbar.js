import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaCalendarCheck,
  FaClipboardList,
  FaBell,
  FaChild,
  FaSignOutAlt,
  FaQuestionCircle,
  FaComments,
} from "react-icons/fa";
import smartVaxLogo from "../../img/icon.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const ParentNavbar = () => {
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

  const parentLinks = [
    {
      path: "/dashboard/parent",
      title: "الرئيسية",
      label: "الرئيسية",
      icon: <FaHome className="icon" />,
    },
    {
      path: "/search",
      title: "البحث عن لقاح",
      label: "البحث عن لقاح",
      icon: <MdMedicalInformation className="icon" />,
    },
    {
      path: "/appointments",
      title: "مواعيدي",
      label: "مواعيدي",
      icon: <FaCalendarCheck className="icon" />,
    },
    {
      path: "/scheduled-vaccinations",
      title: "التطعيمات المجدولة",
      label: "التطعيمات المجدولة",
      icon: <FaClipboardList className="icon" />,
    },
    {
      path: "/feedback",
      title: "التقييمات",
      label: "التقييمات",
      icon: <FaComments className="icon" />,
    },
    {
      path: "/profile",
      title: "الملف الشخصي",
      label: "الملف الشخصي",
      icon: <FaChild className="icon" />,
    },
    {
      path: "/account",
      title: "الحساب",
      label: "الحساب",
      icon: <FaUser className="icon" />,
    },
    {
      path: "/reminder",
      title: "التذكيرات",
      label: "التذكيرات",
      icon: <FaBell className="icon" />,
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
      <ul className="nav-links">{renderLinks(parentLinks)}</ul>
    </div>
  );
};

export default ParentNavbar;
