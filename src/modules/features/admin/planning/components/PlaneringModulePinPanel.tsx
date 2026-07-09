import { useMemo, useState } from 'react';
import { Button } from '@/design-system';
import { MapPin, PinOff, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import {
  addPlanningModulePin,
  listPlanningModulePins,
  removePlanningModulePin,
  type PlaneringPinContent,
} from '../planningModulePinStorage';
import {
  planeringPinTargetLabel,
  type PlaneringPinLayoutId,
  type PlaneringPinTargetId,
} from '../planningPinRegistry';
import { getPlaneringPinTarget } from '../planningPinRegistry';
import { PlaneringPinDestinationPicker } from './PlaneringPinDestinationPicker';

type Props = {
  title: string;
  content: PlaneringPinContent;
  onPinned?: () => void;
};

/** Välj skärm + modulform och fäst lista eller anteckning. */
export function PlaneringModulePinPanel({ title, content, onPinned }: Props) {
  const [targetId, setTargetId] = useState<PlaneringPinTargetId>('hem.brass.below-grid');
  const [layout, setLayout] = useState<PlaneringPinLayoutId>('tile');
  const [contextKey, setContextKey] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const existing = useMemo(
    () =>
      listPlanningModulePins().filter((p) => {
        if (p.content.kind !== content.kind) return false;
        if (content.kind === 'list' && p.content.kind === 'list') {
          return p.content.listId === content.listId;
        }
        if (content.kind === 'note' && p.content.kind === 'note') {
          return p.content.body === content.body;
        }
        return false;
      }),
    [content, open, message],
  );

  const handlePin = () => {
    const def = getPlaneringPinTarget(targetId);
    if (def?.contextKind === 'child' && !contextKey.trim()) {
      setMessage('Välj barn för Barnfokus.');
      return;
    }
    if (content.kind === 'note' && !content.body.trim()) {
      setMessage('Skriv anteckningen först.');
      return;
    }
    const duplicate = listPlanningModulePins().some(
      (p) =>
        p.targetId === targetId &&
        (p.contextKey ?? '') === (contextKey.trim() || '') &&
        p.content.kind === content.kind &&
        ((content.kind === 'list' &&
          p.content.kind === 'list' &&
          p.content.listId === content.listId) ||
          (content.kind === 'note' && p.content.kind === 'note')),
    );
    if (duplicate) {
      setMessage('Redan fäst på den platsen.');
      return;
    }
    addPlanningModulePin({
      title: title.trim() || 'Min modul',
      targetId,
      contextKey: contextKey.trim() || undefined,
      layout,
      content,
    });
    setMessage(`Fäst på ${planeringPinTargetLabel(targetId, contextKey.trim() || undefined)}.`);
    setOpen(false);
    onPinned?.();
  };

  const handleRemove = (pinId: string) => {
    removePlanningModulePin(pinId);
    setMessage('Borttagen.');
    onPinned?.();
  };

  return (
    <section className="planering-pin-panel rounded-2xl border border-border/30 bg-surface-2/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Fäst modul i appen
          </p>
          <p className="mt-1 text-xs text-text-dim">
            Välj skärm och form — Hem, Barnfokus, Valv, Ekonomi m.fl.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={clsx('shrink-0', open && 'text-accent')}
          onClick={() => setOpen((v) => !v)}
        >
          <Plus className="h-3.5 w-3.5" />
          {open ? 'Stäng' : 'Fäst …'}
        </Button>
      </div>

      {open ? (
        <div className="mt-3 space-y-3 border-t border-border/20 pt-3">
          <PlaneringPinDestinationPicker
            targetId={targetId}
            layout={layout}
            contextKey={contextKey}
            onTargetChange={setTargetId}
            onLayoutChange={setLayout}
            onContextKeyChange={setContextKey}
            compact
          />
          <Button type="button" variant="accent" size="sm" className="w-full" onClick={handlePin}>
            Fäst modul här
          </Button>
        </div>
      ) : null}

      {existing.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {existing.map((pin) => (
            <li
              key={pin.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border/25 bg-surface/60 px-3 py-2 text-xs"
            >
              <span className="text-text-muted">
                {planeringPinTargetLabel(pin.targetId, pin.contextKey)} · {pin.layout}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 px-2 py-1 text-[10px]"
                onClick={() => handleRemove(pin.id)}
              >
                <PinOff className="h-3 w-3" />
                Loss
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {message ? <p className="mt-2 text-center text-xs text-accent">{message}</p> : null}
    </section>
  );
}
