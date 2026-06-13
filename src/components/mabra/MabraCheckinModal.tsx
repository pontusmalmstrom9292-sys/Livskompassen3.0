import { useState } from 'react';
import { X, Smile, Zap } from 'lucide-react';
import { useMabraStore } from '@/modules/features/dailyLife/wellbeing/mabra/store/mabraStore';
import { useStore } from '@/core/store';
import { toast } from '@/modules/core/store/toastStore';

interface MabraCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MabraCheckinModal({ isOpen, onClose }: MabraCheckinModalProps) {
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useStore((s) => s.user);
  const saveMabraCheckIn = useMabraStore((s) => s.saveMabraCheckIn);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!user?.uid) {
      toast.error('Du måste vara inloggad för att spara incheckningen.');
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
      onClose();
    } catch (err) {
      console.error('Fel vid sparning av incheckning:', err);
      toast.error('Misslyckades att spara incheckningen. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-bg/85 backdrop-blur-md">
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden calm-card border border-border/30 bg-surface-2/95 shadow-accent-glow-lg rounded-3xl p-6 transition-all duration-300">
        
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 via-accent-ai/50 to-accent-secondary/50 animate-pulse" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display-serif text-lg text-accent tracking-wide">Ny MåBra-incheckning</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-surface/50 border border-border/10 text-text-muted hover:text-white hover:border-border/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
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
            <div className="flex justify-between text-[10px] text-text-dim px-0.5">
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
            <div className="flex justify-between text-[10px] text-text-dim px-0.5">
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
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hur känns det just nu? Vad tar din energi?"
              rows={3}
              className="w-full p-3 text-sm rounded-xl bg-surface/60 border border-border/20 text-white placeholder-text-dim focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-medium border border-border/20 text-text-muted hover:text-white hover:bg-surface-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-accent hover:bg-accent-light text-obsidian-bg transition-all hover:shadow-accent-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sparar...' : 'Spara'}
          </button>
        </div>
      </div>
    </div>
  );
}
