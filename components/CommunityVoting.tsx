import React, { useEffect, useState } from 'react';
import { getSuggestions, voteOnSuggestion } from '../storage/suggestionsStorage';
import type { CourseSuggestion } from '../types/suggestion';

// Public voting page - read-only suggestion list except voting.
// Assumes suggestions are being auto-refreshed by orchestrator on load.

const CommunityVoting: React.FC = () => {
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>([]);
  const [sortMode, setSortMode] = useState<'votes'|'recent'>('votes');
  const [filterGenerated, setFilterGenerated] = useState<boolean>(false);

  useEffect(() => {
    setSuggestions(getSuggestions());
    const interval = setInterval(() => setSuggestions(getSuggestions()), 5000);
    return () => clearInterval(interval);
  }, []);

  let list = suggestions.slice();
  if (filterGenerated) list = list.filter(s => s.status !== 'generated');
  list.sort((a,b) => sortMode === 'votes' ? b.votes - a.votes : b.createdAt - a.createdAt);

  const handleVote = (id: string) => {
    const updated = voteOnSuggestion(id, 1);
    setSuggestions(updated);
  };

  return (
    <section className="py-20 px-4 bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 text-center">التصويت المجتمعي على أفكار الدورات</h1>
        <p className="text-slate-400 text-center mb-8">صوِّت لأكثر الأفكار فائدة. تُولّد دورتان أسبوعياً من الأعلى تصويتاً.</p>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-slate-300 text-sm">الترتيب</label>
            <select value={sortMode} onChange={e=> setSortMode(e.target.value as any)} className="bg-slate-900 text-white rounded px-3 py-2 border border-slate-700">
              <option value="votes">حسب الأصوات</option>
              <option value="recent">الأحدث</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 select-none">
            <input type="checkbox" className="accent-emerald-500" checked={filterGenerated} onChange={e=> setFilterGenerated(e.target.checked)} />
            إخفاء المُولَّدة
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(s => (
            <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">{s.level || 'مستوى'}</span>
                <span className="text-xs text-slate-500">أصوات: {s.votes}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm flex-grow">{s.description}</p>
              {s.status === 'generated' ? (
                <span className="mt-4 inline-block bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded">تم توليد دورة</span>
              ) : (
                <button
                  onClick={() => handleVote(s.id)}
                  className="mt-4 bg-indigo-600 text-white font-bold py-2 px-3 rounded hover:bg-indigo-500"
                >تصويت</button>
              )}
            </div>
          ))}
          {list.length === 0 && (
            <div className="col-span-full text-center text-slate-400">لا توجد اقتراحات حالياً.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityVoting;
