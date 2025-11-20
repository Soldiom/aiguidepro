import React, { useState, useEffect } from 'react';
import AIChatAssistant from './AIChatAssistant';
import AIModelPlaygroundFixed from './AIModelPlaygroundFixed';
import GitHubCodeExamples from './GitHubCodeExamples';
import CodePlayground from './CodePlayground';
import SmartLearningPath from './SmartLearningPath';
import CourseGenerator from './CourseGenerator';

const AIFeaturesPage: React.FC = () => {
  // Check URL for tab parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'chat';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update tab from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['chat', 'playground', 'code', 'examples', 'learning', 'course-gen'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const tabs = [
    { id: 'chat', name: 'مساعد AI', icon: '🤖', component: AIChatAssistant },
    { id: 'playground', name: 'ساحة النماذج', icon: '🧪', component: AIModelPlaygroundFixed },
    { id: 'code', name: 'ساحة البرمجة', icon: '💻', component: CodePlayground },
    { id: 'examples', name: 'أمثلة GitHub', icon: '📚', component: GitHubCodeExamples },
    { id: 'learning', name: 'مسار التعلم', icon: '🎯', component: SmartLearningPath },
    { id: 'course-gen', name: 'مولد الدورات', icon: '🎓', component: CourseGenerator }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || AIChatAssistant;

  return (
    <div className="relative z-10 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 ميزات الذكاء الاصطناعي التفاعلية
          </h1>
          <p className="text-xl text-slate-300">
            جرب أحدث تقنيات AI مباشرة في المتصفح
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          <ActiveComponent />
        </div>

        {/* Info Banner */}
        <div className="mt-10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-3">💡 هل تعلم؟</h3>
          <p className="text-slate-300">
            جميع هذه الميزات تعمل مباشرة في متصفحك باستخدام أحدث تقنيات الذكاء الاصطناعي من 
            <strong className="text-emerald-400"> Hugging Face</strong> و
            <strong className="text-purple-400"> GitHub</strong>.
            لا حاجة لتثبيت أي برامج!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesPage;
