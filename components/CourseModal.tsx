import React, { useState } from 'react';

interface Week {
  title: string;
  description: string;
  topics: string[];
}

interface Course {
  id: number;
  headline: string;
  title: string;
  level: string;
  description: string;
  weeks: Week[];
  details: {
    type: 'list' | 'text';
    title?: string;
    items: string[];
  }[];
}

interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

const AccordionItem: React.FC<{ week: Week; isOpen: boolean; onClick: () => void }> = ({ week, isOpen, onClick }) => {
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
        </div>
      )}
    </div>
  );
};


const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
  const [openWeekIndex, setOpenWeekIndex] = useState<number | null>(0);

  const handleWeekClick = (index: number) => {
    setOpenWeekIndex(openWeekIndex === index ? null : index);
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
          <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">{course.level}</span>
          <h2 id="course-title" className="text-3xl font-black text-white">{course.title}</h2>
          <p className="mt-2 text-slate-400">{course.description}</p>
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
