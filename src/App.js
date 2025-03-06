// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import LogoutPage from "./pages/LogoutPage";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import VaccineInfoPage from "./pages/VaccineInfoPage";
// import BookAppointmentPage from "./pages/BookAppointmentPage";
// import FeedbackPage from "./pages/FeedbackPage";
// import ParentDashboard from "./pages/ParentDashboard";
// import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
// import Navbar from "./components/Navbar";
// import HWAppointmentScheduling from "./pages/HWAppointmentScheduling";
// import ProfilePage from "./pages/ProfilePage";
// import AccountPage from "./pages/AccountPage";
// import ReminderPage from "./pages/ReminderPage";
// import HelpPage from "./pages/HelpPage";
// import SearchPage from "./pages/SearchPage";

// import SearchChildByID from "./pages/SearchChildByID";
// import ManegmentRequestsAppointment from "./pages/ManegmentRequestsAppointment";

// const AppContent = () => {
//   const location = useLocation();
//   const hideNavbarRoutes = ["/login", "/register", "/logout"];

//   return (
//     <div>
//       {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
//       <div className="main-content">
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/logout" element={<LogoutPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route
//             path="/vaccine-info/:vaccineName/:day"
//             element={<VaccineInfoPage />}
//           />
//           <Route path="/book-appointment" element={<BookAppointmentPage />} />
//           <Route path="/feedback" element={<FeedbackPage />} />
//           <Route path="/dashboard/parent" element={<ParentDashboard />} />
//           <Route
//             path="/dashboard/healthworker"
//             element={<HealthWorkerDashboard />}
//           />
//           <Route
//             path="/appointment-scheduling/:day/:vaccineName"
//             element={<HWAppointmentScheduling />}
//           />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/account" element={<AccountPage />} />
//           <Route path="/reminder" element={<ReminderPage />} />
//           <Route path="/help" element={<HelpPage />} />
//           <Route path="/search" element={<SearchPage />} />
//           {/* <Route path="/search" element={<SearchPage />} /> */}

//           {/* <Link to="/Search-Child-By-ID" title="SearchChildByID">
//             <Link to="/Manegment-Requests-Appointment" title="ManegmentRequestsAppointment"> */}

//           <Route path="/Search-Child-By-ID" element={<SearchChildByID />} />
//           <Route
//             path="/Manegment-Requests-Appointment"
//             element={<ManegmentRequestsAppointment />}
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VaccineInfoPage from "./pages/VaccineInfoPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import FeedbackPage from "./pages/FeedbackPage";
import ParentDashboard from "./pages/ParentDashboard";
import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
import Navbar from "./components/Navbar";
import HWAppointmentScheduling from "./pages/HWAppointmentScheduling";
import ProfilePage from "./pages/ProfilePage";
import AccountPage from "./pages/AccountPage";
import ReminderPage from "./pages/ReminderPage";
import HelpPage from "./pages/HelpPage";
import SearchPage from "./pages/SearchPage";
import SearchChildByID from "./pages/SearchChildByID";
import ManegmentRequestsAppointment from "./pages/ManegmentRequestsAppointment";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbarRoutes = ["/login", "/register", "/logout"];

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // جلب الدور من localStorage
    if (storedRole) {
      setRole(storedRole);

      console.log("-- app the role is : ", { role });
    }
  }, []);

  // // حالة لتخزين الدور (role) من الـ localStorage
  // const [role, setRole] = useState(null);

  // useEffect(() => {
  //   const storedRole = localStorage.getItem("role");
  //   setRole(storedRole);
  //   console.log("the role is : ", { role });
  // }, []);

  const handleLogout = () => {
    // إزالة الدور من الـ localStorage عند تسجيل الخروج
    localStorage.removeItem("role");
    navigate("/login"); // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
  };

  // إظهار الـ Navbar إذا كان الدور موجودًا ولم يكن من ضمن المسارات المخفية
  // const showNavbar = role && !hideNavbarRoutes.includes(location.pathname);
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar role={role} />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/logout"
            element={<LogoutPage handleLogout={handleLogout} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/vaccine-info/:vaccineName/:day"
            element={<VaccineInfoPage />}
          />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route
            path="/dashboard/healthworker"
            element={<HealthWorkerDashboard />}
          />
          <Route
            path="/appointment-scheduling/:day/:vaccineName"
            element={<HWAppointmentScheduling />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/reminder" element={<ReminderPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/Search-Child-By-ID" element={<SearchChildByID />} />
          <Route
            path="/Manegment-Requests-Appointment"
            element={<ManegmentRequestsAppointment />}
          />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
