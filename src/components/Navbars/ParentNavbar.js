import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome, FaUser, FaCalendarCheck, FaClipboardList, FaBell, FaChild,
  FaSignOutAlt, FaQuestionCircle, FaRobot, FaFileAlt, FaRulerCombined
} from "react-icons/fa";
import smartVaxLogo from "../../img/icon.png";
import "../../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const ParentNavbar = () => {
  const [childId, setChildId] = useState(localStorage.getItem("childId") || "unknown");

  useEffect(() => {
    const fetchChildId = async () => {
      const parentId = localStorage.getItem("parentId");
      if (!parentId) return;
      if (!childId || childId === "unknown") {
        try {
          const res = await fetch(`http://localhost:8080/api/children/by-parent/${parentId}`);
          const data = await res.json();
          if (data?.length > 0) {
            localStorage.setItem("childId", data[0].id);
            setChildId(data[0].id);
          }
        } catch {}
      }
    };
    fetchChildId();
  }, [childId]);

  const parentLinks = [
    { path: "/dashboard/parent", title: "الرئيسية", label: "الرئيسية", icon: <FaHome className="icon" /> },
    { path: "/search", title: "التطيعمات الأساسية لطفلك", label: "التطيعمات الأساسية لطفلك", icon: <MdMedicalInformation className="icon" /> },
    { path: "/appointments", title: "مواعيدي", label: "مواعيدي", icon: <FaCalendarCheck className="icon" /> },
    { path: "/scheduled-vaccinations", title: "التطعيمات المجدولة", label: "التطعيمات المجدولة", icon: <FaClipboardList className="icon" /> },
    { path: "/vaccine-bot", title: "لقاح بوت", label: "لقاح بوت", icon: <FaRobot className="icon" /> },
    { path: `/certificate/${childId}`, title: "شهادة التطعيم", label: "شهادة التطعيم", icon: <FaFileAlt className="icon" /> },
    { path: `/additional-certificate/${childId}`, title: "شهادة التطعيمات الإضافية", label: "شهادة التطعيمات الإضافية", icon: <MdMedicalInformation className="icon" /> },
    { path: "/profile", title: "الملف الشخصي", label: "الملف الشخصي", icon: <FaChild className="icon" /> },
    { path: `/growth/form/${childId}`, title: "متابعة الطول والوزن", label: "متابعة الطول والوزن", icon: <FaRulerCombined className="icon" /> },
    { path: "/account", title: "الحساب", label: "الحساب", icon: <FaUser className="icon" /> },
    { path: "/reminder", title: "التذكيرات", label: "التذكيرات", icon: <FaBell className="icon" /> },
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
          {parentLinks.map((link, index) => (
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
export default ParentNavbar;
