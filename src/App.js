import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VaccineInfoPage from "./pages/VaccineInfoPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import FeedbackPage from "./pages/FeedbackPage";
import ParentDashboard from "./pages/ParentDashboard";
import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
import Navbar from "./components/Navbar";

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"]; // المسارات التي لا يظهر فيها الناف بار ـ Navbar

  return (
    <div>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vaccine-info" element={<VaccineInfoPage />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route
            path="/dashboard/healthworker"
            element={<HealthWorkerDashboard />}
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
