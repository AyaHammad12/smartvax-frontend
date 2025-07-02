import React from "react";
import "../styles/HelpPage.css"; // تأكد من المسار الصحيح

const HelpPage = () => {
    return (
        <div className="help-main-wrapper">
            {/* صندوق الأسئلة الشائعة */}
            <div className="faq-container">
                <h2>الأسئلة الشائعة (FAQs)</h2>
                <div className="faq-section">
                    <details>
                        <summary>
                            كيف أحصل على معلومات عن لقاح معين؟
                            <span className="faq-arrow">▼</span>
                        </summary>
                        <p>
                            يمكنك معرفة جميع التفاصيل حول أي لقاح من خلال الضغط على موعد التطعيم في التقويم (الكاليندر)، وستظهر لك المعلومات المتعلقة باللقاح. كما يمكنك الاستعانة بخاصية "لقاح بوت" في الشريط الجانبي لطرح أي سؤال حول اللقاحات.
                        </p>
                    </details>

                    <details>
                        <summary>
                            كيف يمكنني تأجيل الموعد أو تغيير موقع التطعيم؟
                            <span className="faq-arrow">▼</span>
                        </summary>
                        <p>
                            يمكنك إدارة مواعيد التطعيم الخاصة بك بسهولة من خلال الذهاب إلى "مواعيدي" في الشريط الجانبي. هناك ستجد خيارات لتأكيد الحضور، تأجيل الموعد، أو تغيير موقع التطعيم.
                        </p>
                    </details>

                    <details>
                        <summary>
                            هل تتوفر خاصية ذكاء اصطناعي في الموقع؟
                            <span className="faq-arrow">▼</span>
                        </summary>
                        <p>
                            نعم، يوفر SmartVax خاصية الذكاء الاصطناعي عبر "لقاح بوت" الموجود في الشريط الجانبي، والذي يمكنه الإجابة على جميع استفساراتك الصحية المتعلقة بالتطعيمات والأعراض.
                        </p>
                    </details>

                    <details>
                        <summary>
                            كيف أعرف إذا كان وزن وطول طفلي مناسبين لعمره؟
                            <span className="faq-arrow">▼</span>
                        </summary>
                        <p>
                            يمكنك متابعة نمو طفلك بدقة من خلال خاصية "متابعة الطول والوزن" في الشريط الجانبي. ستجد هناك أدوات وتوصيات تساعدك على تقييم حالة طفلك.
                        </p>
                    </details>

                    <details>
                        <summary>
                            كيف أعرف أن موعد تطعيم طفلي قد اقترب؟
                            <span className="faq-arrow">▼</span>
                        </summary>
                        <p>
                            سنقوم بإرسال رسالة تذكير إلى بريدك الإلكتروني قبل 3 أيام من موعد التطعيم المقرر. تأكد من متابعة بريدك الإلكتروني باستمرار.
                        </p>
                    </details>
                </div>
            </div>

            {/* صندوق الدعم والتواصل */}
            <div className="support-container">
                <h2>المساعدة والدعم</h2>
                <p>
                    نحن هنا لمساعدتك! إذا كنت بحاجة إلى دعم إضافي، لا تتردد في التواصل مع فريق SmartVax عبر الوسائل التالية:
                </p>
                <div className="contact-info">
                    <strong>البريد الإلكتروني:</strong>{" "}
                    <a href="mailto:smartvax99@gmail.com">smartvax99@gmail.com</a>
                    <br />
                    <strong>رقم الهاتف:</strong>{" "}
                    <a href="tel:+123456789">+123456789</a>
                </div>
                <a
                    href="mailto:smartvax99@gmail.com?subject=دعم%20SmartVax&body=السلام%20عليكم،%20أحتاج%20إلى%20مساعدة%20حول..."
                    className="contact-btn"
                >
                    الاتصال بالدعم
                </a>
            </div>
        </div>
    );
};

export default HelpPage;
