import { useState } from 'react';
import { X, Smile, Zap } from 'lucide-react';
import { Modal, Button, ButtonLink } from '@/design-system';
import { useMabraStore } from '@/modules/features/dailyLife/wellbeing/mabra/store/mabraStore';
import { useStore } from '@/core/store';
import { toast } from '@/modules/core/store/toastStore';
import { shouldRedirectMabraCoachToSpeglar } from '@/modules/features/dailyLife/wellbeing/mabra/lib/mabraCoachGuard';
import { MABRA_SPEGLAR_GUARD_COPY } from '@/modules/features/dailyLife/wellbeing/mabra/constants';

interface MabraCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** `inline` — embedded in Superhub without overlay (Fas 6A). */
  variant?: 'modal' | 'inline';
  onSaved?: () => void;
}

export function MabraCheckinModal({
  isOpen,
  onClose,
  variant = 'modal',
  onSaved,
}: MabraCheckinModalProps) {
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speglarRedirect, setSpeglarRedirect] = useState(false);

  const user = useStore((s) => s.user);
  const saveMabraCheckIn = useMabraStore((s) => s.saveMabraCheckIn);

  const isInline = variant === 'inline';
  if (!isOpen && !isInline) return null;

  const handleSave = async () => {
    if (!user?.uid) {
      toast.error('Du måste vara inloggad för att spara incheckningen.');
      return;
    }

    if (notes.trim() && shouldRedirectMabraCoachToSpeglar(notes)) {
      setSpeglarRedirect(true);
      return;
    }

    setIsLoading(true);
    try {
      await saveMabraCheckIn(user.uid, {
        energy,
        mood,
        notes: notes.trim() || undefined,
      });
      toast.success('Din incheckning har sparats!');
      onSaved?.();
      if (isInline) {
        setEnergy(5);
        setMood(5);
        setNotes('');
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Fel vid sparning av incheckning:', err);
      toast.error('Misslyckades att spara incheckningen. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  const card = (
    <div
      className={`relative w-full overflow-hidden calm-card border border-border/30 bg-surface-2/95 ${
        isInline ? 'rounded-2xl p-4 sm:p-5' : 'max-w-md rounded-3xl p-6 shadow-accent-glow-lg transition-all duration-300'
      }`}
    >
      {!isInline ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 via-accent-ai/50 to-accent-secondary/50 animate-pulse" />
      ) : null}

      <div className={`flex items-center justify-between ${isInline ? 'mb-4' : 'mb-6'}`}>
        <h2 className="font-display-serif text-lg text-accent tracking-wide">Ny MåBra-incheckning</h2>
        {!isInline ? (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Stäng"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border/10 bg-surface/50 p-1.5 text-text-muted transition-colors hover:border-border/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

        {/* Content / Sliders */}
        <div className="space-y-6">
          {/* Mood Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-white/90 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-accent" />
                Humör
              </label>
              <span className="font-mono text-accent-light bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                {mood} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full accent-accent bg-surface-3 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted px-0.5">
              <span>Lågt</span>
              <span>Balanserat</span>
              <span>Strålande</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-white/90 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent-ai" />
                Energinivå
              </label>
              <span className="font-mono text-accent-ai bg-accent-ai/10 px-2 py-0.5 rounded-md border border-accent-ai/20">
                {energy} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full accent-accent-ai bg-surface-3 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted px-0.5">
              <span>Utmattad</span>
              <span>Jämn</span>
              <span>Laddad</span>
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white/90">
              Anteckning (frivillig)
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (speglarRedirect) setSpeglarRedirect(false);
              }}
              placeholder="Hur känns det just nu? Vad tar din energi?"
              rows={3}
              className="w-full p-3 text-sm rounded-xl bg-surface/60 border border-border/20 text-white placeholder-text-dim focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 resize-none transition-colors"
            />
          </div>

          {speglarRedirect ? (
            <div
              className="rounded-xl border border-accent/25 bg-surface/40 p-3 text-xs text-text-muted"
              role="status"
            >
              <p>{MABRA_SPEGLAR_GUARD_COPY.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink to="/hjartat?tab=speglar" variant="accent" size="sm">
                  {MABRA_SPEGLAR_GUARD_COPY.goLabel}
                </ButtonLink>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSpeglarRedirect(false)}>
                  {MABRA_SPEGLAR_GUARD_COPY.stayLabel}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

      <div className={`flex justify-end gap-3 ${isInline ? 'mt-6' : 'mt-8'}`}>
        {!isInline ? (
          <button
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center rounded-xl border border-border/20 px-4 py-2 text-xs font-medium text-text-muted transition-all hover:bg-surface-3 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Avbryt
          </button>
        ) : null}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex min-h-11 items-center rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-obsidian-bg transition-all hover:bg-accent-light hover:shadow-accent-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Sparar...' : 'Spara'}
        </button>
      </div>
    </div>
  );

  if (isInline) return card;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      ariaLabel="Ny MåBra-incheckning"
      hideHeader
      panelClassName="max-w-md border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
    >
      {card}
    </Modal>
  );
}
