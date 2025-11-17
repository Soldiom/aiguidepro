type BackgroundTask = () => Promise<void> | void;

interface ScheduleOptions {
  timeout?: number;
}

type CancelFn = () => void;

/**
 * Schedule a set of background tasks when the browser is idle (or after a short timeout fallback).
 * Returns a cancel function to abort pending execution.
 */
export function scheduleBackgroundTasks(tasks: BackgroundTask[], options?: ScheduleOptions): CancelFn | undefined {
  if (typeof window === 'undefined') return undefined;
  const safeTasks = Array.isArray(tasks) ? tasks.filter(Boolean) : [];
  if (!safeTasks.length) return undefined;

  let cancelled = false;
  const execTasks = async () => {
    for (const task of safeTasks) {
      if (cancelled) return;
      try {
        await task();
      } catch (error) {
        console.error('[automation] background task failed', error);
      }
    }
  };

  const timeout = options?.timeout ?? 4000;
  const requestIdle = (window as any).requestIdleCallback as
    | ((cb: (deadline: IdleDeadline) => void, opts?: IdleRequestOptions) => number)
    | undefined;
  const cancelIdle = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;

  if (typeof requestIdle === 'function') {
    const handle = requestIdle(() => {
      if (!cancelled) {
        execTasks();
      }
    }, { timeout });
    return () => {
      cancelled = true;
      if (typeof cancelIdle === 'function') {
        cancelIdle(handle);
      }
    };
  }

  const timer = window.setTimeout(() => {
    if (!cancelled) {
      execTasks();
    }
  }, timeout);

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}

interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining(): number;
}

interface IdleRequestOptions {
  timeout?: number;
}
