import type { CognitiveLoadLevel } from '../cognitive/cognitiveLoadStorage';

export const COMPASS_DAY_CHIPS = ['BIFF', 'Ingen JADE', 'Parallellt föräldraskap'] as const;

type TipSlot = { morning: string; day: string; evening: string; highLoad: string };

const TIPS: TipSlot = {
  morning:
    'Börja med ett mikrosteg — inte hela dagen. Vatten och ett andetag räcker som första seger.',
  day: 'Håll logistik kort idag. Känslomässiga beten behöver inget svar från dig.',
  evening:
    'Kvällen är för återhämtning, inte för att vinna argument. Stäng skärmen när kroppen säger till.',
  highLoad:
    'Safe Mode: endast det som skyddar dig och barnen. Resten kan vänta till imorgon.',
};

function hourBucket(): keyof Pick<TipSlot, 'morning' | 'day' | 'evening'> {
  const h = new Date().getHours();
  if (h < 11) return 'morning';
  if (h < 17) return 'day';
  return 'evening';
}

/** F-02.3 — deterministiskt råd, ingen LLM på hem. */
export function getDailyCompassTip(load: CognitiveLoadLevel): string {
  if (load >= 4) return TIPS.highLoad;
  return TIPS[hourBucket()];
}
