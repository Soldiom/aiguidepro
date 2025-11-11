import React, { useMemo, useState } from 'react';
import { extractPdfText, buildChapters, generateTsFile, generateFallbackTsFile, type ChapterDraft, type RawPdfPage } from '../services/pdfParser';

const PdfImporter: React.FC = () => {
  const [pages, setPages] = useState<RawPdfPage[] | null>(null);
  const [chapters, setChapters] = useState<ChapterDraft[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const totalPages = pages?.length || 0;

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    setPages(null);
    setChapters(null);
    try {
      const out = await extractPdfText(file, { onProgress: (r) => setProgress(r) });
      setPages(out);
      const ch = buildChapters(out);
      setChapters(ch);
    } catch (err: any) {
      setError(err?.message || 'فشل قراءة PDF');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const onFetchUrl = async () => {
    if (!pdfUrl.trim()) return;
    setError(null);
    setLoading(true);
    setPages(null);
    setChapters(null);
    try {
      const res = await fetch(pdfUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`تعذر تنزيل الملف (${res.status})`);
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('pdf')) {
        // قد لا يرسل الخادم نوع المحتوى بشكل صحيح؛ نستمر ولكن نحذّر
        console.warn('[PdfImporter] Content-Type is not PDF:', ct);
      }
      const blob = await res.blob();
      const file = new File([blob], 'book.pdf', { type: 'application/pdf' });
      const out = await extractPdfText(file, { onProgress: (r) => setProgress(r) });
      setPages(out);
      const ch = buildChapters(out);
      setChapters(ch);
    } catch (err: any) {
      const msg = err?.message || 'فشل جلب PDF من الرابط (قد تكون مشكلة صلاحيات CORS)';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onDownloadTsx = () => {
    let ts = '';
    if (chapters && chapters.length > 0) {
      ts = generateTsFile(chapters);
    } else if (pages && pages.length > 0) {
      ts = generateFallbackTsFile(pages);
    } else {
      return;
    }
    const blob = new Blob([ts], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookData.generated.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('تم توليد ملف TSX؛ ضعه في مجلد data/ واربطة في واجهة الكتاب');
  };

  const hints = useMemo(() => {
    const arr: string[] = [];
    if (chapters && chapters.length > 0) {
      const titles = chapters.map(c => c.title).join(' | ');
      arr.push(`تم اكتشاف ${chapters.length} قسماً/فصلاً`);
      arr.push(`العناوين: ${titles.substring(0, 200)}${titles.length > 200 ? '…' : ''}`);
    }
    if (totalPages) arr.push(`عدد الصفحات المقروءة: ${totalPages}`);
    return arr;
  }, [chapters, totalPages]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">استيراد كتاب PDF (تجريبي)</h2>
        <p className="text-slate-400 mb-4">ارفع ملف PDF الكامل (120+ صفحة). سنستخرج النص ونحاول اكتشاف فصول وعناوين، ثم نولّد ملف TSX يمكنك إضافته إلى المشروع.</p>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <label className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
            اختر ملف PDF
            <input type="file" accept="application/pdf" onChange={onSelect} className="hidden" />
          </label>
          {loading && (
            <div className="text-slate-300">جاري القراءة… {(progress * 100).toFixed(0)}%</div>
          )}
          {!loading && (chapters?.length || pages?.length) ? (
            <button onClick={onDownloadTsx} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded">
              {chapters && chapters.length > 0 ? 'تحميل ملف TSX' : 'تحميل TSX (نسخة كاملة بدون تقسيم)'}
            </button>
          ) : null}
          {!loading && pages?.length && (
            <button onClick={() => pages && setChapters(buildChapters(pages))} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
              إعادة اكتشاف الفصول
            </button>
          )}
        </div>

        <div className="mt-3 mb-4">
          <label className="block text-slate-300 text-sm mb-2">أو جلب من رابط مباشر لملف PDF (يتطلب دعم CORS من المصدر):</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/book.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={onFetchUrl} disabled={!pdfUrl || loading} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded">جلب</button>
          </div>
          <p className="text-xs text-slate-500 mt-1">ملاحظة: إن لم يعمل الرابط بسبب CORS، فضلاً حمل الملف محلياً عبر الزر أعلاه.</p>
        </div>

        {error && <div className="text-red-400 mb-3">{error}</div>}

        {hints.length > 0 && (
          <ul className="text-slate-300 list-disc list-inside mb-4">
            {hints.map((h, i) => (<li key={i}>{h}</li>))}
          </ul>
        )}

        {chapters?.length ? (
          <div className="mt-6">
            <h3 className="text-white font-bold mb-3">الفصول/الأقسام المكتشفة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapters.map((c) => (
                <div key={c.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">صفحات: {c.pages[0]}{c.pages.length > 1 ? `…${c.pages[c.pages.length-1]}` : ''}</div>
                  <div className="text-white font-bold mb-2">{c.title}</div>
                  <div className="text-slate-400 text-sm line-clamp-3 whitespace-pre-wrap">{c.raw.slice(0, 300)}{c.raw.length > 300 ? '…' : ''}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PdfImporter;
