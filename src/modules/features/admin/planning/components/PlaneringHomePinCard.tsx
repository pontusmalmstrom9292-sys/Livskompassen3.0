import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <BentoCard title={pin.title} description="Från Planering">
      <ul className="planering-quicklist planering-quicklist--compact">
        {open.length === 0 ? (
          <li className="planering-quicklist__empty">Allt bockat — eller tom lista.</li>
        ) : (
          open.map((item) => (
            <li key={item.id} className="planering-quicklist__row">
              <button
                type="button"
                className="planering-quicklist__check"
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
      <Link
        to={`/planering?tab=inkop`}
        className="btn-pill--ghost mt-3 flex w-full items-center justify-center gap-1 text-sm"
      >
        Öppna listan
        <ChevronRight className="h-4 w-4" />
      </Link>
    </BentoCard>
  );
}
