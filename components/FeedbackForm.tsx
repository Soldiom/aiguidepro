import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) {
      setError('يرجى كتابة ملاحظتك أولاً');
      return;
    }
    
    try {
      // Send email using mailto (opens email client)
      const subject = encodeURIComponent('ملاحظة من AI Guide Pro');
      const body = encodeURIComponent(`ملاحظة/اقتراح:\n\n${msg}\n\n---\nمن: AI Guide Pro\nالتاريخ: ${new Date().toLocaleString('ar-SA')}`);
      const mailtoLink = `mailto:soldiom@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Also try to send via Web3Forms API as backup
      const formData = new FormData();
      formData.append('access_key', '8c3e7f1a-4b2d-4e9c-8f5a-1d3c7e9f2b4a'); // Free Web3Forms key
      formData.append('subject', 'ملاحظة من AI Guide Pro');
      formData.append('message', msg);
      formData.append('from_name', 'AI Guide Pro User');
      formData.append('to_email', 'soldiom@gmail.com');
      
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      setSent(true);
      setError('');
      setMsg('');
    } catch (err) {
      console.error('Error sending feedback:', err);
      setError('حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.');
    }
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
