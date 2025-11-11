import React from 'react';
import { bookIntro, bookContentFull as bookContent, hasImportedBook } from '../data/bookData';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AiModal from './AiModal';


const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-16">
      {children}
    </h2>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6.275 3.275l2.122 2.121M3.275 6.275l2.121 2.122M15 3v4M13 5h4M16.275 3.275l2.122 2.121M13.275 6.275l2.121 2.122M10 17v4M8 19h4M11.275 17.275l2.122 2.121M8.275 20.275l2.121 2.122" />
    </svg>
);

const LightBulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const InteractiveBookSection: React.FC = () => {
  const aiClient = React.useMemo(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[InteractiveBookSection] Missing VITE_GEMINI_API_KEY; AI features disabled.');
      return null;
    }

    try {
      return new GoogleGenerativeAI(apiKey);
    } catch (err) {
      console.error('[InteractiveBookSection] Failed to initialize GoogleGenerativeAI client.', err);
      return null;
    }
  }, []);

  const allChapterIds = React.useMemo(() => {
    const ids = ['intro'];
    bookContent.forEach(part => {
      part.chapters.forEach(chapter => ids.push(chapter.id));
    });
    return ids;
  }, []);

  const [activeId, setActiveId] = React.useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash && allChapterIds.includes(hash) ? hash : 'intro';
  });
  
  const [expandedParts, setExpandedParts] = React.useState(() => {
    return Object.fromEntries(bookContent.map(part => [part.title, true]));
  });
  
  const contentRef = React.useRef<HTMLDivElement>(null);
  const contentDisplayRef = React.useRef<HTMLDivElement>(null);
  const chapterLinkRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});
  
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [aiContent, setAiContent] = React.useState('');
  const [isLoadingAi, setIsLoadingAi] = React.useState(false);
  const [aiError, setAiError] = React.useState('');
  const [aiModalTitle, setAiModalTitle] = React.useState('');
  const [easyRead, setEasyRead] = React.useState(false);
  const [fontScale, setFontScale] = React.useState(1);

  const chapterToPartMap = React.useMemo(() => {
    const map = new Map<string, string>();
    bookContent.forEach(part => {
      part.chapters.forEach(chapter => {
        map.set(chapter.id, part.title);
      });
    });
    return map;
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && allChapterIds.includes(hash)) {
            setActiveId(hash);
        } else if (!hash) {
            setActiveId('intro');
        }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    return () => {
        window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [allChapterIds]);

  React.useEffect(() => {
    if (history.replaceState) {
        history.replaceState(null, '', `#${activeId}`);
    } else {
        window.location.hash = `#${activeId}`;
    }

    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
    
    const partTitle = chapterToPartMap.get(activeId);
    if(partTitle && !expandedParts[partTitle]) {
      setExpandedParts(prev => ({...prev, [partTitle]: true}));
    }

    const timerId = setTimeout(() => {
        const activeLinkEl = chapterLinkRefs.current[activeId];
        if (activeLinkEl) {
            activeLinkEl.focus({ preventScroll: true });
            activeLinkEl.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, 100);

    return () => clearTimeout(timerId);

  }, [activeId, chapterToPartMap, expandedParts]);


  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
  };
  
  const handleNavigation = (direction: 'next' | 'prev') => {
    const currentIndex = allChapterIds.indexOf(activeId);
    let nextIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < allChapterIds.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }
    setActiveId(allChapterIds[nextIndex]);
  };

  const handleAiAction = async (action: 'summarize' | 'simplify') => {
    if (!contentDisplayRef.current) return;

    const textContent = contentDisplayRef.current.innerText;
  if (!textContent || textContent.trim().length < 50) { // Basic check for content
        setAiModalTitle("خطأ");
        setAiContent('');
        setAiError("لا يوجد محتوى كافٍ للمعالجة.");
        setIsLoadingAi(false);
        setIsAiModalOpen(true);
        return;
    }

    setIsAiModalOpen(true);
    setIsLoadingAi(true);
    setAiError('');
    setAiContent('');

  const promptText = action === 'summarize'
    ? `قم بتلخيص النص العربي التالي حول الذكاء الاصطناعي للمبتدئين فقط. التعليمات:
1. اكتب الرد باللغة العربية الفصحى الواضحة فقط.
2. يمنع استخدام أي كلمة أو حرف لاتيني أو إنجليزي.
3. قدم الملخص في شكل قائمة نقطية Markdown (استخدم * قبل كل نقطة).
4. اجعل كل نقطة قصيرة ومباشرة وتشرح المفهوم ببساطة.
5. لا تضف مقدمة عامة أو خاتمة، ابدأ مباشرة بالنقاط.
النص:
${textContent}
`
    : `قم بتبسيط النص العربي التالي حول الذكاء الاصطناعي لشخص لا يمتلك أي خلفية تقنية. التعليمات:
1. اكتب باللغة العربية الفصحى المبسطة فقط بدون أي مفردات إنجليزية أو لاتينية.
2. استخدم أمثلة وتشبيهات حياتية قصيرة لتوضيح الأفكار.
3. قسم الرد إلى فقرات قصيرة منظمة، ويمكنك بعد ذلك إضافة قائمة نقطية Markdown (استخدم * قبل كل نقطة) لأهم النقاط.
4. تجنب المصطلحات التقنية الصعبة، وإذا اضطررت لذكر مصطلح تقني فسّره فورًا.
5. لا تستخدم سطر يحتوي على أحرف لاتينية. إذا ظهرت كلمة إنجليزية فهذا يعتبر خطأ.
النص:
${textContent}
`;
    
    setAiModalTitle(action === 'summarize' ? 'ملخص الفصل' : 'تبسيط المحتوى');

  if (!aiClient) {
    setAiError('ميزة الذكاء الاصطناعي غير متاحة حاليًا. يرجى إعداد مفتاح Gemini في الإعدادات.');
    setIsLoadingAi(false);
    return;
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(promptText);
    const response = await result.response;
    setAiContent(response.text());
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    setAiError(`حدث خطأ أثناء معالجة الطلب: ${errorMessage}`);
  } finally {
        setIsLoadingAi(false);
    }
  };


  const togglePart = (partTitle: string) => {
      setExpandedParts(prev => ({ ...prev, [partTitle]: !prev[partTitle] }));
  };

  const handleExpandAll = () => {
    const allExpanded = bookContent.reduce((acc, part) => {
        acc[part.title] = true;
        return acc;
    }, {} as Record<string, boolean>);
    setExpandedParts(allExpanded);
  };

  const handleCollapseAll = () => {
      const allCollapsed = bookContent.reduce((acc, part) => {
          acc[part.title] = false;
          return acc;
      }, {} as Record<string, boolean>);
      setExpandedParts(allCollapsed);
  };
  
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const renderTOC = () => (
    <nav className="md:col-span-1 md:sticky top-10 self-start p-4 h-full md:h-auto md:max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-orange-400">فهرس الكتاب</h3>
        <div className="flex gap-4">
          <button onClick={handleExpandAll} className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400" aria-label="عرض كل الأقسام">عرض الكل</button>
          <button onClick={handleCollapseAll} className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400" aria-label="إخفاء كل الأقسام">إخفاء الكل</button>
        </div>
      </div>
      <ul>
        <li>
            <a href="#intro" onClick={(e) => handleLinkClick(e, 'intro')} ref={(el) => (chapterLinkRefs.current['intro'] = el)} className={`block py-2 px-3 rounded-md transition-all duration-200 text-sm font-semibold relative ${activeId === 'intro' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400`}>
                {activeId === 'intro' && <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-emerald-400 rounded-r-full"></span>}
                مقدمة الكتاب
            </a>
        </li>
        {bookContent.map((part) => {
            const isPartExpanded = !!expandedParts[part.title];
            const partId = `part-${slugify(part.title)}`;
            return (
              <li key={part.title} className="mt-4">
                <button 
                    onClick={() => togglePart(part.title)} 
                    className={`w-full flex justify-between items-center text-right px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${isPartExpanded ? 'bg-slate-700/50 text-white' : 'text-slate-500 hover:bg-slate-800/50 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-400`}
                    aria-expanded={isPartExpanded}
                    aria-controls={partId}
                >
                    <span>{part.title}</span>
                    <svg className={`w-4 h-4 transition-transform ${isPartExpanded ? 'rotate-0' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isPartExpanded && (
                    <ul id={partId} className="mt-2 pr-2 border-r-2 border-slate-800">
                      {part.chapters.map((chapter) => (
                        <li key={chapter.id}>
                          <a href={`#${chapter.id}`} onClick={(e) => handleLinkClick(e, chapter.id)} ref={(el) => (chapterLinkRefs.current[chapter.id] = el)} className={`block py-2 px-3 rounded-md transition-all duration-200 text-sm relative ${activeId === chapter.id ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400`}>
                            {activeId === chapter.id && <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-emerald-400 rounded-r-full"></span>}
                            {chapter.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                )}
              </li>
            )
        })}
      </ul>
    </nav>
  );

  const currentContent = React.useMemo(() => {
    if (activeId === 'intro') {
        return bookIntro();
    }

    for (const part of bookContent) {
        const chapter = part.chapters.find(c => c.id === activeId);
        if (chapter) {
            return (
                <>
                    <h2 className="border-b-2 border-slate-700 pb-2 mb-6">{part.title}</h2>
                    <h3 className="text-4xl !text-white font-black">{chapter.title}</h3>
                    {chapter.content()}
                </>
            );
        }
    }
    return null;
  }, [activeId]);

  const renderContent = () => {
    const currentIndex = allChapterIds.indexOf(activeId);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === allChapterIds.length - 1;

    return (
        <div className="md:col-span-3">
      <div ref={contentRef} className="p-4 md:max-h-[85vh] overflow-y-auto">
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                    <button onClick={() => handleAiAction('summarize')} className="flex items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold py-2 px-4 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50" disabled={isLoadingAi}>
                       <SparklesIcon /> {isLoadingAi ? 'جاري المعالجة...' : 'تلخيص الفصل'}
                    </button>
                    <button onClick={() => handleAiAction('simplify')} className="flex items-center justify-center bg-orange-500/10 text-orange-400 font-bold py-2 px-4 rounded-lg hover:bg-orange-500/20 transition-colors disabled:opacity-50" disabled={isLoadingAi}>
                       <LightBulbIcon /> {isLoadingAi ? 'جاري المعالجة...' : 'تبسيط المحتوى'}
                    </button>
          <button onClick={() => setEasyRead(v => !v)} className={`flex items-center justify-center ${easyRead ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'} font-bold py-2 px-4 rounded-lg hover:bg-emerald-500/80 transition-colors`}>
            وضع القراءة السهل
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 text-xs">حجم الخط</span>
            <button onClick={() => setFontScale(s => Math.max(0.9, Math.round((s - 0.05) * 100) / 100))} className="bg-slate-700 text-white w-8 h-8 rounded hover:bg-slate-600">-</button>
            <button onClick={() => setFontScale(s => Math.min(1.3, Math.round((s + 0.05) * 100) / 100))} className="bg-slate-700 text-white w-8 h-8 rounded hover:bg-slate-600">+</button>
          </div>
                </div>

        <div
          ref={contentDisplayRef}
          className={`prose prose-invert max-w-none rounded-xl bg-slate-900/40 p-4 ${easyRead ? 'prose-lg md:prose-xl leading-loose' : 'prose-p:text-slate-300'} prose-headings:text-white prose-h2:text-3xl prose-h2:font-black prose-h3:text-2xl prose-h3:font-bold prose-h3:text-orange-400 prose-strong:text-emerald-400 prose-ul:list-disc prose-li:my-1 prose-a:text-emerald-400 hover:prose-a:text-emerald-300`}
          style={{ fontSize: `${fontScale}em` }}
        >
                    {currentContent}
                </div>
            </div>
            <div className="mt-8 flex justify-between items-center border-t border-slate-800 pt-4 px-4">
                 <button 
                    onClick={() => handleNavigation('prev')}
                    disabled={isFirst}
                    className="bg-slate-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    السابق
                </button>
                 <span className="text-sm text-slate-500">
                    صفحة {currentIndex + 1} من {allChapterIds.length}
                </span>
                <button 
                    onClick={() => handleNavigation('next')}
                    disabled={isLast}
                    className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center"
                >
                    التالي
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
  };

  return (
    <section className="py-20 md:py-32 px-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle>تصفح كتاب إتقان الذكاء الاصطناعي</SectionTitle>
        <p className="text-center text-amber-400 -mt-12 mb-12 text-sm">
          📖 ملاحظة: المعروض هنا نسخة مختصرة من الكتاب وليس الكتاب الكامل
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {renderTOC()}
          {renderContent()}
        </div>
      </div>
      {isAiModalOpen && (
        <AiModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          title={aiModalTitle}
          content={aiContent}
          isLoading={isLoadingAi}
          error={aiError}
        />
      )}
    </section>
  );
};

export default InteractiveBookSection;