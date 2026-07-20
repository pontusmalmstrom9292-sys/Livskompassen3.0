/**
 * analyzeChildIncident — Barnen-silo, Fas A: heuristik only (flashUsed=false).
 * Ingen Valv/Kunskap-läsning. WORM sker klient-side via saveChildrenLog.
 */
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { createSiloGuard, Silo } from '../lib/siloEnforcer';
import {
  scanBarnIncidentText,
  formatIncidentMetaTruth,
  BARN_INCIDENT_LIBRARY_VERSION,
  BARN_INCIDENT_TAG_LABELS,
} from '../lib/barnIncidentPatternLibrary';

const barnenGuard = createSiloGuard('analyzeChildIncident', Silo.BARNEN);

const SCRIPT_BY_TAG: Record<string, { bankId: string; text_sv: string }> = {
  triangulering: {
    bankId: 'BP-CRISIS-05',
    text_sv:
      'Tack att du berättade. Det du hörde behöver inte vara hela sanningen. Jag vill träffa dig — det står kvar.',
  },
  loyalty_conflict: {
    bankId: 'BP-CRISIS-06',
    text_sv:
      'Du behöver inte välja sida. Du får gilla både mig och mamma. Jag håller dig trygg här.',
  },
  contact_fear_relay: {
    bankId: 'BP-CRISIS-05',
    text_sv:
      'Tack att du berättade. Det du hörde behöver inte vara hela sanningen. Jag vill träffa dig — det står kvar.',
  },
  parental_alienation_pattern: {
    bankId: 'BP-PARENT-07',
    text_sv:
      'Bekräfta barnets känsla utan att angripa den andra. En mening räcker. Spara observationen.',
  },
  blame_relay: {
    bankId: 'BP-PARENT-01',
    text_sv: 'Skriv citat och tolkning separat. Beteende + datum — ingen etikett på motpart.',
  },
  separation_anxiety_signal: {
    bankId: 'BP-CRISIS-01',
    text_sv: 'Jag är här. Vi tar det lugnt en stund — du behöver inte förklara allt nu.',
  },
  unclear_source: {
    bankId: 'BP-PARENT-01',
    text_sv: 'Skriv citat och tolkning separat. Beteende + datum — ingen etikett på motpart.',
  },
};

function pickScript(tags: string[]) {
  for (const t of tags) {
    if (SCRIPT_BY_TAG[t]) return SCRIPT_BY_TAG[t]!;
  }
  return SCRIPT_BY_TAG.unclear_source!;
}

export const analyzeChildIncident = onCall({ region: 'europe-west1', memory: '256MiB' }, async (request) => {
  await guardSensitiveCallableV2(request, 'analyzeChildIncident', 40);

  const rawText = request.data?.rawText;
  if (!rawText || typeof rawText !== 'string') {
    throw new HttpsError('invalid-argument', 'Fältet "rawText" (string) krävs.');
  }
  if (rawText.length > 8000) {
    throw new HttpsError('invalid-argument', 'Texten får vara max 8000 tecken.');
  }

  const childAlias =
    typeof request.data?.childAlias === 'string' && request.data.childAlias.trim()
      ? request.data.childAlias.trim().slice(0, 48)
      : undefined;

  barnenGuard.assertCollections(['children_logs', 'entity_profiles']);

  const matches = scanBarnIncidentText(rawText.trim());
  const tagNames = matches.map((m) => m.tag);
  const script = pickScript(tagNames);

  const deepening =
    matches.length === 0
      ? 'Ingen tydlig mönstertag ännu. Spara citat och tolkning separat — beteende och datum räcker.'
      : `Möjliga mönster (beteende, inte diagnos): ${matches
          .slice(0, 3)
          .map((m) => BARN_INCIDENT_TAG_LABELS[m.tag])
          .join(' · ')}. Håll dig till barnets behov just nu — en mening.`;

  return {
    childAlias: childAlias ?? null,
    tags: matches.map((m) => ({
      patternId: m.patternId,
      tag: m.tag,
      label: m.label,
      weight: m.weight,
      questionCardId: m.questionCardId ?? null,
      scriptBankId: m.scriptBankId ?? null,
    })),
    deepening,
    childResponseScript: script.text_sv,
    bankId: script.bankId,
    truthMeta: formatIncidentMetaTruth(matches),
    analysisMode: 'heuristic' as const,
    flashUsed: false,
    heuristicVersion: BARN_INCIDENT_LIBRARY_VERSION,
    silo: 'barnen' as const,
  };
});
