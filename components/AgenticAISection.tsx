import React from 'react';
import { CTAButton, SectionContainer, UnifiedSystemButton } from './ui';

const AgenticAISection: React.FC = () => {
  const agents = [
    {
      id: 1,
      name: 'مساعد البحث والتحليل',
      icon: '🔍',
      description: 'يقوم بالبحث العميق، تحليل البيانات، وإنشاء تقارير شاملة تلقائياً',
      capabilities: ['بحث متعدد المصادر', 'تحليل البيانات', 'إنشاء التقارير', 'استخلاص الأفكار'],
      useCase: 'مثالي للباحثين والمحللين',
    },
    {
      id: 2,
      name: 'مطور البرمجيات الذكي',
      icon: '💻',
      description: 'يكتب الكود، يصلح الأخطاء، ويبني تطبيقات كاملة بناءً على وصفك',
      capabilities: ['كتابة الكود', 'إصلاح الأخطاء', 'بناء التطبيقات', 'مراجعة الكود'],
      useCase: 'مثالي للمطورين ورواد الأعمال',
    },
    {
      id: 3,
      name: 'مصمم المحتوى الإبداعي',
      icon: '🎨',
      description: 'ينشئ محتوى إبداعي متكامل: نصوص، صور، فيديوهات، وعروض تقديمية',
      capabilities: ['كتابة المحتوى', 'توليد الصور', 'تصميم العروض', 'إنشاء الفيديو'],
      useCase: 'مثالي للمسوقين والمبدعين',
    },
    {
      id: 4,
      name: 'مدير المشاريع الآلي',
      icon: '📊',
      description: 'يخطط المشاريع، يتابع المهام، وينسق بين الفرق تلقائياً',
      capabilities: ['تخطيط المشاريع', 'إدارة المهام', 'التنسيق', 'إعداد التقارير'],
      useCase: 'مثالي لمديري المشاريع والفرق',
    },
    {
      id: 5,
      name: 'مستشار الأعمال الذكي',
      icon: '💼',
      description: 'يحلل السوق، يقترح استراتيجيات، ويساعد في اتخاذ القرارات',
      capabilities: ['تحليل السوق', 'استراتيجيات الأعمال', 'دراسة الجدوى', 'التوقعات المالية'],
      useCase: 'مثالي لرواد الأعمال والمستثمرين',
    },
    {
      id: 6,
      name: 'معلم شخصي متخصص',
      icon: '📚',
      description: 'يشرح المفاهيم، يجيب على الأسئلة، ويصمم خطط تعليمية مخصصة',
      capabilities: ['شرح المفاهيم', 'إجابة الأسئلة', 'خطط تعليمية', 'تقييم التقدم'],
      useCase: 'مثالي للطلاب والمتعلمين',
    },
  ];

  return (
    <SectionContainer
      id="agentic-ai"
      className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      contentClassName="space-y-16"
    >
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/60 border border-slate-700 mx-auto">
          <span className="text-5xl">🤖</span>
        </div>
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            موظفو AI الأذكياء
            <span className="block text-cyan-400 mt-2">Agentic AI Agents</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            فريق من الوكلاء الأذكياء يعملون لك على مدار الساعة. فقط أخبرهم بما تريد، وسيقومون بالباقي تلقائياً.
          </p>
        </div>
        <div className="mt-4 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-full px-6 py-3">
          <span className="text-2xl">🤖</span>
          <div className="text-right">
            <div className="text-sm text-emerald-300 font-semibold">مدعوم بـ</div>
            <div className="text-lg font-bold text-white">AI Guide Pro Unified System</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          ما هي Agentic AI؟
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-slate-300">
          <div className="space-y-4 leading-relaxed">
            <p>
              <strong className="text-cyan-400">Agentic AI</strong> هي الجيل الجديد من الذكاء الاصطناعي الذي لا يكتفي بالإجابة على الأسئلة، بل
              <strong> يتصرف بشكل مستقل </strong>
              لإنجاز المهام المعقدة.
            </p>
            <p>تخيل موظفاً ذكياً يفهم هدفك، يخطط الخطوات، ينفذها، ويتعلم من النتائج - كل ذلك تلقائياً!</p>
          </div>
          <div className="space-y-3">
            {[
              { title: 'الاستقلالية', desc: 'يعمل بدون إشراف مستمر' },
              { title: 'التخطيط', desc: 'يحلل المهمة ويضع خطة عمل' },
              { title: 'التنفيذ', desc: 'ينفذ الخطوات باستخدام أدوات متعددة' },
              { title: 'التعلم', desc: 'يتحسن مع كل مهمة جديدة' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <strong className="text-white">{item.title}:</strong>
                  <span className="text-slate-300 mr-1">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{agent.icon}</span>
              <h3 className="text-xl font-bold text-white">{agent.name}</h3>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">{agent.description}</p>
            <div className="space-y-2 mb-4">
              {agent.capabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-2 text-sm">
                  <span className="text-cyan-400">▸</span>
                  <span className="text-slate-400">{capability}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-700">
              <span className="text-xs text-cyan-400 font-semibold">{agent.useCase}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">كيف تعمل؟</h3>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: '1️⃣', title: 'أخبر الوكيل', desc: 'صف ما تريد إنجازه بلغة طبيعية' },
            { step: '2️⃣', title: 'يخطط تلقائياً', desc: 'يحلل المهمة ويضع خطة عمل مفصلة' },
            { step: '3️⃣', title: 'ينفذ الخطوات', desc: 'يستخدم أدوات متعددة لإنجاز المهمة' },
            { step: '4️⃣', title: 'يسلم النتيجة', desc: 'تحصل على النتيجة النهائية جاهزة' },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-2">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">
                {item.step}
              </div>
              <h4 className="font-bold text-white">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-2xl p-8 space-y-8 text-center">
        <div className="space-y-4">
          <div className="text-5xl">🎓</div>
          <h3 className="text-3xl font-bold text-white">AI Guide Pro Unified System</h3>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            نظام موحد متكامل لتشغيل وإدارة Agentic AI Agents. قوي، ذكي، ومصمم خصيصاً لاحتياجاتك.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 text-right">
          {[{ icon: '🚀', title: 'سريع وقوي', desc: 'معالجة متوازية وأداء عالي' }, { icon: '🧠', title: 'ذكاء متقدم', desc: 'وكلاء أذكياء بقدرات تعلم ذاتي' }, { icon: '🎯', title: 'موحد ومتكامل', desc: 'نظام شامل لجميع احتياجاتك' }].map(
            (item) => (
              <div key={item.title} className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            )
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <UnifiedSystemButton fullWidth className="sm:w-auto" />
          <CTAButton
            as="a"
            href="/vote"
            label="اقترح دورة جديدة"
            icon="💡"
            variant="secondary"
            className="sm:w-auto"
          />
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-slate-400">هل أنت مستعد لتوظيف فريق AI الخاص بك؟</p>
        <div className="max-w-md mx-auto">
          <CTAButton
            as="a"
            href="https://3000-i0w99un5bzd0a7a1vp6nc-71ef756c.manus-asia.computer"
            label="ابدأ الآن مجاناً"
            icon="🚀"
            className="sm:w-auto"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default AgenticAISection;
