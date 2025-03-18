import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUserPlus,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import smartVaxLogo from "../../img/simplified_icon.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../../styles/Navbar.css";

const ManagerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // دالة لتبديل حالة القائمة الجانبية
  const toggleSidebar = () => setIsOpen(!isOpen);

  const managerLinks = [
    {
      path: "/dashboard/manager",
      title: "Manager Dashboard",
      label: "Dashboard",
      icon: <FaHome className="icon" />,
    },
    {
      path: "/manage-workers",
      title: "Manage Workers",
      label: "Manage Workers",
      icon: <FaUserPlus className="icon" />,
    },
    {
      path: "/reports",
      title: "Reports & Analytics",
      label: "Reports",
      icon: <FaChartBar className="icon" />,
    },
    {
      path: "/logout",
      title: "Logout",
      label: "Logout",
      icon: <FaSignOutAlt className="icon" />,
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
      <ul className="nav-links">
        {managerLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.path} title={link.title}>
              {link.icon}
              <span className={isOpen ? "show" : "hide"}>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerNavbar;
