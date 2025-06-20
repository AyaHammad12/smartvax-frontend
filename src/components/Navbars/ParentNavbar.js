import React, { useState, useEffect } from "react";
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
  FaFileAlt,
} from "react-icons/fa";
import smartVaxLogo from "../../img/icon.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const ParentNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [childId, setChildId] = useState(localStorage.getItem("childId") || "unknown");

  useEffect(() => {
    const fetchChildId = async () => {
      const parentId = localStorage.getItem("parentId");

      if (!parentId) {
        console.error("❌ لا يوجد parentId في localStorage");
        return;
      }

      if (!childId || childId === "unknown") {
        try {
          const res = await fetch(`http://localhost:8080/api/children/by-parent/${parentId}`);
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }

          const data = await res.json();
          if (data?.length > 0) {
            localStorage.setItem("childId", data[0].id);
            setChildId(data[0].id);
          } else {
            console.warn("⚠️ لم يتم العثور على أي طفل لهذا الأب.");
          }
        } catch (error) {
          console.error("❌ فشل تحميل معرف الطفل:", error);
        }
      }
    };

    fetchChildId();
  }, [childId]);

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
      path: `/certificate/${childId}`,
      title: "شهادة التطعيم",
      label: "شهادة التطعيم",
      icon: <FaFileAlt className="icon" />,
    },
    {
      path: `/additional-certificate/${childId}`,
      title: "شهادة التطعيمات الإضافية",
      label: "شهادة إضافية",
      icon: <MdMedicalInformation className="icon" />,
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
        <div className="menu-icon" onClick={toggleSidebar}>
          <FaBars />
        </div>

        <div className="logo-container">
          <img src={smartVaxLogo} alt="SmartVax Logo" className="logo" />
          <span className={isOpen ? "nav-title" : "hide"}>SmartVax</span>
        </div>

        <ul className="nav-links">{renderLinks(parentLinks)}</ul>
      </div>
  );
};

export default ParentNavbar;
