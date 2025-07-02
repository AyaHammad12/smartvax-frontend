import React, { useState, useEffect } from "react";
import DayCell from "./DayCell";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Calendar.css";

const Calendar = ({ role: propRole }) => {
    const navigate = useNavigate();
    const rawRole = propRole || localStorage.getItem("role");
    const role = rawRole ? rawRole.toUpperCase() : null;
    const userId = localStorage.getItem("userId");
    const parentId = localStorage.getItem("parentId");
    const { date: urlDate } = useParams();

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [scheduleData, setScheduleData] = useState([]);
    const [parentAppointments, setParentAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [healthWorker, setHealthWorker] = useState(null);
    const [searchDate, setSearchDate] = useState("");
    const [loading, setLoading] = useState(true);

    const currentDate = new Date(currentYear, currentMonth, 1);
    const monthName = currentDate.toLocaleString("ar-EG", { month: "long" });
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const normalizeDate = (dateStr) => {
        if (!dateStr) return null;
        return dateStr.split("T")[0];
    };

    const translateStatus = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "قادم";
            case "COMPLETED":
                return "مكتمل";
            case "MISSED":
                return "فائت";
            default:
                return "غير معروف";
        }
    };

    const fetchHealthWorker = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/health-workers/by-user/${userId}`);
            if (!response.ok) throw new Error("فشل تحميل بيانات العامل الصحي");
            const data = await response.json();
            setHealthWorker(data);
        } catch (error) {
            console.error("❌ خطأ أثناء جلب بيانات العامل الصحي:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchScheduleData = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/schedule-vaccinations", {
                method: "GET",
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) throw new Error("فشل تحميل بيانات جدول التطعيمات");
            const data = await response.json();
            setScheduleData(data);
        } catch (error) {
            console.error("❌ خطأ أثناء تحميل جدول التطعيمات:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchParentAppointments = async () => {
        if (!parentId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/appointments/by-parent-with-schedules/${parentId}`);
            if (!response.ok) throw new Error("فشل جلب مواعيد الأب");
            const data = await response.json();
            setParentAppointments(data);
        } catch (error) {
            console.error("❌ خطأ أثناء جلب مواعيد الأب:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "HEALTH_WORKER") {
            fetchHealthWorker();
            fetchScheduleData();
        } else {
            fetchScheduleData();
            fetchParentAppointments();
        }
    }, [role, parentId, userId]);

    const changeMonth = (offset) => {
        let newMonth = currentMonth + offset;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleDayClick = (dateKey) => {
        setSelectedDate(dateKey);
        if (role === "HEALTH_WORKER" && healthWorker?.vaccinationCenter?.id) {
            navigate(`/hw-appointment-scheduling/${dateKey}`);
        }
    };

    const handleSearchDateChange = (event) => {
        setSearchDate(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchDate) {
            const [year, month, day] = searchDate.split("-").map(Number);
            setCurrentYear(year);
            setCurrentMonth(month - 1);
            setSelectedDate(searchDate);
            if (role === "HEALTH_WORKER" && healthWorker?.vaccinationCenter?.id) {
                navigate(`/hw-appointment-scheduling/${searchDate}`);
            }
        }
    };

    if (loading || (role === "HEALTH_WORKER" && !healthWorker)) {
        return <div className="loading">جاري تحميل البيانات...</div>;
    }

    const vaccinationDays = new Set(
        scheduleData
            .map(item => normalizeDate(item.scheduledDate))
            .filter(Boolean)
    );

    const generateDays = () => {
        let days = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = String(i).padStart(2, "0");
            const month = String(currentMonth + 1).padStart(2, "0");
            const dateKey = `${currentYear}-${month}-${day}`;
            const isSelected = selectedDate === dateKey;

            // ==== تحديد اليوم وامبارح وبكرا ====
            const todayObj = new Date();
            todayObj.setHours(0, 0, 0, 0);
            const currentCellDate = new Date(currentYear, currentMonth, i);
            currentCellDate.setHours(0, 0, 0, 0);
            const yesterdayObj = new Date(todayObj);
            yesterdayObj.setDate(todayObj.getDate() - 1);
            const tomorrowObj = new Date(todayObj);
            tomorrowObj.setDate(todayObj.getDate() + 1);

            const isToday = currentCellDate.getTime() === todayObj.getTime();
            const isYesterday = currentCellDate.getTime() === yesterdayObj.getTime();
            const isTomorrow = currentCellDate.getTime() === tomorrowObj.getTime();

            if (role === "HEALTH_WORKER") {
                const hasVaccination = vaccinationDays.has(dateKey);

                days.push(
                    <DayCell
                        key={`day-${dateKey}`}
                        day={i}
                        month={month}
                        year={currentYear}
                        role="healthworker"
                        isSelected={isSelected}
                        hasVaccination={hasVaccination}
                        isToday={isToday}
                        isYesterday={isYesterday}
                        isTomorrow={isTomorrow}
                        onClick={() => handleDayClick(dateKey)}
                    />
                );
            } else {
                const today = new Date();
                const vaccines = scheduleData
                    .filter((item) => normalizeDate(item.scheduledDate) === dateKey)
                    .map((item) => {
                        const appointment = parentAppointments.find((appt) =>
                            appt.scheduleVaccinations?.some((sv) => {
                                return (
                                    sv &&
                                    sv.vaccination &&
                                    sv.vaccination.group &&
                                    sv.child &&
                                    item.vaccination &&
                                    item.vaccination.group &&
                                    item.child &&
                                    sv.child.id === item.child.id &&
                                    sv.vaccination.group.id === item.vaccination.group.id &&
                                    normalizeDate(sv.scheduledDate) === normalizeDate(item.scheduledDate)
                                );
                            })
                        );
                        const vaccineDate = new Date(item.scheduledDate);
                        let finalStatus;

                        if (appointment) {
                            finalStatus = appointment.status;
                        } else {
                            finalStatus = item.status;
                            if (finalStatus === "PENDING" && vaccineDate < today) {
                                finalStatus = "MISSED";
                            }
                        }
                        return {
                            id: item.vaccination?.id,
                            name: item.vaccination?.name,
                            groupName: item.vaccination?.group?.name || "",
                            status: translateStatus(finalStatus),
                            rawStatus: finalStatus,
                        };
                    });

                days.push(
                    <DayCell
                        key={`day-${dateKey}`}
                        day={i}
                        month={month}
                        year={currentYear}
                        role="parent"
                        vaccines={vaccines}
                        isSelected={isSelected}
                        onClick={() => handleDayClick(dateKey)}
                    />
                );
            }
        }
        return days;
    };

    return (
        <div className="calendar-container">
            {/* شريط البحث عن التاريخ */}
            <div className="calendar-search-bar">
                <input
                    type="date"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    className="search-date-input"
                    aria-label="اختر تاريخ للبحث"
                />
                <button onClick={handleSearchClick} className="search-button" aria-label="بحث">
                    <span className="search-icon">🔍</span>
                </button>
            </div>

            {/* رأس الكاليندر */}
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)} className="calendar-arrow-btn" aria-label="الشهر السابق">
                    <span className="calendar-arrow-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18l-6-6 6-6" stroke="#23a6d5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
                <h2>
                    {monthName} {currentYear}
                </h2>
                <button onClick={() => changeMonth(1)} className="calendar-arrow-btn" aria-label="الشهر التالي">
                    <span className="calendar-arrow-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M9 6l6 6-6 6" stroke="#23a6d5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
            </div>

            <div className="calendar-grid">
                <div className="day-label">الأحد</div>
                <div className="day-label">الإثنين</div>
                <div className="day-label">الثلاثاء</div>
                <div className="day-label">الأربعاء</div>
                <div className="day-label">الخميس</div>
                <div className="day-label">الجمعة</div>
                <div className="day-label">السبت</div>
                {generateDays()}
            </div>

            {/* الشرح الخاص بالألوان (يظهر فقط للهيلث ووركر) */}
            {role === "HEALTH_WORKER" && (
                <div className="legend legend-under-calendar">
                    <div className="legend-item">
                        <span className="legend-box today-legend"></span> اليوم الحالي
                    </div>
                    <div className="legend-item">
                        <span className="legend-box yesterday-legend"></span> أمس
                    </div>
                    <div className="legend-item">
                        <span className="legend-box tomorrow-legend"></span> غداً
                    </div>

                </div>
            )}
        </div>
    );
};

export default Calendar;
