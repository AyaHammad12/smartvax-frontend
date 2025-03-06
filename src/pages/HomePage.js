import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // فحص الـ role والتوجيه بناء عليه
    if (role === "parent") {
      navigate("/dashboard/parent"); // توجيه الأب
    } else if (role === "healthworker") {
      navigate("/dashboard/healthworker"); // توجيه موظف الصحة
    } else {
      navigate("/"); // إذا كان هناك دور غير معروف أو غير مُحدد، يمكن توجيه المستخدم للصفحة الرئيسية
    }
  }, [role, navigate]); // يعتمد على `role` و `navigate`

  // لا نحتاج لعرض أي مكون أو محتوى في هذه الصفحة، حيث أننا فقط نقوم بالتوجيه
  return null;
};

export default HomePage;



