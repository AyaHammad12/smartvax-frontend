import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUser,
  FaInfoCircle,
  FaSignInAlt, // أيقونة تسجيل الدخول الجديدة
  FaUserPlus, // أيقونة التسجيل الجديدة
  FaCalendarCheck,
  FaClipboardList,
  FaBell,
  FaChild,
} from "react-icons/fa";
import smartVaxLogo from "../img/image.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* أيقونة القائمة */}
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      {/* شعار SmartVax */}
      <div className="logo-container">
        <img src={smartVaxLogo} alt="SmartVax Logo" className="logo" />
        <span className={isOpen ? "nav-title" : "hide"}>SmartVax</span>
      </div>

      {/* الروابط */}
      <ul className="nav-links">
        <li>
          <Link to="/" title="Home">
            <FaHome className="icon" />
            <span className={isOpen ? "show" : "hide"}>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/login" title="Login">
            <FaSignInAlt className="icon" />
            <span className={isOpen ? "show" : "hide"}>Login</span>
          </Link>
        </li>
        <li>
          <Link to="/register" title="Register">
            <FaUserPlus className="icon" />
            <span className={isOpen ? "show" : "hide"}>Register</span>
          </Link>
        </li>
        <li>
          <Link to="/vaccine-info" title="Vaccine Info">
            <MdMedicalInformation className="icon" />
            <span className={isOpen ? "show" : "hide"}>Vaccine Info</span>
          </Link>
        </li>
        <li>
          <Link to="/book-appointment" title="Book Appointment">
            <FaCalendarCheck className="icon" />
            <span className={isOpen ? "show" : "hide"}>Book Appointment</span>
          </Link>
        </li>
        <li>
          <Link to="/feedback" title="Feedback">
            <FaClipboardList className="icon" />
            <span className={isOpen ? "show" : "hide"}>Feedback</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" title="Profile">
            <FaChild className="icon" />
            <span className={isOpen ? "show" : "hide"}>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/reminder" title="Reminder">
            <FaBell className="icon" />
            <span className={isOpen ? "show" : "hide"}>Reminder</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
