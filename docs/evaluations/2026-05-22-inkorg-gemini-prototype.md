# Inkorg — Gemini React-prototyp (mock App)

**Status:** Arkiverad ritning (ej source of truth)  
**Källa:** Cursor-chatt / Gemini, klistrad 2026-05-22  
**Sammanhang:** [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)

## Fil

- Full källkod: [`artifacts/gemini-cognitive-exoskeleton-App.tsx`](./artifacts/gemini-cognitive-exoskeleton-App.tsx) (1079 rader)
- Skärmdumpar: [`artifacts/screenshots-gemini-2026-05-22/`](./artifacts/screenshots-gemini-2026-05-22/)

### Skärmindex

| # | Fil | Vy |
|---|-----|-----|
| 01 | `01-horizon-dashboard.png` | Horizon Grid, KASAM, 2×2-kvadranter, 5-ikon dock |
| 02 | `02-vagus-idle.png` | Vagus — redo |
| 03 | `03-vagus-active.png` | Vagus — aktiv + Stoppa + somatiska tips |
| 04 | `04-korsreferens-search.png` | Korsreferens — sök |
| 05 | `05-korsreferens-results.png` | Korsreferens — WORM + logg |
| 06 | `06-biff-triage.png` | BIFF — blur beten, logistik 10% |
| 07 | `07-biff-svar.png` | BIFF — tre svar + JADE-test |

## Syfte i prototypen

| Del | Mock-state |
|-----|------------|
| Safe Mode | `cognitiveLoad === 'high'` |
| Nav | `menuStyle` horizon / orbit |
| Flikar | dashboard, biff, valvet, korsreferens, vagus |
| BIFF | `processBiff`, bait blur, 3 svar |
| JADE | `jadeInput` regex-varningar |
| Korsreferens | `mockWormData` + `mockLogData` |
| WORM UI | checkbox + toast (ej riktig Firestore) |

**Nästa:** `kör UX-inkorg-analys` mot `src/` och `navigation-master.md`.
