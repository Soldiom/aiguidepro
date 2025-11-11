import React from 'react';

const ErrorPage: React.FC<{ error?: string }> = ({ error }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200">
    <h1 className="text-5xl font-black mb-4">حدث خطأ</h1>
    <p className="text-lg mb-6">عذراً، حدث خطأ غير متوقع أثناء معالجة طلبك.</p>
    {error && <pre className="bg-slate-800 text-red-400 p-4 rounded mb-4 max-w-xl overflow-x-auto">{error}</pre>}
    <a href="/" className="text-emerald-400 hover:underline">العودة للصفحة الرئيسية</a>
  </div>
);

export default ErrorPage;
