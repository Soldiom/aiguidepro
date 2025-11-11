// Lightweight client-side research helpers with best-effort CORS-friendly feeds.
// If network fails, we fall back to generic AI topics in Arabic.

export async function fetchAIResearchTopics(): Promise<string[]> {
  const topics: string[] = [];
  try {
    // arXiv simple query for cs.AI recent submissions
    const res = await fetch('https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=10', { mode: 'cors' });
    if (res.ok) {
      const xml = await res.text();
      // naive extraction of <title> elements without heavy XML parsing
      const matches = Array.from(xml.matchAll(/<title>([^<]+)<\/title>/g)).map(m => m[1]).slice(1); // skip feed title
      matches.forEach(t => {
        // extract some keywords
        const kw = t
          .replace(/\b(arXiv|AI|LLM|NLP|CV|\d{4}\.\d{4,5})\b/gi, '')
          .split(/[:\-–\|]/)[0]
          .trim();
        if (kw && kw.length > 2) topics.push(kw);
      });
    }
  } catch {}

  // If not enough, fill with curated Arabic-friendly topics
  const fallback = [
    'نماذج اللغة الكبيرة في التعليم',
    'الرؤية الحاسوبية في الرعاية الصحية',
    'أتمتة الأعمال الصغيرة بالذكاء الاصطناعي',
    'السلامة والأخلاقيات في الذكاء الاصطناعي',
    'الهندسة المعمارية لوكلاء الذكاء الاصطناعي',
    'تحسين تجربة العملاء باستخدام روبوتات الدردشة',
  ];
  while (topics.length < 6 && fallback.length) topics.push(fallback.shift()!);
  return Array.from(new Set(topics)).slice(0, 6);
}
