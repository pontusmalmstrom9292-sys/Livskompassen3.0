import { useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Check, Settings2, X } from 'lucide-react';
import type { FreeportChameleonTarget } from '../freeportChameleonBridge';
import {
  loadSnabbstartEnabledIds,
  saveSnabbstartEnabledIds,
  SNABBSTART_CATALOG,
  type SnabbstartItemId,
} from '../freeportSnabbstartConfig';

type Props = {
  open: boolean;
  activeId?: SnabbstartItemId;
  onSelect: (id: SnabbstartItemId, morph: FreeportChameleonTarget) => void;
  onClose: () => void;
};

/** Fyren-lik panel — 4×N rutnät, alla genvägar synliga utan sid-scroll. */
export function FreeportSnabbstartPanel({ open, activeId, onSelect, onClose }: Props) {
  const [enabledIds, setEnabledIds] = useState<SnabbstartItemId[]>(() => loadSnabbstartEnabledIds());
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (open) setEnabledIds(loadSnabbstartEnabledIds());
  }, [open]);

  const enabledEntries = SNABBSTART_CATALOG.filter((e) => enabledIds.includes(e.id));

  const toggleId = useCallback((id: SnabbstartItemId) => {
    setEnabledIds((prev) => {
      const has = prev.includes(id);
      if (has && prev.length <= 1) return prev;
      const next = has ? prev.filter((x) => x !== id) : [...prev, id];
      saveSnabbstartEnabledIds(next);
      return next;
    });
  }, []);

  const handlePick = useCallback(
    (id: SnabbstartItemId) => {
      const entry = SNABBSTART_CATALOG.find((e) => e.id === id);
      if (!entry) return;
      onSelect(id, entry.morph);
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <>
      {open ? (
        <button
          type="button"
          className="design-freeport__snabb-backdrop"
          aria-label="Stäng snabbstart"
          onClick={onClose}
        />
      ) : null}
      <div
        className={clsx('design-freeport__snabb-panel', open && 'design-freeport__snabb-panel--open')}
        aria-label="Snabbstart"
        aria-hidden={!open}
      >
        <div className="design-freeport__snabb-panel-head">
          <p className="design-freeport__snabb-panel-title">Snabbstart</p>
          <button
            type="button"
            className={clsx(
              'design-freeport__snabb-panel-settings',
              editing && 'design-freeport__snabb-panel-settings--on',
            )}
            aria-pressed={editing}
            aria-label={editing ? 'Klar med anpassning' : 'Anpassa genvägar'}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? <Check className="h-3.5 w-3.5" /> : <Settings2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            className="design-freeport__snabb-panel-close"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {editing ? (
          <ul className="design-freeport__snabb-edit-list">
            {SNABBSTART_CATALOG.map((entry) => {
              const Icon = entry.icon;
              const on = enabledIds.includes(entry.id);
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={clsx(
                      'design-freeport__snabb-edit-row',
                      on && 'design-freeport__snabb-edit-row--on',
                    )}
                    onClick={() => toggleId(entry.id)}
                  >
                    <span className="design-freeport__snabb-tile-icon" aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="design-freeport__snabb-edit-label">{entry.label}</span>
                    <span className="design-freeport__snabb-edit-check">{on ? '✓' : ''}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="design-freeport__snabb-grid" role="list">
            {enabledEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="listitem"
                  className={clsx(
                    'design-freeport__snabb-tile',
                    activeId === entry.id && 'design-freeport__snabb-tile--on',
                  )}
                  onClick={() => handlePick(entry.id)}
                >
                  <span className="design-freeport__snabb-tile-icon" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="design-freeport__snabb-tile-label">{entry.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
