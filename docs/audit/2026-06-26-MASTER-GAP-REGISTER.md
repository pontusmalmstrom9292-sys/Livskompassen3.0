# MASTER GAP Register — 2026-06-26

Merged from frontend, backend, design, governance audits.

## P0 (våg 1)

| ID | Item | Owner |
|----|------|-------|
| G-01 | Synka styrning → Fas 24 | Governance |
| G-02 | Skapa app-plan-syntes + FAS24-SPRINT-AUTORUN | Governance |
| G-03 | alwaysApply fix (5 regler) | Governance |

## P1 (våg 2-3)

| ID | Item | Owner |
|----|------|-------|
| F-01 | Arkivera orphan frontend (diary/, LayoutShell, EconomyDashboard) | Frontend |
| F-02 | Radera main.tsx.bak | Frontend |
| D-01 | Fix text-[#050505] i DagbokReflektionDelegate | Design |
| B-01 | Fix kampsparRag stub-kommentar | Backend |

## P2 (defer)

| ID | Item |
|----|------|
| B-02 | kasam_aggregation beslut |
| B-03 | firestoreBackupJob export/arkiv |
| D-02 | Figma variables Phase 1-2 |
| F-03 | Konsolidera useChameleonMorph |

## Nästa YOLO-våg

**Våg 1 Styrningssync** — blockerar allt annat.

## Gates

`npm run smoke:predeploy` efter våg 2+3. YOLO GO → Pontus OK deploy.

## Status 2026-06-28

| ID | Status |
|----|--------|
| G-01–G-03 | ✅ Klart |
| F-01–F-02 | ✅ Klart |
| D-01 | ✅ Klart |
| B-01 | ✅ Klart |
| B-02, B-03, D-02, F-03 | Defer P2 |
