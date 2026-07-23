import { useCallback, useState } from 'react';
import { ButtonLink } from '@/design-system';
import { ChevronRight } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { getPlaneringHomePin } from '../planeringHomePin';
import { getQuickList, toggleQuickListItem } from '../quickListStorage';
import type { QuickList } from '../types';

/** Fäst planeringslista på Hem (localStorage). */
export function PlaneringHomePinCard() {
  const pin = getPlaneringHomePin();
  const [list, setList] = useState<QuickList | null>(() =>
    pin ? getQuickList(pin.listId) : null,
  );

  const reload = useCallback(() => {
    const p = getPlaneringHomePin();
    setList(p ? getQuickList(p.listId) : null);
  }, []);

  if (!pin || !list) return null;

  const open = list.items.filter((i) => !i.done).slice(0, 6);

  return (
    <BentoCard title={pin.title} description="Från Planering" glow="gold" className="rounded-2xl border border-border/30">
      <ul className="planering-quicklist planering-quicklist--compact">
        {open.length === 0 ? (
          <li className="planering-quicklist__empty">Allt bockat — eller tom lista.</li>
        ) : (
          open.map((item) => (
            <li key={item.id} className="planering-quicklist__row">
              <button
                type="button"
                className="planering-quicklist__check min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                aria-label={`Klar: ${item.text}`}
                onClick={() => {
                  setList(toggleQuickListItem(pin.listId, item.id));
                  reload();
                }}
              >
                <span className="planering-quicklist__check-ring" />
              </button>
              <span className="planering-quicklist__text">{item.text}</span>
            </li>
          ))
        )}
      </ul>
      <ButtonLink
        to="/planering?tab=inkop"
        variant="ghost"
        size="sm"
        className="mt-3 flex w-full items-center justify-center gap-1 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        Öppna listan
        <ChevronRight className="h-4 w-4" />
      </ButtonLink>
    </BentoCard>
  );
}
