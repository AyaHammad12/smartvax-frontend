import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faSpinner, faInfoCircle, faCommentDots } from '@fortawesome/free-solid-svg-icons';

const VaccineBotInteraction = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError(null);
        setAnswer('');
        if (!question.trim()) {
            setError('الرجاء إدخال سؤالك.');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('http://localhost:8080/api/ai/ask-vaccine-bot', {
                method: 'POST',
                headers,
                body: JSON.stringify({ question })
            });

            if (response.ok) {
                const data = await response.json();
                setAnswer(data.answer);
                setQuestion('');
            } else {
                let errorMessage = `حدث خطأ: ${response.status} ${response.statusText}`;
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        const errorText = await response.text();
                        errorMessage = errorText.substring(0, 200) + "...";
                    }
                } catch (parseError) {
                    errorMessage = `حدث خطأ غير متوقع في الخادم. الرجاء المحاولة لاحقًا. (الكود: ${response.status})`;
                }
                setError(errorMessage);
            }
        } catch (err) {
            setError(err.message || 'فشل الاتصال بخدمة لقاح بوت. يرجى التحقق من اتصالك بالإنترنت أو أن الخادم قيد التشغيل.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 font-sans antialiased text-right text-gray-800 flex flex-col items-center">
            <div className="w-full max-w-2xl ml-auto mr-8 bg-white/75 rounded-3xl shadow-2xl border border-blue-100/50 px-0 pt-0 pb-8 relative backdrop-blur-md">

                {/* عنوان جذاب بدون صورة */}
                <div className="rounded-t-3xl overflow-hidden mb-6">
                    <div className="h-20 bg-gradient-to-l from-cyan-400 to-blue-500 flex items-center justify-center">
                        <h2 className="text-4xl font-black text-white text-center tracking-wide flex items-center justify-center gap-3 py-1">
                            <FontAwesomeIcon icon={faRobot} className="text-white text-4xl" />
                            لقاح بوت - مساعد التطعيمات الذكي
                        </h2>

                    </div>
                </div>
                <p className="text-base text-gray-700 text-center mb-8 max-w-md mx-auto font-medium leading-7">
                    اسأل أي شيء عن التطعيمات: فوائدها، جداولها، الأعراض الجانبية، أو أي استفسار صحي حول اللقاحات!
                </p>
                <form onSubmit={handleSendMessage} className="space-y-5 max-w-lg mx-auto">
                    <div>
                        <label htmlFor="question" className="block text-base font-semibold text-blue-700 mb-2">
                            <FontAwesomeIcon icon={faCommentDots} className="text-cyan-400 ml-2" />
                            اكتب سؤالك هنا:
                        </label>
                        <textarea
                            id="question"
                            className="w-full p-4 border border-blue-200 bg-blue-50/60 rounded-xl text-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder:text-gray-400 placeholder:font-normal shadow-inner resize-none"
                            rows="4"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="مثلاً: ما هي أهمية تطعيم شلل الأطفال؟"
                            required
                        />
                        {!question.trim() && (
                            <div className="text-xs text-gray-400 mt-2 flex items-center gap-1 animate-pulse">
                                <FontAwesomeIcon icon={faInfoCircle} className="ml-1" />
                                يمكنك كتابة سؤالك حول أي لقاح أو جدول تطعيم.
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className={`
                            w-full py-3 rounded-xl text-xl font-bold flex items-center justify-center gap-2
                            transition-all duration-150
                            shadow-lg
                            ${loading || !question.trim()
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-l from-cyan-400 to-blue-600 text-white hover:scale-105 hover:shadow-2xl hover:brightness-110 active:scale-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
                        }
                        `}
                    >
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="ml-2" /> جاري البحث عن إجابة...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} className="ml-2" /> إرسال السؤال
                            </>
                        )}
                    </button>
                </form>
                {/* error message */}
                {error && (
                    <div className="mt-7 bg-red-50 border border-red-300 rounded-lg px-6 py-4 text-base text-red-700 flex items-center gap-3 shadow-sm animate-fade-in">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-red-400 text-lg flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {/* answer message */}
                {answer && (
                    <div className="mt-10 px-7 py-6 bg-gradient-to-l from-cyan-50 to-blue-100/50 rounded-2xl border border-blue-200/50 shadow-xl animate-fade-in-up">
                        <h3 className="text-xl font-extrabold text-blue-800 mb-3 flex items-center justify-start gap-2 border-b pb-2 border-blue-300/40">
                            <FontAwesomeIcon icon={faRobot} className="text-cyan-500 text-2xl" />
                            إجابة لقاح بوت:
                        </h3>

                        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">{answer}</p>
                    </div>
                )}
            </div>
            {/* Extra tailwind animation classes */}
            <style>
                {`
                .animate-fade-in {
                    animation: fadeIn .8s cubic-bezier(.4,0,.2,1) both;
                }
                .animate-fade-in-up {
                    animation: fadeInUp .8s cubic-bezier(.4,0,.2,1) both;
                }
                @keyframes fadeIn {
                    from {opacity: 0;}
                    to {opacity: 1;}
                }
                @keyframes fadeInUp {
                    from {opacity: 0; transform: translateY(32px);}
                    to {opacity: 1; transform: translateY(0);}
                }
                `}
            </style>
        </div>
    );
};

export default VaccineBotInteraction;
