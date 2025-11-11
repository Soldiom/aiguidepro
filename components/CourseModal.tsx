import React, { useState } from 'react';
import type { Course, Week } from '../types/course';
import { openExternal } from '../utils/openExternal';

// Types moved to types/course.ts

interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

const AccordionItem: React.FC<{ week: Week; isOpen: boolean; onClick: () => void; onSmartHelp?: () => void }> = ({ week, isOpen, onClick, onSmartHelp }) => {
  return (
    <div className="border-b border-slate-700">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-right py-4 px-2 text-white hover:bg-slate-700/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-lg">{week.title}</span>
        <svg
          className={`w-5 h-5 transition-transform transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-900/50">
          <p className="text-slate-400 mb-4">{week.description}</p>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            {week.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
          {onSmartHelp && (
            <div className="mt-4">
              <button
                onClick={onSmartHelp}
                className="bg-emerald-500 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600"
              >
                مساعدة ذكية لهذا الأسبوع
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
  const [openWeekIndex, setOpenWeekIndex] = useState<number | null>(0);
  const [includeTopics, setIncludeTopics] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('aiguidepro.includeTopics');
    return stored === 'false' ? false : true;
  });
  const [toast, setToast] = useState<string | null>(null);

  const handleWeekClick = (index: number) => {
    setOpenWeekIndex(openWeekIndex === index ? null : index);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const composeWeekPrompt = (week: Week) => {
    const header = `أنت مستشار الذكاء الاصطناعي AIGuidePro. ساعدني بوضوح وبالعربية فقط.`;
    const context = `\n\nالدورة: ${course.title}\nالمستوى: ${course.level}\nالأسبوع: ${week.title}\nالوصف: ${week.description}`;
    const topics = includeTopics && week.topics?.length ? `\nالموضوعات:\n- ${week.topics.join('\n- ')}` : '';
    const ask = `\n\nالمطلوب: اشرح النقاط عملياً بخطوات قصيرة، أمثلة بسيطة، وتمارين صغيرة قابلة للتنفيذ. ثم أعطني اختباراً قصيراً (3 أسئلة) للإتقان.`;
    return header + context + topics + ask;
  };

  const handleSmartHelp = async (week: Week) => {
    const prompt = composeWeekPrompt(week);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(prompt);
      } else {
        const ta = document.createElement('textarea');
        ta.value = prompt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('تم نسخ سياق الأسبوع. افتح AIGuidePro والصقه في الرسالة الأولى.');
    } catch {
      showToast('تعذر النسخ تلقائياً. افتح AIGuidePro وانسخ الرسالة يدوياً.');
    }
    const url = course.consultantUrl || 'https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro';
    openExternal(url);
  };

  const handleCopyOnlyWeek = async (week: Week) => {
    const prompt = composeWeekPrompt(week);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(prompt);
      } else {
        const ta = document.createElement('textarea');
        ta.value = prompt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('تم النسخ — يمكنك لصق الرسالة في AIGuidePro.');
    } catch {
      showToast('تعذر النسخ تلقائياً — انسخ الرسالة يدوياً.');
    }
  };

  const composeCoursePrompt = () => {
    const header = `أنت مستشار الذكاء الاصطناعي AIGuidePro. ساعدني بوضوح وبالعربية فقط.`;
    const context = `\n\nالدورة: ${course.title}\nالمستوى: ${course.level}\nالوصف العام: ${course.description}`;
    const weeksList = course.weeks?.length
      ? `\nخطة الأسابيع:\n${course.weeks
          .map((w, i) => `الأسبوع ${i + 1}: ${w.title}${includeTopics && w.topics?.length ? `\n- ${w.topics.join('\n- ')}` : ''}`)
          .join('\n')}`
      : '';
    const ask = `\n\nالمطلوب: ضع لي خطة تعلم عملية مختصرة لمحتوى الدورة، بخطوات تطبيقية، أمثلة قصيرة، وتمارين، ثم اختبار قصير نهائي. التزم باللغة العربية فقط.`;
    return header + context + weeksList + ask;
  };

  const handleSmartHelpCourse = async () => {
    const prompt = composeCoursePrompt();
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(prompt);
      } else {
        const ta = document.createElement('textarea');
        ta.value = prompt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('تم نسخ سياق الدورة. افتح AIGuidePro والصقه في الرسالة الأولى.');
    } catch {
      showToast('تعذر النسخ تلقائياً. افتح AIGuidePro وانسخ الرسالة يدوياً.');
    }
    const url = course.consultantUrl || 'https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro';
    openExternal(url);
  };

  const handleCopyOnlyCourse = async () => {
    const prompt = composeCoursePrompt();
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(prompt);
      } else {
        const ta = document.createElement('textarea');
        ta.value = prompt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('تم النسخ — يمكنك لصق الرسالة في AIGuidePro.');
    } catch {
      showToast('تعذر النسخ تلقائياً — انسخ الرسالة يدوياً.');
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-title"
    >
      <div
        className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full self-start">{course.level}</span>
            {course.source === 'generated' && (
              <span className="inline-block bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded self-start">متولدة تلقائياً</span>
            )}
          </div>
          <h2 id="course-title" className="text-3xl font-black text-white">{course.title}</h2>
          <p className="mt-2 text-slate-400">{course.description}</p>
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
            {course.consultantUrl && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSmartHelpCourse}
                  className="bg-emerald-500 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600"
                >
                  مساعدة ذكية للدورة
                </button>
                <button
                  type="button"
                  onClick={handleCopyOnlyCourse}
                  className="bg-slate-700 text-white font-bold py-2 px-3 rounded hover:bg-slate-600"
                  title="نسخ فقط"
                >
                  نسخ فقط
                </button>
              </div>
            )}
            <label className="inline-flex items-center gap-2 text-slate-300 text-sm select-none">
              <input
                type="checkbox"
                className="accent-emerald-500"
                checked={includeTopics}
                onChange={(e) => {
                  setIncludeTopics(e.target.checked);
                  try { localStorage.setItem('aiguidepro.includeTopics', String(e.target.checked)); } catch {}
                }}
              />
              تضمين المواضيع في الرسالة
            </label>
          </div>
        </header>
        
        <div className="border-t border-slate-700 pt-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">محتوى الدورة الكامل</h3>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
                {course.weeks.map((week, index) => (
                  <AccordionItem
                    key={index}
                    week={week}
                    isOpen={openWeekIndex === index}
                    onClick={() => handleWeekClick(index)}
                    onSmartHelp={() => handleSmartHelp(week)}
                  />
                ))}
            </div>
          </div>

          {course.details.map((detail, index) => (
            <div key={index}>
              {detail.title && <h3 className="text-xl font-bold text-orange-400 mb-3">{detail.title}</h3>}
              {detail.type === 'list' ? (
                <ul className="space-y-2 list-disc list-inside text-slate-300">
                  {detail.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300 leading-relaxed">{detail.items.join(' ')}</p>
              )}
            </div>
          ))}
        </div>

      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CourseModal;
