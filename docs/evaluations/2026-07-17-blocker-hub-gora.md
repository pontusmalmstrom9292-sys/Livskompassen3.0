# Blocker / SKIP — hub-gora (2026-07-17)

**Våg:** `hub-gora`  
**Status:** **SKIP — already done**  
**Nästa:** `hub-dagbok`

## Verifiering mot plan

Plan: [`docs/archive/evaluations-fas19-2026-06/2026-05-31-gora-ombyggnad-plan.md`](../archive/evaluations-fas19-2026-06/2026-05-31-gora-ombyggnad-plan.md)  
Planstatus: **Fas 2 implementerad (2026-05-31 Master YOLO)**

| Scope | Status i kod |
|-------|----------------|
| Fas 1 — default `parsePlaneringTab` → `handling` | **PASS** (`planeringHubConfig.ts`) |
| Fas 1 — header «Göra» | **PASS** (`headerPageLabel.ts`) |
| Fas 1 — `GoraHubTabBar` | **PASS** |
| Fas 2 — `PLANERING_MORE_TABS` (Fokus/Framsteg/Regler) | **PASS** (`constants.ts`) |
| Fas 2 — Handling/Inkorg via GoraHubTabBar | **PASS** |
| Fas 2+ — route `/gora` alias (P3, valfritt) | **SKIP** — ej implementerad; kräver ändring i låst `MOD-CORE-NAV` (`AppRoutes.tsx`). Ingen unlock/Pontus OK. Alias är P3 optional; `/planering` är kanon. |

## PMIR / module-lock

- Ingen ändring i `firestore.rules`, Sacred/Locked UX, Barnporten kanon-UI eller Gmail.
- `/gora`-alias skulle röra `MOD-CORE-NAV` (status `locked` 2026-07-12) → medvetet **inte** tvingat.

## Koddiff

Ingen applikationskod ändrad denna våg.

## Smoke / deploy

Ej körda (ingen kod). Locked UX för Göra/Planering redan grön i tidigare leveranser (`MODUL-GAP-OVERSIKT` Planering **closed**).
