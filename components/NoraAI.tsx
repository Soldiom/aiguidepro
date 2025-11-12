import React, { useState } from 'react';
import noraAvatar from '../src/assets/images/nora_ai_avatar.png';
import noraFullBody from '../src/assets/images/nora_ai_full_body.png';

interface NoraAIProps {
  message?: string;
  variant?: 'avatar' | 'full' | 'floating';
  showMessage?: boolean;
}

const NoraAI: React.FC<NoraAIProps> = ({ 
  message = "مرحباً! أنا نورا، مرشدتك في عالم الذكاء الاصطناعي 🤖✨",
  variant = 'avatar',
  showMessage = true
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const avatarImage = variant === 'full' ? noraFullBody : noraAvatar;

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 animate-fade-in">
        {showMessage && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-sm relative animate-slide-up">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-sm leading-relaxed pr-4">{message}</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 transform rotate-45"></div>
          </div>
        )}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
          <img
            src={noraAvatar}
            alt="نورا AI"
            className="relative w-20 h-20 rounded-full border-4 border-white shadow-2xl object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs">✨</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-3xl border border-emerald-500/20 backdrop-blur-sm">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-400 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <img
          src={avatarImage}
          alt="نورا AI - خبيرة الذكاء الاصطناعي"
          className={`relative ${variant === 'full' ? 'w-64 h-auto' : 'w-32 h-32 md:w-48 md:h-48'} rounded-2xl shadow-2xl object-cover border-4 border-emerald-500/30 group-hover:scale-105 transition-transform duration-300`}
        />
      </div>
      
      {showMessage && (
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              نورا AI
            </h3>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
              خبيرة ذكاء اصطناعي
            </span>
          </div>
          
          <p className="text-slate-300 text-lg leading-relaxed">
            {message}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-800/50 text-slate-400 text-sm rounded-full border border-slate-700">
              🎓 معلمة
            </span>
            <span className="px-3 py-1 bg-slate-800/50 text-slate-400 text-sm rounded-full border border-slate-700">
              💡 مبتكرة
            </span>
            <span className="px-3 py-1 bg-slate-800/50 text-slate-400 text-sm rounded-full border border-slate-700">
              🚀 ملهمة
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoraAI;
