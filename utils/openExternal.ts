/**
 * Open an external URL reliably in environments that may block window.open.
 * - Tries to open in a new tab with noopener for safety.
 * - If blocked or unsupported, falls back to same-tab navigation.
 */
export function openExternal(url: string, newTab: boolean = true): void {
  try {
    if (typeof window === 'undefined') return;
    const target = newTab ? '_blank' : '_self';
    const features = newTab ? 'noopener' : undefined;
    const win = window.open(url, target, features);

    // If the popup was blocked or failed, fall back to same-tab navigation
    if (!win || win.closed) {
      window.location.assign(url);
    }
  } catch (_err) {
    try {
      window.location.assign(url);
    } catch {
      // no-op: nothing else we can do
    }
  }
}
