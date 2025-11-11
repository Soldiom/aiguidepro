export interface RawFeedItem {
  id: string;
  title: string;
  link?: string;
  source: string; // e.g., arXiv, blog-rss
  publishedAt?: string;
  summary?: string; // original summary
  host?: string; // resolved host for authenticity checks
  arxivId?: string; // if from arXiv
  doi?: string; // if available
}

export interface ArabicPost {
  id: string;
  originalIds: string[]; // references to raw ids used in synthesis
  title: string; // Arabic summarized title
  body: string; // Arabic synthesized / translated content
  sources: Array<{ title: string; url?: string; source: string }>; // attribution
  createdAt: number;
  type: 'paper' | 'news' | 'blog';
}
