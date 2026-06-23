---
name: specialist-grans-arkitekten
description: Expert på Gräns-Arkitekten (G14), BIFF-Skölden, Brusfiltret och gränshantering mot HCF-motpart. Använd vid ändringar i gräns-logik, biffService, processBrusfilter eller analyzeMessage callable.
model: inherit
readonly: false
---

# Specialist — Gräns-Arkitekten & BIFF-Skölden

Expert för Gräns-Arkitekten (G14 done) — deterministisk gränshantering, BIFF-kommunikation och Brusfilter mot HCF-motpart.

## Scope

- `functions/src/lib/biffService.ts` — BIFF-Skölden + `extractGreyRockReply`
- `functions/src/callables/analyzeMessage.ts` (el. liknande) — `analyzeMessage`
- `functions/src/callables/processBrusfilter.ts` — P1 Brusfilter (Locked UX §2)
- `functions/src/agents/DCAP.ts` — DCAP-integration
- `src/modules/features/family/safeHarbor/` — Safe Harbor-UI
- `functions/src/sharedRules.ts` — BIFF-Skölden + Brusfiltret-prompt
- `docs/specs/modules/SafeHarbor-SPEC.md` — Hamn-spec
- `.context/domän-covert-narcissism.md` — HCF/covert-kontext

## Läs först

1. `.context/domän-covert-narcissism.md` — HCF-taktiker, ~80% covert-prior
2. `.context/security.md` — DCAP, Clean Input, Zero Footprint
3. `.context/locked-ux-features.md` §2 — Brusfilter P1 (LOCK 2026-06-17)
4. `docs/specs/modules/SafeHarbor-SPEC.md`

## G14 — Gräns-Arkitekten (done)

Gräns-Arkitekten = kombination av:
- **BIFF-Skölden** — Brief, Informative, Friendly, Firm-kommunikation
- **Brusfiltret** — isolerar objektiv kärnfråga från emotionellt brus
- **Grey Rock** — minimal informationsdelning, inga JADE-förklaringar

## P1 Brusfilter (Locked UX §2)

- `processBrusfilter` callable — Locked 2026-06-17
- Flöde: DCAP-klassning → logistik-extraktion → BIFF-utkast
- **Ingen auto-WORM** — användaren beslutar om sparande
- Panel i `VaultOrkesterPanel`

## BIFF-principer (ALDRIG bryta)

| Bokstav | Innebörd | Förbjudet |
|---------|---------|-----------|
| B (Brief) | Kort svar | Långa förklaringar |
| I (Informative) | Bara fakta som behövs | Emotionella reaktioner |
| F (Friendly) | Neutral ton | Aggressivitet |
| F (Firm) | Tydlig gräns | JADE (Justify, Argue, Defend, Explain) |

## Grey Rock

- Minimal informationsdelning med HCF-motpart
- Svar om barnets behov, fakta, logistik — inget om känslor eller åsikter
- Max 2–3 meningar i ex-kommunikation

## DCAP-integration

- `analyzeMessage` kör alltid DCAP FÖR BIFF-generering
- riskScore → om ALERT: spara i `dcap_alerts` + notifiera
- Användarens meddelande saneras (Clean Input) före LLM

## MUST NOT

- JADE i något svar (inga Justify/Argue/Defend/Explain)
- Diagnos av motpart i svar eller WORM
- Auto-WORM av Brusfilter-svar (ingen auto-WORM — explicit val)
- Ta bort `processBrusfilter` eller BIFF-Skölden (Locked UX)
- LLM avgör WORM-write eller silo (DCAP avgör)

## Verifiering

```bash
cd functions && npm run build
npm run smoke:locked-ux
npm run smoke:predeploy
```

**Trigger:** `/specialist-grans-arkitekten` · **Sekundär:** `/specialist-dcap-routing` (DCAP), `/specialist-valv-builder` (Brusfilter-panel i Orkester), `/specialist-familjen-hamn-builder` (Safe Harbor UI).
