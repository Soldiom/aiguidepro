import React from 'react';
import { CTAButton, SectionContainer } from './ui';

const CallToActionSection: React.FC = () => {
  return (
    <SectionContainer className="bg-transparent" contentClassName="max-w-4xl">
      <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500 rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-emerald-500/10 space-y-6">
        <h2 className="text-3xl md:text-4xl font-black text-white">استشر خبيرك الخاص في الذكاء الاصطناعي</h2>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
          استخدم مساعدي الذكي <span className="font-bold text-white">AIGuidePro</span> كخبير شخصي لك. ولنتائج أفضل، تعاون بينه وبين منصة{' '}
          <span className="font-bold text-white">Manus</span> لتحقيق أقصى استفادة.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton
            as="a"
            href="https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro"
            target="_blank"
            rel="noopener noreferrer"
            label="ابدأ الآن مع AIGuidePro"
            className="sm:w-auto"
          />
          <CTAButton
            as="a"
            href="https://manus.im/invitation/WPMFXDLTGFVO"
            target="_blank"
            rel="noopener noreferrer"
            label="احصل على 500 رصيد مجاني في Manus"
            variant="secondary"
            className="sm:w-auto"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default CallToActionSection;