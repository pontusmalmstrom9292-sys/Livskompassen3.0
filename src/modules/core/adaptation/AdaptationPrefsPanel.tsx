import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useAdaptationStore } from '../store/useAdaptationStore';
import { mergeAdaptationPrefs } from '../firebase/adaptationLedgerFirestore';
import type { CoachTone, UiDensity } from '../types/adaptation';
import { Button } from '@/design-system';

const COACH_TONE_OPTIONS: { id: CoachTone; label: string; hint: string }[] = [
  { id: 'minimal', label: 'Minimal', hint: 'Kortast möjliga svar' },
  { id: 'standard', label: 'Standard', hint: 'Balanserad ton' },
  { id: 'detailed', label: 'Utförlig', hint: 'Mer kontext när du orkar' },
];

const UI_DENSITY_OPTIONS: { id: UiDensity; label: string; hint: string }[] = [
  { id: 'paralys', label: 'Paralys', hint: 'Ett steg i taget — förenklat Hem' },
  { id: 'normal', label: 'Normal', hint: 'Vanlig vy' },
  { id: 'full', label: 'Full', hint: 'Alla verktyg synliga' },
];

const PARALYS_TIP_ID = 'paralys_mode_tip_v1';

type Props = {
  userId: string;
};

export function AdaptationPrefsPanel({ userId }: Props) {
  const prefs = useAdaptationStore((s) => s.prefs);
  const layerEnabled = useAdaptationStore((s) => s.layerEnabled);
  const semanticSummary = useAdaptationStore((s) => s.semanticSummary);
  const semanticEnabled = useAdaptationStore((s) => s.semanticEnabled);
  const error = useAdaptationStore((s) => s.error);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  if (!layerEnabled) return null;

  const coachTone = prefs?.coachTone ?? 'standard';
  const uiDensity = prefs?.uiDensity ?? 'normal';
  const dismissedHints = prefs?.dismissedHints ?? [];
  const showParalysTip = !dismissedHints.includes(PARALYS_TIP_ID);

  const persist = async (
    patch: Parameters<typeof mergeAdaptationPrefs>[1],
  ): Promise<void> => {
    setSaving(true);
    setSavedFlash(false);
    try {
      await mergeAdaptationPrefs(userId, patch);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const dismissParalysTip = () => {
    if (dismissedHints.includes(PARALYS_TIP_ID)) return;
    void persist({ dismissedHints: [...dismissedHints, PARALYS_TIP_ID] });
  };

  return (
    <BentoCard title="Adaptiv profil" icon={<Sparkles className="h-4 w-4" />} glow="gold">
      <p className="text-sm text-text-muted">
        Appen anpassar ton och täthet efter dina val. Signaler sparas tyst — inget delas mellan silos.
      </p>

      {error ? (
        <p className="mt-2 text-xs text-rose-300/90" role="status">
          {error}
        </p>
      ) : null}

      <fieldset className="mt-4 space-y-2 border-0 p-0">
        <legend className="text-xs font-medium uppercase tracking-wider text-text-dim">
          Coach-ton
        </legend>
        {COACH_TONE_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/40 bg-surface/30 px-3 py-2 hover:border-accent/30"
          >
            <input
              type="radio"
              name="adaptation-coach-tone"
              className="mt-1 accent-accent"
              checked={coachTone === opt.id}
              disabled={saving}
              onChange={() => void persist({ coachTone: opt.id })}
            />
            <span className="text-sm leading-relaxed text-text-muted">
              <span className="block font-medium text-text">{opt.label}</span>
              {opt.hint}
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="mt-4 space-y-2 border-0 p-0">
        <legend className="text-xs font-medium uppercase tracking-wider text-text-dim">
          UI-täthet
        </legend>
        {UI_DENSITY_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/40 bg-surface/30 px-3 py-2 hover:border-accent/30"
          >
            <input
              type="radio"
              name="adaptation-ui-density"
              className="mt-1 accent-accent"
              checked={uiDensity === opt.id}
              disabled={saving}
              onChange={() => void persist({ uiDensity: opt.id })}
            />
            <span className="text-sm leading-relaxed text-text-muted">
              <span className="block font-medium text-text">{opt.label}</span>
              {opt.hint}
            </span>
          </label>
        ))}
      </fieldset>

      {semanticEnabled && semanticSummary ? (
        <div className="mt-4 rounded-xl border border-border/40 bg-surface/20 px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-dim">
            Coach-kontext (read-only)
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{semanticSummary}</p>
        </div>
      ) : null}

      {showParalysTip ? (
        <div className="mt-4 rounded-xl border border-accent/20 bg-surface-2/60 px-3 py-3">
          <p className="text-xs text-text-muted">
            <strong className="text-text">Paralys-läge</strong> förenklar Hem till ett mikrosteg i taget
            — bra när kapaciteten är låg.
          </p>
          <Button type="button" variant="ghost" className="--ghost mt-2 text-xs" disabled={saving} onClick={dismissParalysTip}>
            Dölj tipset
          </Button>
        </div>
      ) : null}

      {savedFlash ? (
        <p className="mt-3 text-xs text-emerald-400/90" role="status">
          Sparat
        </p>
      ) : null}
    </BentoCard>
  );
}
