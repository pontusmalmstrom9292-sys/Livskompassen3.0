# FP-TI-S2 · UX Guardian — Låst vs Fri sandbox

**Tag:** FP-TI-S2 · **Datum:** 2026-06-18 · **Tema:** `tactile-obsidian` (E) · **Scope:** `/dev/design-freeport` — ej prod

**Källor:** `.context/locked-ux-features.md` · `CHAMELEON-SUPERMODULE-SPEC.md` · `2026-06-18-fp-ti-e-approved.md`

---

## 1. Låst vs Fri

| **Låst (funktionellt)** | **Fri (chrome / layout i sandbox)** |
|---|---|
| Barnfokus: `BARNFOKUS_QUESTIONS`, optimistisk save, «Spara till {barn}s logg» (`FamiljenBarnfokusDelegate`) | Kortskuggor, padding, typografi Cinzel zon + Inter hub |
| Valv: Mönster (`VaultMonsterPanel`), Orkester/SMS (`VaultOrkesterPanel`), Kunskapsbank, Aktörskarta G9 | Hem-hub-layout, discovery-kort, bottennav *form* (ej etiketter) |
| P3 Kanban ATT GÖRA/VÄNTAR/KLART på `/planering` | Planering 8 hub-layouter i freeport |
| Fyren WH1/WH2 — tyst inspelning, WORM, ingen synlig REC | Widget *demo-position* utan `ingestWidgetRecording` |
| Barnporten HITL: inkorg → explicit «Spara som bevis» + `sourceRef` | Chameleon morph 300–400 ms, `prefers-reduced-motion` |
| Drawer: Vardag publikt · Valv endast `vaultOpen` · aktiv rad guld | Guldstjärna-fokal nav (#c9a227), depth-linje på shell |
| Plausible deniability — inga valv-/bevis-ord i publikt DOM | Tema-växlare; default `tactile-obsidian` |
| Supermodule `inputMode` per zon (Hjärtat/MåBra/Familjen/Planering) | Kapacitetsfiltrerade kort (max 12) |
| `/hamn` snabb BIFF utan PIN; djup Hamn i Valv | OSÄKER: helt ersätta drawer med bottom-nav i prod |
| D1/M2 ikoner, AUTH-G1 popup-login | OD-skalet `/dev/obsidian-depth` — separat låst mockup |

---

## 2. Valv & Barnlogg — tre diskreta mönster

**A. Drawer-bibehållen (minsta risk)**  
Valv-sektion i hamburger endast efter PIN på Valv-route (`vaultSessionOpen`). Barnlogg nås via Familjen-zon → supermodul-läge (`livslogg_stund` / `fysiologi`). Ingen global nav-etikett. *För:* bevarar `MENU-DRAWER-KANON.md`. *Emot:* färre synliga flikar kvar i drawer.

**B. Långtryck + biometri (Chameleon-spec)**  
Referensbildens guldstjärna = hem-fokal, inte Valv. Valv: långtryck Familjen-ikon → PIN-sheet. Barnlogg: kapacitetsfiltrerat discovery-kort under supermodul — aldrig i bottom-nav. *För:* noll brus publikt. *Emot:* upptäckbarhet (OSÄKER: behöver onboarding-hint i sandbox).

**C. Progressiv uppenbarelse**  
Publikt: noll valv-/barnlogg-ord. Efter PIN i session: mjuk fade-in av Valv-rad i drawer + Familjen «livslogg»-kort. Alignar E:s lugna kortdensity. *För:* ADHD-säker; matchar mjuka skuggor. *Emot:* tillstånd måste rensas vid logout/blur (Zero Footprint).

---

## 3. Risker — bottennav / Fyren i sandbox

| Risk | Mitigering |
|---|---|
| Prod-routing läcker (`navTruth.ts`) | Endast `DesignFreeportPage` + lokala komponenter |
| Valv-ord exponeras publikt | `smoke:locked-ux` + manuell DOM-scan utan PIN |
| Fyren tyst REC bryts | Sandbox mock — koppla ej `FyrenWidgetBar` prod-callables |
| ADHD overload (puls/glow/feed) | Avvisa per E-beslut; ingen oändlig skroll som hem |
| Locked-flow regression | `npm run smoke:locked-ux` + `smoke:design-freeport` |

**Säker test:** parallell route `/dev/design-freeport`, `localStorage` tema, diff mot `.context/locked-ux-features.md` före varje merge. Prod-wire först efter S7 + PMIR.

---

## 4. Färre sidor — fem Chameleon-idéer

| # | Idé | För | Nackdel |
|---|---|---|---|
| **I** | Zon-hub ersätter tabbar: Hem → zon → kort → `inputMode` (Modell A) | Max 2 klick; färre routes | Djupa `?tab=`-bokmärken kräver redirect-karta |
| **II** | Valv som overlay-shell — inre flikar morphas, en PIN-ingång | En ingång till Pansaret | Mönster+Orkester måste vara egna lägen — ej Dossier-only |
| **III** | Familjen supermodul slukar livslogg-tabbar (`barnfokus`…`observation`) | En route `/familjen` | OSÄKER: behöver livslogg separat URL för support? |
| **IV** | Vardagen discovery → Planering+MåBra modes via kort | Matchar referens hub-kort + elevation | Ekonomi/Arbetsliv kvar som sekundära kort |
| **V** | Hem v3 + 3-zons bottom nav (Hjärtat/Vardagen/Familjen), guldstjärna hem | Alignar E-referens; nekar Dagbok/Hälsa | Drawer behövs kvar för Valv/Kunskap — dubbel chrome OSÄKER |

---

## 5. Alignment E + referensbild

**JA:** mjuka flerlagers skuggor, rundade kort, generös padding, guld-fokal nav, lugn density, depth-linje (`0 2px 0 accent-dim`).  
**NEJ:** prod-etiketter Dagbok/Hälsa, infinite scroll feed, pulserande nav-glow.

---

## Rekommendation

Sandbox: `tactile-obsidian` + Modell A + mönster **B** (långtryck Valv) eller **C** (progressiv drawer). Behåll alla locked delegates; byt endast chrome. Nästa: S7 säkerhetsgranskning av deniability i ny nav.
