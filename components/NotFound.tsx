import React from 'react';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200">
    <h1 className="text-6xl font-black mb-4">404</h1>
    <p className="text-xl mb-6">الصفحة غير موجودة</p>
    <a href="/" className="text-emerald-400 hover:underline">العودة للصفحة الرئيسية</a>
  </div>
);

export default NotFound;
