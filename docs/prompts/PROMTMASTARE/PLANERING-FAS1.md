# Promtmästare — PLANERING · Fas 1 · Implementation & förbättring

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/locked-ux-features.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/planering-kanon-guard.mdc
@docs/design/PLANERING-PROJEKT-HYBRID.md
@docs/specs/modules/Core-SPEC.md
@docs/SMOKE_CHECKLIST.md

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg — ett steg i taget
- **Inga JADE** — direkt, saklig
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Locked UX, prod deploy

### 2. WORM: Planering-tasks är INTE WORM. `checkins` är WORM (CREATE only).

### 3. Tre silor: Planering = ingen RAG-silo. Tasks i Firestore (`tasks`/`planning_items`), ej `reality_vault`.

### 4. DCAP: routing=planning för action items i `classifyInboxDocument`.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts`.

### 6. Zero Footprint: Draft Layer för planeringsutkast.

### 7. Sacred Features: Morgonkompassen ingår i planerings-ekosystemet.

### 8. Locked UX (KRITISK):
- **Planering hybrid är LÅST** — P3 Kanban (ATT GÖRA / VÄNTAR / KLART) KVAR
- Projekt: lista, anteckning, bild, egna planeringar `/projekt`
- Widget v2: `W1-kompakt-projekt.png`
- Smoke: `npm run smoke:locked-ux`

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad. GAP-register vinner.

### 11. Domänlins: Planering inkluderar ex-relaterad logistik (hämtning, byte, schema) — BIFF-ton. Ej ex-brus till Planering.

### 12. Design: `/planering` har eget tema. Progressive disclosure — inte visa alla tasks på en gång.

### 13. Secrets: Aldrig `.env`, SA-JSON.

### 14. Validate:
```bash
npm run smoke:locked-ux
npm run typecheck:core-strict
npm run smoke:predeploy
```

---

## Ämnets kontext

**Modul:** Planering (`/planering`) + Projekt (`/projekt`) — `src/modules/`  
**Aktuell fas:** Fas 1 — IMPLEMENTATION & förbättring  
**Fas-syfte:** Verifiera att Planering hybrid-designen (Kanban P3 + Projekt) är korrekt implementerad och komplett, åtgärda GAP

### Vad som är klart (DONE):
- [x] `/planering` route live (Del B 2026-05-24)
- [x] Planering hybrid-design låst (`docs/design/PLANERING-PROJEKT-HYBRID.md`)
- [x] `routing=planning` i `classifyInboxDocument` (Inkorg-Sorteraren)
- [x] e-postregler `planning_email_rules`

### Vad som ska verifieras:
- [ ] P3 Kanban (ATT GÖRA / VÄNTAR / KLART) — tre kolumner implementerade?
- [ ] Drag-and-drop eller enkel statusändring?
- [ ] Projekt-sidan (`/projekt`) — separat från Planering?
- [ ] Widget v2 (`W1-kompakt-projekt.png`) — lever i appen?
- [ ] Inkorg-Sorteraren → Planering-flöde: tasks landar korrekt?
- [ ] `planning_email_rules` — hur fungerar e-poststyrning?
- [ ] Morgonkompassen-integration med Planering?

### Nyckelfiler:
- `src/modules/` — hitta PlaneringsPage + KanbanBoard
- `docs/design/PLANERING-PROJEKT-HYBRID.md` — hybrid-spec (LÅST)
- `docs/design/planering/` — mockups
- `.context/locked-ux-features.md` §3–4 — Planering låst

---

## Fas 1-uppdrag

**Läge: INVENTERING + IMPLEMENTATION**

### Steg (i ordning):
1. Verifiera att P3 Kanban har exakt tre kolumner: ATT GÖRA / VÄNTAR / KLART
2. Kontrollera att `/planering` är helt separat från Valv (`reality_vault`)
3. Verifiera att `routing=planning`-tasks från Inkorg landar rätt i UI
4. Kontrollera Widget v2 — finns den i appens FloatingDock eller SmartWidgetBar?
5. Identifiera 2–3 GAP att stänga
6. Presentera alternativ + REKOMMENDATION per GAP

---

## Leveransformat

```markdown
## Fas 1 — Planering

### P3 Kanban-status
| Kolumn | Finns | Drag-drop | Notering |
|--------|-------|-----------|----------|

### Routing-verifiering
- Inkorg → planning: korrekt / GAP

### Widget v2
- Status: implementerad / saknas

### GAP att stänga
1. [GAP] → Alt A / Alt B → **REKOMMENDATION**

### Smoke-resultat
- [ ] `npm run smoke:locked-ux` → PASS/FAIL
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: ta bort eller ändra P3 Kanban-strukturen (Locked UX)
- ALDRIG: flytta Planering-tasks till `reality_vault` eller `journal`
- ALDRIG: ex-brus till Planering (ex-sms → Hamn/Valv, ej Planering)
- ALDRIG: merge utan PMIR + Pontus OK
- ALDRIG: deploya utan `npm run smoke:locked-ux` PASS
