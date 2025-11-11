import type { ArabicPost, RawFeedItem } from '../types/news';

const KEY_POSTS = 'aiguidepro.news.posts';
const KEY_RAW = 'aiguidepro.news.raw';
const KEY_LAST = 'aiguidepro.news.lastFetchedAt';

export function getArabicPosts(): ArabicPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_POSTS);
    return raw ? (JSON.parse(raw) as ArabicPost[]) : [];
  } catch { return []; }
}

export function saveArabicPosts(posts: ArabicPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_POSTS, JSON.stringify(posts));
}

export function getRawFeedItems(): RawFeedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_RAW);
    return raw ? (JSON.parse(raw) as RawFeedItem[]) : [];
  } catch { return []; }
}

export function saveRawFeedItems(items: RawFeedItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_RAW, JSON.stringify(items));
}

export function getLastFetchedAt(): number {
  if (typeof window === 'undefined') return 0;
  try { return Number(localStorage.getItem(KEY_LAST) || 0); } catch { return 0; }
}

export function setLastFetchedAt(ts: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_LAST, String(ts));
}
