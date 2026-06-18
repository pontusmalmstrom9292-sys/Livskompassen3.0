import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, List } from 'lucide-react';
import { clsx } from 'clsx';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ElongatedModule } from '@/core/ui/ElongatedModule';
import { usePlanningModulePins } from '../hooks/usePlanningModulePins';
import type { PlaneringModulePin } from '../planningModulePinStorage';
import type { PlaneringPinTargetId } from '../planningPinRegistry';
import {
  getQuickList,
  openItems,
  toggleQuickListItem,
} from '../quickListStorage';

type Props = {
  targetId: PlaneringPinTargetId;
  contextKey?: string;
  className?: string;
};

function PinListBody({
  pin,
  compact,
}: {
  pin: PlaneringModulePin;
  compact?: boolean;
}) {
  const [tick, setTick] = useState(0);
  if (pin.content.kind !== 'list') return null;
  const list = getQuickList(pin.content.listId);
  const open = openItems(list).slice(0, compact ? 4 : 8);

  return (
    <ul className={clsx('planering-quicklist', compact && 'planering-quicklist--compact')}>
      {open.length === 0 ? (
        <li className="planering-quicklist__empty">Tom lista — öppna Planering.</li>
      ) : (
        open.map((item) => (
          <li key={`${item.id}-${tick}`} className="planering-quicklist__row">
            <button
              type="button"
              className="planering-quicklist__check"
              aria-label={`Klar: ${item.text}`}
              onClick={() => {
                if (pin.content.kind !== 'list') return;
                toggleQuickListItem(pin.content.listId, item.id);
                setTick((t) => t + 1);
              }}
            >
              <span className="planering-quicklist__check-ring" />
            </button>
            <span className="planering-quicklist__text">{item.text}</span>
          </li>
        ))
      )}
    </ul>
  );
}

function PinNoteBody({ pin }: { pin: PlaneringModulePin }) {
  if (pin.content.kind !== 'note') return null;
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">{pin.content.body}</p>
  );
}

function SinglePinnedModule({ pin }: { pin: PlaneringModulePin }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = pin.content.kind === 'list' ? List : FileText;
  const editLink = '/planering?tab=inkop';

  if (pin.layout === 'elongated') {
    return (
      <ElongatedModule
        title={pin.title}
        lead={pin.content.kind === 'list' ? 'Lista från Planering' : 'Anteckning'}
        icon={Icon}
        tone="gold"
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      >
        {pin.content.kind === 'list' ? <PinListBody pin={pin} /> : <PinNoteBody pin={pin} />}
        <Link to={editLink} className="btn-pill--ghost mt-2 inline-flex text-xs">
          Redigera i Planering
        </Link>
      </ElongatedModule>
    );
  }

  if (pin.layout === 'compact') {
    return (
      <div className="pinned-planering-module pinned-planering-module--compact rounded-xl border border-border/30 bg-surface-2/60 px-3 py-2">
        <p className="text-[10px] uppercase tracking-wider text-accent">{pin.title}</p>
        {pin.content.kind === 'list' ? <PinListBody pin={pin} compact /> : <PinNoteBody pin={pin} />}
      </div>
    );
  }

  const cardClass =
    pin.layout === 'tile'
      ? 'pinned-planering-module--tile'
      : 'pinned-planering-module--card';

  return (
    <BentoCard
      title={pin.title}
      description="Från Planering"
      glow="gold"
      className={clsx('pinned-planering-module rounded-2xl border border-border/30', cardClass)}
    >
      {pin.content.kind === 'list' ? <PinListBody pin={pin} /> : <PinNoteBody pin={pin} />}
      <Link
        to={editLink}
        className="btn-pill--ghost mt-3 flex w-full items-center justify-center gap-1 text-sm"
      >
        Öppna i Planering
        <ChevronRight className="h-4 w-4" />
      </Link>
    </BentoCard>
  );
}

/** Renderar alla fästa moduler för en skärmplats. */
export function PinnedPlaneringModuleSlot({ targetId, contextKey, className }: Props) {
  const pins = usePlanningModulePins({ targetId, contextKey });
  if (pins.length === 0) return null;

  return (
    <div className={clsx('pinned-planering-slot space-y-3', className)} aria-label="Fästa moduler">
      {pins.map((pin) => (
        <SinglePinnedModule key={pin.id} pin={pin} />
      ))}
    </div>
  );
}
