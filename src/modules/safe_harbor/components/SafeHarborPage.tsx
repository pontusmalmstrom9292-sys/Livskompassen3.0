import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TryggHamnHub } from './TryggHamnHub';

export function SafeHarborPage() {
  const location = useLocation();
  const prefilledMessage =
  (location.state as { prefilledMessage?: string } | null)?.prefilledMessage ?? '';

  useEffect(() => {
    return () => {
      /* Zero Footprint: panels wipe on unmount via internal state */
    };
  }, []);

  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <p className="home-page__eyebrow">Trygg hamn</p>
        <h1 className="home-page__title text-xl">Gränser & BIFF</h1>
        <p className="home-page__lead text-xs">Kompassråd och affärsmässiga svar — utan JADE.</p>
      </header>
      <TryggHamnHub initialMessage={prefilledMessage} />
    </div>
  );
}
