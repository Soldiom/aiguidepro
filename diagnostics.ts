// Sentry integration (optional, replace DSN)
// import * as Sentry from '@sentry/browser';
// Sentry.init({
//   dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // ضع DSN الحقيقي هنا
//   tracesSampleRate: 0.1,
//   environment: process.env.NODE_ENV,
// });
function normalize(e: unknown) {
  if (e instanceof Error) return `${e.name}: ${e.message}\n${e.stack ?? ''}`;
  if (typeof e === 'object' && e && 'reason' in (e as any)) {
    const r = (e as any).reason;
    return r instanceof Error ? `${r.name}: ${r.message}\n${r.stack ?? ''}` : String(r);
  }
  return String(e);
}

export function installGlobalDiagnostics() {
  const renderToOverlay = (message: string) => {
    try {
      const id = '__diagnostics-overlay';
      const existing = document.getElementById(id);
      const formatted = `[${new Date().toISOString()}]\n${message}`;
      if (existing) {
        existing.textContent = `${formatted}\n\n${existing.textContent ?? ''}`;
        return;
      }

      const container = document.createElement('pre');
      container.id = id;
      container.style.position = 'fixed';
      container.style.bottom = '1rem';
      container.style.left = '1rem';
      container.style.maxWidth = '90vw';
      container.style.maxHeight = '40vh';
      container.style.overflow = 'auto';
      container.style.zIndex = '9999';
      container.style.padding = '1rem';
      container.style.borderRadius = '0.5rem';
      container.style.background = 'rgba(15,23,42,0.95)';
      container.style.color = '#fca5a5';
      container.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      container.style.fontSize = '0.75rem';
      container.style.border = '1px solid rgba(248,113,113,0.5)';
      container.textContent = formatted;
      document.body.appendChild(container);
    } catch {
      /* ignore overlay errors */
    }
  };

  window.addEventListener('error', (ev) => {
    const message = normalize(ev.error ?? ev.message);
    console.error('[GlobalError]', message);
    renderToOverlay(`[GlobalError] ${message}`);
  });
  window.addEventListener('unhandledrejection', (ev) => {
    const message = normalize(ev);
    console.error('[UnhandledRejection]', message);
    renderToOverlay(`[UnhandledRejection] ${message}`);
  });
}
