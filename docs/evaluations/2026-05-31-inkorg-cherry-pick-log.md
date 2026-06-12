# Inkorg cherry-pick-log — 2026-05-31

**Metod:** Jämförelse `main` vs `feat/*` (merge-base `1c70e737`, ~200 commits bakom). Ingen wholesale-merge.

---

## Sammanfattning

| ID | Feature | Commit (design-inkorg) | Beslut | Main efter 2026-05-31 |
|----|---------|------------------------|--------|------------------------|
| **I1** | MåBra `DailyQuestionCard`, `EmotionCompass`, `CognitivePlaysList` | `1fa44666` | **DEFER (Superceded)** | `wellbeing/mabra/` har nu avancerad KBT + verktyg, `DagligMixPanel` ersätter I1 helt. |
| **I2** | `BiffFlowPanel`, Hamn JADE, **Visa brus** | `032f01bc`, `7c0dc5c2` | **PORT** (Visa brus) 2026-05-31 | `BiffTriagePanel` + `index.css`; `BiffFlowPanel` ej portad (Hamn har `BiffPublicPanel` + forensic) |
| **I3** | Barnen F-B11 `LivsloggQuestionCard` | `55ce5ccb` | **INTEGRATED** | Frågorna från I3 har integrerats in i `BARNFOKUS_QUESTIONS_BUILTIN` utan att duplicera UI-låset. |
| **I4** | Valv F-V13 chattbubblor | `aa7c0fbf` | **PORT** | `evidence/vaultChat` — tråd-UI + `useValvChatSession` messages |
| **I5** | Hub-tile CSS Riktning B | `8ba53de0` | **REJECT** | Designbeslut; ej Sacred |

---

## SKIP (redan på main)

| Commit-tema | Anledning |
|-------------|-----------|
| Stämpel / `time_entries` / arbetsliv hub | [`2026-05-25-stampla-merge.md`](./2026-05-25-stampla-merge.md) |
| Modulkluster `evidence/`, `diary/`, `family/` | `7d1aeaa9` på main |
| `valvChatQuery` + `ValvChatPanel` (enkel) | Finns; I4 utökar UI |
| Fyren, G18, Capacitor 8 | Senare main-commits |

---

## I4 — PORT-detalj

- **Källa:** `aa7c0fbf` (paths: `valv_chatt/` → `evidence/vaultChat/`)
- **Filer:** `useValvChatSession.ts`, `ValvChatPanel.tsx`
- **Zero Footprint:** oförändrat — `reset` vid `active=false` och unmount
- **Smoke:** `npm run smoke:locked-ux` + `smoke:orkester` efter commit

---

## Grenar efter logg

```bash
git tag archive/inkorg-mabra feat/mabra-fragekort
git tag archive/inkorg-barnen feat/barnen-fragekort
git tag archive/inkorg-broar feat/broar-inkorg
git tag archive/inkorg-design feat/design-inkorg
git branch -D feat/mabra-fragekort feat/barnen-fragekort feat/broar-inkorg feat/design-inkorg
```

---

## Nästa produktsteg (ej git)

- **I1:** Beslut frågekort vs `KbtTransformatorPanel` + U6 bank
- **I2:** Port **Visa brus** till `BiffTriagePanel` utan att ta bort %-vy
- **I3:** Integrera F-B11 med Barnfokus-pool om godkänt
