# Barnhubben — Fas A byggplan (syntes R1–R5)

**Datum:** 2026-07-20  
**Plattform:** Cursor · **Status:** Research klar · **Ingen prod-kod ännu**  
**Kräver innan kod:** Pontus OK + unlock `MOD-FAM-HUB`/`MOD-FAM-BARN` + PMIR där rules/prompt rörs

## Källor

| ID | Fil |
|----|-----|
| R1 | `2026-07-20-barnhub-research-R1-barn.md` |
| R2 | `2026-07-20-barnhub-research-R2-medforalder.md` |
| R3 | `2026-07-20-barnhub-research-R3-psykoed.md` |
| R4 | `2026-07-20-barnhub-research-R4-fragkort.md` + schema JSON |
| R5 | `2026-07-20-barnhub-research-R5-incident-motor.md` |

## Produktprincip (låst)

- **En knapp:** «Skriv vad som hände» i Familjen Superhub (nytt läge, inte ny toppflik).
- **Tre svar:** kort förklaring · vad säga till barnet · ett frågekort.
- **Gratis:** heuristik först; Flash valfritt (1×); Fas A kan vara LLM=0.
- **Minne:** WORM till samma `children_logs` → stärker lexical RAG. Ingen cross-RAG. Vector deferred.
- **Lås:** tillfällig unlock → bygg → smoke → re-lock + ny `MOD-FAM-INCIDENT`.

## Fas A — exakt leveransordning

### A0 — Gate
1. Unlock-eval för `MOD-FAM-HUB` + `MOD-FAM-BARN` (`approved: yes` + Pontus OK).
2. PMIR om nya `children_logs`-fält eller `sharedRules`-prompt (annars minimal path: `category=incident` redan inom allowlist om `category` finns).

### A1 — Bank (0 API)
1. R3 Fas A scripts → KEEP i `Barnen-PLAY-BANK` / catalog overlay (specialist-barn-lek).
2. R4 **11 fasA-kort** (akut + vad hände) som overlay — rör inte `BARNFOKUS_QUESTIONS`.
3. R2 länkkort: Hamn / Speglar / SOS (copy + `Navigate`).

### A2 — Incident UI (Familjen)
1. Nytt Superhub-läge `incident` i `familjenInputModes` + delegate.
2. Fri text → lokal heuristik (R5 `bh-*`) → visa 3 panelblock.
3. Spara WORM `children_logs` med epistemik `[citat]`/`[tolkning]`, `category: 'incident'`.
4. Child picker oförändrad (Kasper/Arvid).

### A3 — Backend (tunn)
1. Callable `analyzeChildIncident` — **heuristik-only** i Fas A (`flashUsed=false`).
2. Silo-guard `barnen`; rate-limit; ingen Valv-läsning.
3. Unit-test på Kasper-exemplet (R5).
4. Smoke-skiss `smoke:child-incident` (offline).

### A4 — Lås
1. `smoke:children` · `smoke:barn-epistemik` · `smoke:locked-ux` · `smoke:module-lock` · `smoke:cost-guard` · `smoke:governance`.
2. Re-lock MOD-FAM-* + registrera `MOD-FAM-INCIDENT`.

## DoD Fas A

- [ ] Fri text → stöd inom ~10 s (heuristik; Flash optional senare)
- [ ] WORM i `children_logs` + epistemik
- [ ] Noll cross-RAG / noll diagnosetikett
- [ ] Locked Barnfokus intakt
- [ ] All ny kod låst
- [ ] Kostnad: 0 nya betal-API:er

## Explicit INTE i Fas A

- BIFF-motor i Barnhub (länk Hamn)
- Vector på `children_logs`
- Kryptering av `childAlias`
- Ny route `/barnhub`
- Progression/milstolpar (Fas C)

## Nästa steg för Pontus

Säg **«bygg Fas A»** (eller **KEEP bank först** om du vill godkänna R3-scripts innan kod).
