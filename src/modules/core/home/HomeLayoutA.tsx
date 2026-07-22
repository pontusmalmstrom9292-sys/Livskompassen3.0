import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Inbox, Mic, PenLine, Sun, Moon, Clock, Sparkles, Edit2, ChevronRight, Star } from 'lucide-react';
import { ExecutiveJournalHistoryRail } from './executive/ExecutiveJournalHistoryRail';
import { ExecutiveReflektionHero } from './executive/ExecutiveReflektionHero';
import { ExecutiveFocusCard } from './executive/cards/ExecutiveFocusCard';
import { ExecutiveLivsloggCard } from './executive/cards/ExecutiveLivsloggCard';
import { ExecutiveHomeStagger, ExecutiveHomeStaggerItem } from './executive/ExecutiveHomeStagger';
import { clsx } from 'clsx';
import { Button } from '@/design-system';
import { saveCheckIn, getRecentCheckIns } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { CalmCollapsible } from '../ui/CalmCollapsible';
import { HomeGreeting } from './HomeGreeting';
import { HomeBrassDaySteps } from './HomeBrassDaySteps';
import { HomeStreakChip } from './HomeStreakChip';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
import { UserWidgetHomeSlot } from './UserWidgetHomeSlot';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';
import { getHomeCompassPhase, phaseLead } from './homeCompassPhase';
import { useLifeHubPreset } from '../lifeOs';
import { getCompassAdvice } from '@/features/dailyLife/wellbeing/compasses/utils/compassAdvice';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';

type Props = {
  onCheckInSaved?: () => void;
  /** brass = Brushed Brass tema; calm = Obsidian Calm; executive = Midnight Executive mockup. */
  variant?: 'brass' | 'calm' | 'executive';
  presetLabel?: string;
  /** Executive: greeting renderas i HomeHeroKanon scenic stack. */
  hideIntro?: boolean;
};

const QUICK_CAPTURE = [
  { id: 'note', label: 'Anteckning', icon: PenLine, to: HOME_SUPERHUB_ROUTES.hjartatReflektion },
  { id: 'voice', label: 'Inspelning', icon: Mic, to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror },
  { id: 'inbox', label: 'Inkast', icon: Inbox, to: HOME_SUPERHUB_ROUTES.planeringInkast },
] as const;

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('sv-SE', { weekday: 'long' });
}

function surfaceClass(variant: 'brass' | 'calm' | 'executive', extra?: string) {
  if (variant === 'brass') {
    return clsx('brass-glass', extra);
  }
  if (variant === 'executive') {
    return clsx('calm-card-midnight', extra);
  }
  return clsx('calm-card-midnight', extra);
}

function getRitualMeta(now: Date) {
  const hour = now.getHours();
  if (hour >= 5 && hour < 11) {
    return { name: 'Morgon', time: '05:00-11:00', icon: 'Sun' };
  } else if (hour >= 11 && hour < 17) {
    return { name: 'Dagen', time: '11:00-17:00', icon: 'Clock' };
  } else if (hour >= 17 && hour < 22) {
    return { name: 'Afton', time: '17:00-22:00', icon: 'Moon' };
  } else {
    return { name: 'Natt', time: '22:00-05:00', icon: 'Sparkles' };
  }
}

/** Hem layout A — ankare + asymmetriskt rutnät (HEM-LAYOUT-A-KANON). Wave A2 polish. */
export function HomeLayoutA({ onCheckInSaved, variant = 'calm', presetLabel, hideIntro = false }: Props) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const { preset } = useLifeHubPreset();
  const now = useMemo(() => new Date(), []);
  const phase = getHomeCompassPhase(now);

  const [anchor, setAnchor] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [presenceVal, setPresenceVal] = useState('7/10');
  const [presenceLabel, setPresenceLabel] = useState('Stabil');

  // Load history on mount
  useEffect(() => {
    if (!user) return;
    let active = true;

    getRecentCheckIns(user.uid, 20)
      .then((history) => {
        if (!active) return;
        
        // 1. Dagens ankare
        const targetId =
          variant === 'brass'
            ? 'home_brass_anchor'
            : variant === 'executive'
              ? 'home_executive_anchor'
              : 'home_layout_a_anchor';
        const foundAnchor = history.find((c) => c.questionId === targetId);
        if (foundAnchor && foundAnchor.taskNote) {
          setAnchor(foundAnchor.taskNote);
          setIsEditing(false);
        }

        // 2. Närvaro (MåBra checkin)
        const foundMabra = history.find((c) => c.questionId === 'mabra_checkin');
        if (foundMabra && foundMabra.energy !== undefined) {
          setPresenceVal(`${foundMabra.energy}/10`);
          if (foundMabra.energy >= 7) setPresenceLabel('Stabil');
          else if (foundMabra.energy >= 4) setPresenceLabel('Balanserad');
          else setPresenceLabel('Utsatt');
        }
      })
      .catch((err) => console.error('Failed to load checkins', err));

    return () => {
      active = false;
    };
  }, [user, variant]);

  const handleAnchorSave = async () => {
    const text = anchor.trim();
    if (!user) {
      navigate(HOME_SUPERHUB_ROUTES.hjartatReflektion);
      return;
    }
    if (text.length < 2) {
      setError('Skriv minst ett par ord.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveCheckIn(user.uid, {
        questionId:
          variant === 'brass'
            ? 'home_brass_anchor'
            : variant === 'executive'
              ? 'home_executive_anchor'
              : 'home_layout_a_anchor',
        questionText: 'Dagens ankare',
        optionSelected: 'intention',
        taskCategory: 'morning',
        taskNote: text,
      });
      setIsEditing(false);
      onCheckInSaved?.();
    } catch {
      setError('Kunde inte spara. Kontrollera nätverk.');
    } finally {
      setSaving(false);
    }
  };

  const ritual = useMemo(() => getRitualMeta(now), [now]);
  const RitualIcon = {
    Sun: Sun,
    Moon: Moon,
    Clock: Clock,
    Sparkles: Sparkles
  }[ritual.icon];

  const compassAdvice = useMemo(() => {
    try {
      const flow = getDefaultCompassByTime();
      return getCompassAdvice(flow, now);
    } catch {
      return 'Ett mikrosteg i taget.';
    }
  }, [now]);

  const rootClass = clsx(
    'home-layout-a mx-auto w-full max-w-2xl space-y-4 pb-4',
    variant === 'brass' && 'home-brass-a',
    variant === 'calm' && 'home-layout-a--calm',
    variant === 'executive' && 'home-layout-a--executive executive-home-dashboard calm-scroll-island',
  );

  const insetClass =
    variant === 'brass'
      ? 'home-layout-a__hero-inset brass-inset neu-inset w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-text'
      : 'home-layout-a__hero-inset w-full resize-none rounded-xl border border-border/20 bg-surface-3 px-3 py-2 text-sm text-text';

  const heroSurface = clsx(
    'home-layout-a__hero-card',
    variant === 'brass' ? surfaceClass(variant, 'brass-glass--hero') : 'calm-card',
    variant === 'executive' && 'home-layout-a__hero-card--executive',
  );

  const cardClass = variant === 'brass' ? 'brass-glass' : 'calm-card';

  const anchorSection = (
    <section
      className={clsx('home-layout-a__hero relative p-4', heroSurface)}
      aria-label="Dagens ankare"
    >
      <div className="relative z-[1] mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Anchor className="h-4 w-4 text-accent" strokeWidth={1.5} aria-hidden />
          <p
            className={clsx(
              'mb-0 text-[9px] font-bold uppercase tracking-[0.2em] text-accent',
              variant === 'executive' && 'home-layout-a__section-label',
            )}
          >
            Dagens ankare
          </p>
        </div>
        {!isEditing && anchor.trim() ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 motion-reduce:transition-none"
              aria-label="Redigera dagens ankare"
            >
              <Edit2 className="h-3.5 w-3.5" aria-hidden />
            </button>
            <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
          </div>
        ) : (
          <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
        )}
      </div>

      <div className="relative z-[1] space-y-1">
        <h2
          className={clsx(
            'text-lg font-bold leading-snug text-text',
            variant === 'executive' ? 'font-display-serif tracking-wide text-accent-light' : 'font-display-serif',
          )}
        >
          Vad är viktigast idag?
        </h2>
        <p className="text-xs text-text-muted">Inte hela dagen — bara det viktigaste nu.</p>
      </div>

      {isEditing ? (
        <div className="relative z-[1] mt-4 space-y-3">
          <label htmlFor="home-layout-a-anchor" className="text-[10px] font-medium text-text-muted">
            Dagens ankare
          </label>
          <textarea
            id="home-layout-a-anchor"
            className={clsx(
              insetClass,
              'font-sans text-sm transition-colors focus:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/20 motion-reduce:transition-none',
            )}
            rows={3}
            placeholder="T.ex. lugnt samtal med barnen efter skolan …"
            value={anchor}
            onChange={(e) => {
              setAnchor(e.target.value);
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="text-[10px] font-semibold uppercase tracking-wider"
              disabled={saving}
              onClick={() => void handleAnchorSave()}
            >
              {saving ? 'Sparar …' : 'Spara ankare'}
            </Button>
            {anchor.trim() ? (
              <Button
                variant="ghost"
                className="text-[10px] font-semibold uppercase tracking-wider"
                onClick={() => setIsEditing(false)}
              >
                Avbryt
              </Button>
            ) : null}
            {error ? <p className="text-xs text-danger">{error}</p> : null}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="relative z-[1] mt-4 min-h-11 w-full animate-fade-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
          onClick={() => setIsEditing(true)}
        >
          <p
            className={clsx(
              'text-base font-semibold leading-snug text-text hover:text-accent-light',
              variant === 'executive' && 'font-display-serif tracking-wide text-accent-light',
            )}
          >
            {anchor.trim() || 'Ett mikrosteg räcker.'}
          </p>
        </button>
      )}
    </section>
  );

  return (
    <div className={rootClass}>
      {variant === 'executive' ? (
        <ExecutiveHomeStagger className="space-y-4">
          <ExecutiveHomeStaggerItem>
            <ExecutiveReflektionHero />
          </ExecutiveHomeStaggerItem>
          <ExecutiveHomeStaggerItem>
            <div className="executive-home-grid">
              <ExecutiveFocusCard />
              <ExecutiveLivsloggCard />
            </div>
          </ExecutiveHomeStaggerItem>
          <ExecutiveHomeStaggerItem>{anchorSection}</ExecutiveHomeStaggerItem>
          <ExecutiveHomeStaggerItem>
            <ExecutiveJournalHistoryRail />
          </ExecutiveHomeStaggerItem>
        </ExecutiveHomeStagger>
      ) : null}

      {!hideIntro && variant !== 'executive' ? (
      <div className="home-layout-a__intro">
        <HomeGreeting />
        <CalmCollapsible
          title="Profil & fas"
          meta={weekdayLabel(now)}
          defaultOpen={false}
          glow="gold"
          variant="card"
        >
          <div className="home-layout-a__intro-meta space-y-1">
            <p className="home-layout-a__sub">
              {weekdayLabel(now)} · {phaseLead(phase).toLowerCase()}
            </p>
            {(presetLabel ?? preset.label) ? (
              <p
                className="home-greeting-module__profile text-[10px] text-text-muted"
                aria-label={`Hemprofil: ${presetLabel ?? preset.label}`}
              >
                {presetLabel ?? preset.label}
              </p>
            ) : null}
            <p className="text-xs text-text-muted">{preset.lead}</p>
            <HomeStreakChip />
          </div>
        </CalmCollapsible>
      </div>
      ) : null}

      {variant !== 'executive' ? anchorSection : null}

      <PinnedPlaneringModuleSlot targetId="hem.brass.below-grid" />

      <UserWidgetHomeSlot />

      {variant !== 'executive' ? (
        <>
      <HomeBrassDaySteps variant={variant} />

      <div className="space-y-2">
        <p className={clsx(
          'text-[9px] tracking-[0.2em] uppercase font-bold text-accent pl-1',
        )}>
          SNABBSTART
        </p>
        <div className="home-layout-a__snabbstart grid grid-cols-3 gap-2.5">
          {QUICK_CAPTURE.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.to)}
                aria-label={item.label}
                className={clsx(
                  cardClass,
                  'home-layout-a__tile flex min-h-[5.5rem] flex-col items-center justify-center gap-2 p-4 transition-all hover:border-accent/30 active:scale-[0.98]',
                )}
              >
                <Icon className="h-5 w-5 text-accent" aria-hidden />
                <span className="text-[10px] font-semibold text-text-muted">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Närvaro & Ritual side-by-side (Mockup flat layout) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/vardagen?tab=mabra')}
          aria-label={`Närvaro ${presenceVal}, ${presenceLabel}`}
          className={clsx(
            cardClass,
            'home-layout-a__tile flex min-h-24 flex-col justify-between p-3.5 text-left transition-all hover:border-accent/30 active:scale-[0.98]',
          )}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-accent">
            NÄRVARO
          </span>
          <div className="mt-2 flex flex-col">
            <span className="font-sans text-xl font-bold leading-none text-text">{presenceVal}</span>
            <span className="mt-1 text-[10px] font-semibold text-success">{presenceLabel}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/vardagen')}
          aria-label={`Ritual ${ritual.name}, ${ritual.time}`}
          className={clsx(
            cardClass,
            'home-layout-a__tile flex min-h-24 flex-col justify-between p-3.5 text-left transition-all hover:border-accent/30 active:scale-[0.98]',
          )}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-accent">
            RITUAL
          </span>
          <div className="mt-2 flex flex-col">
            <span className="font-sans text-base font-bold leading-none text-text">{ritual.name}</span>
            <span className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-text-muted">
              {RitualIcon ? <RitualIcon className="h-3 w-3 text-accent" aria-hidden /> : null}
              {ritual.time}
            </span>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/hjartat')}
        aria-label={`Kompassråd: ${compassAdvice}`}
        className={clsx(
          cardClass,
          'home-layout-a__tile flex w-full items-center justify-between p-4 text-left transition-all hover:border-accent/30 active:scale-[0.99]',
        )}
      >
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
            KOMPASSRÅD
          </p>
          <p className="font-sans text-xs font-semibold leading-relaxed text-text">
            {compassAdvice}
          </p>
        </div>
        <ChevronRight className="ml-4 h-4 w-4 flex-shrink-0 text-accent" aria-hidden />
      </button>
        </>
      ) : null}

    </div>
  );
}
