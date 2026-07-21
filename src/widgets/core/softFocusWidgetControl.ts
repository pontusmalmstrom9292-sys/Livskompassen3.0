/**
 * Soft-focus primary control after Android deep-link open (bible UX).
 */

export type SoftFocusOptions = {
  rootSelector: string;
  focusSelector: string;
  /** Attempts with backoff — DOM may mount late. */
  attempts?: number;
  delayMs?: number;
};

/**
 * Focus + scroll + temporary highlight. Safe no-op if missing.
 */
export function softFocusWidgetControl(opts: SoftFocusOptions): () => void {
  const attempts = Math.max(1, opts.attempts ?? 4);
  const delayMs = Math.max(0, opts.delayMs ?? 420);
  let cancelled = false;
  let timers: number[] = [];

  const tryFocus = (attempt: number) => {
    if (cancelled) return;
    const el = document.querySelector<HTMLElement>(
      `${opts.rootSelector} ${opts.focusSelector}`,
    );
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      el.classList.add('cw-soft-focus');
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
      const clear = window.setTimeout(() => {
        el.classList.remove('cw-soft-focus');
      }, 1600);
      timers.push(clear);
      return;
    }
    if (attempt + 1 < attempts) {
      const t = window.setTimeout(() => tryFocus(attempt + 1), 280);
      timers.push(t);
    }
  };

  const start = window.setTimeout(() => tryFocus(0), delayMs);
  timers.push(start);

  return () => {
    cancelled = true;
    for (const t of timers) window.clearTimeout(t);
    document.querySelectorAll('.cw-soft-focus').forEach((n) => {
      n.classList.remove('cw-soft-focus');
    });
  };
}
