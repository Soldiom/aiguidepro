import React, { useMemo, useState } from 'react';
import { generateCourses } from '../services/courseGenerator';
import { appendCourses, getStoredCourses } from '../storage/coursesStorage';
import type { Course } from '../types/course';

const AdminCourseGenerator: React.FC = () => {
  const [topicsText, setTopicsText] = useState<string>('الذكاء الاصطناعي للأعمال\nهندسة الأوامر\nتوليد الصور');
  const [countPerTopic, setCountPerTopic] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Course[]>([]);

  const topics = useMemo(() =>
    topicsText
      .split(/\n|,|؛/)
      .map(t => t.trim())
      .filter(Boolean)
  , [topicsText]);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const out = await generateCourses({ topics, countPerTopic });
      setPreview(out);
    } catch (e: any) {
      setError(e?.message || 'فشل إنشاء الدورات');
    } finally {
      setLoading(false);
    }
  };

  const onSave = () => {
    const merged = appendCourses(preview);
    setPreview([]);
    alert(`تم حفظ ${merged.length} دورة في النظام`);
  };

  const onExport = () => {
    try {
      const all = getStoredCourses();
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aiguidepro-courses.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('تم تصدير الدورات إلى ملف JSON');
    } catch (e) {
      alert('فشل التصدير');
    }
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('هيكل غير صالح');
        // basic shape check
        const cleaned: Course[] = parsed.filter(p => p && p.id && p.title);
        const merged = appendCourses(cleaned);
        alert(`تم استيراد ${cleaned.length} ودمجها. إجمالي الآن: ${merged.length}`);
      } catch (err: any) {
        alert('فشل الاستيراد: ' + (err?.message || 'خطأ غير معروف'));
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <section className="py-20 md:py-32 px-4 bg-slate-900">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 text-center">لوحة إدارة الدورات (عاملة محلياً)</h1>
        <p className="text-slate-400 mb-8 text-center">اكتب المواضيع بالعربية وحدد عدد الدورات لكل موضوع. سيتم إنشاء دورات عربية مبسطة ومتصلة بـ AIGuidePro كمستشار تلقائياً.</p>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-bold">المواضيع</label>
            <textarea
              className="w-full bg-slate-900 text-white rounded p-3 border border-slate-700 min-h-32"
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              placeholder="موضوع لكل سطر أو مفصول بفواصل"
            />
            <p className="text-slate-500 text-sm mt-1">مثال: الذكاء الاصطناعي للأعمال، هندسة الأوامر، توليد الصور</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-slate-300 font-bold">عدد الدورات لكل موضوع</label>
            <input
              type="number"
              min={1}
              max={5}
              value={countPerTopic}
              onChange={(e) => setCountPerTopic(Math.max(1, Math.min(5, Number(e.target.value) || 1)))}
              className="w-24 bg-slate-900 text-white rounded p-2 border border-slate-700"
            />
            <span className="text-slate-500 text-sm">(محدد للحفاظ على التكلفة)</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onGenerate}
              disabled={loading || topics.length === 0}
              className="bg-emerald-500 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء الدورات'}
            </button>
            <button
              onClick={onSave}
              disabled={preview.length === 0}
              className="bg-slate-700 text-white font-bold py-2 px-4 rounded hover:bg-slate-600 disabled:opacity-50"
            >
              حفظ في النظام
            </button>
            <button
              onClick={onExport}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500"
            >
              تصدير JSON
            </button>
            <label className="bg-slate-600 text-white font-bold py-2 px-4 rounded hover:bg-slate-500 cursor-pointer">
              استيراد JSON
              <input type="file" accept="application/json,.json" onChange={onImport} className="hidden" />
            </label>
          </div>

          {error && <div className="text-red-400">{error}</div>}
        </div>

        {preview.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">معاينة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preview.map((c) => (
                <div key={c.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">{c.level}</span>
                    <a href={c.consultantUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-sm underline">AIGuidePro</a>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-slate-400 mb-2">{c.description}</p>
                  <ul className="text-slate-300 list-disc list-inside">
                    {c.weeks.slice(0, 3).map((w, i) => (
                      <li key={i}>{w.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminCourseGenerator;
