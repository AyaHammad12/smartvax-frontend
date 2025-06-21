import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./styles/Navbar.css"; /* تأكد من صحة المسار */
import "./App.css";

import LogoutPage from "./pages/LogoutPage";
import LoginPage from "./pages/LoginPage";
import VaccineInfoPage from "./pages/VaccineInfoPage";
import FeedbackPage from "./pages/FeedbackPage";
import ParentDashboard from "./pages/ParentDashboard";
import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
import Navbar from "./components/Navbar";
import HWAppointmentScheduling from "./pages/HWAppointmentScheduling";
import ProfilePage from "./pages/ProfilePage";
import AccountPage from "./pages/AccountPage";
import ReminderPage from "./pages/ReminderPage";
import HealthWorkerReminders from "./pages/HealthWorkerReminders";
import AdditionalVaccineCertificate from "./pages/AdditionalVaccineCertificate";
import HelpPage from "./pages/HelpPage";
import SearchPage from "./pages/SearchPage";
import SearchChildByID from "./pages/SearchChildByID";
import ManegmentRequestsAppointment from "./pages/ManegmentRequestsAppointment";
import SearchAdditionalVaccines from "./pages/SearchAdditionalVaccines";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManageWorkers from "./pages/ManageWorkers";
import ReportsPage from "./pages/ReportsPage";
import ReschedulePage from "./pages/ReschedulePage";
import ParentAppointments from "./pages/ParentAppointments";
import VaccineAppointments from "./pages/VaccineAppointments";
import RegisterPage from "./pages/RegisterPage";
import ScheduledVaccinationsPage from "./pages/ScheduledVaccinationsPage";
import ReviewsPage from "./pages/ReviewsPage";
import AppointmentManagementPage from "./pages/AppointmentManagementPage";
import HealthWorkerAccountPage from "./pages/HealthWorkerAccountPage";
import SearchVaccineInfoPage from "./pages/SearchVaccineInfoPage";
import VaccinationCertificate from "./pages/VaccinationCertificate";
import ChildGrowthHistory from "./pages/ChildGrowthHistory";
import ChildGrowthForm from "./pages/ChildGrowthForm";


const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // قائمة بالمسارات التي لا يجب أن يظهر فيها شريط التنقل
  const hideNavbarRoutes = ["/login", "/register", "/logout"];

  // حالة لتخزين الدور (role)
  const [role, setRole] = useState(null);
 const [appointments, setAppointments] = useState([
    {
      id: 1,
      vaccine: "شلل الأطفال",
      date: "2024-04-15",
      status: "مجدول",
      center: "",
    },
    {
      id: 2,
      vaccine: "الحصبة والنكاف والحصبة الألمانية",
      date: "2024-06-10",
      status: "مجدول",
      center: "",
    },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const updateRole = () => {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    };

    // جلب الدور عند تحميل الصفحة
    updateRole();

    // مراقبة أي تغيير في `localStorage`
    window.addEventListener("storage", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("role"); // مسح الدور عند تسجيل الخروج
    setRole(null); // تحديث الحالة
    navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
  };

  // التحقق مما إذا كان يجب عرض شريط التنقل أم لا
  const showNavbar = role && !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {/* {showNavbar && <Navbar role={role} />} */}
      {showNavbar && (
        <Navbar
          role={role}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/logout"
            element={<LogoutPage handleLogout={handleLogout} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/appointment-management/:appointmentId"
            element={<AppointmentManagementPage />}
          />
          <Route path="/additional-vaccines/search" element={<SearchAdditionalVaccines />} />
          <Route path="/vaccine-info/:id" element={<VaccineInfoPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/certificate/:childId" element={<VaccinationCertificate />} />
          <Route path="/additional-certificate/:childId" element={<AdditionalVaccineCertificate />} />
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route
            path="/dashboard/healthworker"
            element={<HealthWorkerDashboard />}
          />

          <Route
            path="/hw-appointment-scheduling/:day"
            element={<HWAppointmentScheduling />}
          />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/reminder" element={<ReminderPage />} />
          <Route
            path="/heal_thworker_reminder"
            element={<HealthWorkerReminders />}
          />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/Search-Child-By-ID" element={<SearchChildByID />} />
          <Route
            path="/Manegment-Requests-Appointment"
            element={<ManegmentRequestsAppointment />}
          />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/manage-workers" element={<ManageWorkers />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route
              path="/additional-vaccines/certificate/:childId"
              element={<AdditionalVaccineCertificate />}
          />

          <Route path="/growth/history/:childId" element={<ChildGrowthHistory />} />
          <Route path="/growth/form/:childId" element={<ChildGrowthForm />} />

          <Route
            path="/appointments"
            element={
              <ParentAppointments
                appointments={appointments}
                setAppointments={setAppointments}
              />
            }
          />
          <Route
            path="/reschedule/:appointmentId"
            element={
              <ReschedulePage
                appointments={appointments}
                setAppointments={setAppointments}
              />
            }
          />
          <Route
            path="/vaccine-appointments"
            element={<VaccineAppointments />}
          />
          <Route
            path="/scheduled-vaccinations"
            element={<ScheduledVaccinationsPage />}
          />
          <Route path="/write-review/:id" element={<ReviewsPage />} />
          <Route
            path="/health-worker-account"
            element={<HealthWorkerAccountPage />}
          />
          <Route
            path="/search-vaccine-info/:id"
            element={<SearchVaccineInfoPage />}
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
