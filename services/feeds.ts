import type { RawFeedItem } from '../types/news';

export function getAllowedHosts(): string[] {
  const env = (import.meta as any).env?.VITE_NEWS_ALLOWED_HOSTS as string | undefined;
  const defaults = [
    'export.arxiv.org', 'arxiv.org',
    'ai.googleblog.com', 'openai.com', 'thegradient.pub', 'blogs.nvidia.com',
    'deepmind.google', 'huggingface.co', 'meta.com', 'pytorch.org', 'paperswithcode.com',
    'semanticscholar.org', 'nature.com', 'science.org', 'acm.org', 'ieee.org'
  ];
  if (!env) return defaults;
  const extra = env.split(',').map(s => s.trim()).filter(Boolean);
  return Array.from(new Set([...defaults, ...extra]));
}

function parseArxivAtom(xml: string): RawFeedItem[] {
  const out: RawFeedItem[] = [];
  const entries = xml.split('<entry>').slice(1);
  for (const e of entries) {
    const title = (e.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || '';
    const idUrl = (e.match(/<id>([\s\S]*?)<\/id>/) || [])[1]?.trim() || title;
    const link = (e.match(/<link[^>]*href=\"([^\"]+)\"/) || [])[1] || idUrl;
    const published = (e.match(/<published>([\s\S]*?)<\/published>/) || [])[1];
    const summary = (e.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1];
    let arxivId: string | undefined;
    try { const u = new URL(link); arxivId = u.pathname.replace(/\//g,'').replace('abs','').trim() || undefined; } catch {}
    const doi = (e.match(/<arxiv:doi[^>]*>([\s\S]*?)<\/arxiv:doi>/) || [])[1];
    if (title) out.push({ id: idUrl, title, link, publishedAt: published, source: 'arXiv', summary, host: 'export.arxiv.org', arxivId, doi });
  }
  return out;
}

async function safeFetch(url: string): Promise<string | null> {
  try {
    const proxy = (import.meta as any).env?.VITE_NEWS_PROXY_URL as string | undefined;
    const finalUrl = proxy ? `${proxy}?url=${encodeURIComponent(url)}` : url;
    const res = await fetch(finalUrl, { mode: proxy ? 'cors' : 'cors' });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

export async function fetchArxivRecent(max = 10): Promise<RawFeedItem[]> {
  const url = `https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=${max}`;
  const text = await safeFetch(url);
  if (!text) return [];
  return parseArxivAtom(text).slice(0, max);
}

// Generic RSS parsing (very light, best-effort)
function parseRSS(xml: string, sourceHint?: string): RawFeedItem[] {
  const out: RawFeedItem[] = [];
  const items = xml.split(/<item[\s>]/i).slice(1);
  for (const it of items) {
    const title = (it.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
    const link = (it.match(/<link>([\s\S]*?)<\/link>/i) || [])[1]?.trim();
    const pub = (it.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1]?.trim();
    if (title) out.push({ id: (link || title), title, link, publishedAt: pub, source: sourceHint || 'rss' });
  }
  return out;
}

export async function fetchRSS(url: string, max = 10): Promise<RawFeedItem[]> {
  // Enforce allowed hosts for authenticity
  try {
    const h = new URL(url).host;
    if (!getAllowedHosts().includes(h)) return [];
  } catch { return []; }
  const text = await safeFetch(url);
  if (!text) return [];
  // Use host as source hint
  let hint: string | undefined;
  try { hint = new URL(url).host; } catch {}
  return parseRSS(text, hint).slice(0, max);
}

export function getDefaultNewsFeeds(): string[] {
  // You can override via VITE_NEWS_SOURCES (comma-separated)
  const env = (import.meta as any).env?.VITE_NEWS_SOURCES as string | undefined;
  if (env) return env.split(',').map(s => s.trim()).filter(Boolean);
  return [
    'https://ai.googleblog.com/feeds/posts/default?alt=rss',
    'https://openai.com/blog/rss/',
    'https://thegradient.pub/rss/',
    'https://blogs.nvidia.com/blog/category/ai/feed/',
  ];
}

export async function fetchCommunityFeeds(maxPerFeed = 5): Promise<RawFeedItem[]> {
  const urls = getDefaultNewsFeeds();
  const all: RawFeedItem[] = [];
  for (const u of urls) {
    try {
      const items = await fetchRSS(u, maxPerFeed);
      // only allow items whose host is whitelisted
      const allowed = getAllowedHosts();
      all.push(...items.filter(it => {
        try { return it.link ? allowed.includes(new URL(it.link).host) : true; } catch { return false; }
      }));
    } catch {}
  }
  return all;
}

// Placeholder fallback when nothing is reachable
export async function fetchFallbackBlogs(): Promise<RawFeedItem[]> {
  // Curated placeholders to avoid empty UI in case of CORS blocks
  const now = Date.now();
  return [
    { id: 'blog-1', title: 'أفضل ممارسات تبنّي وكلاء الذكاء الاصطناعي في الشركات', link: undefined, source: 'blog-curated', publishedAt: new Date(now-86400000).toISOString() },
    { id: 'news-1', title: 'إطلاق تقنيات جديدة لتحسين كفاءة نماذج اللغة الكبيرة', link: undefined, source: 'news-curated', publishedAt: new Date(now-2*86400000).toISOString() },
  ];
}
