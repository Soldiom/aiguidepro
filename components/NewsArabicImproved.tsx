import React, { useEffect, useState } from 'react';

interface ResearchPaper {
  id: string;
  title: string;
  titleAr?: string;
  summary: string;
  summaryAr?: string;
  authors: string[];
  published: string;
  link: string;
  categories: string[];
}

const NewsArabicImproved: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('all');

  useEffect(() => {
    fetchArxivPapers();
  }, []);

  const fetchArxivPapers = async () => {
    try {
      setLoading(true);
      
      // Fetch from arXiv API
      const searchQuery = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV';
      const maxResults = 20;
      const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(searchQuery)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
      
      const response = await fetch(url);
      const xmlText = await response.text();
      
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.querySelectorAll('entry');
      
      const parsedPapers: ResearchPaper[] = Array.from(entries).map((entry, index) => {
        const id = entry.querySelector('id')?.textContent || `paper-${index}`;
        const title = entry.querySelector('title')?.textContent?.trim() || 'Untitled';
        const summary = entry.querySelector('summary')?.textContent?.trim() || '';
        const published = entry.querySelector('published')?.textContent || '';
        const link = entry.querySelector('id')?.textContent || '';
        
        const authorNodes = entry.querySelectorAll('author name');
        const authors = Array.from(authorNodes).map(node => node.textContent || '');
        
        const categoryNodes = entry.querySelectorAll('category');
        const categories = Array.from(categoryNodes).map(node => node.getAttribute('term') || '');
        
        return {
          id,
          title,
          summary: summary.substring(0, 500) + '...',
          authors,
          published,
          link,
          categories
        };
      });
      
      setPapers(parsedPapers);
    } catch (error) {
      console.error('Error fetching arXiv papers:', error);
      // Fallback to sample data
      setPapers(getSamplePapers());
    } finally {
      setLoading(false);
    }
  };

  const getSamplePapers = (): ResearchPaper[] => [
    {
      id: '1',
      title: 'Advances in Large Language Models for Arabic NLP',
      titleAr: 'تطورات في نماذج اللغة الكبيرة لمعالجة اللغة العربية',
      summary: 'This paper presents recent advances in large language models specifically designed for Arabic natural language processing tasks...',
      summaryAr: 'تقدم هذه الورقة أحدث التطورات في نماذج اللغة الكبيرة المصممة خصيصاً لمهام معالجة اللغة العربية الطبيعية...',
      authors: ['Ahmed Al-Mansour', 'Fatima Hassan'],
      published: '2025-11-10',
      link: 'https://arxiv.org/abs/2511.00001',
      categories: ['cs.CL', 'cs.AI']
    },
    {
      id: '2',
      title: 'Vision Transformers for Medical Image Analysis',
      titleAr: 'محولات الرؤية لتحليل الصور الطبية',
      summary: 'We introduce a novel architecture based on vision transformers for analyzing medical images with improved accuracy...',
      summaryAr: 'نقدم بنية جديدة تعتمد على محولات الرؤية لتحليل الصور الطبية بدقة محسّنة...',
      authors: ['Sarah Chen', 'Mohammed Al-Rashid'],
      published: '2025-11-09',
      link: 'https://arxiv.org/abs/2511.00002',
      categories: ['cs.CV', 'cs.AI']
    },
    {
      id: '3',
      title: 'Reinforcement Learning for Autonomous Driving',
      titleAr: 'التعلم المعزز للقيادة الذاتية',
      summary: 'This work explores the application of deep reinforcement learning techniques in autonomous vehicle navigation...',
      summaryAr: 'يستكشف هذا العمل تطبيق تقنيات التعلم المعزز العميق في التنقل بالمركبات ذاتية القيادة...',
      authors: ['David Park', 'Layla Ibrahim'],
      published: '2025-11-08',
      link: 'https://arxiv.org/abs/2511.00003',
      categories: ['cs.LG', 'cs.RO']
    }
  ];

  const filteredPapers = papers.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'recent') return new Date(p.published) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return true;
  });

  return (
    <section className="py-20 px-4 bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            أحدث الأبحاث في الذكاء الاصطناعي
          </h1>
          <p className="text-lg text-slate-400">
            آخر الأوراق البحثية من arXiv في مجالات الذكاء الاصطناعي والتعلم الآلي
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label className="text-slate-300 text-sm font-semibold">التصفية:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'recent'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                الأحدث
              </button>
            </div>
          </div>
          <button
            onClick={fetchArxivPapers}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تحديث
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="text-slate-400 mt-4">جاري تحميل الأبحاث...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPapers.map((paper) => (
              <article
                key={paper.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {paper.titleAr || paper.title}
                    </h2>
                    {paper.titleAr && (
                      <p className="text-sm text-slate-400 mb-2">{paper.title}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {paper.categories.slice(0, 3).map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full font-semibold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-4">
                  {paper.summaryAr || paper.summary}
                </p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-slate-700">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {paper.authors.slice(0, 3).join(', ')}
                      {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(paper.published).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all font-semibold"
                  >
                    قراءة البحث
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredPapers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">لا توجد أبحاث متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsArabicImproved;
