export async function safeUnregisterAllSW() {
  const canUseSW =
    'serviceWorker' in navigator &&
    window.isSecureContext === true &&
    (window.top === window.self);

  if (!canUseSW) return;

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister().catch(() => {})));
  } catch {
    // ignore; SW APIs may be unavailable in some contexts
  }
}

export async function safeRegisterSW(path: string = '/sw.js') {
  const canUseSW =
    'serviceWorker' in navigator &&
    window.isSecureContext === true &&
    (window.top === window.self);

  if (!canUseSW) return;

  try {
    await navigator.serviceWorker.register(path);
  } catch {
    // ignore; never block app on SW failure
  }
}
