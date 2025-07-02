import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrochip,
  faShieldAlt,
  faClipboardList,
  faSearchPlus,
  faSpinner,
  faHandsHelping,
  faCheckCircle,
  faFirstAid,
  faPrescriptionBottleAlt,
  faCloudUploadAlt,
  faUserGroup,
  faUserCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTag,
  faNotesMedical,
  faChartSimple,
  faBandage,
  faSmile,
  faSkullCrossbones,
  faBabyCarriage,
  faChartPie,
  faStethoscope,
  faChevronDown,
  faRobot // New icon for the bot button
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

// دالة لتعديل التشخيص للعرض حسب شروطك
function mapDiagnosisForDisplay(diagnosis) {
  if (!diagnosis) return '';
  const normalized = diagnosis.trim().replace(/_/g, ' ');
  if (normalized === 'ردة فعل طبيعية') return 'استجابة متوقعة';
  if (normalized === 'تحسس') return 'بحاجة لمتابعة';
  if (normalized === 'حالة خطيرة' || normalized.includes('خطير') || normalized.includes('طارئ')) return 'حالة طارئة';
  return normalized;
}

const ReviewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [vaccine, setVaccine] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);

  // Dynamic statistics from feedbacks:
  function getCommonItems(feedbacks, fieldName) {
    const countMap = {};
    let total = 0;
    feedbacks.forEach(fb => {
      if (fb[fieldName]) {
        fb[fieldName].split(',').forEach(rawItem => {
          const item = rawItem.trim();
          if (item) {
            countMap[item] = (countMap[item] || 0) + 1;
            total += 1;
          }
        });
      }
    });
    return Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count], idx) => ({
          id: idx + 1,
          name,
          count,
          percentage: total ? Math.round((count / total) * 100) + "%" : "0%"
        }));
  }
  const commonSideEffects = getCommonItems(feedbacks, 'sideEffects');
  const commonTreatments = getCommonItems(feedbacks, 'treatment');

  // Fetch vaccine info
  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/vaccinations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch vaccine information');
        const data = await response.json();
        setVaccine(data);
      } catch (err) {
        setError('تعذر تحميل معلومات اللقاح. يرجى المحاولة مرة أخرى.');
      }
    };
    fetchVaccine();
  }, [id]);

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/feedbacks/by-vaccination/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } else if (response.status === 404) {
        setFeedbacks([]);
      } else {
        setFeedbacks([]);
      }
    } catch (err) {
      setError('تعذر تحميل تعليقات الأهالي. يرجى المحاولة مرة أخرى.');
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [id, currentFeedbackId]);
  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError(null);
    setDiagnosis('');
    setSuggestions('');
    setCurrentFeedbackId(null);

    if (!vaccine) {
      setError('لا يمكن تحليل الأعراض. لم يتم تحميل معلومات اللقاح بعد.');
      return;
    }
    if (!symptoms.trim()) {
      setError('الرجاء إدخال الأعراض لتحليلها.');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const parentId = localStorage.getItem("parentId"); // تأكد انه موجود

      // ** أطبع المعلومات التي سترسلها **
      console.log("سأرسل البيانات التالية:", {
        sideEffects: symptoms,
        parent: { id: Number(parentId) },
        vaccination: { id: vaccine.id }
      });

      // ** أرسل البودي بالطريقة الصحيحة **
      const response = await fetch(`http://localhost:8080/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sideEffects: symptoms,
          parent: { id: Number(parentId) },
          vaccination: { id: vaccine.id }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDiagnosis(result.diagnosis);
        setSuggestions(result.suggestions);
        setCurrentFeedbackId(result.feedbackId);
      } else {
        const errorData = await response.json();
        let userMessage = errorData.detail || errorData.message || 'فشل إرسال البيانات. يرجى التأكد من صحة المدخلات.';
        userMessage = userMessage.replace(/^(\d+\s+BAD_REQUEST\s*)?["“”']?/, '').replace(/["“”']?$/, '');
        setError(userMessage);
      }

    } catch (err) {
      setError('حدث خطأ غير متوقع أثناء تحليل الأعراض. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };


  const handleSaveTreatment = async () => {
    setError(null);
    if (!diagnosis) {
      setError('يجب تحليل الأعراض أولاً قبل إضافة العلاج.');
      return;
    }
    if (!treatment.trim()) {
      setError('الرجاء إدخال العلاج أو الإجراء.');
      return;
    }
    if (!currentFeedbackId) {
      setError('لم يتم تحديد مرجع للتعليق (Feedback ID). يرجى إعادة تحليل الأعراض.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/feedbacks/${currentFeedbackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: currentFeedbackId,
          sideEffects: symptoms,
          messageText: diagnosis,
          treatment: treatment,
          vaccination: { id: vaccine.id },
          parent: { id: 1 }
        })
      });

      if (response.ok) {
        await fetchFeedbacks();
        setSymptoms('');
        setTreatment('');
        setDiagnosis('');
        setSuggestions('');
        setCurrentFeedbackId(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'فشل إضافة العلاج. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع أثناء حفظ العلاج. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for diagnosis style/icons
  const getDiagnosisClass = (diag) => {
    const cleanedDiag = mapDiagnosisForDisplay(diag); // Use mapDiagnosisForDisplay here
    switch (cleanedDiag) {
      case 'استجابة متوقعة':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: faSmile,
          titleColor: 'text-green-700'
        };
      case 'بحاجة لمتابعة':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-300',
          textColor: 'text-amber-800',
          iconColor: 'text-amber-600',
          icon: faExclamationTriangle,
          titleColor: 'text-amber-700'
        };
      case 'حالة طارئة':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: faSkullCrossbones,
          titleColor: 'text-red-700'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: faInfoCircle,
          titleColor: 'text-blue-700'
        };
    }
  };
  const currentDiagnosisClasses = getDiagnosisClass(diagnosis);

  // Smooth scroll
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
      <div className="max-w-screen-2xl w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-12 mr-0">

        {/* Introduction Section */}
        <div className="w-full max-w-screen-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-12 transform hover:scale-[1.005] transition-transform duration-300 mx-auto relative overflow-hidden">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-6 leading-tight drop-shadow-md">
            <FontAwesomeIcon icon={faStethoscope} className="text-teal-500 ml-4 animate-pulse-subtle" /> رعاية طفلك أصبحت أذكى!
          </h1>
          <p className="text-lg text-gray-700 text-center mb-8 max-w-3xl mx-auto leading-relaxed">
            أداتنا الشاملة هنا لتمكينك من فهم شامل لأعراض ما بعد اللقاح لطفلك. نحن نقدم لك قوة <b className="text-teal-600">تحليل الذكاء الاصطناعي المتقدم</b>، ونشاركك <b className="text-purple-600">تجارب الأهالي الواقعية</b>، ونعرض لك <b className="text-green-600">إحصائيات مهمة</b> لقراراتك.
            <br /><br />
            ولتعزيز دعمك، يتوفر <b className="text-pink-600">لقاح بوت</b> كمساعدك الافتراضي الذكي، لتقديم إجابات فورية وموثوقة على كل استفساراتك حول التطعيمات، من أهميتها وأنواعها إلى جداولها وآثارها الجانبية، لتبقى على اطلاع دائم.
          </p>
          <div className="grid md:grid-cols-4 gap-6 text-center"> {/* Changed to grid-cols-4 */}
            <div
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200 shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => scrollToSection('ai-analysis-section')}
            >
              <FontAwesomeIcon icon={faMicrochip} className="text-purple-600 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-indigo-800 mb-2">تحليل الذكاء الاصطناعي</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                أدخل الأعراض، واحصل على تشخيص مقترح ونصائح.
              </p>
            </div>
            <div
                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => scrollToSection('parent-feedback-section')}
            >
              <FontAwesomeIcon icon={faBabyCarriage} className="text-blue-600 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-blue-800 mb-2">تجارب الأهالي</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                استفد من تجارب الآخرين أو شارك تجربتك.
              </p>
            </div>
            <div
                className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-green-200 shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => scrollToSection('statistics-section')}
            >
              <FontAwesomeIcon icon={faChartPie} className="text-green-600 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-green-800 mb-2">إحصائيات مهمة</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                اطلع على إحصائيات الأعراض والعلاجات الشائعة.
              </p>
            </div>
            {/* New Button/Box for Vaccine Bot */}
            <div
                className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-200 shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => navigate('/vaccine-bot-interaction')} // Direct navigation
            >
              <FontAwesomeIcon icon={faRobot} className="text-rose-600 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-pink-800 mb-2">تحدث مع لقاح بوت</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                مساعد افتراضي للإجابة على أي استفسارات تتعلق بالتطعيمات بشكل عام.              </p>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-2xl" />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-screen-2xl flex flex-col md:flex-row gap-8 mb-12 mx-auto" dir="rtl">
          {/* AI Analysis Section */}
          <div id="ai-analysis-section" className="flex-[2.75] flex flex-col space-y-7 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 transform hover:scale-[1.005] transition-transform duration-300">
            <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-6 drop-shadow-md border-b-2 pb-4 border-indigo-200">
              <FontAwesomeIcon icon={faMicrochip} className="text-indigo-600 ml-3" /> تحليل الأعراض بالذكاء الاصطناعي
            </h2>

            {/* Vaccine Information */}
            {vaccine && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-inner border border-purple-200 text-lg mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-3 border-b pb-2 border-purple-300 flex items-center justify-start">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-purple-600 text-xl ml-2" />
                    معلومات اللقاح
                  </h3>
                  <div className="flex items-center justify-start text-right pr-2">
                    <FontAwesomeIcon icon={faTag} className="text-purple-500 text-base ml-2" />
                    <strong>الاسم:</strong>
                    <span className="font-semibold mr-2">{vaccine.name}</span>
                  </div>
                </div>

            )}

            {/* Symptom Recording */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-inner border border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-5 border-b pb-3 border-blue-300 flex items-center justify-start">
                <FontAwesomeIcon icon={faNotesMedical} className="text-blue-600 text-2xl ml-2" />
                سجل الأعراض
              </h3>

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div>
                  <label htmlFor="symptoms" className="block text-base font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faClipboardList} className="text-gray-500 ml-2" /> أدخل الأعراض التي ظهرت على الطفل:
                  </label>
                  <textarea
                      id="symptoms"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base placeholder-gray-400 focus:placeholder-gray-300 shadow-sm focus:shadow-md"
                      rows="4"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="مثلاً: احمرار خفيف، ارتفاع حرارة، بكاء مستمر."
                      required
                  /> {error && (
                    <div className="mt-2 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 text-sm text-rose-700 flex items-center shadow-sm animate-fade-in">
                      <svg className="w-5 h-5 text-rose-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.105-2.045l-6.928-11.99c-.526-.907-1.684-.907-2.21 0l-6.928 11.99c-.553.905.051 2.045 1.105 2.045z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                )}
                </div>
                <button
                    type="submit"
                    disabled={loading || !symptoms.trim()}
                    className={`w-full py-2 rounded-lg text-lg font-bold transition-all duration-300 flex items-center justify-center
                  ${loading || !symptoms.trim()
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md hover:shadow-lg'
                    }`}
                >
                  {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="ml-3" /> جاري التحليل...
                      </>
                  ) : (
                      <>
                        <FontAwesomeIcon icon={faSearchPlus} className="ml-3" /> تحليل الأعراض
                      </>
                  )}
                </button>
              </form>
            </div>

            {diagnosis && (
                <>
                  {/* Diagnosis Box */}
                  <div className={`mt-8 p-6 rounded-xl text-center shadow-lg transform hover:scale-[1.01] transition-transform duration-300
                  ${currentDiagnosisClasses.bgColor} ${currentDiagnosisClasses.borderColor} border`}>
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center text-gray-900">
                      <FontAwesomeIcon icon={currentDiagnosisClasses.icon} className={`${currentDiagnosisClasses.iconColor} text-3xl ml-3 animate-fade-in`} /> تشخيص الذكاء الاصطناعي:
                    </h3>
                    <p className={`text-xl leading-relaxed ${currentDiagnosisClasses.textColor}`}>
                      {mapDiagnosisForDisplay(diagnosis)}
                    </p>
                  </div>

                  {/* Diagnosis Key */}
                  <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl shadow-inner border border-green-200 mt-6">
                    <h3 className="text-xl font-bold text-green-800 mb-5 border-b pb-3 border-green-300 flex items-center justify-center">
                      <FontAwesomeIcon icon={faInfoCircle} className="text-green-600 text-2xl ml-3" /> فهم التشخيصات
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-right">
                      <div className={`p-4 rounded-xl border ${getDiagnosisClass('استجابة متوقعة').bgColor} ${getDiagnosisClass('استجابة متوقعة').borderColor} shadow-sm`}>
                        <h4 className={`text-base font-bold mb-1 flex items-center ${getDiagnosisClass('استجابة متوقعة').titleColor}`}>
                          <FontAwesomeIcon icon={faSmile} className={`${getDiagnosisClass('استجابة متوقعة').iconColor} text-xl ml-2`} /> استجابة متوقعة
                        </h4>
                        <p className={`text-sm ${getDiagnosisClass('استجابة متوقعة').textColor}`}>
                          أعراض شائعة ولا تدعو للقلق.
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl border ${getDiagnosisClass('بحاجة لمتابعة').bgColor} ${getDiagnosisClass('بحاجة لمتابعة').borderColor} shadow-sm`}>
                        <h4 className={`text-base font-bold mb-1 flex items-center ${getDiagnosisClass('بحاجة لمتابعة').titleColor}`}>
                          <FontAwesomeIcon icon={faExclamationTriangle} className={`${getDiagnosisClass('بحاجة لمتابعة').iconColor} text-xl ml-2`} /> بحاجة لمتابعة
                        </h4>
                        <p className={`text-sm ${getDiagnosisClass('بحاجة لمتابعة').textColor}`}>
                          راقب الأعراض عن كثب وقد تحتاج لاستشارة.
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl border ${getDiagnosisClass('حالة طارئة').bgColor} ${getDiagnosisClass('حالة طارئة').borderColor} shadow-sm`}>
                        <h4 className={`text-base font-bold mb-1 flex items-center ${getDiagnosisClass('حالة طارئة').titleColor}`}>
                          <FontAwesomeIcon icon={faSkullCrossbones} className={`${getDiagnosisClass('حالة طارئة').iconColor} text-xl ml-2`} /> حالة طارئة
                        </h4>
                        <p className={`text-sm ${getDiagnosisClass('حالة طارئة').textColor}`}>
                          اطلب مساعدة طبية فورية.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions Box */}
                  {suggestions && (
                      <div className="mt-6 p-6 bg-amber-50 rounded-xl border border-amber-200 shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-xl font-bold text-amber-800 mb-5 text-center flex items-center justify-center">
                          <FontAwesomeIcon icon={faHandsHelping} className="text-amber-600 text-2xl ml-3" /> نصائح موصى بها:
                        </h3>
                        <ul className="list-none space-y-3 text-lg text-gray-800 leading-relaxed pr-3">
                          {suggestions
                              .split('\n')
                              .map((item, index) => {
                                const cleanItem = item.replace(/\*\*/g, '').replace(/^\*\s*/, '').trim();
                                return cleanItem && (
                                    <li key={index} className="flex items-start mb-2">
                                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-base mt-1 ml-3 flex-shrink-0" />
                                      <span>{cleanItem}</span>
                                    </li>
                                );
                              })}
                        </ul>
                      </div>
                  )}

                  {/* Treatment Input */}
                  <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-blue-200 transform hover:scale-[1.01] transition-transform duration-300">
                    <h3 className="text-xl font-bold text-blue-800 mb-5 border-b-2 pb-3 border-blue-300 flex items-center justify-start">
                      <FontAwesomeIcon icon={faFirstAid} className="text-blue-600 text-2xl ml-2" />
                      العلاج أو الإجراء المتخذ
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label htmlFor="treatment" className="block text-base font-medium text-gray-700 mb-2">
                          <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="text-gray-500 ml-2" /> أدخل العلاج أو الإجراء:
                        </label>
                        <textarea
                            id="treatment"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base placeholder-gray-400 focus:placeholder-gray-300 shadow-sm focus:shadow-md"
                            rows="3"
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                            placeholder="مثال: أعطيت خافض حرارة، كمادات باردة."
                        />
                      </div>
                      <button
                          type="button"
                          onClick={handleSaveTreatment}
                          disabled={loading || !treatment.trim() || !currentFeedbackId}
                          className={`w-full py-2 rounded-lg text-lg font-bold transition-all duration-300 flex items-center justify-center
                      ${loading || !treatment.trim() || !currentFeedbackId
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-md hover:shadow-lg'
                          }`}
                      >
                        {loading ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin className="ml-3" /> جاري الحفظ...
                            </>
                        ) : (
                            <>
                              <FontAwesomeIcon icon={faCloudUploadAlt} className="ml-3" /> حفظ العلاج ومشاركة التجربة
                            </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
            )}
          </div>

          {/* Parent Feedback Section */}
          <div id="parent-feedback-section" className="flex-[1.25] flex flex-col">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 sticky md:top-6">
              <h2 className="text-2xl font-extrabold text-center text-blue-800 mb-6 border-b-2 pb-3 border-blue-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGroup} className="text-blue-600 text-3xl ml-3" /> تجارب الأهالي على التطعيم
              </h2>
              {Array.isArray(feedbacks) && feedbacks.length === 0 ? (
                  <div className="text-gray-600 text-center py-5 px-4 bg-blue-50 rounded-lg shadow-inner border border-blue-200 text-base">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 text-2xl mb-3" />
                    <p className="font-medium">لا توجد تعليقات بعد لهذا اللقاح.</p>
                    <p className="text-base mt-1">كن أول من يشارك تجربته!</p>
                  </div>
              ) : (
                  Array.isArray(feedbacks) && (
                      <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-3 custom-scrollbar">
                        {feedbacks.map((fb, i) => {
                          const feedbackDiagnosisClasses = getDiagnosisClass(fb.messageText);
                          return (
                              <div key={i} className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-md border ${feedbackDiagnosisClasses.borderColor} hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group`}>
                                <div className={`absolute top-0 right-0 h-1.5 w-full ${feedbackDiagnosisClasses.borderColor.replace('border-', 'bg-')} group-hover:h-2 transition-all duration-300`}></div>
                                <div className="flex items-center mb-2">
                                  <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 text-xl ml-3" />
                                  <span className="font-bold text-gray-800 text-lg">أحد الأهالي</span>
                                </div>
                                <div className="text-gray-700 text-base mb-1">
                                  <span className="font-semibold text-gray-900">الأعراض:</span>{' '}
                                  {fb.sideEffects || <span className="text-gray-400">—</span>}
                                </div>
                                <div className="text-blue-700 text-base mb-1">
                                  <span className="font-semibold text-blue-900">العلاج:</span>{' '}
                                  {fb.treatment || <span className="text-gray-400">—</span>}
                                </div>
                                {/* Updated Diagnosis Display for Parent Feedback */}
                                <div className={`text-base mb-1 ${feedbackDiagnosisClasses.textColor}`}>
                                  <span className={`font-semibold ${feedbackDiagnosisClasses.titleColor}`}>تشخيص الـ AI:</span>{' '}
                                  {fb.messageText ? (
                                      <>
                                        <FontAwesomeIcon icon={feedbackDiagnosisClasses.icon} className={`${feedbackDiagnosisClasses.iconColor} text-base ml-1`} />
                                        {mapDiagnosisForDisplay(fb.messageText)}
                                      </>
                                  ) : (
                                      <span className="text-gray-400">—</span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 text-left mt-3 pt-2 border-t border-blue-200 flex items-center justify-end">
                                  <FontAwesomeIcon icon={faCalendarAlt} className="ml-2" />
                                  {fb.dateSubmitted
                                      ? (
                                          <>
                                            <span>{new Date(fb.dateSubmitted).toLocaleDateString('ar-EG', { dateStyle: 'short' })}</span>
                                            <span className="mx-2">|</span> {/* Separator */}
                                            <span>{new Date(fb.dateSubmitted).toLocaleTimeString('ar-EG', { timeStyle: 'short' })}</span>
                                          </>
                                      )
                                      : <span className="text-gray-400">—</span>
                                  }
                                </div>
                              </div>
                          );
                        })}
                      </div>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div id="statistics-section" className="w-full max-w-screen-2xl mt-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 pb-4 border-b-2 border-gray-300">
            <FontAwesomeIcon icon={faChartSimple} className="text-indigo-600 text-3xl ml-3" /> إحصائيات عامة عن اللقاح
          </h2>
          <div className="flex flex-col md:flex-row gap-8">

            {/* Common Side Effects Table */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 transform hover:scale-[1.005] transition-transform duration-300">
              <h3 className="text-xl font-bold text-blue-800 mb-5 border-b-2 pb-3 border-blue-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartSimple} className="text-blue-600 text-2xl ml-3" />  الأعراض الجانبية الشائعة من تجارب الأهالي
              </h3>
              <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
                <table className="min-w-full text-lg">
                  <thead className="bg-blue-100 border-b border-blue-200">
                  <tr>
                    <th className="py-3 px-4 text-right text-gray-700 font-bold uppercase tracking-wider">الرقم</th>
                    <th className="py-3 px-4 text-right text-gray-700 font-bold uppercase tracking-wider">العَرَض</th>
                    <th className="py-3 px-4 text-right text-gray-700 font-bold uppercase tracking-wider">النسبة</th>
                  </tr>
                  </thead>
                  <tbody>
                  {commonSideEffects.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-3 px-4 text-gray-800 text-right">{index + 1}</td>
                        <td className="py-3 px-4 text-gray-800 text-right">{item.name}</td>
                        <td className="py-3 px-4 text-gray-800 text-right font-semibold">{item.percentage}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Treatments Table */}
            <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 transform hover:scale-[1.005] transition-transform duration-300">
              <h3 className="text-xl font-bold text-green-800 mb-5 border-b-2 pb-3 border-green-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faBandage} className="text-green-600 text-2xl ml-3" /> العلاجات الشائعة
              </h3>
              <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
                <table className="min-w-full text-lg">
                  <thead className="bg-green-100 border-b border-green-200">
                  <tr>
                    <th className="py-3 px-4 text-right text-gray-700 font-bold uppercase tracking-wider">الرقم</th>
                    <th className="py-3 px-4 text-right text-gray-700 font-bold uppercase tracking-wider">العلاج</th>
                    <th className="py-3 px-4 text-right text-gray-700 font-bold uppercase tracking-wider">النسبة</th>
                  </tr>
                  </thead>
                  <tbody>
                  {commonTreatments.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-3 px-4 text-gray-800 text-right">{index + 1}</td>
                        <td className="py-3 px-4 text-gray-800 text-right">{item.name}</td>
                        <td className="py-3 px-4 text-gray-800 text-right font-semibold">{item.percentage}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ReviewsPage;