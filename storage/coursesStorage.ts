import type { Course } from "../types/course";

const KEY = "aiguidepro.courses";

export function getStoredCourses(): Course[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Course[];
  } catch {
    return [];
  }
}

export function saveCourses(courses: Course[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(courses));
}

export function appendCourses(newOnes: Course[]) {
  const existing = getStoredCourses();
  // de-duplicate by id
  const byId = new Map<number, Course>();
  [...existing, ...newOnes].forEach((c) => byId.set(c.id, c));
  const merged = Array.from(byId.values());
  saveCourses(merged);
  return merged;
}
