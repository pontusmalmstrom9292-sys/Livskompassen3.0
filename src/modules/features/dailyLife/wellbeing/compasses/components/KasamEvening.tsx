import { useState } from 'react';
import { Check, Loader2, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
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
};

export function KasamEvening({ userId, onKlar, onSaved }: Props) {
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
    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Kvällskompass sparad.
        </p>
        <BentoCard title="Gaslighting?" description="Bro till Speglar — inget sparas automatiskt">
          <div className="flex flex-col gap-2">
            <Link to="/dagbok?tab=speglar" className="btn-pill--ghost text-sm">
              Jämför känsla med fakta (Speglar)
            </Link>
            <Link to="/dagbok?tab=bevis" className="btn-pill--ghost text-sm">
              Dokumentera neutralt (Bevis)
            </Link>
          </div>
        </BentoCard>
        <div className="flex flex-col gap-2">
          <Link to="/mabra" className="btn-pill--ghost text-sm">
            Landning (Måbra)
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

  return (
    <BentoCard title="Kväll — KASAM" icon={<Moon className="h-4 w-4" />}>
      <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">
        Steg {stepIndex + 1} av {KASAM_STEPS.length}: {current.label}
      </p>
      <p className="mb-4 text-sm text-text-muted">{current.question}</p>
      <textarea
        value={currentValue}
        onChange={(e) => setKasam((k) => ({ ...k, [current.key]: e.target.value }))}
        rows={3}
        className="w-full rounded-xl border border-border-strong bg-surface/50 px-4 py-3 text-sm"
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {stepIndex < KASAM_STEPS.length - 1 ? (
        <button type="button" onClick={handleNext} className="btn-pill--secondary mt-4">
          Nästa
        </button>
      ) : (
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn-pill--success mt-4"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Spara kväll'}
        </button>
      )}
    </BentoCard>
  );
}
