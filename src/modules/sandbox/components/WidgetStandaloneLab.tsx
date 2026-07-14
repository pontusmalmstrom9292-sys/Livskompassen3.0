import { useState } from 'react';
import {
  EyeOff,
  Mic,
  PenLine,
  Sparkles,
  Clock,
  LayoutGrid,
} from 'lucide-react';

type VariantId = 'shell' | 'capture' | 'actions';

const VARIANTS: { id: VariantId; label: string }[] = [
  { id: 'shell', label: 'Shell' },
  { id: 'capture', label: 'Capture' },
  { id: 'actions', label: 'Åtgärder' },
];

const ACTION_TILES = [
  { id: 'record', label: 'Inspelning', icon: Mic },
  { id: 'note', label: 'Anteckning', icon: PenLine },
  { id: 'stamp', label: 'Stämpel', icon: Clock },
  { id: 'grid', label: 'Åtgärder', icon: LayoutGrid },
] as const;

type Props = {
  onStatus?: (msg: string) => void;
};

/**
 * Widget Standalone Lab — prototyp för fristående hemskärms-widgets.
 * Sandbox only. Tokens dokumenteras i docs/design/widget/STANDALONE-WIDGET-SKIN.md
 */
export function WidgetStandaloneLab({ onStatus }: Props) {
  const [variant, setVariant] = useState<VariantId>('shell');
  const [activeTile, setActiveTile] = useState<string | null>(null);

  return (
    <div className="design-freeport__widget-standalone-lab" data-widget-variant={variant}>
      <p className="design-freeport__premium-gallery-banner">
        <strong>Widget Standalone</strong> — fristående skal utan app-nav. Prod orörd.
        Tokens → <code>widget-tokens.css</code> i våg 2.
      </p>

      <div className="design-freeport__widget-variant-row" role="tablist" aria-label="Widget-varianter">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={variant === v.id}
            className={[
              'design-freeport__mode-btn',
              variant === v.id ? 'design-freeport__mode-btn--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setVariant(v.id);
              onStatus?.(`Widget lab: ${v.label}`);
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="design-freeport__widget-phone">
        <header className="design-freeport__widget-shell-header">
          <div className="design-freeport__widget-shell-top">
            <span className="design-freeport__widget-shell-badge">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Widget
            </span>
            <button
              type="button"
              className="design-freeport__widget-panic-btn"
              aria-label="Dölj nu"
              onClick={() => onStatus?.('Panik: dölj + rensa (mock)')}
            >
              <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Dölj nu
            </button>
          </div>
          <h2 className="design-freeport__widget-shell-title">
            {variant === 'shell' ? 'Fristående skal' : variant === 'capture' ? 'Snabbanteckning' : 'Åtgärder'}
          </h2>
          <p className="design-freeport__widget-shell-lead">
            Ingen länk till huvudappen — bara widget-uppgiften.
          </p>
        </header>

        <main className="design-freeport__widget-shell-surface">
          {variant === 'shell' ? (
            <div className="design-freeport__widget-demo-copy">
              <p className="text-sm text-[var(--fp-text-muted)]">
                Premium glas, navy djup, guld accent. Knappar min 44px touch.
              </p>
              <div className="design-freeport__widget-btn-row">
                <button type="button" className="design-freeport__widget-btn design-freeport__widget-btn--accent">
                  Primär
                </button>
                <button type="button" className="design-freeport__widget-btn design-freeport__widget-btn--ghost">
                  Sekundär
                </button>
              </div>
            </div>
          ) : null}

          {variant === 'capture' ? (
            <div className="space-y-3">
              <div className="design-freeport__widget-chip-row">
                {['Inkast', 'Dagbok', 'Bevis'].map((chip) => (
                  <button key={chip} type="button" className="design-freeport__widget-chip">
                    {chip}
                  </button>
                ))}
              </div>
              <textarea
                className="design-freeport__widget-textarea"
                rows={3}
                placeholder="Fakta, observation eller tanke…"
                readOnly
              />
              <button type="button" className="design-freeport__widget-btn design-freeport__widget-btn--accent w-full">
                Spara till Inkast
              </button>
            </div>
          ) : null}

          {variant === 'actions' ? (
            <div className="design-freeport__exec-snabb-grid">
              {ACTION_TILES.map((tile) => {
                const Icon = tile.icon;
                const on = activeTile === tile.id;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    className={[
                      'design-freeport__widget-action-tile',
                      on ? 'design-freeport__widget-action-tile--on' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      setActiveTile(tile.id);
                      onStatus?.(`Tile: ${tile.label}`);
                    }}
                  >
                    <span className="design-freeport__widget-action-tile-icon" aria-hidden>
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <span>{tile.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </main>
      </div>

      <p className="design-freeport__sandbox-note mt-4">
        Jämför mot{' '}
        <code>theme-lab-w1-widget.css</code> och galleri{' '}
        <code>widget/v2/W1-kompakt-projekt.png</code>.
      </p>
    </div>
  );
}
