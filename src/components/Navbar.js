// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaBars,
//   FaHome,
//   FaUser,
//   FaInfoCircle,
//   FaSignInAlt, // أيقونة تسجيل الدخول
//   FaUserPlus, // أيقونة التسجيل
//   FaCalendarCheck,
//   FaClipboardList,
//   FaBell,
//   FaChild,
//   FaSignOutAlt,
//   FaQuestionCircle, // أيقونة المساعدة الجديدة
// } from "react-icons/fa";
// import smartVaxLogo from "../img/image.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
// import "../styles/Navbar.css";
// import { MdMedicalInformation } from "react-icons/md";

// const Navbar = ({ role }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   if (role === "parent") {
//     return (
//       <div className={`sidebar ${isOpen ? "open" : ""}`}>
//         {/* أيقونة القائمة */}
//         <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
//           <FaBars />
//         </div>

//         {/* شعار SmartVax */}
//         <div className="logo-container">
//           <img src={smartVaxLogo} alt="SmartVax Logo" className="logo" />
//           <span className={isOpen ? "nav-title" : "hide"}>SmartVax</span>
//         </div>

//         {/* الروابط */}
//         <ul className="nav-links">
//           <li>
//             <Link to="/dashboard/parent" title="parentHome">
//               <FaHome className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Home</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/search" title="Search">
//               <MdMedicalInformation className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Search Vax</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/book-appointment" title="Book Appointment">
//               <FaCalendarCheck className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Book Appointment</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/feedback" title="Feedback">
//               <FaClipboardList className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Feedback</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/profile" title="Profile">
//               <FaChild className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Profile</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/account" title="Account">
//               <FaUser className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Account</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/reminder" title="Reminder">
//               <FaBell className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Reminder</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/help" title="Help">
//               <FaQuestionCircle className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Help</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/login" title="Login">
//               <FaSignInAlt className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Login</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/logout" title="LogOut">
//               <FaSignOutAlt className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Logout</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/register" title="Register">
//               <FaUserPlus className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Register</span>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     );
//   } else if (role === "healthworker") {
//     return (
//       <div className={`sidebar ${isOpen ? "open" : ""}`}>
//         {/* أيقونة القائمة */}
//         <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
//           <FaBars />
//         </div>

//         {/* شعار SmartVax */}
//         <div className="logo-container">
//           <img src={smartVaxLogo} alt="SmartVax Logo" className="logo" />
//           <span className={isOpen ? "nav-title" : "hide"}>SmartVax</span>
//         </div>

//         {/* الروابط */}
//         <ul className="nav-links">
//           <li>

//             {/* <Route path="/dashboard/parent" element={<ParentDashboard />} />
//           <Route
//             path="/dashboard/healthworker" */}
//             <Link to="/dashboard/healthworker" title="HealthWorkerHome">
//               <FaHome className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Home</span>
//             </Link>
//           </li>

//           <li>
//             <Link to="/Search-Child-By-ID" title="SearchChildByID">
//               <MdMedicalInformation className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Search Child By ID</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/Manegment-Requests-Appointment" title="ManegmentRequestsAppointment">
//               <FaCalendarCheck className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Manegment Requests Appointment</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/feedback" title="Feedback">
//               <FaClipboardList className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Feedback</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/account" title="Account">
//               <FaUser className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Account</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/reminder" title="Reminder">
//               <FaBell className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Reminder</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/help" title="Help">
//               <FaQuestionCircle className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Help</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/login" title="Login">
//               <FaSignInAlt className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Login</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/logout" title="LogOut">
//               <FaSignOutAlt className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Logout</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/register" title="Register">
//               <FaUserPlus className="icon" />
//               <span className={isOpen ? "show" : "hide"}>Register</span>
//             </Link>
//           </li>
//         </ul>
//       </div>
//     );
//   }

// };

// export default Navbar;

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
import smartVaxLogo from "../img/image.png"; // تأكد من أن الصورة موجودة في المسار الصحيح
import "../styles/Navbar.css";
import { MdMedicalInformation } from "react-icons/md";

const Navbar = ({ role }) => {
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
      path: "/book-appointment",
      title: "Book Appointment",
      label: "Book Appointment",
      icon: <FaCalendarCheck className="icon" />,
    },
    {
      path: "/feedback",
      title: "Feedback",
      label: "Feedback",
      icon: <FaClipboardList className="icon" />,
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
      <ul className="nav-links">
        {role === "parent" && renderLinks(parentLinks)}
        {role === "healthworker" && renderLinks(healthWorkerLinks)}
      </ul>
    </div>
  );
};

export default Navbar;
