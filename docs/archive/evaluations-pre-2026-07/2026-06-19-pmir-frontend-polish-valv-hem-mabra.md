# Pre-Merge Impact Report (PMIR)

**Datum:** 2026-06-19  
**Gren:** `cursor/frontend-polish-valv-hem-mabra-3876` → `main`  
**PR:** #15  
**Agent:** Cursor Cloud Agent  
**Godkännande:** Pontus — *godkänn merge*

---

## Följer med till main

- [x] `CalmCollapsible` — delad progressive-disclosure-komponent (`src/modules/core/ui/CalmCollapsible.tsx`)
- [x] **Valv Kunskapsbank** — full header, chat-first, Filarkiv/Familjen collapsible, `overflow-hidden` på chat-kort
- [x] **Hem** — färre adaptiva kort initialt, "Visa färre/mer", sektion "Mer för dig"
- [x] **MåBra** — Daglig mix, Mål, Kurser, Projekt, Historik collapsible; `HubPanelSkeleton` från main
- [x] `KunskapPage` — lugnare citatmarkering (ingen pulse)
- [x] `AutonomousArchivePanel` — ingen fade-in-animation
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS**

**Not:** Större delen av strukturen fanns redan på `main` (parallell YOLO-våg). Merge-diff mot main: enbart `KunskapsbankHeader` full + `overflow-hidden` på BentoCard.

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren | `cursor/frontend-polish-valv-hem-mabra-3876` (lokal + remote efter stängning) |
| Commits som **inte** mergas | 0 |
| Kod kvar **endast** på grenen | 0 |

---

## Regelanalys

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | U1–U5, tre silos, ingen cross-RAG | PASS — frontend only |
| **Design** | Obsidian Calm, locked-ux Kunskapsbank/Aktörskarta | PASS |
| **Säkerhet** | Sacred, WORM, firestore.rules | PASS — inga rules-ändringar |

---

## Smoke (på `main` efter merge)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |

---

## Deploy

Frontend only efter merge:

```bash
npm run build
firebase deploy --only hosting
```

---

## Rekommendation

- [x] Merge till `origin/main`
- [x] Radera gren `cursor/frontend-polish-valv-hem-mabra-3876` efter push

---

## Godkännande

**Användaren:** ☑ godkänn merge  
**Datum:** 2026-06-19
