import React from "react";
import ParentNavbar from "./Navbars/ParentNavbar";
import HealthWorkerNavbar from "./Navbars/HealthWorkerNavbar";
import ManagerNavbar from "./Navbars/ManagerNavbar";

const Navbar = ({ role }) => {
  if (!role) return null; // 🔹 عدم عرض أي Navbar إذا لم يكن هناك دور
  if (role === "parent") return <ParentNavbar />;
  if (role === "healthworker") return <HealthWorkerNavbar />;
  if (role === "manager") return <ManagerNavbar />;

  return null;
};

export default Navbar;
