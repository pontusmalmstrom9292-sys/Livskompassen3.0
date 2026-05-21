# safe_harbor — module plan

## Overview

Safe Harbor / BIFF-Skölden — Grey Rock-svar på ex-meddelanden utan JADE.

Route: `/hamn` · Canonical: `.context/modules/safe_harbor.md` · Spec: `docs/specs/incoming/SafeHarbor-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/SafeHarborPage.tsx` | Textarea, submit, svar, kopiera |
| `api/biffService.ts` | `analyzeMessage` callable + `extractGreyRockReply` |

## Status

| Area | Status |
|------|--------|
| Route + AuthGate | **done** |
| Dock Anchor + HomePage bento | **done** |
| Klistra in + Generera BIFF-svar | **done** |
| `analyzeMessage` → DCAP/supervisor | **done** |
| Kopiera svar | **done** |
| riskScore i UI | **done** |
| Brusfilter som separat UI-steg | **planned** |
| Användarens mål-fält | **planned** |
| Flerstegs progressive disclosure | **planned** |
| "Klar" + Zero Footprint unmount | **planned** |
| Bro från `/speglar` | **done** — länk med prefilledMessage |
| "Spara som bevis" → `reality_vault` | **done** |

## Backend

- Callable: `analyzeMessage` (inte `generateBiffResponse`)
- Agent: KompisSupervisor → DCAP + Grey Rock-svar
- Brusfiltret: internt i supervisor/DCAP; ej exponerat som eget UI-steg

## Security notes

- Ex-meddelanden: auth-only callable, max 5000 tecken
- Ingen persistent lagring utan explicit "Spara som bevis"
- CMEK vid valv-export (drift)

## Nästa fas (implementera när användaren säger kör)

1. Wizard: inmatning → brusfilter → mål → svar  
2. State reset on unmount + Klar-knapp  
3. Route state från Speglar  
4. Valfri WORM-export till valv
