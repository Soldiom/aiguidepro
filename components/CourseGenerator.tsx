import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle, Play, Download } from 'lucide-react';

interface CourseModule {
  id: number;
  title: string;
  duration: string;
  topics: string[];
  completed: boolean;
}

interface GeneratedCourse {
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: CourseModule[];
  createdAt: string;
}

const CourseGenerator: React.FC = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [goal, setGoal] = useState<'general' | 'career' | 'project' | 'research'>('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);

  // Load saved course from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiguidepro_generated_course');
    if (saved) {
      try {
        setGeneratedCourse(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved course');
      }
    }
  }, []);

  const generateCourse = async () => {
    if (!courseTitle.trim()) {
      alert('الرجاء إدخال عنوان الدورة');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate course generation (in production, this would call Gemini API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const course: GeneratedCourse = {
        title: courseTitle,
        description: `دورة شاملة في ${courseTitle} مصممة خصيصاً لمستوى ${getLevelText(level)} لتحقيق هدف ${getGoalText(goal)}.`,
        level: getLevelText(level),
        duration: level === 'beginner' ? '4 أسابيع' : level === 'intermediate' ? '6 أسابيع' : '8 أسابيع',
        modules: generateModules(courseTitle, level),
        createdAt: new Date().toISOString()
      };

      setGeneratedCourse(course);
      localStorage.setItem('aiguidepro_generated_course', JSON.stringify(course));
      
      // Initialize chat with welcome message
      setChatMessages([{
        role: 'assistant',
        content: `مرحباً! أنا AIGuidePro، مدربك الشخصي لدورة "${courseTitle}". 🎓\n\nأنا هنا لمساعدتك في:\n✅ شرح المفاهيم الصعبة\n✅ الإجابة على أسئلتك\n✅ توفير أمثلة عملية\n✅ تتبع تقدمك\n\nكيف يمكنني مساعدتك اليوم؟`
      }]);
      setIsChatMode(true);
    } catch (error) {
      console.error('Error generating course:', error);
      alert('حدث خطأ أثناء إنشاء الدورة. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateModules = (title: string, level: string): CourseModule[] => {
    const baseModules = [
      {
        id: 1,
        title: `مقدمة إلى ${title}`,
        duration: '3 ساعات',
        topics: ['نظرة عامة', 'المفاهيم الأساسية', 'أدوات العمل'],
        completed: false
      },
      {
        id: 2,
        title: 'الأساسيات والمبادئ',
        duration: '5 ساعات',
        topics: ['المبادئ الأساسية', 'أفضل الممارسات', 'أمثلة تطبيقية'],
        completed: false
      },
      {
        id: 3,
        title: 'التطبيق العملي',
        duration: '6 ساعات',
        topics: ['مشاريع عملية', 'دراسات حالة', 'تمارين تفاعلية'],
        completed: false
      },
      {
        id: 4,
        title: 'المستوى المتقدم',
        duration: '4 ساعات',
        topics: ['تقنيات متقدمة', 'حل المشكلات', 'التحسين والأداء'],
        completed: false
      }
    ];

    if (level === 'advanced') {
      baseModules.push({
        id: 5,
        title: 'مشروع التخرج',
        duration: '8 ساعات',
        topics: ['تصميم المشروع', 'التنفيذ', 'العرض والتقييم'],
        completed: false
      });
    }

    return baseModules;
  };

  const getLevelText = (lvl: string): string => {
    switch (lvl) {
      case 'beginner': return 'مبتدئ';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'متقدم';
      default: return 'مبتدئ';
    }
  };

  const getGoalText = (g: string): string => {
    switch (g) {
      case 'general': return 'التعلم العام';
      case 'career': return 'التطوير المهني';
      case 'project': return 'بناء مشروع';
      case 'research': return 'البحث الأكاديمي';
      default: return 'التعلم العام';
    }
  };

  const toggleModuleCompletion = (moduleId: number) => {
    if (!generatedCourse) return;
    
    const updatedCourse = {
      ...generatedCourse,
      modules: generatedCourse.modules.map(m =>
        m.id === moduleId ? { ...m, completed: !m.completed } : m
      )
    };
    
    setGeneratedCourse(updatedCourse);
    localStorage.setItem('aiguidepro_generated_course', JSON.stringify(updatedCourse));
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [
      ...chatMessages,
      { role: 'user' as const, content: userMessage }
    ];
    setChatMessages(newMessages);
    setUserMessage('');

    // Simulate AI response (in production, call Gemini API)
    setTimeout(() => {
      const response = generateAIResponse(userMessage, generatedCourse);
      setChatMessages([...newMessages, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const generateAIResponse = (message: string, course: GeneratedCourse | null): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('شرح') || lowerMessage.includes('ما هو') || lowerMessage.includes('ماهو')) {
      return `بالتأكيد! سأشرح لك المفهوم بطريقة مبسطة:\n\n${course?.title} هو موضوع مهم في مجال الذكاء الاصطناعي. يتضمن عدة جوانب رئيسية:\n\n1️⃣ **الأساسيات**: المفاهيم الأولية التي تحتاج لفهمها\n2️⃣ **التطبيقات**: كيف يُستخدم في الواقع\n3️⃣ **الأدوات**: البرامج والمكتبات المستخدمة\n\nهل تريد شرحاً أكثر تفصيلاً لأي جزء معين؟`;
    }
    
    if (lowerMessage.includes('مثال') || lowerMessage.includes('تطبيق')) {
      return `إليك مثال عملي:\n\n\`\`\`python\n# مثال بسيط على ${course?.title}\n\ndef example_function():\n    # تنفيذ المهمة\n    result = process_data()\n    return result\n\nif __name__ == "__main__":\n    output = example_function()\n    print(f"النتيجة: {output}")\n\`\`\`\n\n💡 هذا مثال تبسيطي. يمكنني تقديم أمثلة أكثر تعقيداً حسب احتياجك!`;
    }
    
    if (lowerMessage.includes('تقدم') || lowerMessage.includes('progress')) {
      const completed = course?.modules.filter(m => m.completed).length || 0;
      const total = course?.modules.length || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return `📊 **تقرير التقدم:**\n\n✅ أكملت ${completed} من ${total} وحدات (${percentage}%)\n\n${percentage < 50 ? '💪 استمر في التقدم! أنت في الطريق الصحيح.' : percentage < 100 ? '🎯 أنت قريب من النهاية! واصل العمل الرائع.' : '🎉 تهانينا! أكملت الدورة بنجاح!'}`;
    }
    
    return `شكراً على سؤالك! كمدرب AI خاص بك في دورة "${course?.title}"، أنا هنا لمساعدتك.\n\n💡 يمكنك أن تسألني عن:\n• شرح المفاهيم\n• أمثلة عملية\n• تقدمك في الدورة\n• نصائح وإرشادات\n\nما الذي تحتاج مساعدة فيه؟`;
  };

  const downloadCourse = () => {
    if (!generatedCourse) return;
    
    const content = `# ${generatedCourse.title}\n\n${generatedCourse.description}\n\n**المستوى:** ${generatedCourse.level}\n**المدة:** ${generatedCourse.duration}\n\n## الوحدات:\n\n${generatedCourse.modules.map(m => 
      `### ${m.title}\n**المدة:** ${m.duration}\n**المواضيع:**\n${m.topics.map(t => `- ${t}`).join('\n')}\n`
    ).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedCourse.title}.md`;
    a.click();
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-emerald-400" />
          مولد الدورات التدريبية الذكي
        </h2>
        <p className="text-lg text-slate-300">
          انسخ عنوان أي دورة، وسيقوم AIGuidePro بإنشائها كاملة ويصبح مدربك الشخصي! 🚀
        </p>
      </div>

      {!generatedCourse ? (
        <div className="space-y-6">
          {/* Course Title Input */}
          <div>
            <label className="block text-white font-semibold mb-2 text-lg">
              📝 عنوان الدورة
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="مثال: تعلم الآلة للمبتدئين، معالجة اللغة الطبيعية، رؤية الحاسوب..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-white font-semibold mb-2 text-lg">
              📊 مستواك
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    level === lvl
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold">{getLevelText(lvl)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selection */}
          <div>
            <label className="block text-white font-semibold mb-2 text-lg">
              🎯 هدفك من التعلم
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['general', 'career', 'project', 'research'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    goal === g
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="text-sm font-semibold">{getGoalText(g)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCourse}
            disabled={isGenerating || !courseTitle.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                جاري إنشاء الدورة...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                إنشاء الدورة الآن
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Course Header */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-3xl font-bold text-white mb-2">{generatedCourse.title}</h3>
            <p className="text-slate-300 mb-4">{generatedCourse.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                📊 {generatedCourse.level}
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-semibold">
                ⏱️ {generatedCourse.duration}
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-semibold">
                📚 {generatedCourse.modules.length} وحدات
              </span>
            </div>
          </div>

          {/* Course Modules */}
          <div>
            <h4 className="text-2xl font-bold text-white mb-4">📚 محتوى الدورة</h4>
            <div className="space-y-3">
              {generatedCourse.modules.map((module) => (
                <div
                  key={module.id}
                  className={`bg-slate-800/50 border rounded-lg p-4 transition-all ${
                    module.completed
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-lg font-bold text-white">{module.title}</h5>
                        <span className="text-xs text-slate-400">({module.duration})</span>
                      </div>
                      <ul className="text-sm text-slate-400 space-y-1">
                        {module.topics.map((topic, i) => (
                          <li key={i}>• {topic}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => toggleModuleCompletion(module.id)}
                      className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                        module.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Trainer Chat */}
          {isChatMode && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                مدربك الشخصي AIGuidePro
              </h4>
              
              <div className="h-64 overflow-y-auto mb-4 space-y-3 p-3 bg-slate-800/30 rounded-lg">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اسأل مدربك أي سؤال..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  إرسال
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={downloadCourse}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              تحميل الدورة
            </button>
            <button
              onClick={() => {
                setGeneratedCourse(null);
                setIsChatMode(false);
                setChatMessages([]);
                localStorage.removeItem('aiguidepro_generated_course');
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              إنشاء دورة جديدة
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <p className="text-sm text-purple-300">
          💡 **كيف يعمل:** انسخ عنوان أي دورة تريد تعلمها، وسيقوم AIGuidePro بإنشاء منهج كامل مخصص لك.
          بعد ذلك، يصبح مدربك الشخصي يجيب على أسئلتك ويساعدك في كل خطوة!
        </p>
      </div>
    </div>
  );
};

export default CourseGenerator;
