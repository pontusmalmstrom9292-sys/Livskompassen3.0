import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/design-system';
import { getMabraProgress, saveMabraProgress } from '@/core/firebase/firestore';
import {
  ACT_VALUES,
  MAX_CORE_VALUES,
  MIN_CORE_VALUES,
  normalizeCoreValues,
  VALUES_COMPASS_COPY,
} from '../constants';

type Props = {
  userId: string;
  onDone: () => void;
  onExit: () => void;
};

export function ValuesCompass({ userId, onDone, onExit }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMabraProgress(userId)
      .then((progress) => {
        if (cancelled) return;
        if (progress?.coreValues.length) {
          setSelected(normalizeCoreValues(progress.coreValues));
        }
      })
      .catch(() => {
        if (!cancelled) setError('Kunde inte hämta sparade värden.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback((valueId: string) => {
    setSelected((current) => {
      if (current.includes(valueId)) {
        return current.filter((id) => id !== valueId);
      }
      if (current.length >= MAX_CORE_VALUES) return current;
      return [...current, valueId];
    });
  }, []);

  const selectedCount = selected.length;
  const canSave =
    selectedCount >= MIN_CORE_VALUES && selectedCount <= MAX_CORE_VALUES && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await saveMabraProgress(userId, selected);
      onDone();
    } catch {
      setError('Kunde inte spara värderingarna.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-6 text-center text-sm text-text-muted">Laddar…</p>;
  }

  return (
    <div className="flex flex-col space-y-6 py-4">
      <div className="w-full max-w-sm rounded-xl border border-border-strong bg-surface/40 px-5 py-6">
        <p className="text-base text-accent">{VALUES_COMPASS_COPY.title}</p>
        <p className="mt-2 text-sm text-text-muted">{VALUES_COMPASS_COPY.detail}</p>
      </div>

      <label className="block text-xs text-text-muted">
        Lägg till värdering
        <select
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          value=""
          disabled={selectedCount >= MAX_CORE_VALUES}
          onChange={(e) => {
            const id = e.target.value;
            if (id) toggle(id);
          }}
          aria-label="Lägg till kärnvärde"
        >
          <option value="">
            {selectedCount >= MAX_CORE_VALUES ? 'Max antal valda' : 'Välj värdering…'}
          </option>
          {ACT_VALUES.filter((v) => !selected.includes(v.id)).map((value) => (
            <option key={value.id} value={value.id}>
              {value.label}
            </option>
          ))}
        </select>
      </label>

      {selectedCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((id) => {
            const value = ACT_VALUES.find((v) => v.id === id);
            if (!value) return null;
            return (
              <button
                key={id}
                type="button"
                className="chip--active text-xs"
                onClick={() => toggle(id)}
              >
                {value.label} ×
              </button>
            );
          })}
        </div>
      )}

      <div className="w-full max-w-sm space-y-2">
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: MAX_CORE_VALUES }, (_, i) => (
            <div
              key={i}
              className={clsx(
                'h-1.5 flex-1 rounded-full transition-colors',
                i < selectedCount ? 'bg-accent/70' : 'bg-surface/80',
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm tabular-nums text-text-muted">
          {selectedCount} av {MIN_CORE_VALUES}–{MAX_CORE_VALUES} valda
        </p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex w-full max-w-sm flex-col gap-2">
        <Button variant="secondary" disabled={!canSave} onClick={handleSave}>
          {saving ? 'Sparar…' : VALUES_COMPASS_COPY.saveLabel}
        </Button>
        <Button variant="ghost" className="text-sm" onClick={onExit}>
          Avsluta nu
        </Button>
      </div>
    </div>
  );
}
