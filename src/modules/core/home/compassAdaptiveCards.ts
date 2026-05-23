import type { CompassFlow } from '../../kompasser/utils/compassTime';
import {
  getDefaultCompassByTime,
  isDayCompassUnlocked,
  isEveningCompassUnlocked,
} from '../../kompasser/utils/compassTime';

export type CheckInSnapshot = {
  id: string;
  questionId?: string;
  questionText?: string;
  optionSelected?: string;
  taskCategory?: string;
  taskNote?: string;
  createdAt?: string;
};

export type AdaptiveMemoryCard = {
  id: string;
  title: string;
  prompt: string;
  actionLabel: string;
  to: string;
  search?: string;
  tone: 'gold' | 'indigo' | 'lavender' | 'emerald';
};

function isToday(iso?: string): boolean {
  if (!iso) return false;
  const d = iso.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  return d === today;
}

function latestForFlow(checkins: CheckInSnapshot[], flow: CompassFlow): CheckInSnapshot | null {
  return (
    checkins.find(
      (c) =>
        c.taskCategory === flow ||
        c.questionId === `compass_${flow}` ||
        (flow === 'evening' && c.optionSelected === 'kasam')
    ) ?? null
  );
}

function kasamFollowUp(taskNote?: string): AdaptiveMemoryCard | null {
  if (!taskNote) return null;
  try {
    const parsed = JSON.parse(taskNote) as { kasam?: Record<string, string> };
    const k = parsed.kasam;
    if (!k) return null;
    const entries = [
      { key: 'meaningful', label: 'Meningsfullhet', q: 'Vill du utveckla vad som gav mening idag?' },
      { key: 'manageable', label: 'Hanterbarhet', q: 'Vill du logga ett litet steg som kändes hanterbart?' },
      { key: 'comprehensible', label: 'Begriplighet', q: 'Vill du skriva ner vad som var begripligt?' },
    ];
    const weakest = entries.find((e) => !(k[e.key]?.trim().length >= 2));
    if (weakest) {
      return {
        id: `kasam-${weakest.key}`,
        title: weakest.label,
        prompt: weakest.q,
        actionLabel: 'Öppna dagbok',
        to: '/dagbok',
        tone: 'gold',
      };
    }
  } catch {
    return null;
  }
  return null;
}

function cardsFromMorning(option: string): AdaptiveMemoryCard[] {
  switch (option) {
    case 'Andning 2 min':
      return [
        {
          id: 'morning-breath',
          title: 'Morgon — andning',
          prompt: 'Du valde lugn start. Vill du köra 4-7-8 i två minuter nu?',
          actionLabel: 'Måbra',
          to: '/mabra',
          tone: 'lavender',
        },
        {
          id: 'morning-minne',
          title: 'Minne',
          prompt: 'Skriv en rad om dagens intention — så minns Kunskapsvalvet.',
          actionLabel: 'Kunskap',
          to: '/vardagen',
          search: '?tab=kunskap',
          tone: 'emerald',
        },
      ];
    case 'En uppgift':
      return [
        {
          id: 'morning-task',
          title: 'Morgon — ett steg',
          prompt: 'Du valde en uppgift. Bryt ner den till ett enda mikrosteg i Kompasser.',
          actionLabel: 'Paralys-brytare',
          to: '/vardagen',
          tone: 'emerald',
        },
      ];
    case 'Rörelse 5 min':
      return [
        {
          id: 'morning-move',
          title: 'Morgon — rörelse',
          prompt: 'Fem minuters rörelse kan väcka kroppen mjukt. Vill du sätta en timer?',
          actionLabel: 'Måbra',
          to: '/mabra',
          tone: 'indigo',
        },
      ];
    case 'Skriv en rad':
      return [
        {
          id: 'morning-journal',
          title: 'Morgon — en rad',
          prompt: 'Skriv en neutral rad om hur du vill ha dagen — inget mål, bara riktning.',
          actionLabel: 'Dagbok',
          to: '/dagbok',
          tone: 'gold',
        },
      ];
    case 'Läs ankaret':
      return [
        {
          id: 'morning-anchor',
          title: 'Morgon — ankare',
          prompt: 'Läs Sanningens Ankare lugnt. Vill du öppna bevisfliken?',
          actionLabel: 'Fyren',
          to: '/dagbok',
          search: '?tab=bevis',
          tone: 'emerald',
        },
      ];
    case 'Inget — vila':
      return [
        {
          id: 'morning-rest',
          title: 'Morgon — vila',
          prompt: 'Vila räcker. Vill du bara läsa Sanningens Ankare utan att prestera?',
          actionLabel: 'Dagbok',
          to: '/dagbok',
          tone: 'gold',
        },
      ];
    default:
      return [];
  }
}

function cardsFromDay(option: string): AdaptiveMemoryCard[] {
  switch (option) {
    case 'Trött':
      return [
        {
          id: 'day-tired',
          title: 'Dag — trött',
          prompt: 'Kroppen signalerar trötthet. Ett kort andningssteg kan sänka pulsen.',
          actionLabel: 'Måbra',
          to: '/mabra',
          tone: 'lavender',
        },
      ];
    case 'Spänd':
      return [
        {
          id: 'day-tense',
          title: 'Dag — spänd',
          prompt: 'Spänning i kroppen. Vill du prova 4-7-8 innan nästa beslut?',
          actionLabel: 'Andning',
          to: '/mabra',
          tone: 'lavender',
        },
        {
          id: 'day-minne-tense',
          title: 'Minne',
          prompt: 'Logga vad som spände — neutralt, utan att lösa.',
          actionLabel: 'Skriv i Minne',
          to: '/vardagen',
          search: '?tab=kunskap',
          tone: 'emerald',
        },
      ];
    case 'Orolig':
      return [
        {
          id: 'day-anxious',
          title: 'Dag — orolig',
          prompt: 'Oro i systemet. Spegla känslan mot fakta — utan att fixa.',
          actionLabel: 'Speglar',
          to: '/dagbok',
          search: '?tab=speglar',
          tone: 'gold',
        },
      ];
    case 'Stabil':
      return [
        {
          id: 'day-stable',
          title: 'Dag — stabil',
          prompt: 'Stabil bas idag. Vad är ett faktum du vill minnas i Kunskapsvalvet?',
          actionLabel: 'Lägg i Minne',
          to: '/vardagen',
          search: '?tab=kunskap',
          tone: 'emerald',
        },
      ];
    case 'Hungrig':
      return [
        {
          id: 'day-fuel',
          title: 'Dag — bränsle',
          prompt: 'Kroppen behöver bränsle. Ett litet mål räcker — utan att lösa hela dagen.',
          actionLabel: 'Uppgift',
          to: '/vardagen',
          tone: 'gold',
        },
      ];
    case 'Behöver kontakt':
      return [
        {
          id: 'day-contact',
          title: 'Dag — kontakt',
          prompt: 'Behöver du nå en trygg person? Planera ett kort samtal — inget måste fixas nu.',
          actionLabel: 'Dagbok',
          to: '/dagbok',
          tone: 'lavender',
        },
      ];
    default:
      return [];
  }
}

/** Bygger 1–4 små kort utifrån dagens kompass-svar (eller uppmaning att checka in). */
export function buildAdaptiveMemoryCards(
  checkins: CheckInSnapshot[],
  options?: { omitCompassPrompts?: boolean },
): AdaptiveMemoryCard[] {
  const todayCheckins = checkins.filter((c) => isToday(c.createdAt));
  const flow = getDefaultCompassByTime();
  const cards: AdaptiveMemoryCard[] = [];
  const omitCompassPrompts = options?.omitCompassPrompts ?? false;

  const morning = latestForFlow(todayCheckins, 'morning');
  const day = latestForFlow(todayCheckins, 'day');
  const evening = latestForFlow(todayCheckins, 'evening');

  if (!omitCompassPrompts) {
    if (flow === 'morning' && !morning) {
      cards.push({
        id: 'prompt-morning',
        title: 'Morgonkompass',
        prompt: 'Vilket mikrosteg ger dig lugnast start idag?',
        actionLabel: 'Svara i Kompasser',
        to: '/vardagen',
        tone: 'emerald',
      });
    }
    if (flow === 'day' && isDayCompassUnlocked() && !day && morning) {
      cards.push({
        id: 'prompt-day',
        title: 'Dagskompass',
        prompt: 'Hur mår kroppen just nu?',
        actionLabel: 'Svara i Kompasser',
        to: '/vardagen',
        tone: 'emerald',
      });
    }
    if (flow === 'evening' && isEveningCompassUnlocked() && !evening) {
      cards.push({
        id: 'prompt-evening',
        title: 'Kvällskompass',
        prompt: 'KASAM — tre korta steg för att landa dagen.',
        actionLabel: 'Kväll i Kompasser',
        to: '/vardagen',
        tone: 'emerald',
      });
    }
  }

  if (morning?.optionSelected) {
    cards.push(...cardsFromMorning(morning.optionSelected));
  }
  if (day?.optionSelected) {
    cards.push(...cardsFromDay(day.optionSelected));
  }
  if (evening?.optionSelected === 'kasam') {
    const follow = kasamFollowUp(evening.taskNote);
    if (follow) cards.push(follow);
    else {
      cards.push({
        id: 'evening-done',
        title: 'Kväll klar',
        prompt: 'KASAM sparad. Vill du lägga en rad i Minne om dagen?',
        actionLabel: 'Minne',
        to: '/vardagen',
        search: '?tab=kunskap',
        tone: 'emerald',
      });
    }
  }

  if (cards.length === 0 && checkins.length === 0 && !omitCompassPrompts) {
    cards.push({
      id: 'fallback-compass',
      title: 'Kompasser',
      prompt: 'Börja med en check-in — då anpassas korten efter dina svar.',
      actionLabel: 'Öppna Kompasser',
      to: '/vardagen',
      tone: 'emerald',
    });
  }

  const seen = new Set<string>();
  return cards.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  }).slice(0, 4);
}
