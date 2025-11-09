function normalize(e: unknown) {
  if (e instanceof Error) return `${e.name}: ${e.message}\n${e.stack ?? ''}`;
  if (typeof e === 'object' && e && 'reason' in (e as any)) {
    const r = (e as any).reason;
    return r instanceof Error ? `${r.name}: ${r.message}\n${r.stack ?? ''}` : String(r);
  }
  return String(e);
}

export function installGlobalDiagnostics() {
  window.addEventListener('error', (ev) => {
    console.error('[GlobalError]', normalize(ev.error ?? ev.message));
  });
  window.addEventListener('unhandledrejection', (ev) => {
    console.error('[UnhandledRejection]', normalize(ev));
  });
}
