# Fas 13 Sprint Autorun — Leverans till 19 juni 2026

**Syfte:** Smal 6-vågskö för att nå felfri, fullt användbar app (backend + frontend + kunskap + bevis). Ersätter **inte** historisk Master YOLO — kör **inte** `master:yolo --reset`.

**State:** [`.orkester/fas13-state.json`](../.orkester/fas13-state.json) (lokal, gitignored)  
**Logg:** `docs/evaluations/YYYY-MM-DD-fas13-vag-<id>.md`  
**Kanon:** [`SYSTEM_PLAN_v2.md`](./SYSTEM_PLAN_v2.md) · [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) · [`.context/security.md`](../.context/security.md)

---

## Begränsning

| Mekanism | Utan dig? |
|----------|-----------|
| `npm run orkester:night` | **Ja** |
| Agent-vågar (YOLO) | **Ja** om Agent-chatt öppen |
| `firebase deploy` | **Ja** om policy tillåter; annars logga blocker |
| Manuell smoke våg 6 (Motorola) | **Nej** |

---

## Säkerhetsblock (MUST i varje superprompt)

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

## Vågkö

| # | ID | Scope | Smoke-extra | Deploy |
|---|-----|-------|-------------|--------|
| 0 | `baseline` | design-modules, `npm ci`, 9 TS-fel → 0 | `orkester:night`, `typecheck:core-strict` | none |
| 1 | `security-12c` | Vault-gate `weeklySummary` + `compass` | `smoke:valv-gate`, `smoke:valv-security`, `smoke:compass` | `functions:weeklySummary,functions:compass` |
| 2 | `worm-medium` | `inboxPersist.ts` + `VaultService.ts` WORM-align | `smoke:vault-worm`, `smoke:inkast` | `hosting` om client |
| 3 | `evidence-e2e` | Dossier BBIC/LEGAL, Valv desync, Hamn/Gräns | `smoke:dossier`, `smoke:grans`, `smoke:hamn`, `smoke:valv`, `smoke:valv-mode` | `functions:generateDossier` + `hosting` |
| 4 | `kunskap-rag` | RAG våg 8–23 verifiering | `smoke:kunskap`, `smoke:innehall`, `smoke:pattern-library` | none |
| 5 | `final-gate` | Full regression + plausible deniability | `smoke:all`, `smoke:plausible-deniability` | `hosting` + ev. functions |
| 6 | `user-signoff` | Manuell Motorola-checklista | USER #3, #4, Dossier PDF | — |

**Defer efter sprint:** Barnporten push, Genkit V1, `/oversigt` merge, hex-städ, Vite chunk-split.

---

## Standard smoke (efter kod per våg)

```bash
npm run build
cd functions && npm run build && cd ..
npm run smoke:locked-ux && npm run smoke:orkester
```

Lägg till **smoke-extra** från tabellen.

---

## Start (terminal)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
export FAS13_AUTORUN=1
```

---

## Per-våg Agent-prompt (mall)

```
FAS 13 SPRINT — våg <waveId>. Läs docs/FAS13-SPRINT-AUTORUN.md och .orkester/fas13-state.json.
Implementera ENDAST scope för våg <waveId>. PMIR-stopp enligt FAS13.
Efter kod: standard smoke + smoke-extra. Vid PASS: uppdatera fas13-state.json och skriv docs/evaluations/YYYY-MM-DD-fas13-vag-<waveId>.md.
Vid deploy: endast named functions enligt tabell — aldrig full functions utan lista.
[SÄKERHETSBLOCK]
```

---

## Handoff (ny chatt)

1. Läs `.orkester/fas13-state.json` — `nextWaveId`, `completedWaves`, `failures`
2. Senaste `docs/evaluations/*-fas13-vag-*.md`
3. Kör **en** våg — inte om hela kön om `status: done`

---

## Relaterat

- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal nattpass
- [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md) — historisk kö (done, kör inte om)
- [`.cursor/agents/orkester-conductor.md`](../.cursor/agents/orkester-conductor.md)
