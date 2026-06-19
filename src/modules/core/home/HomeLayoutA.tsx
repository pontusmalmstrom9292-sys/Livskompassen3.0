import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Mic, PenLine } from 'lucide-react';
import { clsx } from 'clsx';
import { saveCheckIn } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { HomeGreeting } from './HomeGreeting';
import { HomeBrassDaySteps } from './HomeBrassDaySteps';
import { HomeStreakChip } from './HomeStreakChip';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';
import { getHomeCompassPhase, phaseLead } from './homeCompassPhase';

type Props = {
  onCheckInSaved?: () => void;
  /** brass = Brushed Brass tema; calm = Obsidian Calm (default hem). */
  variant?: 'brass' | 'calm';
  presetLabel?: string;
};

const QUICK_CAPTURE = [
  { id: 'note', label: 'Anteckning', icon: PenLine, to: HOME_SUPERHUB_ROUTES.hjartatReflektion },
  { id: 'voice', label: 'Röst', icon: Mic, to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror },
  { id: 'inbox', label: 'Inkast', icon: Inbox, to: HOME_SUPERHUB_ROUTES.planeringInkast },
] as const;

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('sv-SE', { weekday: 'long' });
}

function surfaceClass(variant: 'brass' | 'calm', extra?: string) {
  if (variant === 'brass') {
    return clsx('brass-glass', extra);
  }
  return clsx('calm-card glow-bottom-gold', extra);
}

/** Hem layout A — ankare + asymmetriskt rutnät (HEM-LAYOUT-A-KANON). */
export function HomeLayoutA({ onCheckInSaved, variant = 'calm', presetLabel }: Props) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const now = useMemo(() => new Date(), []);
  const phase = getHomeCompassPhase(now);

  const [anchor, setAnchor] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        questionId: variant === 'brass' ? 'home_brass_anchor' : 'home_layout_a_anchor',
        questionText: 'Dagens ankare',
        optionSelected: 'intention',
        taskCategory: 'morning',
        taskNote: text,
      });
      setSaved(true);
      onCheckInSaved?.();
    } catch {
      setError('Kunde inte spara. Kontrollera nätverk.');
    } finally {
      setSaving(false);
    }
  };

  const rootClass = clsx(
    'home-layout-a mx-auto w-full max-w-2xl space-y-3.5',
    variant === 'brass' && 'home-brass-a',
    variant === 'calm' && 'home-layout-a--calm',
  );

  const insetClass =
    variant === 'brass'
      ? 'home-layout-a__hero-inset brass-inset neu-inset w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-text'
      : 'home-layout-a__hero-inset w-full resize-none rounded-xl border border-border/40 bg-surface-2/80 px-3 py-2 text-sm text-text';

  return (
    <div className={rootClass}>
      <div className="home-layout-a__intro">
        <HomeGreeting hideEyebrow={variant === 'calm'} />
        <div className="home-layout-a__intro-meta">
          <p className="home-layout-a__sub">
            {weekdayLabel(now)} · {phaseLead(phase).toLowerCase()}
          </p>
          {presetLabel ? (
            <p className="home-greeting-module__profile text-[10px] text-text-dim" aria-label={`Hemprofil: ${presetLabel}`}>
              {presetLabel}
            </p>
          ) : null}
          <HomeStreakChip />
        </div>
      </div>

      <section
        className={clsx('home-layout-a__hero', surfaceClass(variant, 'home-layout-a__hero-card'))}
        aria-label="Dagens ankare"
      >
        <p className="home-layout-a__label">Dagens ankare</p>
        <h2 className="home-layout-a__hero-title font-display-serif">
          {anchor.trim() || 'Vad är viktigast idag?'}
        </h2>
        <p className="home-layout-a__hero-lead">Inte hela dagen — bara det viktigaste nu.</p>
        <label className="sr-only" htmlFor="home-layout-a-anchor">
          Dagens ankare
        </label>
        <textarea
          id="home-layout-a-anchor"
          className={insetClass}
          rows={2}
          placeholder="T.ex. lugnt samtal med barnen efter skolan …"
          value={anchor}
          onChange={(e) => {
            setAnchor(e.target.value);
            setSaved(false);
          }}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-pill--accent px-4 py-2 text-xs uppercase tracking-wide"
            disabled={saving}
            onClick={() => void handleAnchorSave()}
          >
            {saving ? 'Sparar …' : saved ? 'Sparat ✓' : 'Spara ankare'}
          </button>
          {error ? <p className="text-xs text-danger">{error}</p> : null}
        </div>
      </section>

      <div className="home-layout-a__grid" aria-label="Steg och snabbstart">
        <HomeBrassDaySteps variant={variant} />

        {QUICK_CAPTURE.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={clsx('home-layout-a__tile home-layout-a__tile--icon', surfaceClass(variant))}
              onClick={() => navigate(item.to)}
            >
              <Icon className="home-layout-a__tile-icon" aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={clsx('home-layout-a__strip', surfaceClass(variant))}
        onClick={() => navigate(QUICK_CAPTURE[2].to)}
      >
        <span className="home-layout-a__strip-ico" aria-hidden>
          ▦
        </span>
        <span className="home-layout-a__strip-text">
          <strong>Senaste · Inkast</strong>
          <span>Tryck för att fånga något nytt</span>
        </span>
      </button>

      <PinnedPlaneringModuleSlot targetId="hem.brass.below-grid" />
    </div>
  );
}
