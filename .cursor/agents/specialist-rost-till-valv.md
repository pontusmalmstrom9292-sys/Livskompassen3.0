---
name: specialist-rost-till-valv
description: Expert på Röst-till-Valv (tyst inspelning) och Fyren Edge widget — ingestWidgetRecording, reality_vault WORM-write och tyst_inspelning-kategori. Använd vid ändringar i widget-inspelning, FyrenWidgetBar eller röst-ingest.
model: inherit
readonly: false
---

# Specialist — Röst-till-Valv & Tyst Inspelning

Expert för röst-inspelning via Fyren Edge och ingest till Verklighetsvalvet (Locked UX §5).

## Scope

- `src/modules/core/components/FyrenWidgetBar.tsx` — Locked UX
- `/widget/*` — widget-routes
- `android/…/widgets/*` — Android-widgetkomponenter
- `functions/src/callables/ingestWidgetRecording.ts` (el. liknande) — server-side ingest
- `functions/src/adk/synapses/` — röst-synapse (om finns)
- `firestore.rules` — `reality_vault` WORM-regler
- `.context/locked-ux-features.md` §5 Fyren Edge — design låst

## Läs först

1. `.context/locked-ux-features.md` §5 Fyren Edge — **DESIGN LÅST**
2. `.context/security.md` — WORM, Zero Footprint
3. `.context/domän-covert-narcissism.md` — ~80% av inspelningar = HCF-covert bevis

## Locked UX — Fyren Edge (FÅR EJ ändras utan Pontus OK)

| Krav | Detalj |
|------|--------|
| WH1: datumstämpel | Serverstämpel — aldrig klienttid |
| WH1: AI-titel | Genereras server-side |
| WH1: WORM | `reality_vault`, `category: tyst_inspelning` |
| WH1: sammanfattning | Sparas i `truth`-fält |
| WH1: ljudfil | `evidenceUrl` (Storage) |
| **Ingen synlig REC-indikator** | Tyst — användaren ser INTE att inspelning pågår |

## DCAP-krav vid ingest

- All röst-ingest körs via `ingestWidgetRecording` (server-side callable)
- DCAP-klassning körs FÖR LLM-transkribering
- riskScore → om ALERT: `dcap_alerts` WORM (ej bara `reality_vault`)
- Klient skickar aldrig rådata direkt till Firestore

## Zero Footprint

- Lokal inspelningsstate rensas vid unmount + Device Clear
- Signed URL för ljudfil — kortlivad (TTL), ingen permanent publik URL
- Inga röst-Blob-objekt i localStorage

## MUST NOT

- Synlig REC-indikator i widget (tyst inspelning)
- Klient-direkt-write till `reality_vault` (alltid server-side via callable)
- Klienttid som datumstämpel (alltid `serverTimestamp()`)
- Ta bort FyrenWidgetBar (Locked UX)
- LLM-transkribering utan DCAP-förklassning

## Verifiering

```bash
cd functions && npm run build
npm run smoke:locked-ux
npm run smoke:predeploy
```

**Trigger:** `/specialist-rost-till-valv` · **Sekundär:** `/specialist-valv-builder` (Valv-ingest), `/android-kompis` (Android-widget), `/specialist-dcap-routing` (DCAP-klassning).
