import { getSuggestions, addSuggestions, markSuggestionGenerated } from '../storage/suggestionsStorage';
import { appendCourses } from '../storage/coursesStorage';
import { getGeminiSuggestions } from './courseSuggestions';
import { generateCourses } from './courseGenerator';
import { fetchAIResearchTopics } from './researchFeed';

const SUGGESTION_COOLDOWN_MS = 24 * 60 * 60 * 1000; // daily
const GENERATION_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // weekly
const MAX_GENERATIONS_PER_WINDOW = 2; // 2 courses per week

const KEY_LAST_SUGGEST = 'aiguidepro.auto.lastSuggestionAt';
const KEY_LAST_GENERATE = 'aiguidepro.auto.lastGenerationAt';
const KEY_LOCK = 'aiguidepro.auto.lock';

function now() { return Date.now(); }

function getTs(key: string) {
  try { return Number(localStorage.getItem(key) || 0); } catch { return 0; }
}

function setTs(key: string, v: number) {
  try { localStorage.setItem(key, String(v)); } catch {}
}

function tryLock(): boolean {
  const ts = getTs(KEY_LOCK);
  const n = now();
  if (n - ts < 60_000) return false; // 1 min lock window
  setTs(KEY_LOCK, n);
  return true;
}

function isEnabled() {
  // env toggle; default true
  const flag = (import.meta as any).env?.VITE_AUTO_COURSES;
  return String(flag ?? 'true') !== 'false';
}

export async function startAutoCourseFlow() {
  if (typeof window === 'undefined') return;
  if (!isEnabled()) return;
  if (!tryLock()) return;

  // Suggestions: daily ensure we refresh suggestions pool from research topics
  const lastS = getTs(KEY_LAST_SUGGEST);
  if (now() - lastS > SUGGESTION_COOLDOWN_MS) {
    try {
      const topics = await fetchAIResearchTopics();
      // ask Gemini for suggestions using merged topics
      const fresh = await getGeminiSuggestions(topics.join('، '), 6);
      addSuggestions(fresh);
      setTs(KEY_LAST_SUGGEST, now());
    } catch {}
  }

  // Generation: weekly generate up to 2 courses from highest-voted suggestions not yet generated
  const lastG = getTs(KEY_LAST_GENERATE);
  if (now() - lastG > GENERATION_COOLDOWN_MS) {
    try {
      const list = getSuggestions().filter(s => s.status !== 'generated');
      const sorted = list.sort((a,b) => b.votes - a.votes);
      const pick = sorted.slice(0, MAX_GENERATIONS_PER_WINDOW).filter(s => s.votes > 0);
      for (const s of pick) {
        const courses = await generateCourses({ topics: [s.title], countPerTopic: 1 });
        appendCourses(courses);
        markSuggestionGenerated(s.id);
      }
      if (pick.length > 0) setTs(KEY_LAST_GENERATE, now());
    } catch {}
  }
}
