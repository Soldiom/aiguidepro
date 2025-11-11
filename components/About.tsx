import React from 'react';

const About: React.FC = () => (
  <div className="max-w-2xl mx-auto py-16 px-4 text-slate-200">
    <h1 className="text-4xl font-black mb-6">عن المنصة</h1>
    <p className="mb-4">AI Guide Pro هو مشروع عربي يهدف إلى تمكين الجميع من تعلم الذكاء الاصطناعي بلغتهم الأم، عبر دورات متخصصة، أخبار موثوقة، وأدوات عملية.</p>
    <ul className="list-disc list-inside mb-4">
      <li>دورات متجددة في الذكاء الاصطناعي</li>
      <li>تجميع أحدث الأبحاث والأخبار من مصادر موثوقة</li>
      <li>واجهة عربية سهلة الاستخدام</li>
      <li>محتوى مجاني ومفتوح للجميع</li>
    </ul>
  <p>للاستفسار أو المساهمة: <a href="mailto:soldiom@gmail.com" className="text-emerald-400 hover:underline">soldiom@gmail.com</a></p>
  </div>
);

export default About;
