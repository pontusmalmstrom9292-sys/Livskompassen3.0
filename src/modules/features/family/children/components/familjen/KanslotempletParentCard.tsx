import { useCallback, useEffect, useState } from 'react';
import { Heart, Loader2, RefreshCw } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { getChildrenLogs } from '@/core/firebase/firestore';
import type { ChildrenLogEntry } from '../../types';

type Props = {
  activeChild: string;
  userId: string;
};

type WeatherType = 'aska' | 'dimma' | 'sol' | 'regn' | 'unknown';

type CoRegulationAdvice = {
  moodLabel: string;
  advice: string;
  physicalAction: string;
  parentGuard: string;
};

const ADVICE_MAP: Record<WeatherType, CoRegulationAdvice> = {
  aska: {
    moodLabel: 'Stressad, arg eller frustrerad (Åska)',
    advice: 'Barnet bär på ett högt inre tryck. Undvik alla krav, frågor om skolan eller den andra föräldern just nu.',
    physicalAction: 'Gör något fysiskt och repetitivt tillsammans: rulla lera, kasta boll ute, eller riv papper. Låt ilskan pysa ut utan ord.',
    parentGuard: 'Kom ihåg: Barnets utbrott hos dig beror på att du är den trygga hamnen där det är säkert att släppa taget.'
  },
  dimma: {
    moodLabel: 'Frånvarande, tyst eller orolig (Dimma)',
    advice: 'Barnet har gått in i "freeze"-tillstånd (dissociation/avstängning) för att skydda sig mot psykisk överbelastning.',
    physicalAction: 'Erbjud fysisk närhet utan krav på samtal. Lägg pussel, rita tyst bredvid varandra eller erbjud en varm filt och ett glas vatten.',
    parentGuard: 'Kom ihåg: Du behöver inte tvinga fram ord. Att bara sitta tyst tillsammans bygger upp tilliten igen.'
  },
  regn: {
    moodLabel: 'Ledsen, sårbar eller trött (Regn)',
    advice: 'Barnet släpper på garden och visar sin sorg. Validera känslan direkt utan att försöka "lösa" eller plåstra om den direkt.',
    physicalAction: 'Säg: "Jag ser att du är ledsen, och det är helt okej att vara det här hos pappa." Ge en lång kram om barnet vill.',
    parentGuard: 'Kom ihåg: Du behöver inte kompensera för det mamman gör. Att du tillåter ledsenhet är den bästa medicinen.'
  },
  sol: {
    moodLabel: 'Stabil, glad eller lugn (Sol)',
    advice: 'Barnets nervsystem är i balans. Ta tillvara på stunden för att fästa ett positivt minnesankare.',
    physicalAction: 'Skriv ner en rad i "Ny stund" tillsammans med barnet. Låt dem berätta med egna ord vad som var roligt.',
    parentGuard: 'Kom ihåg: Dessa stunder är barnets emotionella buffert. Spara dem noggrant.'
  },
  unknown: {
    moodLabel: 'Ingen känsla registrerad idag',
    advice: 'Inget känsloväder har rapporterats från Barnporten ännu.',
    physicalAction: 'Ställ en av dagens roliga barnfokus-frågor under middagen för att känna av läget naturligt.',
    parentGuard: 'Kom ihåg: Ingen press. Allt sker i barnets egen takt.'
  }
};

function parseWeatherFromLog(log: ChildrenLogEntry | undefined): WeatherType {
  if (!log || !log.observation) return 'unknown';
  const text = log.observation.toLowerCase();
  if (text.includes('aska')) return 'aska';
  if (text.includes('dimma')) return 'dimma';
  if (text.includes('regn')) return 'regn';
  if (text.includes('humor') || text.includes('sol')) return 'sol';
  return 'unknown';
}

export function KanslotempletParentCard({ activeChild, userId }: Props) {
  const [latestLog, setLatestLog] = useState<ChildrenLogEntry | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const logs = (await getChildrenLogs(userId)) as ChildrenLogEntry[];
      const childBpLog = logs.find(
        (l) => l.childAlias === activeChild && l.category === 'barnporten',
      );
      setLatestLog(childBpLog);
    } catch {
      setError('Kunde inte läsa känslodata.');
    } finally {
      setLoading(false);
    }
  }, [userId, activeChild]);

  useEffect(() => {
    void load();
  }, [load]);

  const weather = parseWeatherFromLog(latestLog);
  const info = ADVICE_MAP[weather];

  return (
    <BentoCard
      title="Känsloväder & Medreglering"
      description={`Avkodat stöd för ${activeChild}`}
      icon={<Heart className="h-4 w-4 text-accent" />}
    >
      {loading ? (
        <p className="flex items-center gap-2 text-xs text-text-dim py-4">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" /> Läser känsloläge…
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-sm font-semibold text-accent-light">{info.moodLabel}</span>
            <button
              type="button"
              onClick={() => void load()}
              className="text-text-dim hover:text-accent bg-transparent border-0 cursor-pointer"
              title="Uppdatera"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-text-dim">Möt känslan</span>
              <p className="text-text-muted mt-0.5 leading-relaxed">{info.advice}</p>
            </div>

            <div className="rounded-xl border border-border-strong bg-surface-3/30 p-3">
              <span className="text-[10px] uppercase tracking-widest text-accent-ai font-medium">Praktisk handling</span>
              <p className="text-text-muted mt-1 leading-relaxed">{info.physicalAction}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <span className="text-[10px] uppercase tracking-widest text-text-dim">Föräldra-ankare</span>
              <p className="text-text-dim mt-1 leading-relaxed italic">{info.parentGuard}</p>
            </div>
          </div>

          {latestLog?.createdAt && (
            <p className="text-[9px] text-right text-text-dim uppercase tracking-wider">
              Registrerat: {latestLog.createdAt.slice(0, 16).replace('T', ' ')}
            </p>
          )}

          {error && <p className="text-xs text-danger text-center">{error}</p>}
        </div>
      )}
    </BentoCard>
  );
}
