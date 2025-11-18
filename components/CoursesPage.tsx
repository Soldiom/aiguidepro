import React, { useMemo, useState } from 'react';
import { courses, Course } from '../data/coursesData';
import NoraAI from './NoraAI';
import { CTAButton, SectionContainer } from './ui';

const levelFilters: Array<{ id: 'all' | Course['level']; label: string }> = [
  { id: 'all', label: 'جميع الدورات' },
  { id: 'مبتدئ', label: 'مبتدئ' },
  { id: 'متوسط', label: 'متوسط' },
  { id: 'متقدم', label: 'متقدم' },
];

const getLevelColor = (level: Course['level']) => {
  switch (level) {
    case 'مبتدئ':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'متوسط':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'متقدم':
    default:
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  }
};

const CoursesPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterLevel, setFilterLevel] = useState<'all' | Course['level']>('all');

  const filteredCourses = useMemo(() => {
    if (filterLevel === 'all') return courses;
    return courses.filter((course) => course.level === filterLevel);
  }, [filterLevel]);

  return (
    <>
      <SectionContainer
        as="section"
        className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        contentClassName="space-y-16"
      >
        <div className="space-y-8">
          <NoraAI
            message="مرحباً! 🎓 هذه دوراتنا التدريبية في الذكاء الاصطناعي. اختر الدورة المناسبة لمستواك، وسأكون معك في كل خطوة!"
            variant="avatar"
          />

          <div className="flex flex-wrap items-center justify-center gap-3 text-base">
            {levelFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterLevel(filter.id)}
                className={[
                  'px-5 py-2.5 rounded-2xl font-semibold transition-all border text-sm sm:text-base',
                  filterLevel === filter.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40 border-transparent'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-emerald-500/40 hover:text-white',
                ].join(' ')}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-gradient-to-br from-slate-800/60 to-slate-900 rounded-3xl border border-slate-700/80 hover:border-emerald-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer flex flex-col"
            >
              <div className="p-6 flex flex-col gap-5 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-bold text-white leading-snug flex-1">
                    {course.title}
                  </h3>
                  {course.status === 'قريباً' && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30 whitespace-nowrap">
                      قريباً
                    </span>
                  )}
                </div>

                <p className="text-slate-400 leading-relaxed flex-1">{course.description}</p>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600">
                    ⏱️ {course.duration}
                  </span>
                </div>

                <CTAButton
                  label="عرض التفاصيل"
                  variant="secondary"
                  className="mt-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedCourse(course);
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </SectionContainer>

      {selectedCourse && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            dir="rtl"
            className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex items-center justify-between gap-4 z-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">{selectedCourse.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-white">
                  <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
                    {selectedCourse.level}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                    ⏱️ {selectedCourse.duration}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="إغلاق"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400">رسالة من نورا</h3>
                    <p className="text-sm text-slate-400">مرشدتك في هذه الدورة</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedCourse.noraIntro}
                </p>
              </div>

              <section>
                <h3 className="text-2xl font-bold text-white mb-4">وصف الدورة</h3>
                <p className="text-slate-300 leading-relaxed">{selectedCourse.description}</p>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-white mb-4">المواضيع المغطاة</h3>
                <ul className="space-y-3">
                  {selectedCourse.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-white mb-4">أهداف التعلم</h3>
                <ul className="space-y-3">
                  {selectedCourse.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="text-orange-400 mt-1">🎯</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-white mb-4">المتطلبات الأساسية</h3>
                  <ul className="space-y-3">
                    {selectedCourse.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-300">
                        <span className="text-purple-400 mt-1">📚</span>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20 text-center space-y-4">
                {selectedCourse.status === 'متاح' ? (
                  <>
                    <p className="text-slate-300">هل أنت مستعد للبدء؟</p>
                    <div className="max-w-sm mx-auto w-full">
                      <CTAButton
                        as="a"
                        href="/vote"
                        label="ابدأ الدورة الآن"
                        icon="🚀"
                        className="sm:w-auto"
                        fullWidth
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300">هذه الدورة قيد الإعداد</p>
                    <div className="max-w-xs mx-auto w-full">
                      <CTAButton
                        label="قريباً"
                        icon="🔜"
                        variant="outline"
                        disabled
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesPage;
