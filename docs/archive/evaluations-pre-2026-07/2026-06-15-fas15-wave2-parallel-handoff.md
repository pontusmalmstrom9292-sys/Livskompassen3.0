# Fas 15 våg 2 — Parallell handoff — 2026-06-15

**Status:** Deploy klar · Fas 14 fem-spår **done** · våg 2 **redo att starta**  
**Orkestrator:** denna fil · kanon: [`FAS14-PARALLEL-EXPERT-PLAN.md`](../FAS14-PARALLEL-EXPERT-PLAN.md)

---

## Deploy denna session (PASS)

| Steg | Kommando | Resultat |
|------|----------|----------|
| Inkast hosting | `firebase deploy --only hosting` | **PASS** — https://gen-lang-client-0481875058.web.app |
| MåBra rules | `firebase deploy --only firestore:rules` | **PASS** |
| MåBra coach | `firebase deploy --only functions:mabraCoach` | **PASS** |
| Post-deploy | `npm run smoke:mabra` | **PASS** |

**Commit:** `35dfda590` — Fas 15 Inkast I1/I3 + Fas 16 våg 24 bank KEEP · på `origin/main`.

---

## Fas 14 — klart (upprepa ej)

| Chat | Spår | Eval |
|------|------|------|
| 1 | 14B Security | `2026-06-15-fas14-chat1-security-14b.md` |
| 2 | 14C UX | `2026-06-15-fas14-chat2-ux-14c.md` |
| 3 | 15 ADK Inkast plan | `2026-06-15-fas14-chat3-adk-15.md` |
| 4 | 16 Innehåll plan | `2026-06-15-fas14-chat4-innehall-16.md` |
| 5 | 17 Smoke | `2026-06-15-fas14-chat5-smoke-17.md` |

---

## Klart vs öppet (våg 2 scope — ej Fas 14)

### Klart (2026-06-15)

| Område | Bevis |
|--------|-------|
| Fas 15 Inkast **I1/I3** routing (minimal) | `2026-06-15-fas15-inkast-i1-i3.md` · `smoke:inkast` PASS |
| Fas 16 våg 24 **bank KEEP** (6 FACT) | `Kunskap-CONTENT-SEED.md` · `CONTENT-WAVES.md` rad 24 |
| MåBra 3.0 rules + `mabraCoach` deploy | `smoke:mabra` PASS |
| App Check **registrering** (web reCAPTCHA + debug token) | Fas 13 hosting · `appCheck.ts` · `SMOKE_RESULTS.md` |
| Smoke baseline Fas 13 | `orkester:night` · `smoke:all` · `typecheck:core-strict` **0 fel** |
| 14B plausible deniability audit | `smoke:plausible-deniability` PASS — ingen kodändring |
| 17.1 Vite lazy-load Valv/Familjen | redan i `AppRoutes.tsx` |
| 17.2 typecheck steg 1 (`core/**`) | PASS |

### Öppet (våg 2)

| ID | Spår | Blocker / gate |
|----|------|----------------|
| **16b** | Våg 24 **ingest** (`seed:kunskap-facts`) | PMIR om >3 filer utöver seed |
| **15b** | Inkast I2 — inbox queue UX polish (minimal) | Ej `firestore.rules` |
| **17b** | `typecheck:core-strict` steg 2 (`shared/**`) | Ingen feature-logik |
| **14B.1b** | `APP_CHECK_ENFORCE=true` + callable deploy | **Sist** — explicit Pontus OK |
| **18a** | Android `cap sync` + Motorola-smoke rad | Efter hosting stabil |
| **DEFER** | Legacy `vault` rules-borttagning | Prod-koll + `generateWeeklyInsights` migrerad |

---

## Startordning (MUST)

```
Steg 0 — Baseline (en chatt, ~15 min)
  npm run orkester:night
  → dokumentera i SMOKE_RESULTS.md om FAIL

Steg 1 — Parallellt (A + C + D)
  Öppna tre Cursor-chattar samtidigt
  Vänta tills alla tre rapporterar PASS eller blocker

Steg 2 — Android (E, valfritt parallellt med steg 1 om du orkar)
  Efter hosting stabil · cap sync · manuell Motorola-rad

Steg 3 — App Check enforce (B) SIST
  Endast om Pontus säger OK i chatten
  Eget fönster · manuell inloggning + LLM-smoke efter deploy
```

**Fredag:** `npm run orkester:night` + veckogate · **sön:** PMIR vid >3 filer/rules.

---

## Våg 2 — fem parallella spår

| # | Specialist | Fas | Scope | Får skriva | Får INTE |
|---|------------|-----|-------|-----------|----------|
| **0** | `specialist-smoke-runner` | 17b.0 | Baseline gate före parallell | `scripts/smoke_*`, `SMOKE_RESULTS.md`, `package.json` smoke | Feature-logik |
| **A** | `specialist-kunskap-seed` | 16b | Våg 24 ingest | `Kunskap-CONTENT-SEED.*`, `seed_kampspar_profile.mjs`, `CONTENT-WAVES.md`, `INNEHALL-REGISTER.md` | rules, UI, agent routing |
| **B** | `specialist-security-auditor` | 14B.1b | App Check enforce | `functions/.env.*` (lokal), `callableGuards.ts`, DEPLOY-rad | `firestore.rules` utan Pontus OK · UI |
| **C** | `specialist-adk-weaver` | 15b | Inkast I2 / inbox queue UX | `src/modules/inkast/**`, `CaptureSuperModule.tsx`, `smoke_inkast_lockdown.mjs` | rules · locked UX-kärna · content banks |
| **D** | `specialist-smoke-runner` | 17b | typecheck steg 2 | `tsconfig.core-strict.json`, `src/modules/shared/**` (TS-fix only) | Feature-beteende · nya routes |
| **E** | `specialist-ux-guardian` | 18a | Android cap sync + Motorola | `android/`, `capacitor.config.ts`, smoke-rad i eval | rules · backend |

---

## Säkerhetsblock (klistra in varje chatt)

```
SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän vågen PASS eller blocker dokumenterad.
```

---

## Copy-paste-prompter

### Chatt 0 — Baseline (kör FÖRST, ensam)

```
Du är specialist-smoke-runner för Livskompassen v2 Fas 17b.0 — våg 2 baseline.

Läs: docs/SMOKE_RESULTS.md (current truth) · docs/evaluations/2026-06-15-fas15-wave2-parallel-handoff.md

Uppgift:
1. Kör npm run orkester:night från projektrot.
2. Om FAIL: fixa endast smoke-scripts/config (inte feature-logik) eller dokumentera blocker.
3. Uppdatera docs/SMOKE_RESULTS.md med datum 2026-06-15 och resultat.
4. Skriv kort eval: docs/evaluations/2026-06-15-fas15-wave2-chat0-baseline.md

Får skriva: scripts/smoke_*.mjs, package.json (smoke scripts), SMOKE_RESULTS.md
Får INTE: src/features, firestore.rules, content-banker

SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän orkester:night PASS eller blocker dokumenterad.
```

---

### Chatt A — Kunskap våg 24 ingest (parallell steg 1)

```
Du är specialist-kunskap-seed för Livskompassen v2 Fas 16b — våg 24 ingest.

Läs:
- docs/evaluations/2026-06-15-content-wave-24-plan.md
- docs/specs/modules/Kunskap-CONTENT-SEED.md (batch våg 24 — jur-005..007, ep-006, cn-022, bh-013)
- docs/INNEHALL-REGISTER.md · docs/content/CONTENT-WAVES.md
- .context/domän-covert-narcissism.md (FACT utan diagnos-etiketter)

Uppgift:
1. Verifiera bank KEEP i Kunskap-CONTENT-SEED.json (6 poster).
2. Kör npm run seed:kunskap-facts (--skip-existing).
3. Smoke: npm run smoke:innehall && npm run smoke:content-waves && npm run smoke:kunskap
4. Uppdatera CONTENT-WAVES.md rad 24: bank KEEP → ingest PASS.
5. Eval: docs/evaluations/2026-06-15-fas16-wave24-ingest.md

Får skriva: Kunskap-CONTENT-SEED.*, scripts/seed_kampspar_profile.mjs, CONTENT-WAVES.md, INNEHALL-REGISTER.md (status)
Får INTE: firestore.rules, UI, sharedRules.ts, cross-silo routing

MUST NOT: BIFF-coaching i Kunskap · etikettera motpart · fjärde RAG-silo

SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän ingest + smoke PASS eller blocker dokumenterad.
```

---

### Chatt B — App Check enforce (SIST — endast efter Pontus OK)

```
Du är specialist-security-auditor för Livskompassen v2 Fas 14B.1b — App Check enforce.

Läs:
- docs/evaluations/2026-06-15-fas14-chat2-security-14b.md
- docs/DEPLOY.md §1.4
- functions/src/callableGuards.ts · src/modules/core/firebase/appCheck.ts

FÖRUTSÄTTNING: Pontus har sagt OK till fail-closed prod i chatten. Annars STOP — dokumentera blocker only.

Uppgift (minimal):
1. Sätt APP_CHECK_ENFORCE=true i functions/.env.gen-lang-client-0481875058 (gitignored — committa INTE).
2. cd functions && npm run build
3. Deploy callables enligt DEPLOY.md §1.4 (issueVaultSession, valvChatQuery, analyzeMessage, knowledgeVaultQuery, childrenLogsQuery, speglingsMirror, mabraCoach, generateDossier, weaveJournalEntry, mabraCoach, …).
4. Påminn Pontus: Console → App Check → Cloud Functions → Enforce.
5. Smoke: npm run smoke:mabra && npm run smoke:kunskap && npm run smoke:valv-security
6. Eval: docs/evaluations/2026-06-15-fas14b-appcheck-enforce.md

Får skriva: functions/.env.* (lokal), callableGuards.ts om bugfix nödvändig
Får INTE: firestore.rules · UI-ändringar utan UX-guardian · force-push

Gör INTE om: Web reCAPTCHA-registrering, debug token, hosting rebuild — redan klart Fas 13.

SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän enforce deploy + smoke PASS eller blocker dokumenterad.
```

---

### Chatt C — Inkast I2 / inbox queue UX (parallell steg 1)

```
Du är specialist-adk-weaver för Livskompassen v2 Fas 15b — Inkast I2 minimal polish.

Läs:
- docs/evaluations/2026-06-15-fas15-inkast-i1-i3.md (I1/I3 done — rör ej routing-kärna)
- docs/evaluations/2026-06-15-fas14-chat3-adk-15.md
- .context/domän-covert-narcissism.md (~80% upload-prior)
- src/modules/inkast/components/InboxReviewQueue.tsx

Uppgift (minimal scope — ingen ny feature):
1. Polish inbox review queue UX: tydligare routing-etikett, HITL-status, domän-hint vid review-kö.
2. Behåll DCAP före LLM · HITL · ingen auto-promote barn→Valv.
3. Uppdatera smoke om nödvändigt: scripts/smoke_inkast_lockdown.mjs, smoke_inbox_sort.mjs
4. Smoke: npm run smoke:inkast && npm run smoke:inbox
5. Om UI rör Familjen/Valv-länkar: npm run smoke:locked-ux
6. Eval: docs/evaluations/2026-06-15-fas15-inkast-i2.md

Får skriva: src/modules/inkast/**, CaptureSuperModule.tsx (copy/hints only), smoke_inkast*
Får INTE: firestore.rules, navTruth, locked BarnfokusFraganPanel, content banks, cross-RAG

MUST NOT: Ny frågekort-bank · auto-promote barnlogg → Valv · LLM routing-beslut

SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän smoke PASS eller blocker dokumenterad.
```

---

### Chatt D — typecheck steg 2 shared (parallell steg 1)

```
Du är specialist-smoke-runner för Livskompassen v2 Fas 17b — typecheck:core-strict steg 2.

Läs:
- docs/evaluations/2026-06-15-fas14-chat5-smoke-17.md (steg 1 done — 0 fel core/**)
- tsconfig.core-strict.json
- src/modules/shared/**

Uppgift:
1. Utöka tsconfig.core-strict.json include till src/modules/shared/** (behåll core/**).
2. Fixa TS-fel i shared/ — typer only, ingen beteendeändring.
3. Kör npm run typecheck:core-strict tills 0 fel.
4. Gate: npm run build (ska fortfarande PASS).
5. Eval: docs/evaluations/2026-06-15-fas17-typecheck-shared.md

Får skriva: tsconfig.core-strict.json, src/modules/shared/** (TS-fix)
Får INTE: features/, routing, firestore.rules, ny feature-logik

SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän typecheck:core-strict PASS (0 fel) eller blocker dokumenterad.
```

---

### Chatt E — Android Motorola (efter hosting, valfritt parallellt)

```
Du är specialist-ux-guardian för Livskompassen v2 Fas 18a — Android cap sync + Motorola-smoke.

Läs:
- docs/evaluations/2026-06-15-fas13-vag-6-user-signoff.md
- .context/android-capacitor.md
- docs/OFFLINE-ANDROID.md

Uppgift:
1. npm run build:web && npx cap sync android
2. Verifiera google-services.json client_type:1 · SHA-1 noterad om auth-strul.
3. Förbered Motorola-checklista (6 rader) — Pontus kör manuellt på telefon.
4. Uppdatera SMOKE_RESULTS.md Android-rad om cap sync PASS.
5. Eval: docs/evaluations/2026-06-15-fas18-android-cap-sync.md

Får skriva: android/ sync-artefakter, eval, SMOKE_RESULTS rad
Får INTE: firestore.rules, backend callables, locked UX-kärna

Smoke (agent): npm run build:web · cap sync exit 0
Smoke (USER): inloggning native Google · Valv #3 · Barnporten #4

SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän cap sync PASS + Motorola-checklista klar eller blocker dokumenterad.
```

---

## Veckogate & PMIR

| Trigger | Åtgärd |
|---------|--------|
| >3 filer eller `firestore.rules` | PMIR per `docs/MERGE-IMPACT-RAPPORT.md` · vänta **godkänn merge** |
| Fredag | `npm run orkester:night` |
| Alla spår PASS | Uppdatera denna fil → status **våg 2 done** |

---

## Relaterat

- [`FAS14-PARALLEL-EXPERT-PLAN.md`](../FAS14-PARALLEL-EXPERT-PLAN.md)
- [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)
- [`.context/system-plan.md`](../../.context/system-plan.md)
