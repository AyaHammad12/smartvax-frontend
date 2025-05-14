import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../img/logo.png";
import "../styles/AuthPage.css";

const MultiStepRegister = () => {
  const [step, setStep] = useState(1);
  const [childData, setChildData] = useState({
    name: "",
    id: "",
    dob: "",
    phone: "",
  });
  const [code, setCode] = useState("");
  const [parentInfo, setParentInfo] = useState({
    name: "",
    dob: "",
  });
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChildChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    setParentInfo({ ...parentInfo, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleNextStep = async () => {
    if (!childData.name || !childData.id || !childData.dob || !childData.phone) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(childData.phone)) {
      alert("📱 رقم الهاتف يجب أن يتكون من 10 أرقام بدون مقدمة دولية");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(childData.dob)) {
      alert("📅 تنسيق تاريخ الميلاد غير صالح. استخدم التاريخ من التقويم فقط.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/validate-child-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(childData)
      });

      const message = await res.text();

      if (res.status === 200) {
        alert("✅ تم التحقق من بيانات الطفل بنجاح");
        setStep(2);
      } else {
        alert("❌ " + message);
      }
    } catch (error) {
      console.error("خطأ أثناء التحقق:", error);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const handleVerifyCode = () => {
    if (code !== "1234") {
      alert("❌ كود التحقق غير صحيح!");
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert("❌ كلمات المرور غير متطابقة!");
      return;
    }

    try {
      const payload = {
        // بيانات الطفل
        childId: childData.id,
        childName: childData.name,
        childDob: childData.dob,
        childPhone: childData.phone,

        // بيانات الأب
        parentName: parentInfo.name,
        parentDob: parentInfo.dob,
        parentPhone: childData.phone,

        // بيانات المستخدم
        username: userData.username,
        password: userData.password
      };

      const res = await fetch("http://localhost:8080/api/register-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "فشل في إنشاء الحساب");
      }

      alert("✅ تم إنشاء الحساب بنجاح!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
      <div className="login-container" dir="rtl">
        <div className="login-card">
          <div className="login-image">
            <img src={loginImage} alt="SmartVAX" />
          </div>
          <div className="login-form">
            <h1 style={{ color: "#1565c0" }}>إنشاء حساب</h1>

            {step === 1 && (
                <>
                  <div className="input-group">
                    <input type="text" name="name" placeholder="اسم الطفل" value={childData.name} onChange={handleChildChange} required />
                  </div>
                  <div className="input-group">
                    <input type="text" name="id" placeholder="رقم الهوية" value={childData.id} onChange={handleChildChange} required />
                  </div>
                  <div className="input-group">
                    <input type="date" name="dob" value={childData.dob} onChange={handleChildChange} onKeyDown={(e) => e.preventDefault()} required />
                  </div>
                  <div className="input-group">
                    <input type="text" name="phone" placeholder="رقم الهاتف" value={childData.phone} onChange={handleChildChange} required />
                  </div>
                  <button onClick={handleNextStep} className="login-btn">التالي</button>
                </>
            )}

            {step === 2 && (
                <>
                  <p className="subtitle" style={{ color: "#5c6bc0" }}>أدخل كود التحقق المرسل إلى هاتفك</p>
                  <div className="input-group">
                    <input type="text" placeholder="رمز التحقق" value={code} onChange={(e) => setCode(e.target.value)} required />
                  </div>
                  <div className="button-group">
                    <button onClick={() => setStep(1)} className="login-btn">← الرجوع</button>
                    <button onClick={handleVerifyCode} className="login-btn">تحقق</button>
                  </div>
                </>
            )}

            {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <p className="subtitle" style={{ color: "#5c6bc0" }}>أدخل بيانات الأب وبيانات الحساب</p>

                  {/* بيانات الأب */}
                  <div className="input-group">
                    <input type="text" name="name" placeholder="اسم الأب" value={parentInfo.name} onChange={handleParentChange} required />
                  </div>
                  <div className="input-group">
                    <input type="date" name="dob" placeholder="تاريخ ميلاد الأب" value={parentInfo.dob} onChange={handleParentChange} required />
                  </div>

                  {/* بيانات الحساب */}
                  <div className="input-group">
                    <input type="text" name="username" placeholder="اسم المستخدم" value={userData.username} onChange={handleUserChange} required />
                  </div>
                  <div className="input-group">
                    <input type="password" name="password" placeholder="كلمة المرور" value={userData.password} onChange={handleUserChange} required />
                  </div>
                  <div className="input-group">
                    <input type="password" name="confirmPassword" placeholder="تأكيد كلمة المرور" value={userData.confirmPassword} onChange={handleUserChange} required />
                  </div>

                  <div className="button-group">
                    <button type="button" onClick={() => setStep(2)} className="login-btn">← الرجوع</button>
                    <button type="submit" className="login-btn">إنشاء الحساب</button>
                  </div>
                </form>
            )}
          </div>
        </div>
      </div>
  );
};

export default MultiStepRegister;
