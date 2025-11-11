import { fetchArxivRecent, fetchFallbackBlogs, fetchCommunityFeeds, getAllowedHosts } from './feeds';
import { summarizeToArabic } from './generateArabicPosts';
import { getArabicPosts, saveArabicPosts, getRawFeedItems, saveRawFeedItems, getLastFetchedAt, setLastFetchedAt } from '../storage/newsStorage';

const DAILY_MS = 24 * 60 * 60 * 1000;
const LOCK_KEY = 'aiguidepro.news.lock';

function now() { return Date.now(); }
function getLock() { try { return Number(localStorage.getItem(LOCK_KEY) || 0); } catch { return 0; } }
function setLock() { try { localStorage.setItem(LOCK_KEY, String(now())); } catch {} }

function isEnabled() {
  const flag = (import.meta as any).env?.VITE_ARABIC_NEWS;
  return String(flag ?? 'true') !== 'false';
}

export async function runNewsOrchestrator() {
  if (typeof window === 'undefined') return;
  if (!isEnabled()) return;
  const lk = getLock();
  if (now() - lk < 60_000) return; // 1 دقيقة حماية
  setLock();

  const last = getLastFetchedAt();
  if (now() - last < DAILY_MS) return; // مرة يومياً

  try {
    // 1) جلب المصادر
    const papers = await fetchArxivRecent(8);
    let blogs = await fetchCommunityFeeds(4);
    if (!blogs.length) {
      blogs = await fetchFallbackBlogs();
    }
    // Filter by allowed hosts for authenticity
    const allowed = new Set(getAllowedHosts());
    const safeBlogs = blogs.filter(b => {
      try { return b.link ? allowed.has(new URL(b.link).host) : !!b.host && allowed.has(b.host); } catch { return false; }
    });
    const rawMerged = [...papers, ...safeBlogs];
    const existingRaw = getRawFeedItems();
    // دمج بسيط بدون تكرار بالـ id
    const byId = new Map<string, any>();
    [...existingRaw, ...rawMerged].forEach(r => byId.set(r.id, r));
    const mergedRaw = Array.from(byId.values());
    saveRawFeedItems(mergedRaw);

    // 2) توليد منشورات عربية (أوراق + أخبار/مدونات)
    const paperPosts = await summarizeToArabic(papers.slice(0,4), 'paper');
  const newsPosts = await summarizeToArabic(safeBlogs.slice(0,6), 'news');

    if (paperPosts.length || newsPosts.length) {
      const existing = getArabicPosts();
      const combined = [...paperPosts, ...newsPosts, ...existing].sort((a,b) => b.createdAt - a.createdAt).slice(0, 200);
      saveArabicPosts(combined);
    }
    setLastFetchedAt(now());
  } catch {
    // تجاهل بهدوء (يمكن لاحقاً التخزين لسجل أخطاء محلي)
  }
}
