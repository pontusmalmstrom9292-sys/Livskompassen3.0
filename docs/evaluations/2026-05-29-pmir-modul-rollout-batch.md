# Pre-Merge Impact Report (PMIR) — Modul rollout batch 2026-05-29

**Datum:** 2026-05-29  
**Gren:** lokala ändringar på **`main`** (ej pushad)  
**Agent / session:** specialist-smoke-runner · modul rollout stängning

---

## Följer med till main

- [x] **Dagbok v2 Fas 1–4:** sub-nav Snabb/Reflektera/Arkiv, taggar/kategori, bilagor (`journal_memories`), arkiv sök/filter, `HandoffBox` + `DagbokRememberCard`, `VaultZoneGate` (`dagbok_forensic`) för väv-opt-in
- [x] **Planering Fas 1.5:** dock → `/planering?tab=handling`, deadline quick-add, Framsteg-flik, Fokus-knappar
- [x] **Planering Fas 2 (kod):** `planning_email_rules` + Regler-flik — **rules ej deployade**
- [x] **MåBra Fas 1.5 + Fas 2 §1–§2:** Daglig Mix hub, lågenergi-toggle, landningsremsa efter `MabraComplete`
- [x] **Projekt Fas 3 (delvis):** MaterialPack-editor `/projekt/genvagar`, Life OS shortcuts (`materialPackApi`, `useMaterialShortcuts`)
- [x] **Kunskap Fas 1.5:** Valv-panel polish (tom-state, fel, citation) — redan på main
- [x] **Barnporten P1 + P2 CB1:** `BarnportenWidget`, `/widget/barnporten`, `saveBarnportenLog`, manifest
- [x] **Valv (polish):** `vavarenCopy`, speglar/hamn panel-justeringar (ingen rules-diff)
- [x] **Docs:** cursor-planer, `MODUL-GAP-OVERSIKT.md`, smoke-script Barnporten

**Ej med i commit (rekommenderat):** `repomix-dagbok.txt` — lokal export.

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren | N/A — arbete på `main` |
| Uncommitted om `git restore` | ~60 filer (se git status) — hela batch ovan |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, `grunder-kanon.mdc` U1–U6 | **PASS** — tre silos; journal/children_logs WORM; ingen cross-RAG |
| **Design** | `locked-ux-features.md`, Planering hybrid, Dagbok/Barnporten-SPEC | **PASS** — P3 Kanban, Barnfokus, Valv-flikar oförändrade |
| **Säkerhet** | `.context/security.md`, `storage.rules`, `firestore.rules` | **GAP deploy** — se blockers |

### Rules-diff (kräver deploy, ej merge-blocker för kod)

| Rules | Ändring | Prod-kommando |
|-------|---------|---------------|
| `storage.rules` | `users/{userId}/journal_memories/{entryId}/**` WORM | `firebase deploy --only storage` |
| `firestore.rules` | `planning_email_rules` CRUD (Planering Fas 2) | `firebase deploy --only firestore:rules` |

---

## Smoke (lokal 2026-05-29)

| Kommando | Resultat |
|----------|----------|
| `functions` `npm run build` | **PASS** |
| `npm run build` | **PASS** (efter MåBra `MabraLowEnergyToggle`-fix + Dagbok `VaultZoneGate`) |
| `npm run smoke:orkester` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |

---

## Modulstatus (cursor-plan rollout)

| Modul | Plan | Kod | Smoke | Blocker |
|-------|------|-----|-------|---------|
| **Dagbok** | Fas 1–4 | **done** lokal | build + locked-ux + orkester PASS | storage deploy |
| **Planering** | Fas 1.5 + 2 | **done** lokal | locked-ux PASS | **Fas 2 rules deploy** |
| **MåBra** | Fas 1.5 + Fas 2 §1–2 | **done** lokal | build PASS; innehall via orkester | §5 guardrail öppen |
| **Projekt** | Fas 3 MaterialPack | **done** lokal | locked-ux PASS | Firestore `project_rules` defer |
| **Kunskap** | Fas 1.5 | **done** (main) | orkester/innehall PASS | Fas 2 seed-bank (innehåll) |
| **Barnporten** | P1 + CB1 P2 | **done** lokal | locked-ux PASS | manuell smoke #3 |
| **Valv** | polish | delvis lokal | locked-ux (Mönster/Orkester) PASS | Vävaren försätt polish |

---

## Blockers (efter merge)

1. **Planering Fas 2:** `firebase deploy --only firestore:rules` — Regler-flik fungerar inte i prod förrän deploy.
2. **Dagbok Fas 2 bilagor:** `firebase deploy --only storage` — `journal_memories/` path.
3. **Manuell:** Barnporten smoke #3 (barnflöde → `children_logs`).

---

## Rekommendation

- [x] **Commit** batch på `main` (exkl. `repomix-dagbok.txt`)
- [ ] **Push** `origin main` — väntar användare
- [ ] **Deploy** storage + firestore rules (ordning: rules → storage)
- [ ] **Ej** gren-radering

---

## Godkännande

**Användaren:** ☐ godkänn merge · ☐ avbryt  
**Rekommenderat kommando:** **`godkänn merge`** (commit + push batch, därefter rules/storage deploy)

**Datum:** ___________

---

Se: [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md) · [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md)
