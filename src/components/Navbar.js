import React from "react";
import ParentNavbar from "./Navbars/ParentNavbar";
import HealthWorkerNavbar from "./Navbars/HealthWorkerNavbar";

const Navbar = ({ role }) => {
  if (!role) return null; // 🔹 عدم عرض أي Navbar إذا لم يكن هناك دور
  if (role === "parent") return <ParentNavbar />;
  if (role === "healthworker") return <HealthWorkerNavbar />;

  return null;
};

export default Navbar;