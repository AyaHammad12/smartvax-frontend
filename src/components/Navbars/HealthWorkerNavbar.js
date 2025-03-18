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
      title: "HealthWorker Home",
      label: "Home",
      icon: <FaHome className="icon" />,
    },
    {
      path: "/Search-Child-By-ID",
      title: "Search Child By ID",
      label: "Search Child By ID",
      icon: <MdMedicalInformation className="icon" />,
    },
    {
      path: "/Manegment-Requests-Appointment",
      title: "Management Requests Appointment",
      label: "Management Requests Appointment",
      icon: <FaCalendarCheck className="icon" />,
    },
    {
      path: "/feedback",
      title: "Feedback",
      label: "Feedback",
      icon: <FaClipboardList className="icon" />,
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
      <ul className="nav-links">{renderLinks(healthWorkerLinks)}</ul>
    </div>
  );
};

export default HealthWorkerNavbar;
