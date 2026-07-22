# PMIR-C — P6 Dossier Flow-tidslinje

**Datum:** 2026-06-18 · **Status:** **IMPLEMENTERAD + DEPLOYAD** (smoke:dossier E2E PASS 2026-06-18) — Pontus godkänd 2026-06-18  
**Route:** `/valvet` → dossier-export · **Callable:** `generateDossier` (befintlig)  
**Parallellt med:** [PMIR-B P4 MåBra](./2026-06-18-pmir-b-p4-mabra-flow-parafras.md) · Worker **C**

---

## 1. Executive summary

P6 fördjupar **strukturerad AI-tidslinje** i dossier-export — bygger på P2 LOCK (`dossierAiForeword` foreword + timeline JSON). Ingen WORM-mutation; `documentHash` påverkas **inte** av AI-lagret.

**Baseline (redan live):** `generateDossierAiForeword` returnerar `{ foreword, timeline[] }`; PDF renderar tidslinje; P3 `pattern_scan_metadata` kan summeras via `buildTacticSummaryForVaultIds`.

**Delta (denna PMIR):** Rikare tidslinje (källhänvisning, P3-taktik-taggar), smoke med `includeAiForeword: true`, valfri förhandsvisning i `DossierPage`.

---

## 2. Beslut


| Fält        | Värde                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- |
| Scope       | `generateDossierInternal` + `dossierAiForeword` + dossier-UI — **ingen** ny callable         |
| WORM        | `reality_vault` / `children_logs` / `journal` oförändrade; endast `dossier_snapshots` append |
| Hash        | `documentHash` = kanoniska entries only — AI foreword/timeline **utanför** hash              |
| P3-koppling | Inkludera `tacticSummary` + valfri metadata-rad per vault-post i LLM-prompt                  |
| Schema      | `timeline[]`: `{ date, fact, sourceRef? }` — max 12 rader, datum YYYY-MM-DD eller `okänt`    |
| Ton         | Klinisk, lågaffektiv — inga diagnoser, inga partietiketter (samma som P2)                    |
| Rate        | Behåll `generateDossier` 5/timme                                                             |
| Kredit      | ~400–800 Vertex per export med `includeAiForeword: true`                                     |


---

## 3. Worker C — disjunkt filset


| Fil                                                                                  | Roll                                                    |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `functions/src/lib/dossierAiForeword.ts`                                             | Timeline-schema, prompt, parse, fallback                |
| `functions/src/lib/generateDossierInternal.ts`                                       | Passera tacticSummary till foreword; snapshot metadata  |
| `functions/src/lib/dossierPdf.ts`                                                    | Rendera utökad timeline (sourceRef fotnot)              |
| `functions/src/callables/valv.ts`                                                    | `generateDossier` — endast om payload-validering behövs |
| `src/modules/features/lifeJournal/evidence/vault/dossier/components/DossierPage.tsx` | Förhandsvisning timeline (valfritt)                     |
| `src/modules/features/lifeJournal/evidence/vault/dossier/api/dossierService.ts`      | Typ för timeline preview                                |
| `scripts/smoke_dossier.mjs`                                                          | `includeAiForeword: true`-gren + timeline guards        |


**Worker C får INTE röra:** `mabra`*, `mabraCoach`, `mabraContentBank`, `wellbeing/mabra/*`, `firestore.rules`.

---

## 4. Implementation-skiss

1. **Prompt:** Utöka `summarizeEntriesForLlm` med `technique` från `buildTacticSummaryForVaultIds` per post.
2. **Schema:** Lägg till valfritt `sourceRef` i `DOSSIER_AI_SCHEMA` (max 80 tecken).
3. **PDF:** Tidslinje-rad `YYYY-MM-DD — fakta [ref: reality_vault/…]` när `sourceRef` finns.
4. **Snapshot:** `parameters.timelineRowCount` (metadata, ej WORM-innehåll).
5. **UI:** Checkbox «Visa AI-tidslinje i förhandsgranskning» — endast när `includeAiForeword` aktiv.

---

## 5. Regelanalys


| Lager          | Status                                                        |
| -------------- | ------------------------------------------------------------- |
| WORM U3        | PASS — append-only `dossier_snapshots`; inga updates på vault |
| Sacred Dossier | PASS — hash-kedja oförändrad                                  |
| Domän HCF      | PASS — beteende + datum, aldrig diagnos på motpart            |
| Valv session   | PASS — `vaultSessionToken` krävs (befintlig gate)             |
| P2 LOCK        | MUST NOT — bryt inte `includeAiForeword`-kontrakt utan ny CP  |


---

## 6. Smoke

```bash
cd functions && npm run build
npm run smoke:dossier
npm run smoke:valv-security
npm run smoke:vault-worm
npm run smoke:pattern-metadata   # P3-koppling
npm run smoke:locked-ux
```

**Ny guard (smoke_dossier.mjs):** `timeline` i `dossierAiForeword.ts`; valfri E2E med `includeAiForeword: true` (rate-limit tolerant fallback till statisk guard).

---

## 7. Deploy

```bash
cd functions && npm run build
firebase deploy --only functions:generateDossier,hosting
```

Kombinerad deploy med P4 tillåten **efter** båda smoke PASS.

---

## 8. MUST NOT

- Mutera `reality_vault` / `children_logs` / `journal` vid dossier-generering
- Inkludera AI-text i `documentHash` eller kanonisk PDF-beviskedja
- Diagnos-etiketter på motpart i timeline
- Cross-RAG från dossier till MåBra/Kunskap
- Ändra `firestore.rules` utan explicit Pontus-OK

---

## 9. Rekommendation

- [x] Godkänn PMIR-C för implementation (Worker C)
- [x] Flow-prototyp tidslinje-JSON i Google Flow (valfritt)
- [x] Kombinera deploy med PMIR-B

**Efter smoke PASS:** ny rad **P6** LOCK i `LIFE-OS-BUILD-STATE.md` (eller utöka P2-rad med P6-notis).

---

## 10. Godkännande

**Pontus:** ja☑ godkänn PMIR-C · ☐ justera scope  
**Datum:** ___20260618