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

  const imageTools = [
    { name: 'DALL-E 3', provider: 'OpenAI', description: 'يتميز بدقة عالية في فهم الأوامر النصية. يتكامل مع ChatGPT مما يسهل الوصول إليه.' },
    { name: 'Midjourney', provider: 'Discord', description: 'يُعتبر الأفضل للنتائج الفنية والإبداعية. يُنتج صوراً ذات طابع فني مميز مع تفاصيل دقيقة.' },
    { name: 'Stable Diffusion', provider: 'Open Source', description: 'نموذج مفتوح المصدر يمكن تشغيله محلياً. يوفر تحكماً كاملاً في عملية التوليد ويسمح بالتخصيص العميق.' },
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle>نماذج الذكاء الاصطناعي الرائدة</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {models.map(model => <ModelCard key={model.name} {...model} />)}
        </div>

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
