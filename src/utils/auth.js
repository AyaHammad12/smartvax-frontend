// src/utils/auth.js
export const getUserRole = () => {
  return localStorage.getItem("role") || null;
};

export const login = (role) => {
  
  if (["parent", "healthworker", "manager"].includes(role)) {
    localStorage.setItem("role", role);
  }
};

export const logout = () => {
  localStorage.clear(); // مسح جميع البيانات عند تسجيل الخروج
};
