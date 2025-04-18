import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReviewsPage = () => {
  const { id } = useParams(); // vaccineId
  const [symptoms, setSymptoms] = useState('');
  const [vaccine, setVaccine] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // تحميل معلومات اللقاح
    const fetchVaccine = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/vaccinations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        setVaccine(data);
      } catch (error) {
        console.error('❌ خطأ في تحميل معلومات اللقاح:', error);
      }
    };

    fetchVaccine();
  }, [id]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8080/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sideEffects: symptoms,
          vaccination: vaccine,
          parent: { id: 1 } // 👈 عينة ثابتة، عدل حسب Parent الحقيقي
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Received:", result);

        setDiagnosis(result.diagnosis);
        setSuggestions(result.suggestions);
      } else {
        console.error('❌ فشل إرسال البيانات:', response.status);
      }
    } catch (error) {
      console.error('❌ خطأ أثناء تحليل الأعراض:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-6" dir="rtl">
        <h1 className="text-2xl font-bold mb-4 text-center">تحليل الأعراض بالذكاء الاصطناعي</h1>

        {vaccine && (
            <div className="bg-white shadow-md rounded p-4 mb-6">
              <h2 className="text-xl font-semibold mb-2">معلومات اللقاح:</h2>
              <p><strong>اسم اللقاح:</strong> {vaccine.name}</p>
              <p><strong>النوع:</strong> {vaccine.type}</p>
            </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label>أدخل الأعراض التي ظهرت على الطفل:</label>
            <textarea
                className="w-full p-2 border rounded"
                rows="6"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="مثلاً: احمرار، انتفاخ، حرارة..."
                required
            />
          </div>

          <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? '🔄 جاري التحليل...' : '🔍 تحليل الأعراض'}
          </button>
        </form>

        {diagnosis && (
            <div className="mt-6 p-4 bg-green-100 rounded text-center">
              <h3 className="text-lg font-semibold mb-2">🔬 التشخيص:</h3>
              <p>{diagnosis}</p>
            </div>
        )}

        {suggestions && (
            <div className="mt-6 p-4 bg-yellow-100 rounded">
              <h3 className="text-lg font-semibold mb-4 text-center">💡 النصائح الطبية:</h3>
              <ul className="list-disc list-inside space-y-2 text-right">
                {suggestions
                    .split('\n')
                    .map((item, index) => {
                      // تنظيف التنسيقات الخاصة بـ Markdown
                      const cleanItem = item.replace(/\*\*/g, '').replace(/^\*\s*/, '').trim();
                      return cleanItem && <li key={index}>{cleanItem}</li>;
                    })}
              </ul>
            </div>
        )}
      </div>
  );
};

export default ReviewsPage;
