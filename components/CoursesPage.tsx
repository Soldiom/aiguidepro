import React, { useState } from 'react';
import { courses, Course } from '../data/coursesData';
import NoraAI from './NoraAI';

const CoursesPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterLevel, setFilterLevel] = useState<'all' | 'مبتدئ' | 'متوسط' | 'متقدم'>('all');

  const filteredCourses = filterLevel === 'all' 
    ? courses 
    : courses.filter(c => c.level === filterLevel);

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'مبتدئ': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'متوسط': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'متقدم': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Nora */}
        <div className="mb-16">
          <NoraAI 
            message="مرحباً! 🎓 هذه دوراتنا التدريبية في الذكاء الاصطناعي. اختر الدورة المناسبة لمستواك، وسأكون معك في كل خطوة!"
            variant="avatar"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filterLevel === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            جميع الدورات
          </button>
          <button
            onClick={() => setFilterLevel('مبتدئ')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filterLevel === 'مبتدئ'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            مبتدئ
          </button>
          <button
            onClick={() => setFilterLevel('متوسط')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filterLevel === 'متوسط'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            متوسط
          </button>
          <button
            onClick={() => setFilterLevel('متقدم')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filterLevel === 'متقدم'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            متقدم
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer group"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {course.title}
                </h3>
                {course.status === 'قريباً' && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30">
                    قريباً
                  </span>
                )}
              </div>

              <p className="text-slate-400 mb-4 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600">
                  ⏱️ {course.duration}
                </span>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all group-hover:scale-105">
                عرض التفاصيل
              </button>
            </div>
          ))}
        </div>

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedCourse(null)}>
            <div className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/30 shadow-2xl shadow-emerald-500/20" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedCourse.title}</h2>
                  <div className="flex gap-3">
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
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Nora's Introduction */}
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

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">وصف الدورة</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedCourse.description}</p>
                </div>

                {/* Topics */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">المواضيع المغطاة</h3>
                  <ul className="space-y-3">
                    {selectedCourse.topics.map((topic, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-300">
                        <span className="text-emerald-400 mt-1">✓</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Objectives */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">أهداف التعلم</h3>
                  <ul className="space-y-3">
                    {selectedCourse.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-300">
                        <span className="text-orange-400 mt-1">🎯</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">المتطلبات الأساسية</h3>
                    <ul className="space-y-3">
                      {selectedCourse.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-300">
                          <span className="text-purple-400 mt-1">📚</span>
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20 text-center">
                  {selectedCourse.status === 'متاح' ? (
                    <>
                      <p className="text-slate-300 mb-4">هل أنت مستعد للبدء؟</p>
                      <a
                        href="/ai-features?tab=course-gen"
                        className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                      >
                        ابدأ الدورة الآن 🚀
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-300 mb-4">هذه الدورة قيد الإعداد</p>
                      <button className="bg-slate-700 text-slate-300 px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
                        قريباً 🔜
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
