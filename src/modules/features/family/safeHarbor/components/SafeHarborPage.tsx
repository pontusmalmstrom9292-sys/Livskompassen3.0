import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TryggHamnHub } from './TryggHamnHub';

type Props = {
  /** Inbäddad i Familjehubben — utan egen sidrubrik. */
  embedded?: boolean;
};

export function SafeHarborPage({ embedded = false }: Props) {
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
      {!embedded && (
        <header className="px-0.5">
          <p className="home-page__eyebrow">Trygg hamn</p>
          <h1 className="home-page__title text-xl">Gränser & BIFF</h1>
          <p className="home-page__lead text-xs">
            Klistra in meddelandet — få ett kort Grey Rock-svar. Inget skickas automatiskt.
          </p>
        </header>
      )}
      <TryggHamnHub initialMessage={prefilledMessage} embedded={embedded} />
    </div>
  );
}
