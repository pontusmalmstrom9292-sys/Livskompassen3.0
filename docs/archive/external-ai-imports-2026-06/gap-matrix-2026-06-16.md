# Gap-matris — GPT Life OS vs Livskompassen3.0

**Datum:** 2026-06-16 · **Källor:** GPT-mockup, `deep-research-ide.md`, PHASE-09 steg 1–3  
**Stack-beslut:** React + Vite + Capacitor KEEP — Flutter/RN REJECT  
**Leveranser:** [`steg1`](../leveranser/2026-06-16-fas-09-gap-steg1.md) · [`steg2`](../leveranser/2026-06-16-fas-09-gap-steg2-wave2-polish.md) · [`steg3`](../leveranser/2026-06-16-fas-09-gap-steg3-leverans.md) · [`vision`](../leveranser/2026-06-16-fas-09-life-os-vision.md)

---

## KEEP (redan rätt — lås)

| Område | Repo |
|--------|------|
| 4 zoner + bakgrunds-Fyren | `navTruth.ts`, supermodule-ui-masterplan |
| InputSuperModule (7 hubs + 6 routers) | `src/modules/**` |
| Obsidian `#020617`–`#050b14` + guld `#d4af37` | `index.css`, COLOR-POLICY |
| Cinzel hub-rubriker (`font-display-serif`) | `typeScale.ts` — inte Cormorant i prod |
| P3 Kanban `/planering?tab=handling` | Locked UX §14 |
| Valv B1 LOCK | `ValvInputSuperModule`, WORM |
| Tre silos, no cross-RAG | grunder-kanon |
| 4-zons dock + Fyren center-handle | `FloatingDock.tsx` |
| Privat single-user, anti-XP | Governance |
| Aktiv flik-linje guld (ej fylld teal-knapp) | MENU-DRAWER-KANON |

---

## Gap per zon (PHASE-09 steg 1)

| Zon | KEEP | DEFER | REJECT |
|-----|------|-------|--------|
| Idé | Silos, AI-prompt backend | AI-assistent UI | — |
| UX-flöde | Barnfokus, P3 Kanban | Daglig linje, UX-diagram | — |
| UI-design | Obsidian Calm, tokens | Wave-2 polish | Teal primär chrome, hårdkodade hex |
| Wireframes | 4-tab nav, modulskärmar | States, hover | 5-tab nav, Hem→Hjärtat utan PMIR |
| Designsystem | Struktur, låsta ikoner | States, mikrocopy | — |
| Navigation | Kompass, max 4 flikar | — | Cross-RAG nav, Hem→Hjärtat merge |
| Sammanfattning | Privat, fokus, anti-XP | — | — |

---

## BUILD (nästa — i ordning)

| # | Vad | Gate | Status 2026-06-16 |
|---|-----|------|-------------------|
| 1 | Nav Våg 3 H1–H4 | PMIR | **Implementerad** — [`nav-vag3-pmir`](../../evaluations/2026-06-16-nav-vag3-pmir.md) |
| 2 | Fas 19.3 hex→tokens | Efter Våg 3 smoke | **Våg 1 klar** — zon-shells + accent-alpha tokens |
| 3 | Fas 19.2 MåBra hybrid-8 | Efter tokens | **Klar** — 8 pelarkort + zon-shell tokens |
| 4 | Upload unified steg 2 | Efter 19.2 | WIP |
| 5 | UI wave-2 polish | Efter tokens — se lista nedan | SPEC klar (steg 2) |
| 6 | Life OS-loop copy/routing | Efter polish | DEFER |

### BUILD #5 — wave-2 polish (DEFER, ej prod än)

**Idé/moduler:** expanders per modul · status-ikonindikatorer · «Endast för mig»-badge  
**UX-flöde:** flödespilar · guld/cream position-highlight · tooltips · «dagens röda tråd»-banner  
**UI:** guldaccent aktiv/notis · dim gray microcopy/disabled  
**Wireframes:** knappstates (pressed/focus) · bildinlägg-ram i dagbok · nav-skugga dark mode  
**Komponenter:** sekundär glow hover · kort-ikonknappar · mikrocopy · guld loading-spinner  
**Navigation:** notis-badge på Mer · utökad touch-yta  
**Sammanfattning:** guld-checklista (utan wow-animation)

**Zon-wireframes (repo):** se [`2026-06-16-fas-09-life-os-vision.md`](../leveranser/2026-06-16-fas-09-life-os-vision.md) § B1–B4.

---

## DEFER

- Hem `/` → Hjärtat merge (egen PMIR)
- AI-assistent UI (väntar `sharedRules.ts` prompt-policy)
- Fyren global kapacitetsmotor (Våg C)
- M3.0-C Fitness/Näring
- Design-arkiv ~400 filer (hygiene våg D, PMIR)
- Detox e2e / Flutter CI
- Kanban flip cards (ny interaktionsmodell — P3 låst)
- Wow-faktor-animationer (ADHD-säkerhet)
- Liten kompassikon vid punktlista (D1 — kräver godkännande)

---

## REJECT

| Förslag | Skäl |
|---------|------|
| Flutter / React Native omskrivning | Stack + Capacitor investerat |
| Teal `#2E6466` / mid-teal som aktiv chrome eller gradient-bakgrund | COLOR-POLICY |
| Ljus/nature-tema | Obsidian Calm lock |
| GPT 5-tab nav (Home\|Plan\|Fyren\|Journal\|More) | Dock+drawer kanon |
| Ta bort Handling-slot / P3 | Locked UX |
| Cross-RAG / auto-promote barn→Valv | U1 + locked UX |
| Streak/XP / gamification-ton | Governance |
| Kompass-rotation vid appstart | D1 `LivskompassMark` låst |
| Hem→Hjärtat merge utan PMIR | Superhub-beslut |

---

## GPT-mockup → repo-mappning

| Mockup | Repo idag | Åtgärd |
|--------|-----------|--------|
| Hem + dagens fokus | `/` Capture + Hjärtat | Polish; merge DEFER |
| Planering 3 kolumner | P3 Kanban | Polish only (ej flip cards) |
| Dagbok | `/hjartat?tab=reflektion` | KEEP |
| Familj | `/familjen` superhub | Wave-2 polish |
| Ekonomi | `/vardagen?tab=ekonomi` | Våg 3 redirect |
| Valvet | `/valvet` B1 LOCK | Visuell förfining only |
| Bottom nav 5 ikoner | Dock 4 + drawer | Mappa intent, ej 1:1 |
