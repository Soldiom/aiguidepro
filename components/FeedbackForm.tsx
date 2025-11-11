import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) {
      setError('يرجى كتابة ملاحظتك أولاً');
      return;
    }
    setSent(true);
    setError('');
    // TODO: send to backend or email service
  };

  if (sent) return <div className="text-emerald-400">شكرًا لملاحظتك! تم الإرسال بنجاح.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <label className="block text-slate-200 font-bold mb-2">ملاحظاتك أو اقتراحك:</label>
      <textarea
        className="w-full p-2 rounded bg-slate-800 text-slate-100 border border-slate-700 focus:border-emerald-500"
        rows={4}
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="اكتب رأيك أو اقتراحك هنا..."
        required
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 font-bold">إرسال</button>
    </form>
  );
};

export default FeedbackForm;
