import { useState } from 'react';
import { Check, Loader2, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hjartatTabHref } from '@/core/navigation/appNavigation';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { BentoCard } from '@/shared/ui/BentoCard';
import { saveCheckIn } from '@/core/firebase/firestore';

const KASAM_STEPS = [
  { key: 'comprehensible' as const, label: 'Begriplighet', question: 'Vad var begripligt idag?' },
  { key: 'manageable' as const, label: 'Hanterbarhet', question: 'Vad kändes hanterbart?' },
  { key: 'meaningful' as const, label: 'Meningsfullhet', question: 'Vad gav mening — även litet?' },
];

type KasamData = Record<(typeof KASAM_STEPS)[number]['key'], string>;

type Props = {
  userId: string;
  onKlar: () => void;
  onSaved?: () => void;
  /** Inbäddad i HomeAdaptiveCompass — utan yttre BentoCard. */
  embedded?: boolean;
};

export function KasamEvening({ userId, onKlar, onSaved, embedded = false }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [kasam, setKasam] = useState<Partial<KasamData>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = KASAM_STEPS[stepIndex];
  const currentValue = current ? (kasam[current.key] ?? '') : '';

  const handleNext = () => {
    if (!current || currentValue.trim().length < 2) {
      setError('Skriv minst ett par ord.');
      return;
    }
    setError(null);
    setKasam((k) => ({ ...k, [current.key]: currentValue.trim() }));
    if (stepIndex < KASAM_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSave = async () => {
    if (!current || currentValue.trim().length < 2) {
      setError('Skriv minst ett par ord.');
      return;
    }
    const full: KasamData = {
      comprehensible: kasam.comprehensible ?? '',
      manageable: kasam.manageable ?? '',
      meaningful: kasam.meaningful ?? '',
    };
    full[current.key] = currentValue.trim();

    setSaving(true);
    setError(null);
    try {
      await saveCheckIn(userId, {
        questionId: 'compass_evening',
        questionText: 'KASAM — kvällskompass',
        optionSelected: 'kasam',
        taskCategory: 'evening',
        taskNote: JSON.stringify({ kasam: full }),
      });
      setSaved(true);
      onSaved?.();
    } catch {
      setError('Kunde inte spara. Kontrollera Firestore-regler.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    const savedBody = (
      <>
        <p className="flex items-center justify-center gap-2 text-xs text-success">
          <Check className="h-4 w-4" /> Kvällskompass sparad.
        </p>
        <p className="text-center text-[10px] text-text-dim">Gaslighting? Bro — inget sparas automatiskt.</p>
        <div className="flex flex-col gap-2">
          <Link to={hjartatTabHref('speglar')} className="btn-pill--ghost text-xs">
            Jämför känsla med fakta (Speglar)
          </Link>
          <Link to={NAV_PATHS.VALVET} className="btn-pill--ghost text-xs">
            Dokumentera neutralt (Bevis)
          </Link>
          <Link to="/mabra" className="btn-pill--ghost text-xs">
            Landning (MåBra)
          </Link>
          <button type="button" onClick={onKlar} className="btn-pill--success text-xs">
            Klar
          </button>
        </div>
      </>
    );

    if (embedded) return <div className="space-y-3">{savedBody}</div>;

    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Kvällskompass sparad.
        </p>
        <BentoCard title="Gaslighting?" description="Bro till Speglar — inget sparas automatiskt">
          <div className="flex flex-col gap-2">
            <Link to={hjartatTabHref('speglar')} className="btn-pill--ghost text-sm">
              Jämför känsla med fakta (Speglar)
            </Link>
            <Link to={NAV_PATHS.VALVET} className="btn-pill--ghost text-sm">
              Dokumentera neutralt (Bevis)
            </Link>
          </div>
        </BentoCard>
        <div className="flex flex-col gap-2">
          <Link to="/mabra" className="btn-pill--ghost text-sm">
            Landning (MåBra)
          </Link>
          <Link to="/familjen" className="btn-pill--ghost text-sm">
            Livslogg barnen
          </Link>
          <button type="button" onClick={onKlar} className="btn-pill--success text-sm">
            Klar
          </button>
        </div>
      </div>
    );
  }

  const stepForm = (
    <>
      <p className="text-center text-[10px] uppercase tracking-widest text-text-dim">
        Steg {stepIndex + 1} av {KASAM_STEPS.length}: {current.label}
      </p>
      <p className="text-center text-xs text-text-muted">{current.question}</p>
      <textarea
        value={currentValue}
        onChange={(e) => setKasam((k) => ({ ...k, [current.key]: e.target.value }))}
        rows={embedded ? 2 : 3}
        className={
          embedded
            ? 'input-glass w-full text-sm'
            : 'w-full rounded-xl border border-border-strong bg-surface/50 px-4 py-3 text-sm'
        }
      />
      {error && <p className="text-center text-xs text-danger">{error}</p>}
      {stepIndex < KASAM_STEPS.length - 1 ? (
        <button
          type="button"
          onClick={handleNext}
          className={embedded ? 'btn-pill--secondary w-full text-xs' : 'btn-pill--secondary mt-4'}
        >
          Nästa
        </button>
      ) : (
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className={
            embedded ? 'btn-pill--accent w-full text-xs disabled:opacity-40' : 'btn-pill--success mt-4'
          }
        >
          {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Spara kväll'}
        </button>
      )}
    </>
  );

  if (embedded) return <div className="space-y-3">{stepForm}</div>;

  return (
    <BentoCard title="Kväll — KASAM" icon={<Moon className="h-4 w-4" />}>
      {stepForm}
    </BentoCard>
  );
}
