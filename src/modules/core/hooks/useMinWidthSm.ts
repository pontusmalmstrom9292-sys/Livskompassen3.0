import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 640px)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return true;
}

/** true från Tailwind `sm` (640px) och uppåt. */
export function useMinWidthSm() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
