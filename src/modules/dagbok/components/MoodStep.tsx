import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { MOOD_OPTIONS } from '../constants/moods';
import { MOOD_META } from '../constants/moodMeta';
import type { MoodOption } from '../constants/moods';
import { MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';

type MoodStepProps = {
  mood: string;
  onMoodChange: (mood: string) => void;
  onContinue: () => void;
  lowEnergyBridge?: boolean;
  saving?: boolean;
  onSaveMoodOnly?: () => void;
  showMoodOnlyButton?: boolean;
};

export function MoodStep({
  mood,
  onMoodChange,
  onContinue,
  lowEnergyBridge = false,
  saving = false,
  onSaveMoodOnly,
  showMoodOnlyButton = false,
}: MoodStepProps) {
  const selected = mood && MOOD_OPTIONS.includes(mood as MoodOption) ? MOOD_META[mood as MoodOption] : null;

  return (
    <div className="dagbok-mood-step">
      <p className="dagbok-step-kicker">Steg 1 — Hur känns det?</p>

      <div className="dagbok-mood-grid" role="group" aria-label="Välj humör">
        {MOOD_OPTIONS.map((m) => {
          const meta = MOOD_META[m];
          const Icon = meta.icon;
          const active = mood === m;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={active}
              onClick={() => onMoodChange(m)}
              className={clsx('dagbok-mood-card', `dagbok-mood-card--${meta.tone}`, active && 'dagbok-mood-card--active')}
            >
              <span className="dagbok-mood-card__icon">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="dagbok-mood-card__label">{m}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={clsx('dagbok-mood-panel', `dagbok-mood-panel--${selected.tone}`)}>
          <p className="dagbok-mood-panel__tagline">{selected.tagline}</p>
          <p className="dagbok-mood-panel__prompt">{selected.prompt}</p>

          <div className="dagbok-mood-actions">
            {selected.actions.map((action) => {
              if (action.continueWizard) {
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={onContinue}
                    className="dagbok-mood-action dagbok-mood-action--primary"
                  >
                    <span className="dagbok-mood-action__label">{action.label}</span>
                    <span className="dagbok-mood-action__hint">{action.hint}</span>
                  </button>
                );
              }
              if (action.id === 'mood-only' && onSaveMoodOnly) {
                return (
                  <button
                    key={action.id}
                    type="button"
                    disabled={saving}
                    onClick={onSaveMoodOnly}
                    className="dagbok-mood-action"
                  >
                    <span className="dagbok-mood-action__label">
                      {saving ? 'Sparar…' : action.label}
                    </span>
                    <span className="dagbok-mood-action__hint">{action.hint}</span>
                  </button>
                );
              }
              if (action.path) {
                return (
                  <Link
                    key={action.id}
                    to={{ pathname: action.path, search: action.search ?? '' }}
                    className="dagbok-mood-action"
                  >
                    <span className="dagbok-mood-action__label">{action.label}</span>
                    <span className="dagbok-mood-action__hint">{action.hint}</span>
                  </Link>
                );
              }
              return null;
            })}
          </div>

          {!lowEnergyBridge && (
            <button
              type="button"
              onClick={onContinue}
              className="btn-pill--secondary mt-3 w-full text-sm"
            >
              Full reflektion <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {lowEnergyBridge && mood && onSaveMoodOnly && (
        <button
          type="button"
          disabled={saving}
          onClick={onSaveMoodOnly}
          className="btn-pill--ghost mt-2 w-full text-sm"
        >
          {saving ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            MABRA_BRIDGE_LABELS.saveMoodOnly
          )}
        </button>
      )}

      {showMoodOnlyButton && !selected && onSaveMoodOnly && (
        <button
          type="button"
          disabled={!mood || saving}
          onClick={onSaveMoodOnly}
          className="btn-pill--ghost mt-3 w-full text-sm"
        >
          {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Spara bara humör'}
        </button>
      )}
    </div>
  );
}
