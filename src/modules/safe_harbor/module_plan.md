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

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| BIFF/Grey Rock callable | Ex-sms, 10% logistik | Ja | **done** |
| DCAP riskScore | Brus i backend | Ja | **done** |
| Spara som bevis → valv | WORM original | Ja | **done** |
| Bro Speglar | prefilledMessage | Ja | **done** |
| Brusfilter UI-steg | Kladd #3 metod | Nej | **planned** |
| "Klar" + unmount cleanup | Zero Footprint | Nej | **planned** |
| Dölj tills energi | Kladd fråga | Nej | **planned** fas 2 |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

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
