export const ADMIN_KEY = 'aiguidepro.isAdmin';

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ADMIN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdmin(flag: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_KEY, flag ? 'true' : 'false');
    // notify listeners in same tab
    try { window.dispatchEvent(new CustomEvent('aiguidepro-admin-change')); } catch {}
  } catch {}
}
