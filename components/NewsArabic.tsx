import React, { useEffect, useMemo, useState } from 'react';
import { runNewsOrchestrator } from '../services/newsOrchestrator';
import { getArabicPosts } from '../storage/newsStorage';
import type { ArabicPost } from '../types/news';
import { getAllowedHosts } from '../services/feeds';

const NewsArabic: React.FC = () => {
  const [posts, setPosts] = useState<ArabicPost[]>([]);
  const [filter, setFilter] = useState<'all'|'paper'|'news'|'blog'>('all');
  const allowed = useMemo(() => new Set(getAllowedHosts()), []);

  useEffect(() => {
    // run orchestrator opportunistically
    runNewsOrchestrator();
    setPosts(getArabicPosts());
    const interval = setInterval(() => setPosts(getArabicPosts()), 10000);
    return () => clearInterval(interval);
  }, []);

  const list = posts.filter(p => filter === 'all' ? true : p.type === filter);
  const isVerified = (p: ArabicPost) => {
    if (!p.sources?.length) return false;
    try {
      return p.sources.every(s => {
        if (!s.url) return false;
        const h = new URL(s.url).host;
        return allowed.has(h);
      });
    } catch { return false; }
  };

  return (
    <section className="py-20 px-4 bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 text-center">ملخصات وأخبار الذكاء الاصطناعي بالعربية</h1>
        <p className="text-slate-400 text-center mb-8">محتوى مُلخّص ومُترجم آلياً إلى العربية بالاعتماد على مصادر أصلية مع الإسناد. يتم التحديث يومياً.</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label className="text-slate-300 text-sm">التصفية</label>
            <select value={filter} onChange={e=> setFilter(e.target.value as any)} className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2">
              <option value="all">الكل</option>
              <option value="paper">أوراق بحثية</option>
              <option value="news">أخبار</option>
              <option value="blog">مقالات</option>
            </select>
          </div>
          <p className="text-xs text-slate-500">يتم الجمع والتوليد محلياً؛ قد تختلف النتائج حسب التحديث الأخير.</p>
        </div>
        <div className="space-y-8">
          {list.map(p => (
            <article key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <header className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-xl font-bold text-white">{p.title}</h2>
                <div className="flex items-center gap-2">
                  {isVerified(p) && (
                    <span className="text-[10px] inline-block bg-emerald-600/20 text-emerald-300 font-bold px-2 py-1 rounded">موثّق</span>
                  )}
                  <span className="text-xs inline-block bg-emerald-500/10 text-emerald-300 font-bold px-3 py-1 rounded-full">{p.type === 'paper' ? 'بحث' : p.type === 'news' ? 'خبر' : 'مقال'}</span>
                </div>
              </header>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed text-sm">{p.body}</div>
              <footer className="mt-4 text-xs text-slate-500 flex flex-wrap gap-3">
                {p.sources.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{s.title.substring(0,80)}</a>
                    <span className="text-slate-500">({s.source})</span>
                  </span>
                ))}
              </footer>
            </article>
          ))}
          {list.length === 0 && (
            <div className="text-center text-slate-400">لا توجد منشورات عربية حالياً.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsArabic;
