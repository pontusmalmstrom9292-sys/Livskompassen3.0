# Designmoduler D1–D29 (mockup → kod)

**Senast:** 2026-05-23 · **Tema:** **E — Nordic Skymning + Guld** (tokens i `src/index.css`)

| ID | Modul | Status | Kod |
|----|-------|--------|-----|
| D1 | Kompis AI-livsarkitekt | partial | `KnowledgeVaultChat` |
| D2 | Livskompass-hero | partial | `HomeActionHub`, `CompassModuleStrip` |
| D3 | Kompassråd + taggar | **wired** | `KompassradPanel` → Hem |
| D4–D6 | Kognitiv laddning / Trygg Hamn-hub | partial | `CognitiveLoadStrip` (P2) |
| D7–D10 | Valv-entry, WORM | done | `VaultEntryForm` |
| D11 | Barnfokus hero | **wired** | `BarnfokusFraganPanel`, Familjen |
| D12 | Barnprofilkort | **wired** | `ChildProfileCards` |
| D13 | Positiva minnesankare | **wired** | `PositivaMinnesankare` |
| D14 | Påminnelse-footer | **wired** | `ParentReminderFooter` |
| D15 | Mönster + Orkester (locked) | done | `VaultMonsterPanel`, `VaultOrkesterPanel` |
| D16 | Pansaret header | **wired** | `PansaretHeader` |
| D17 | Flikar Arkiv/Triage | **wired** | `VaultPage` labels |
| D18 | Orkester-trio | **wired** | `OrkesterAgentTrio` |
| D19 | Registrerade dokument | **wired** | `VaultOrkesterPanel` |
| D20 | WORM-kort metadata | **wired** | `VaultLogList` tags + tidsstämpel |
| D21 | Barnfokus-frågor (locked) | done | `BarnfokusFraganPanel` |
| D22–D23 | BIFF + extra | **wired** | `BiffTriagePanel` → Hamn |
| D24–D28 | Lager 2 copy, dock macro | partial/P3 | — |
| D29 | KBT-Transformatorn | **wired** | `KbtTransformatorPanel` + `mabraCoach` transformator |

**Smoke:** `npm run smoke:design-modules` · **Locked UX:** `npm run smoke:locked-ux`

**Planering P1:** `/planering` kanban + inkorg · `planning_tasks` · `/projekt` hub (stub).

**Nästa:** deploy `firestore.rules` · användaren väljer tema (A/B/C/D) → tokens.
