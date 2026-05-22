# Grunder — utvärderingsresultat (U1–U5, Fas C)

**Datum:** 2026-05-22  
**Källor:** [`GRUNDER-UTVARDERING-UNDERAGENTER.md`](./GRUNDER-UTVARDERING-UNDERAGENTER.md), [`grunder-slides/INVENTAR.md`](./grunder-slides/INVENTAR.md), kod + specs  
**GCP-synk:** [`docs/GCP-KONSOLIDERING-BESLUT.md`](../../GCP-KONSOLIDERING-BESLUT.md)

---

## Slutrapport

### Stämmer med Grunder (runtime)

- **DCAP före LLM** — `kompis-supervisor.ts` → `analyzeDcap` → `routeFromDcap`
- **Tre silos + WORM** — separata RAG-vägar; Firestore append-only
- **Gräns-Arkitekten** — JADE/DARVO/gaslighting i `GRANS_ARKITEKTEN_SYSTEM_PROMPT`
- **BIFF/Grey Rock vid akut risk** — `riskScore >= 70` / ALERT → BIFF intent
- **Zero Footprint + Kill Switch** — `invalidateSession`, `useZeroFootprint`
- **Drive → kb_docs** — `driveIngestSynapse.ts` (ej `reality_vault`)
- **Gamification avvisad** — G05, G42 i INVENTAR

### Största GAP (prioritet)

1. **U1.5** — Indirect prompt injection ↔ projektion (G10) saknas i kanon (`sharedRules`/`DCAP`)
2. **U4.3** — RSD-Kylaren använder `KOMPIS_SYSTEM_PROMPT`, ingen dedikerad prompt
3. **U5.3** — Parental alienation (G52) saknas i `Barnen-SPEC.md`
4. **U5.5** — Kompis saknar routing till Barnen-modul (neutral ton)
5. **U2.5** — Human-in-the-loop (G38) vision-only; `dcap_alert` stub

### Nästa runtime (endast efter `kör [GAP]`)

- RSD dedikerad prompt i `sharedRules.ts`
- PA-referens i `Barnen-SPEC.md` § appendix
- Injection-parity notis i `.context/security.md` eller `sharedRules`

**Ej starta:** Genkit/Dotprompt (G01, G28, G29 vision-only).

---

## U1 — Hotvektorer

- **U1.1: PASS** — `kompis-supervisor.ts:22-40`
- **U1.2: PASS** — `cards/index.ts:278-283`
- **U1.3: PASS** — `sharedRules.ts:9-11`
- **U1.4: PASS** — Brusfiltret + BIFF → `agent_grans_arkitekten`
- **U1.5: FAIL** — G10 vision-only; ingen kanonisk injection↔projektion-notis

**Sammanfattning:** Hotvektor-försvar live via DCAP + Gräns-Arkitekten; injection-parity odokumenterad.

---

## U2 — Systemförsvar

- **U2.1: PASS** — ALERT → BIFF
- **U2.2: PASS** — Inga LLM auth-beslut
- **U2.3: PASS** — `dcap_alert` stub dokumenterad
- **U2.4: PASS** — Kill Switch + Zero Footprint
- **U2.5: PASS (GAP)** — G38 human fallback saknas i prod

**Sammanfattning:** Circuit breaker delvis (routing); eskalering/HITL vision-only.

---

## U3 — Life-OS och lager

- **U3.1: PASS** — Tre silor separata query-vägar
- **U3.2: PASS** — WORM i `firestore.rules`
- **U3.3: PASS** — Offentliga moduler utan valv-RAG
- **U3.4: PASS** — Drive → `kb_docs`
- **U3.5: PASS** — Gamification avvisat (G05, G42)

**Sammanfattning:** Life-OS-lager och silo stämmer mot arkiv-minne.

---

## U4 — Orkester och agenter

- **U4.1: PASS** — 10 cards
- **U4.2: PASS** — 2 executors
- **U4.3: FAIL** — RSD → Kompis-fallback prompt
- **U4.4: PASS** — 0 `.prompt`-filer
- **U4.5: PASS** — Genkit vision-only

**Sammanfattning:** ADK + cards matchar; RSD-prompt prioritet 1.

---

## U5 — Barn och domän

- **U5.1: PASS** — `children_logs` WORM owner-bound
- **U5.2: PASS** — Ingen cross-RAG med kampspar/valv
- **U5.3: FAIL** — G52 PA saknas i Barnen-SPEC
- **U5.4: PASS** — Dossier aggregerar barn-data
- **U5.5: FAIL** — Kompis barn-routing saknas

**Sammanfattning:** Silo 3 säker; PA-dokumentation och Kompis-routing GAP.

---

## Relaterade filer

| Fil | Åtgärd |
|-----|--------|
| [`GRUNDER-SYSTEMET-ANALYS.md`](./GRUNDER-SYSTEMET-ANALYS.md) | Kanon per slide G01–G52 |
| [`grunder-slides/INVENTAR.md`](./grunder-slides/INVENTAR.md) | Fas A register |
| [`Arkiv-GAP-REGISTER.md`](./Arkiv-GAP-REGISTER.md) | G15–G16 Grunder-GAP tillagda |

**BLOCKED:** Inget — read-only U1–U5 klart.
