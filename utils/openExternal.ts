/**
 * Open an external URL in a new tab.
 * - Always opens in a new tab with noopener and noreferrer for safety.
 * - Uses multiple fallback methods to ensure it works.
 */
export function openExternal(url: string, newTab: boolean = true): void {
  try {
    if (typeof window === 'undefined') return;
    
    if (newTab) {
      // Method 1: Try window.open with proper attributes
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Method 2: If blocked, create a hidden link and click it
      if (!win || win.closed || typeof win.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      window.location.assign(url);
    }
  } catch (_err) {
    // Final fallback: create and click a link
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // If all else fails, at least log the error
      console.error('Failed to open external link:', url);
    }
  }
}
