import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-slate-900 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:3rem_3rem]"></div>
      <div className="absolute inset-0 bg-slate-900/80"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-orange-400 mb-4 rounded"></div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight">
          الذكاء الاصطناعي
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-bold text-orange-400 max-w-3xl mx-auto">
          دليل شامل للتعلم والتطبيق
        </p>
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-4xl mx-auto">
          رحلة تعليمية متكاملة لإتقان تقنيات الذكاء الاصطناعي الحديثة
        </p>
        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-2xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm mb-2">إعداد:</p>
          <p className="text-white text-2xl font-bold">مهندس علي يعقوب الذويخ</p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a 
              href="https://chatgpt.com/g/g-sw3sWxPbP-aiguidepro" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
            >
              استشر خبيرك AIGuidePro
            </a>
            <a 
              href="https://manus.im/invitation/WPMFXDLTGFVO" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto bg-slate-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-600 transition-colors duration-300"
            >
              جرب منصة Manus
            </a>
        </div>

      </div>
    </div>
  );
};

export default Hero;