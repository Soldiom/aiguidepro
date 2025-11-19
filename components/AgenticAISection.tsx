import React from 'react';

const AgenticAISection: React.FC = () => {
  const agents = [
    {
      id: 1,
      name: "مساعد البحث والتحليل",
      icon: "🔍",
      description: "يقوم بالبحث العميق، تحليل البيانات، وإنشاء تقارير شاملة تلقائياً",
      capabilities: ["بحث متعدد المصادر", "تحليل البيانات", "إنشاء التقارير", "استخلاص الأفكار"],
      useCase: "مثالي للباحثين والمحللين"
    },
    {
      id: 2,
      name: "مطور البرمجيات الذكي",
      icon: "💻",
      description: "يكتب الكود، يصلح الأخطاء، ويبني تطبيقات كاملة بناءً على وصفك",
      capabilities: ["كتابة الكود", "إصلاح الأخطاء", "بناء التطبيقات", "مراجعة الكود"],
      useCase: "مثالي للمطورين ورواد الأعمال"
    },
    {
      id: 3,
      name: "مصمم المحتوى الإبداعي",
      icon: "🎨",
      description: "ينشئ محتوى إبداعي متكامل: نصوص، صور، فيديوهات، وعروض تقديمية",
      capabilities: ["كتابة المحتوى", "توليد الصور", "تصميم العروض", "إنشاء الفيديو"],
      useCase: "مثالي للمسوقين والمبدعين"
    },
    {
      id: 4,
      name: "مدير المشاريع الآلي",
      icon: "📊",
      description: "يخطط المشاريع، يتابع المهام، وينسق بين الفرق تلقائياً",
      capabilities: ["تخطيط المشاريع", "إدارة المهام", "التنسيق", "إعداد التقارير"],
      useCase: "مثالي لمديري المشاريع والفرق"
    },
    {
      id: 5,
      name: "مستشار الأعمال الذكي",
      icon: "💼",
      description: "يحلل السوق، يقترح استراتيجيات، ويساعد في اتخاذ القرارات",
      capabilities: ["تحليل السوق", "استراتيجيات الأعمال", "دراسة الجدوى", "التوقعات المالية"],
      useCase: "مثالي لرواد الأعمال والمستثمرين"
    },
    {
      id: 6,
      name: "معلم شخصي متخصص",
      icon: "📚",
      description: "يشرح المفاهيم، يجيب على الأسئلة، ويصمم خطط تعليمية مخصصة",
      capabilities: ["شرح المفاهيم", "إجابة الأسئلة", "خطط تعليمية", "تقييم التقدم"],
      useCase: "مثالي للطلاب والمتعلمين"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-6xl">🤖</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            موظفو AI الأذكياء
            <span className="block text-cyan-400 mt-2">Agentic AI Agents</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            فريق من الوكلاء الأذكياء يعملون لك على مدار الساعة. فقط أخبرهم بما تريد، وسيقومون بالباقي تلقائياً.
          </p>
          
          {/* AI Guide Pro Badge */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-full px-6 py-3">
            <span className="text-2xl">🤖</span>
            <div className="text-right">
              <div className="text-sm text-emerald-300 font-semibold">مدعوم بـ</div>
              <div className="text-lg font-bold text-white">AI Guide Pro Unified System</div>
            </div>
          </div>
        </div>

        {/* What are Agentic AI? */}
        <div className="mb-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            ما هي Agentic AI؟
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <p className="leading-relaxed mb-4">
                <strong className="text-cyan-400">Agentic AI</strong> هي الجيل الجديد من الذكاء الاصطناعي الذي لا يكتفي بالإجابة على الأسئلة، 
                بل <strong>يتصرف بشكل مستقل</strong> لإنجاز المهام المعقدة.
              </p>
              <p className="leading-relaxed">
                تخيل موظفاً ذكياً يفهم هدفك، يخطط الخطوات، ينفذها، ويتعلم من النتائج - كل ذلك تلقائياً!
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <strong className="text-white">الاستقلالية:</strong> يعمل بدون إشراف مستمر
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <strong className="text-white">التخطيط:</strong> يحلل المهمة ويضع خطة عمل
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <strong className="text-white">التنفيذ:</strong> ينفذ الخطوات باستخدام أدوات متعددة
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <strong className="text-white">التعلم:</strong> يتحسن مع كل مهمة جديدة
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
            >
              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{agent.icon}</span>
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
              </div>

              {/* Description */}
              <p className="text-slate-300 mb-4 leading-relaxed">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="space-y-2 mb-4">
                {agent.capabilities.map((capability, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-cyan-400">▸</span>
                    <span className="text-slate-400">{capability}</span>
                  </div>
                ))}
              </div>

              {/* Use Case */}
              <div className="pt-4 border-t border-slate-700">
                <span className="text-xs text-cyan-400 font-semibold">{agent.useCase}</span>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            كيف تعمل؟
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="font-bold text-white mb-2">أخبر الوكيل</h4>
              <p className="text-sm text-slate-400">صف ما تريد إنجازه بلغة طبيعية</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="font-bold text-white mb-2">يخطط تلقائياً</h4>
              <p className="text-sm text-slate-400">يحلل المهمة ويضع خطة عمل مفصلة</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="font-bold text-white mb-2">ينفذ الخطوات</h4>
              <p className="text-sm text-slate-400">يستخدم أدوات متعددة لإنجاز المهمة</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">4️⃣</span>
              </div>
              <h4 className="font-bold text-white mb-2">يسلم النتيجة</h4>
              <p className="text-sm text-slate-400">تحصل على النتيجة النهائية جاهزة</p>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default AgenticAISection;
