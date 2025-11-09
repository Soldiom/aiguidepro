import React from 'react';

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-slate-800 p-6 rounded-lg text-center border border-slate-700 transform hover:scale-105 transition-transform duration-300">
    <p className="text-4xl md:text-5xl font-black text-emerald-400">{value}</p>
    <p className="mt-2 text-slate-400">{label}</p>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-12">
    {children}
  </h2>
);

const InfoCard: React.FC<{ title: string; number: string; children: React.ReactNode }> = ({ title, number, children }) => (
    <div className="border border-slate-700 rounded-lg p-6 md:p-8 bg-slate-800/50 mb-6 transition-all duration-300 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10">
        <div className="flex items-start">
            <div className="text-5xl font-black text-slate-600 mr-6">{number}</div>
            <div>
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{children}</p>
            </div>
        </div>
    </div>
);

const IntroductionSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 px-4 bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            الذكاء الاصطناعي يُحدث ثورة بمعدل نمو <span className="text-emerald-400">37.3%</span> سنوياً
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
            هو تقنية تحويلية تمكّن الآلات من محاكاة القدرات البشرية في التعلم والفهم واتخاذ القرارات. أصبح الذكاء الاصطناعي جزءاً لا يتجزأ من حياتنا، من السيارات ذاتية القيادة إلى المساعدين الافتراضيين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <StatCard value="$307B" label="الاستثمارات في 2025" />
          <StatCard value="$632B" label="القيمة السوقية المتوقعة بحلول 2030" />
          <StatCard value="78%" label="من المؤسسات العالمية تستخدم الذكاء الاصطناعي" />
        </div>

        <SectionTitle>التسلسل الهرمي للذكاء الاصطناعي</SectionTitle>
        <div className="max-w-4xl mx-auto mb-24">
            <InfoCard title="الطبقة الأولى - التعلم الآلي (Machine Learning)" number="01">
                الأساس الذي يتضمن تدريب الخوارزميات على البيانات لإجراء تنبؤات دقيقة. يُستخدم في التصنيف والتنبؤ واكتشاف الأنماط.
            </InfoCard>
            <InfoCard title="الطبقة الثانية - التعلم العميق (Deep Learning)" number="02">
                مجموعة فرعية متقدمة تستخدم شبكات عصبية متعددة الطبقات تمكّنها من استخراج الأنماط المعقدة تلقائياً من البيانات الضخمة.
            </InfoCard>
            <InfoCard title="الطبقة الثالثة - الذكاء الاصطناعي التوليدي (Generative AI)" number="03">
                أحدث تطور يستخدم نماذج متقدمة مثل المحولات (Transformers) لإنشاء محتوى أصلي كالنصوص والصور والفيديو.
            </InfoCard>
        </div>

        <SectionTitle>التقنيات الأساسية</SectionTitle>
         <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-orange-400 mb-2">معالجة اللغة الطبيعية (NLP)</h3>
                <p className="text-slate-400">تقنية تمكّن الآلات من فهم وتوليد اللغة البشرية.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-orange-400 mb-2">رؤية الكمبيوتر (Computer Vision)</h3>
                <p className="text-slate-400">تمكّن الآلات من رؤية وفهم الصور والفيديو.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-orange-400 mb-2">الشبكات العصبية (Neural Networks)</h3>
                <p className="text-slate-400">العمود الفقري الذي يحاكي بنية الدماغ البشري للتعلم من الأمثلة.</p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default IntroductionSection;
