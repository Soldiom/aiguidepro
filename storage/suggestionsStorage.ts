import type { CourseSuggestion } from '../types/suggestion';

const KEY = 'aiguidepro.courseSuggestions';

export function getSuggestions(): CourseSuggestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CourseSuggestion[];
  } catch {
    return [];
  }
}

export function saveSuggestions(list: CourseSuggestion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addSuggestions(newOnes: CourseSuggestion[]) {
  const existing = getSuggestions();
  const byId = new Map<string, CourseSuggestion>();
  [...existing, ...newOnes].forEach(s => byId.set(s.id, s));
  const merged = Array.from(byId.values());
  saveSuggestions(merged);
  return merged;
}

export function voteOnSuggestion(id: string, delta: number = 1) {
  const all = getSuggestions();
  const updated = all.map(s => s.id === id ? { ...s, votes: Math.max(0, s.votes + delta) } : s);
  saveSuggestions(updated);
  return updated;
}

export function clearSuggestions() {
  saveSuggestions([]);
}

export function markSuggestionGenerated(id: string) {
  const all = getSuggestions();
  const updated = all.map(s => s.id === id ? { ...s, status: 'generated' as const } : s);
  saveSuggestions(updated);
  return updated;
}
