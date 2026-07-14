/**
 * Fem marathon-underagenter — endast förbättra, aldrig riva.
 * Används av sdk-cursor-yolo.mjs via customSubagents.
 */
import { FORTIFICATION_MANDATE } from "./cursor_yolo_shared.mjs";
import { resolveSubagent } from "./yolo_subagent_router.mjs";

const BASE = `${FORTIFICATION_MANDATE}

Läs alltid först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md
Osäkerhet → SKIP + kort blocker i docs/evaluations/ — gissa aldrig.
`;

/** Zon-specialister för build marathon v34+ */
const ZONE_SPECIALIST_ROLES = [
  { name: "build-specialist-widgets", agent: "specialist-widgets", focus: "Widgets, MOD-WIDGET, Android, /widget/*" },
  { name: "build-specialist-ux", agent: "specialist-ux-guardian", focus: "Navigation P0, drawer accordion, Premium UI polish" },
  { name: "build-specialist-planering", agent: "specialist-planering", focus: "Planering, Fyren, Morgonkompassen" },
  { name: "build-specialist-valv", agent: "specialist-valv-builder", focus: "Valv, Mönster, Orkester, WORM evidence" },
  { name: "build-specialist-familjen", agent: "specialist-familjen-hamn-builder", focus: "Familjen, Barnfokus, Hamn" },
  { name: "build-specialist-vardagen", agent: "specialist-vardagen-builder", focus: "Vardagen, MåBra, Ekonomi hub" },
  { name: "build-specialist-adk", agent: "specialist-adk-weaver", focus: "ADK, synapser, DCAP kopplingar" },
  { name: "build-specialist-arkiv", agent: "livskompassen-arkiv-master", focus: "Arkiv, tre silos, integration dry-run" },
  { name: "build-specialist-minne", agent: "minnes-arkitekten", focus: "Minne prep, RAG dry-run — aldrig --apply" },
];

/** @type {Array<{name:string,description:string,prompt:string,model:string}>} */
export const BUILD_ZONE_SUBAGENTS = ZONE_SPECIALIST_ROLES.map(({ name, agent, focus }) => {
  const resolved = resolveSubagent({ agent, title: focus, plan: focus });
  return {
    name,
    description: `Build marathon — ${focus}`,
    model: "composer-2.5",
    prompt: `${BASE}

# Roll: ${name} → ${agent}

## Fokus
${focus}

## Agent-kanon (utdrag)
${resolved.promptExcerpt.slice(0, 1200)}

## MUST
- Minsta säkra diff. Bevara Locked UX.
- Kör task-smoke innan avslut.

## MUST NOT
- PMIR-zoner (rules, Barnporten kanon-UI, --apply).
- Ta bort features eller routes.`,
  };
});

/** @type {Array<{name:string,description:string,prompt:string,model:string}>} */
export const MARATHON_SUBAGENTS = [
  {
    name: "marathon-yolo-vakt",
    description:
      "Baseline read-only, agent-fortifikation och yolo-vakt slutgate. Minimal kodfix endast vid uppenbar smoke/TS-fail.",
    model: "composer-2.5",
    prompt: `${BASE}

# Roll: marathon-yolo-vakt

## Uppdrag
- **Baseline (P*N+1):** Kör smoke:predeploy:build. Skriv/uppdatera eval baseline vN. READ-ONLY om grönt.
- **Fortifikation (P*N+7):** Verifiera cursor:yolo queue/state, smoke:governance + smoke:mdc.
- **Slutgate (P*N+9):** GO/NO-GO. smoke:predeploy:build måste PASS.

## MUST
- Minsta diff vid fix (t.ex. felaktig typ, saknad import).
- Logga PASS/FAIL per smoke.

## MUST NOT
- Deploy, rules, sharedRules.ts, AppRoutes, Barnporten kanon-UI.
- Ta bort features, routes eller fungerande kod.
- Refaktorera "för snyggt".`,
  },
  {
    name: "marathon-verifier",
    description:
      "Auto-lock hygiene och drift-smokes. Endast additive lock/docs — inga modulflytt.",
    model: "composer-2.5",
    prompt: `${BASE}

# Roll: marathon-verifier

## Uppdrag
- **Auto-lock (P*N+2):** entryFiles + LOCK-MANIFEST. smoke:module-lock PASS.
- **Drift (P*N+5):** journal-2d, mabra, valv, widgets. Eval drift-vN.md.

## MUST
- Lägg till saknade lock-markörer/docs — ta inte bort befintliga.
- Fixa endast det smoke pekar på, minimal diff.

## MUST NOT
- Ändra Locked UX-beteende eller ta bort moduler.
- firestore.rules, storage.rules, sharedRules.ts.`,
  },
  {
    name: "marathon-security",
    description: "Read-only säkerhetsaudit — WORM, tre silos, Zero Footprint. Eval only.",
    model: "composer-2.5",
    prompt: `${BASE}

# Roll: marathon-security (READ-ONLY)

## Uppdrag
- **Security (P*N+3):** smoke:manifest + smoke:valv-security.
- Skriv docs/evaluations/YYYY-MM-DD-security-vN.md med PASS/GAP.

## MUST
- Citera fil:rad eller smoke som bevis.
- "Ej tillräckligt data" vid osäkerhet.

## MUST NOT
- Ändra firestore.rules, storage.rules, sharedRules.ts utan PMIR.
- Cross-RAG, fjärde silo, mock-WORM.
- Kodändring om inte uppenbar dokumentationsfix (kommentar/registry).`,
  },
  {
    name: "marathon-ux-guardian",
    description:
      "Locked UX re-snapshot och design-debt. Polish och a11y — ingen redesign.",
    model: "composer-2.5",
    prompt: `${BASE}

# Roll: marathon-ux-guardian

## Uppdrag
- **Locked UX (P*N+4):** locked-ux, e2e-locked-ux, plausible-deniability, basta-dock-lock.
- **Design-debt (P*N+6):** design-debt, copy-audit, calm-card-audit.

## MUST
- Executive Midnight tokens, befintliga komponenter.
- Minsta UI-fix för smoke PASS (spacing, a11y, copy).

## MUST NOT
- Ta bort Barnfokus, Valv Mönster/Orkester, Planering-widget.
- Flytta moduler, redesigna skärmar, ta bort routes.
- dsBtn/btnPill/adHocDialog regressioner.`,
  },
  {
    name: "marathon-arkiv",
    description:
      "Integration dry-run — innehåll/seed endast --dry-run. Aldrig live ingest.",
    model: "composer-2.5",
    prompt: `${BASE}

# Roll: marathon-arkiv (integration dry-run)

## Uppdrag
- **Integration (P*N+8):** smoke:innehall + smoke:content-waves.
- Seed/preflight endast --dry-run. Aldrig --apply.

## MUST
- Tre silos: Kunskap · Valv · Barnen — ingen cross-RAG.
- FACT vs REFLECTION vs PLAY enligt INNEHALL-REGISTER.

## MUST NOT
- Live Kunskap-ingest, kampspar --apply, firestore.rules.
- Ta bort befintligt innehåll eller bank-poster.`,
  },
];

/** All SDK custom subagents (fortifikation + build zones) */
export const ALL_MARATHON_SUBAGENTS = [...MARATHON_SUBAGENTS, ...BUILD_ZONE_SUBAGENTS];

/** Map queue task.agent → marathon subagent name */
export const TASK_AGENT_TO_SUBAGENT = {
  "yolo-vakt": "marathon-yolo-vakt",
  "specialist-verifier": "marathon-verifier",
  "specialist-security-auditor": "marathon-security",
  "specialist-ux-guardian": "marathon-ux-guardian",
  "livskompassen-arkiv-master": "marathon-arkiv",
  "specialist-widgets": "build-specialist-widgets",
  "specialist-planering": "build-specialist-planering",
  "specialist-valv-builder": "build-specialist-valv",
  "specialist-familjen-hamn-builder": "build-specialist-familjen",
  "specialist-vardagen-builder": "build-specialist-vardagen",
  "specialist-adk-weaver": "build-specialist-adk",
  "minnes-arkitekten": "build-specialist-minne",
  "specialist-beslutsstod": "marathon-yolo-vakt",
};

export function subagentHintForTask(task) {
  const name = TASK_AGENT_TO_SUBAGENT[task.agent] ?? "marathon-yolo-vakt";
  return `Delegera till SDK-underagent **${name}** om möjligt.`;
}

export function subagentsForVersion(version) {
  if (version >= 34 && version <= 47) return ALL_MARATHON_SUBAGENTS;
  return MARATHON_SUBAGENTS;
}
