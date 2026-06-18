import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Mic, PenLine } from 'lucide-react';
import { saveCheckIn } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { HomeGreeting } from './HomeGreeting';
import { HomeBrassDaySteps } from './HomeBrassDaySteps';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';
import { getHomeCompassPhase, phaseLead } from './homeCompassPhase';

type Props = {
  onCheckInSaved?: () => void;
};

const QUICK_CAPTURE = [
  { id: 'note', label: 'Anteckning', icon: PenLine, to: HOME_SUPERHUB_ROUTES.hjartatReflektion },
  { id: 'voice', label: 'Röst', icon: Mic, to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror },
  { id: 'inbox', label: 'Inkast', icon: Inbox, to: HOME_SUPERHUB_ROUTES.planeringInkast },
] as const;

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('sv-SE', { weekday: 'long' });
}

/** Hem layout A — stor ankare-modul + asymmetriskt rutnät (Brushed Brass vinnare). */
export function HomeBrassLayoutA({ onCheckInSaved }: Props) {
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
        questionId: 'home_brass_anchor',
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

  return (
    <div className="home-brass-a mx-auto w-full max-w-2xl space-y-3.5 animate-fade-in">
      <div className="home-brass-a__intro">
        <HomeGreeting hideEyebrow />
        <p className="home-brass-a__sub">
          {weekdayLabel(now)} · {phaseLead(phase).toLowerCase()}
        </p>
      </div>

      <section className="home-brass-a__hero brass-glass brass-glass--hero" aria-label="Dagens ankare">
        <p className="home-brass-a__label">Dagens ankare</p>
        <h2 className="home-brass-a__hero-title font-display-serif">
          {anchor.trim() || 'Vad är viktigast idag?'}
        </h2>
        <p className="home-brass-a__hero-lead">Inte hela dagen — bara det viktigaste nu.</p>
        <label className="sr-only" htmlFor="home-brass-anchor">
          Dagens ankare
        </label>
        <textarea
          id="home-brass-anchor"
          className="home-brass-a__hero-inset brass-inset neu-inset w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-text"
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
            className="btn-pill--accent px-4 py-2 text-xs"
            disabled={saving}
            onClick={() => void handleAnchorSave()}
          >
            {saving ? 'Sparar …' : saved ? 'Sparat ✓' : 'Spara ankare'}
          </button>
          {error ? <p className="text-xs text-danger">{error}</p> : null}
        </div>
      </section>

      <div className="home-brass-a__grid" aria-label="Steg och snabbstart">
        <HomeBrassDaySteps />

        {QUICK_CAPTURE.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="home-brass-a__tile home-brass-a__tile--icon brass-glass"
              onClick={() => navigate(item.to)}
            >
              <Icon className="home-brass-a__tile-icon" aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="home-brass-a__strip brass-glass"
        onClick={() => navigate(QUICK_CAPTURE[2].to)}
      >
        <span className="home-brass-a__strip-ico" aria-hidden>
          ▦
        </span>
        <span className="home-brass-a__strip-text">
          <strong>Senaste · Inkast</strong>
          <span>Tryck för att fånga något nytt</span>
        </span>
      </button>

      <PinnedPlaneringModuleSlot targetId="hem.brass.below-grid" />
    </div>
  );
}
