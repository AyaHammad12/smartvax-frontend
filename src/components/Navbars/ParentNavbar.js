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
  FaHistory,
  FaComments,
} from "react-icons/fa";
import smartVaxLogo from "../../img/icon.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const Navbar = () => {
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
      title: "Parent Home",
      label: "Home",
      icon: <FaHome className="icon" />,
    },
    {
      path: "/search",
      title: "Search Vax",
      label: "Search Vax",
      icon: <MdMedicalInformation className="icon" />,
    },
    {
      path: "/appointments",
      title: "Parent Appointment",
      label: "Parent Appointment",
      icon: <FaCalendarCheck className="icon" />,
    },
    {
      path: "/scheduled-vaccinations", // ✅ إضافة رابط التطعيمات المجدولة
      title: "Scheduled Vaccinations",
      label: "Scheduled Vax",
      // icon: <FaHistory className="icon" />,
      icon: <FaClipboardList className="icon" />,
    },
    {
      path: "/feedback",
      title: "Feedback",
      label: "Feedback",
      // icon: <FaClipboardList  className="icon" />,
      icon: <FaComments className="icon" />,
    },
    {
      path: "/profile",
      title: "Profile",
      label: "Profile",
      icon: <FaChild className="icon" />,
    },
    {
      path: "/account",
      title: "Account",
      label: "Account",
      icon: <FaUser className="icon" />,
    },
    {
      path: "/reminder",
      title: "Reminder",
      label: "Reminder",
      icon: <FaBell className="icon" />,
    },
    {
      path: "/help",
      title: "Help",
      label: "Help",
      icon: <FaQuestionCircle className="icon" />,
    },
    {
      path: "/login",
      title: "Login",
      label: "Login",
      icon: <FaSignInAlt className="icon" />,
    },
    {
      path: "/logout",
      title: "LogOut",
      label: "Logout",
      icon: <FaSignOutAlt className="icon" />,
    },
    {
      path: "/register",
      title: "Register",
      label: "Register",
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

export default Navbar;
