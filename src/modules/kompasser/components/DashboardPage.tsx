import { useState, useEffect } from 'react';
import { Sun, Cloud, Moon, Check, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveCheckIn } from '../../core/firebase/firestore';

type Flow = 'morning' | 'day' | 'evening';

const flows: { id: Flow; label: string; icon: typeof Sun; question: string; options: string[] }[] = [
  {
    id: 'morning',
    label: 'Morgon',
    icon: Sun,
    question: 'Vilket mikrosteg ger dig lugnast start idag?',
    options: ['Andning 2 min', 'En uppgift', 'Inget — vila'],
  },
  {
    id: 'day',
    label: 'Dag',
    icon: Cloud,
    question: 'Hur mår kroppen just nu?',
    options: ['Stabil', 'Trött', 'Spänd', 'Orolig'],
  },
  {
    id: 'evening',
    label: 'Kväll',
    icon: Moon,
    question: 'Vad vill du stänga dagen med?',
    options: ['Tacksamhet', 'Plan imorgon', 'Vila direkt'],
  },
];

export function DashboardPage() {
  const compassFilter = useStore((s) => s.ui.compassFilter);
  const setCompassFilter = useStore((s) => s.setCompassFilter);
  const user = useStore((s) => s.user);
  const [activeFlow, setActiveFlow] = useState<Flow>(
    compassFilter === 'morning' || compassFilter === 'day' || compassFilter === 'evening'
      ? compassFilter
      : 'morning'
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCompassFilter(activeFlow);
  }, [activeFlow, setCompassFilter]);

  const flow = flows.find((f) => f.id === activeFlow)!;

  const handleSave = async () => {
    if (!selected || !user) return;
    setSaving(true);
    setError(null);
    try {
      await saveCheckIn(user.uid, {
        questionId: `compass_${activeFlow}`,
        questionText: flow.question,
        optionSelected: selected,
        taskCategory: activeFlow,
      });
      setSaved(true);
    } catch {
      setError('Kunde inte spara check-in. Kontrollera Firestore-regler och .env.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {flows.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setActiveFlow(id);
              setSelected(null);
              setSaved(false);
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border ${
              activeFlow === id
                ? 'border-[#FDE68A]/40 bg-[#FDE68A]/10 text-[#FDE68A]'
                : 'border-white/10 text-slate-400'
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      <BentoCard title={flow.label} icon={<flow.icon className="h-4 w-4" />}>
        <p className="text-sm text-slate-300 mb-4">{flow.question}</p>
        <div className="space-y-2">
          {flow.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelected(opt);
                setSaved(false);
              }}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm border transition-colors ${
                selected === opt
                  ? 'border-[#FDE68A]/50 bg-[#FDE68A]/10 text-[#FDE68A]'
                  : 'border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {selected && !saved && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-full border border-emerald-500/40 px-5 py-2 text-xs uppercase tracking-widest text-emerald-400 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Spara check-in
          </button>
        )}

        {saved && (
          <p className="mt-4 text-sm text-emerald-400 flex items-center gap-2">
            <Check className="h-4 w-4" /> Check-in sparad.
          </p>
        )}

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </BentoCard>
    </div>
  );
}
