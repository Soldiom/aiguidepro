import React from 'react';

interface GptTool {
  name: string;
  description: string;
  url: string;
}

const GptToolCard: React.FC<{ tool: GptTool }> = ({ tool }) => (
    <a 
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-1 group h-full"
    >
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{tool.name}</h3>
        <p className="text-slate-400 mb-4">{tool.description}</p>
        <span className="inline-block text-emerald-500 mt-auto font-semibold group-hover:underline">
            جرب الأداة &rarr;
        </span>
    </a>
);


const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-12">
      {children}
    </h2>
);

const GptToolsSection: React.FC = () => {
    const tools = [
        { name: 'Pain Empowerment Coach', description: 'مستشار متخصص في تمكين الأفراد للتعامل مع الألم، مستوحى من أساليب د. أحمد سالم.', url: 'https://chatgpt.com/g/g-69074702c1dc819188f772e5ad1fb699-pain-empowerment-coach-inspired-by-dr-ahmad-salem' },
        { name: 'MarketMasterGPT', description: 'خبير استراتيجي في سوق الأسهم، يساعدك على تحليل الأسواق المالية واتخاذ قرارات استثمارية مدروسة.', url: 'https://chatgpt.com/g/g-6772bcad914c8191898c13698264da02-marketmastergpt' },
        { name: 'ParentPro | صلاح الأبناء', description: 'مرشدك التربوي المتخصص في التربية الإيجابية، يقدم نصائح عملية لمواجهة التحديات التربوية اليومية.', url: 'https://chatgpt.com/g/g-674104f7b0788191a960c37aa7d2c6e0-parentpro-slh-lbn' },
        { name: 'GPT Islami | جي بي تي إسلامي', description: 'باحث إسلامي متخصص يقدم إجابات معمقة في العلوم الشرعية، معززة بالمصادر والمراجع الموثوقة.', url: 'https://chatgpt.com/g/g-8CXAj7yrK-gpt-islami' },
        { name: 'Nutritionist GPT', description: 'أخصائي تغذية افتراضي يساعدك على تخطيط وجبات صحية ومتوازنة وتحقيق أهدافك الغذائية.', url: 'https://chatgpt.com/g/g-EKLmwiLaO-nutritionist-gpt' },
        { name: 'The Entrepreneur | رائد الأعمال', description: 'مرشدك المتكامل في عالم ريادة الأعمال، يوجهك خطوة بخطوة من الفكرة إلى تحقيق النمو المستدام.', url: 'https://chatgpt.com/g/g-Qy9E1Kv1T-the-entrepreneur' },
        { name: 'المستشار الذكي', description: 'مستشار قانوني متخصص يقدم لك استشارات دقيقة لمساعدتك على فهم حقوقك والتزاماتك.', url: 'https://chatgpt.com/g/g-8zY4NMs6e-lmstshr-ldhky' },
        { name: 'Chef GPT | الشيف جي بي تي', description: 'شيفك الافتراضي الذي يلهمك بوصفات مبتكرة ونصائح طهي احترافية لتجربة مطبخ ممتعة.', url: 'https://chatgpt.com/g/g-TJ5m4tm0h-chef-gpt' },
        { name: 'Personal Trainer GPT | المدرب الشخصي', description: 'مدربك الرياضي الافتراضي الذي يصمم لك خطط تمرين مخصصة ويساعدك على تحقيق أهدافك البدنية.', url: 'https://chatgpt.com/g/g-weh1I6wHD-personal-trainer-gpt' },
    ];

    return (
        <section className="py-20 md:py-32 px-4 bg-slate-900">
            <div className="container mx-auto max-w-6xl">
                <SectionTitle>أدوات GPT المخصصة</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tools.map(tool => (
                       <GptToolCard key={tool.name} tool={tool} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GptToolsSection;