/**
 * Lokal Fas A/B-analys — heuristik only (0 LLM).
 * Samma logik som callable analyzeChildIncident (flashUsed=false).
 */
import {
  scanBarnIncidentText,
  formatIncidentMetaTruth,
  BARN_INCIDENT_LIBRARY_VERSION,
  type BarnIncidentMatch,
} from '@/shared/patterns/barnIncidentPatternLibrary';
import {
  pickIncidentCard,
  scriptForTags,
  type IncidentSupportCard,
  type IncidentSupportScript,
} from '../content/incidentSupportBank';
import { formatChildObservation, type EpistemicKind } from '../utils/childObservationEpistemics';

export type ChildIncidentAnalysis = {
  tags: BarnIncidentMatch[];
  deepening: string;
  childResponseScript: string;
  questionCard: IncidentSupportCard;
  script: IncidentSupportScript;
  analysisMode: 'heuristic';
  flashUsed: false;
  heuristicVersion: string;
  observationForWorm: string;
  truthForWorm: string;
  bankId: string;
};

function buildDeepening(tags: BarnIncidentMatch[]): string {
  if (tags.length === 0) {
    return 'Ingen tydlig mönstertag ännu. Spara citat och tolkning separat — beteende och datum räcker.';
  }
  const labels = tags
    .slice(0, 3)
    .map((t) => t.label)
    .join(' · ');
  return `Möjliga mönster (beteende, inte diagnos): ${labels}. Håll dig till barnets behov just nu — en mening.`;
}

export function analyzeChildIncidentLocal(input: {
  rawText: string;
  epistemicKind?: EpistemicKind;
  /** Pattern-ids från senaste 7 dagars incidenter (tematik) */
  themePatternIds?: string[];
}): ChildIncidentAnalysis {
  const epistemicKind = input.epistemicKind ?? 'tolkning';
  const tags = scanBarnIncidentText(input.rawText);
  const tagNames = tags.map((t) => t.tag);
  const script = scriptForTags(tagNames);
  const questionCard = pickIncidentCard({
    preferredCardId: tags[0]?.questionCardId,
    tagPatternIds: tags.map((t) => t.patternId),
    themePatternIds: input.themePatternIds,
    preferCrisis: tags.some((t) => t.weight >= 35),
  });

  return {
    tags,
    deepening: buildDeepening(tags),
    childResponseScript: script.text_sv,
    questionCard,
    script,
    analysisMode: 'heuristic',
    flashUsed: false,
    heuristicVersion: BARN_INCIDENT_LIBRARY_VERSION,
    observationForWorm: formatChildObservation(input.rawText, epistemicKind),
    truthForWorm: formatIncidentMetaTruth(tags),
    bankId: script.bankId,
  };
}
