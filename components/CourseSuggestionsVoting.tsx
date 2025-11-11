import React, { useEffect, useState } from 'react';
import type { CourseSuggestion } from '../types/suggestion';
import { getGeminiSuggestions } from '../services/courseSuggestions';
import { addSuggestions, getSuggestions, voteOnSuggestion, clearSuggestions } from '../storage/suggestionsStorage';
import { generateCourses } from '../services/courseGenerator';
import { appendCourses } from '../storage/coursesStorage';

const MIN_VOTES_TO_GENERATE = 5; // threshold to allow generation

const CourseSuggestionsVoting: React.FC = () => {
  const [topicHint, setTopicHint] = useState('تطبيقات الذكاء الاصطناعي في التعليم والوظائف المستقبلية');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoThreshold, setAutoThreshold] = useState<number>(MIN_VOTES_TO_GENERATE);

  useEffect(() => {
    setSuggestions(getSuggestions());
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true); setError(null);
    try {
      const fresh = await getGeminiSuggestions(topicHint, 6);
      const merged = addSuggestions(fresh);
      setSuggestions(merged);
    } catch(e: any) {
      setError(e?.message || 'فشل جلب الاقتراحات');
    } finally { setLoading(false); }
  };

  const handleVote = (id: string) => {
    const updated = voteOnSuggestion(id, 1);
    setSuggestions(updated);
  };

  const topSuggestion = suggestions.slice().sort((a,b) => b.votes - a.votes)[0];

  const canGenerate = topSuggestion && topSuggestion.votes >= autoThreshold;

  const generateTopCourse = async () => {
    if (!topSuggestion) return;
    setGenerating(true); setError(null);
    try {
      // Use its title as a topic to generate one course
      const courses = await generateCourses({ topics: [topSuggestion.title], countPerTopic: 1 });
      appendCourses(courses);
      alert(`تم توليد الدورة: ${courses[0].title}`);
    } catch(e: any) {
      setError(e?.message || 'فشل توليد الدورة');
    } finally { setGenerating(false); }
  };

  const resetSuggestions = () => {
    if (!window.confirm('مسح كل الاقتراحات؟')) return;
    clearSuggestions();
    setSuggestions([]);
  };

  return (
    <section className="py-16 px-4 bg-slate-900">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 text-center">اقتراحات الدورات والتصويت</h2>
        <p className="text-slate-400 text-center mb-8">اقترح Gemini أفكار دورات عربية. صوِّت للفكرة الأفضل. عند بلوغ الحد سيتم إنشاء دورة مجانية ونشرها.</p>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-slate-300 mb-2 font-bold">تلميح موضوع عام</label>
              <input
                type="text"
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
                className="w-full bg-slate-900 text-white rounded p-3 border border-slate-700"
                placeholder="مثال: تطبيقات الذكاء الاصطناعي في الصحة"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-400">حد الأصوات للتوليد</label>
              <input
                type="number"
                min={1}
                max={20}
                value={autoThreshold}
                onChange={(e) => setAutoThreshold(Math.max(1, Math.min(20, Number(e.target.value) || MIN_VOTES_TO_GENERATE)))}
                className="w-20 bg-slate-900 text-white rounded p-2 border border-slate-700"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchSuggestions}
                disabled={loading}
                className="bg-emerald-500 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600 disabled:opacity-50"
              >{loading ? 'جارٍ الاقتراح...' : 'جلب اقتراحات جديدة'}</button>
              <button
                onClick={resetSuggestions}
                className="bg-slate-700 text-white font-bold py-2 px-4 rounded hover:bg-slate-600"
              >مسح القائمة</button>
            </div>
          </div>
          {error && <div className="text-red-400 mt-4">{error}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map(s => (
            <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">{s.level || 'مستوى'}</span>
                <span className="text-xs text-slate-500">أصوات: {s.votes}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm flex-grow">{s.description}</p>
              <button
                onClick={() => handleVote(s.id)}
                className="mt-4 bg-indigo-600 text-white font-bold py-2 px-3 rounded hover:bg-indigo-500"
              >تصويت</button>
            </div>
          ))}
        </div>

        {topSuggestion && (
          <div className="mt-10 bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">الأعلى حالياً: {topSuggestion.title}</h3>
            <p className="text-slate-400 mb-4">الأصوات: {topSuggestion.votes} / الحد المطلوب: {autoThreshold}</p>
            <button
              onClick={generateTopCourse}
              disabled={!canGenerate || generating}
              className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
            >{generating ? 'جارٍ التوليد...' : 'توليد الدورة الآن'}</button>
            {!canGenerate && <p className="text-slate-500 text-sm mt-2">زد عدد الأصوات للوصول إلى حد التوليد.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSuggestionsVoting;
