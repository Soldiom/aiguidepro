import React, { useState } from 'react';
import { Brain, Target, TrendingUp, Award, ChevronRight, Check } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
}

const SmartLearningPath: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('beginner');
  const [selectedGoal, setSelectedGoal] = useState<string>('general');
  const [generatedPath, setGeneratedPath] = useState<LearningPath | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const levels = [
    { id: 'beginner', name: 'مبتدئ', icon: '🌱', description: 'ليس لدي خبرة سابقة' },
    { id: 'intermediate', name: 'متوسط', icon: '🚀', description: 'لدي بعض المعرفة الأساسية' },
    { id: 'advanced', name: 'متقدم', icon: '⚡', description: 'أريد تعميق معرفتي' }
  ];

  const goals = [
    { id: 'general', name: 'تعلم عام', icon: '📚', description: 'فهم شامل للذكاء الاصطناعي' },
    { id: 'nlp', name: 'معالجة اللغة', icon: '💬', description: 'التخصص في NLP والنصوص' },
    { id: 'vision', name: 'رؤية الحاسوب', icon: '👁️', description: 'التخصص في الصور والفيديو' },
    { id: 'career', name: 'تطوير مهني', icon: '💼', description: 'الحصول على وظيفة في AI' }
  ];

  const pathTemplates: Record<string, Record<string, LearningPath>> = {
    beginner: {
      general: {
        id: 'beginner-general',
        title: 'مسار المبتدئين الشامل',
        description: 'رحلة تعليمية متكاملة من الصفر إلى الاحتراف',
        level: 'beginner',
        duration: '12 أسبوع',
        modules: [
          { id: '1', title: 'مقدمة إلى الذكاء الاصطناعي', completed: false, locked: false },
          { id: '2', title: 'أساسيات البرمجة بلغة Python', completed: false, locked: true },
          { id: '3', title: 'الرياضيات للذكاء الاصطناعي', completed: false, locked: true },
          { id: '4', title: 'التعلم الآلي - المفاهيم الأساسية', completed: false, locked: true },
          { id: '5', title: 'مشروع عملي: بناء نموذج تصنيف', completed: false, locked: true },
          { id: '6', title: 'التعلم العميق - مقدمة', completed: false, locked: true },
          { id: '7', title: 'مشروع تخرج: تطبيق AI متكامل', completed: false, locked: true }
        ]
      },
      nlp: {
        id: 'beginner-nlp',
        title: 'مسار معالجة اللغة الطبيعية',
        description: 'تعلم بناء تطبيقات ذكية للغة العربية',
        level: 'beginner',
        duration: '10 أسابيع',
        modules: [
          { id: '1', title: 'مقدمة في NLP', completed: false, locked: false },
          { id: '2', title: 'معالجة النصوص العربية', completed: false, locked: true },
          { id: '3', title: 'Tokenization والتحليل اللغوي', completed: false, locked: true },
          { id: '4', title: 'نماذج اللغة - BERT وGPT', completed: false, locked: true },
          { id: '5', title: 'مشروع: chatbot عربي', completed: false, locked: true },
          { id: '6', title: 'تحليل المشاعر والآراء', completed: false, locked: true }
        ]
      }
    },
    intermediate: {
      general: {
        id: 'intermediate-general',
        title: 'مسار المتوسط المتقدم',
        description: 'تعمق في تقنيات AI الحديثة',
        level: 'intermediate',
        duration: '16 أسبوع',
        modules: [
          { id: '1', title: 'مراجعة سريعة للأساسيات', completed: false, locked: false },
          { id: '2', title: 'Deep Learning المتقدم', completed: false, locked: true },
          { id: '3', title: 'CNNs لرؤية الحاسوب', completed: false, locked: true },
          { id: '4', title: 'RNNs وLSTMs', completed: false, locked: true },
          { id: '5', title: 'Transformers والانتباه', completed: false, locked: true },
          { id: '6', title: 'Reinforcement Learning', completed: false, locked: true },
          { id: '7', title: 'مشروع: نظام توصيات ذكي', completed: false, locked: true },
          { id: '8', title: 'نشر النماذج في الإنتاج', completed: false, locked: true }
        ]
      }
    }
  };

  const generatePath = async () => {
    setIsGenerating(true);
    
    // Simulate AI path generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const path = pathTemplates[selectedLevel]?.[selectedGoal] || pathTemplates[selectedLevel].general;
    setGeneratedPath(path);
    setIsGenerating(false);
  };

  const toggleModuleComplete = (moduleId: string) => {
    if (!generatedPath) return;
    
    setGeneratedPath({
      ...generatedPath,
      modules: generatedPath.modules.map((module, index) => {
        if (module.id === moduleId) {
          const newCompleted = !module.completed;
          // Unlock next module when current is completed
          if (newCompleted && index < generatedPath.modules.length - 1) {
            generatedPath.modules[index + 1].locked = false;
          }
          return { ...module, completed: newCompleted };
        }
        return module;
      })
    });
  };

  const progress = generatedPath 
    ? (generatedPath.modules.filter(m => m.completed).length / generatedPath.modules.length) * 100 
    : 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Brain className="w-7 h-7 text-purple-400" />
          مسار التعلم الذكي
        </h2>
        <p className="text-slate-400">احصل على مسار تعليمي مخصص بناءً على مستواك وأهدافك</p>
      </div>

      {!generatedPath ? (
        <div className="space-y-6">
          {/* Level Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <Target className="w-4 h-4 inline mr-2" />
              ما هو مستواك الحالي؟
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    selectedLevel === level.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{level.icon}</div>
                  <div className="font-semibold text-white mb-1">{level.name}</div>
                  <div className="text-xs text-slate-400">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              <Award className="w-4 h-4 inline mr-2" />
              ما هو هدفك من التعلم؟
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-right ${
                    selectedGoal === goal.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{goal.icon}</div>
                    <div>
                      <div className="font-semibold text-white mb-1">{goal.name}</div>
                      <div className="text-xs text-slate-400">{goal.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePath}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-lg px-6 py-4 flex items-center justify-center gap-3 transition-all text-lg font-semibold"
          >
            <Brain className="w-6 h-6" />
            {isGenerating ? 'جاري إنشاء المسار...' : 'إنشاء مسار تعليمي مخصص'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Path Header */}
          <div className="bg-gradient-to-r from-purple-600 to-emerald-600 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{generatedPath.title}</h3>
            <p className="text-purple-100 mb-4">{generatedPath.description}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="opacity-80">المستوى:</span>
                <span className="font-semibold mr-2">
                  {levels.find(l => l.id === generatedPath.level)?.name}
                </span>
              </div>
              <div>
                <span className="opacity-80">المدة:</span>
                <span className="font-semibold mr-2">{generatedPath.duration}</span>
              </div>
              <div>
                <span className="opacity-80">الوحدات:</span>
                <span className="font-semibold mr-2">{generatedPath.modules.length}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">التقدم الإجمالي</span>
              <span className="text-sm font-bold text-emerald-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            {generatedPath.modules.map((module, index) => (
              <div
                key={module.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  module.completed
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : module.locked
                    ? 'border-slate-700 bg-slate-900 opacity-50'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    module.completed
                      ? 'bg-emerald-500'
                      : module.locked
                      ? 'bg-slate-700'
                      : 'bg-purple-500'
                  }`}>
                    {module.completed ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{module.title}</h4>
                    {module.locked && (
                      <p className="text-xs text-slate-500 mt-1">🔒 مقفل - أكمل الوحدة السابقة أولاً</p>
                    )}
                  </div>
                  {!module.locked && (
                    <button
                      onClick={() => toggleModuleComplete(module.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        module.completed
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {module.completed ? 'إلغاء الإكمال' : 'وضع علامة كمكتمل'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setGeneratedPath(null)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-3 transition-colors"
            >
              إنشاء مسار جديد
            </button>
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              عرض التقارير التفصيلية
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartLearningPath;
