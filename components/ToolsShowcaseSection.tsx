import React from 'react';

interface ModelCardProps {
  name: string;
  provider: string;
  features: string[];
  borderColor: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ name, provider, features, borderColor }) => (
  <div className={`bg-slate-800/50 rounded-lg p-6 border-t-4 ${borderColor} border-slate-700 h-full flex flex-col`}>
    <h3 className="text-3xl font-black text-white">{name}</h3>
    <p className="text-slate-500 mb-4">{provider}</p>
    <ul className="space-y-2 text-slate-400 list-disc list-inside flex-grow">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-12">
      {children}
    </h2>
  );

const ToolsShowcaseSection: React.FC = () => {
  const models = [
    { name: 'ChatGPT', provider: 'OpenAI', features: ['الأكثر شهرة عالمياً', 'محادثة طبيعية ممتازة', 'مثالي للكتابة والبرمجة والتحليل'], borderColor: 'border-emerald-400' },
    { name: 'Gemini', provider: 'Google', features: ['تكامل عميق مع خدمات Google', 'تحليل متعدد الوسائط (نص، صور، فيديو)', 'مثالي للتطبيقات المتكاملة مع Google'], borderColor: 'border-orange-400' },
    { name: 'Claude', provider: 'Anthropic', features: ['يتفوق في الكتابة الطويلة والتحليل المعقد', 'نافذة سياق ضخمة', 'يُفضله الكتاب والباحثون والمحللون'], borderColor: 'border-purple-400' },
  ];

  const advisors = [
    { 
      name: 'مجلس الخبراء السيدي', 
      provider: 'مستشار متخصص', 
      description: 'مستشار AI متخصص للإجابة على أسئلتك وتقديم النصائح الخبيرة في مجالات متعددة. يجمع خبرات متنوعة لمساعدتك في اتخاذ القرارات الصحيحة.',
      link: 'https://chatgpt.com/g/g-691adb7af1cc81919f2e8f70a3826df4-mjls-lkhbr-lsydy',
      icon: '🎯'
    }
  ];

  const imageTools = [
    { name: 'DALL-E 3', provider: 'OpenAI', description: 'يتميز بدقة عالية في فهم الأوامر النصية. يتكامل مع ChatGPT مما يسهل الوصول إليه.' },
    { name: 'Midjourney', provider: 'Discord', description: 'يُعتبر الأفضل للنتائج الفنية والإبداعية. يُنتج صوراً ذات طابع فني مميز مع تفاصيل دقيقة.' },
    { name: 'Stable Diffusion', provider: 'Open Source', description: 'نموذج مفتوح المصدر يمكن تشغيله محلياً. يوفر تحكماً كاملاً في عملية التوليد ويسمح بالتخصيص العميق.' },
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            المستشارين الافتراضيين
          </h1>
          <p className="text-xl text-slate-300">أدوات ومستشارين AI لمساعدتك في رحلتك التعليمية</p>
        </div>

        {/* Custom AI Advisors Section */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400 mb-8">
            🎯 المستشارين المخصصين
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {advisors.map(advisor => (
              <a 
                key={advisor.name}
                href={advisor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 p-8 rounded-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl group-hover:scale-110 transition-transform">{advisor.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {advisor.name}
                    </h3>
                    <p className="text-sm text-cyan-400 mb-3">{advisor.provider}</p>
                    <p className="text-slate-300 leading-relaxed">{advisor.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-semibold">
                      <span>جرب الآن</span>
                      <span className="group-hover:translate-x-1 transition-transform">←</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* AI Models Section */}
        <SectionTitle>نماذج الذكاء الاصطناعي الرائدة</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {models.map(model => <ModelCard key={model.name} {...model} />)}
        </div>

        {/* Image Generation Tools */}
        <SectionTitle>أدوات توليد الصور: من الفكرة إلى الواقع</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {imageTools.map(tool => (
                <div key={tool.name} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-orange-400 transition-colors">
                    <h3 className="text-2xl font-bold text-white mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{tool.provider}</p>
                    <p className="text-slate-400">{tool.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcaseSection;
