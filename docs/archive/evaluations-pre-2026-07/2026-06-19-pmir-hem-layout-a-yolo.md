# Pre-Merge Impact Report (PMIR) — Hem Layout A YOLO

**Datum:** 2026-06-19  
**Gren:** `cursor/hem-layout-a-yolo-3876` → `main`  
**Godkännande:** Pontus — *"Godkänn samanfoge"* (2026-06-19)

---

## Följer med till main

- [x] `HomeLayoutA.tsx` — gemensam Layout A (`calm` | `brass`)
- [x] `HomeBrassLayoutA.tsx` — tunn wrapper → `HomeLayoutA variant="brass"`
- [x] `HomeHeroKanon.tsx` — Obsidian Calm default = Layout A; mockup behåller kompass
- [x] `HomePage.tsx` — sekundär feed i `CalmCollapsible`; ingen dubbel inkast
- [x] `HomeBrassDaySteps.tsx` — delade `home-layout-a__*` klasser
- [x] `AdaptiveMemoryCards.tsx` — små justeringar för Layout A
- [x] CSS: `obsidian-calm-2.css` (`.home-layout-a--calm`), `brushed-brass-neu.css` (omdöpta selektorer)

**Låst UX:** `npm run smoke:locked-ux` — **PASS**  
**Design:** `npm run smoke:design-modules` — **PASS**  
**Build:** `npm run build` — **PASS**

---

## Försvinner (gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren | `cursor/hem-layout-a-yolo-3876` (lokal + remote efter stängning) |
| Kod endast på gren | 0 — allt mergat |

---

## Regelanalys

| Lager | Status |
|-------|--------|
| U1–U5 / Sacred | PASS — endast frontend Hem, ingen RAG/rules-ändring |
| Locked UX | PASS — Barnfokus, Valv, Planering, Barnporten oförändrade |
| Obsidian Calm | PASS — kanon enligt `docs/design/references/HEM-LAYOUT-A-KANON.md` |
| firestore.rules | Ej rörd |

---

## Deploy

Frontend påverkas — efter merge på Mac:

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
git pull origin main
npm run build
firebase deploy --only hosting
```

Hard refresh (Cmd+Shift+R) och verifiera `/` — Layout A med ankare, rutnät, collapsible "Mer för dig".
