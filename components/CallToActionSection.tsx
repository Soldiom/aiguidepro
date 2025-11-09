import React from 'react';

const CallToActionSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        
        <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500 rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-emerald-500/10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">استشر خبيرك الخاص في الذكاء الاصطناعي</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            استخدم مساعدي الذكي <span className="font-bold text-white">AIGuidePro</span> كخبير شخصي لك. ولنتائج أفضل، تعاون بينه وبين منصة <span className="font-bold text-white">Manus</span> لتحقيق أقصى استفادة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
            >
              ابدأ الآن مع AIGuidePro
            </a>
            <a 
              href="https://manus.im/invitation/WPMFXDLTGFVO" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto bg-slate-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-600 transition-colors duration-300"
            >
              احصل على 500 رصيد مجاني في Manus
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CallToActionSection;