import { clsx } from 'clsx';
import { BookOpen, ChevronDown, Compass, Flame, Inbox, Sparkles, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  COMPASS_WIDGET_CATALOG,
  type CompassWidgetDef,
} from '@/features/dailyLife/wellbeing/compasses/config/compassWidgetCatalog';
import { KompassDiscoveryCardFlow } from '@/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryCardFlow';
import { KompassDiscoveryDeck } from '@/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryDeck';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import type { CompassFlow } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import {
  compassFlowToQuotePhase,
  pickForgeMicroTip,
} from '@/core/copy/compassBannerQuotes';

export type OdForgeSuperMode = 'kompass' | 'inkast' | 'lek';

const MODE_OPTIONS: { id: OdForgeSuperMode; label: string }[] = [
  { id: 'kompass', label: 'Kompass' },
  { id: 'inkast', label: 'Inkast' },
  { id: 'lek', label: 'Lek & lär' },
];

type Props = {
  greeting: string;
  name: string;
  tagline: string;
  profileLabel: string;
  presenceDays?: number;
  stepHint: string;
  ctaLabel: string;
  ctaPressed: boolean;
  userId?: string;
  onCtaPointerDown: () => void;
  onCtaPointerUp: () => void;
  onModeChange?: (mode: OdForgeSuperMode) => void;
  onWidgetSelect?: (widget: CompassWidgetDef) => void;
  onDiscoverySelect?: (categoryId: DiscoveryCategoryId) => void;
  onDiscoveryStatus?: (message: string) => void;
};

function flowLabel(flow: CompassFlow): string {
  if (flow === 'morning') return 'Morgonkompass';
  if (flow === 'day') return 'Dagskompass';
  return 'Kvällskompass';
}

function flowLead(flow: CompassFlow): string {
  if (flow === 'morning') return 'Sätt intention — ett ankare för dagen.';
  if (flow === 'day') return 'Ett litet steg — manuell start, utan prestation.';
  return 'Stäng dagen utan skuld.';
}

function flowMicroTip(flow: CompassFlow, date = new Date()): string {
  return pickForgeMicroTip(compassFlowToQuotePhase(flow), date);
}

export function OdForgeKompassSuperHub({
  greeting,
  name,
  tagline,
  profileLabel,
  presenceDays = 7,
  stepHint,
  ctaLabel,
  ctaPressed,
  userId,
  onCtaPointerDown,
  onCtaPointerUp,
  onModeChange,
  onWidgetSelect,
  onDiscoverySelect,
  onDiscoveryStatus,
}: Props) {
  const [mode, setMode] = useState<OdForgeSuperMode>('kompass');
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DiscoveryCategoryId | null>(null);
  const flow = useMemo(() => getDefaultCompassByTime(), []);
  const quoteDate = useMemo(() => new Date(), []);
  const widgets = COMPASS_WIDGET_CATALOG[flow];

  const setSuperMode = (next: OdForgeSuperMode) => {
    setMode(next);
    onModeChange?.(next);
  };

  const handleCategorySelect = (categoryId: DiscoveryCategoryId) => {
    setActiveCategory(categoryId);
    setDeckOpen(false);
    onDiscoverySelect?.(categoryId);
    onDiscoveryStatus?.(`Kategori: ${categoryId}`);
  };

  const closeDiscovery = () => {
    setActiveCategory(null);
    setDeckOpen(false);
  };

  return (
    <section className="od-forge__superhub" aria-label="Kompass superhub">
      <div className="od-forge__superhub-top">
        <div className="od-forge__superhub-phase">
          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden />
          <span>{flowLabel(flow)}</span>
        </div>
        <div className="od-forge__superhub-top-actions">
          <button
            type="button"
            className={clsx(
              'od-forge__superhub-snabb',
              widgetOpen && 'od-forge__superhub-snabb--open',
            )}
            aria-expanded={widgetOpen}
            aria-label={widgetOpen ? 'Dölj extra snabbstart' : 'Visa extra snabbstart'}
            onClick={() => setWidgetOpen((v) => !v)}
          >
            <Zap className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            Mer
            <ChevronDown
              className={clsx(
                'od-forge__superhub-snabb-chevron',
                widgetOpen && 'od-forge__superhub-snabb-chevron--open',
              )}
              strokeWidth={1.5}
              aria-hidden
            />
          </button>
          <button
            type="button"
            className="od-forge__superhub-dagbok"
            aria-label="Öppna dagbok"
          >
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Dagbok
          </button>
        </div>
      </div>

      <div className="od-forge__superhub-modes" role="tablist" aria-label="Kompassläge">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={mode === opt.id}
            className={clsx(
              'od-forge__superhub-mode',
              mode === opt.id && 'od-forge__superhub-mode--active',
            )}
            onClick={() => setSuperMode(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="od-forge__superhub-body">
        <div className="od-forge__superhub-main">
          {mode === 'kompass' && !activeCategory ? (
            <>
              <h2 className="od-forge__hero-greeting">
                {greeting},{' '}
                <span className="od-forge__hero-name">{name}</span>
                <span aria-hidden> ✦</span>
              </h2>
              <p className="od-forge__hero-tagline">{tagline}</p>
              <p className="od-forge__superhub-flow-lead">{flowLead(flow)}</p>
              <p className="od-forge__hero-step">{stepHint}</p>
              <p className="od-forge__superhub-micro-tip">{flowMicroTip(flow, quoteDate)}</p>
              <div className="od-forge__superhub-inline-quick" aria-label="Snabbstart kompass">
                {widgets.slice(0, 3).map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className="od-forge__superhub-inline-chip"
                    title={w.siloNote}
                    onClick={() => onWidgetSelect?.(w)}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {mode === 'inkast' && !activeCategory ? (
            <div className="od-forge__superhub-inkast">
              <Inbox className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
              <p className="od-forge__superhub-inkast-title">Inkast — direkt här</p>
              <p className="od-forge__superhub-inkast-lead">
                Klistra sms, röst eller anteckning. Granska innan arkiv — inget auto-Valv.
              </p>
              <div className="od-forge__superhub-inkast-field" aria-hidden>
                Skriv eller klistra in…
              </div>
            </div>
          ) : null}

          {mode === 'lek' && !activeCategory ? (
            <div className="od-forge__superhub-lek">
              <p className="od-forge__superhub-lek-title">Snabbstart lek & utbildning</p>
              <div className="od-forge__superhub-lek-grid">
                {widgets.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className="od-forge__superhub-lek-btn"
                    onClick={() => onWidgetSelect?.(w)}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {activeCategory ? (
            <KompassDiscoveryCardFlow
              userId={userId}
              categoryId={activeCategory}
              variant="forge"
              onBack={() => setActiveCategory(null)}
              onDone={closeDiscovery}
              onSaved={(summary) => onDiscoveryStatus?.(`Sparat: ${summary.slice(0, 40)}…`)}
            />
          ) : null}

          {!activeCategory ? (
            <div className="od-forge__hero-meta">
              <span className="od-forge__hero-profile">{profileLabel}</span>
              <span className="od-forge__hero-presence" aria-label={`Närvaro: ${presenceDays} dagar`}>
                <Flame className="h-3 w-3 text-accent" strokeWidth={1.5} aria-hidden />
                <span className="od-forge__hero-presence-value">{presenceDays}</span>
                Närvaro
              </span>
            </div>
          ) : null}

          {mode === 'kompass' && !activeCategory ? (
            <>
              <div
                className="od-forge__superhub-widget-rail"
                aria-label={`Snabbstart ${flowLabel(flow)}`}
              >
                <p className="od-forge__superhub-widget-rail-label">Snabbstart</p>
                <div className="od-forge__superhub-widget-rail-scroll" role="list">
                  {widgets.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      className="od-forge__superhub-widget-chip"
                      role="listitem"
                      title={w.siloNote}
                      onClick={() => onWidgetSelect?.(w)}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="od-forge__cta-wrap">
                <button
                  type="button"
                  className={clsx('od-forge__cta', ctaPressed && 'od-forge__cta--pressed')}
                  onPointerDown={onCtaPointerDown}
                  onPointerUp={onCtaPointerUp}
                  onPointerLeave={onCtaPointerUp}
                  onPointerCancel={onCtaPointerUp}
                >
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  {ctaLabel}
                </button>
              </div>

              <button
                type="button"
                className={clsx(
                  'od-forge__superhub-explore',
                  deckOpen && 'od-forge__superhub-explore--open',
                )}
                aria-expanded={deckOpen}
                onClick={() => setDeckOpen((v) => !v)}
              >
                <Compass className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Utforska
                <ChevronDown
                  className={clsx(
                    'od-forge__superhub-explore-chevron',
                    deckOpen && 'od-forge__superhub-explore-chevron--open',
                  )}
                  strokeWidth={1.5}
                  aria-hidden
                />
              </button>

              {deckOpen ? (
                <KompassDiscoveryDeck variant="forge" onSelect={handleCategorySelect} />
              ) : null}
            </>
          ) : null}
        </div>

        <div
          className={clsx(
            'od-forge__superhub-widget-strip',
            widgetOpen && 'od-forge__superhub-widget-strip--open',
          )}
          aria-label="Extra snabbstart"
          aria-hidden={!widgetOpen}
        >
          <p className="od-forge__superhub-widget-strip-label">Mer · {flowLabel(flow)}</p>
          <div className="od-forge__superhub-widget-strip-scroll" role="list">
            {widgets.map((w) => (
              <button
                key={w.id}
                type="button"
                className="od-forge__superhub-widget-chip"
                role="listitem"
                title={w.siloNote}
                onClick={() => onWidgetSelect?.(w)}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
