# Brusfiltret SuperModule Lab — verifiering

**Datum:** 2026-06-19  
**Branch:** `cursor/brusfiltret-lab-verify-82f5`  
**Status:** **PASS** (build + routing + smoke:brusfiltret-lab + GAP stängda)

---

## Snabbtest

```bash
npm install
npm run build
npm run dev
```

| Steg | URL / åtgärd | Förväntat |
|------|----------------|-----------|
| 1 | Öppna `/dev/theme-lab` | Länk **Brusfiltret SuperModule B** syns under SuperModule |
| 2 | Klicka länken eller gå till `/dev/theme-lab/brusfiltret-supermodule` | Lab-sida laddas (lazy chunk `BrusfiltretSupermoduleLabPage`) |
| 3 | Flikrad | Fyra flikar: Klistra in · Svar · JADE · Spara |
| 4 | **Demo-läge** (default) | Mock textarea + lokal JADE-regex + timeout-svar — **ingen backend** |
| 5 | **Live BiffPublicPanel** (knapp i header) | Prod-panel för jämförelse — anropar Hamn-wire endast om användaren skickar |
| 6 | Footer | Taktik-lexikon-knapp (inaktiv stub) + hjälptext |
| 7 | Länk **Prod Brusfiltret** | `/widget/hamn` |
| 8 | Länk **← Theme Lab** | `/dev/theme-lab` |

---

## Kodkartläggning

| Kontroll | Fil | Resultat |
|----------|-----|----------|
| Dev-route | `AppRoutes.tsx` → `/dev/theme-lab/brusfiltret-supermodule` | PASS — ej `ProtectedModule`, ej ny prod-route |
| Sandbox shell | `src/modules/sandbox/brusfiltret/BrusfiltretSupermoduleShell.tsx` | PASS — isolerad komponent |
| Lab-sida | `src/modules/core/pages/BrusfiltretSupermoduleLabPage.tsx` | PASS |
| CSS | `src/styles/theme-lab-brusfiltret-supermodule.css` (import i `index.css`) | PASS |
| Kanon | `docs/design/references/BRUSFILTRET-MODUL-KANON.md` | PASS — Variant B dokumenterad |
| Theme Lab-länk | `ThemeLabPage.tsx` MOCKUP_LINKS | PASS |

---

## SuperModule-mönster (ej ChameleonInputShell)

Variant B använder **explicit flikrad** (`role="tablist"`) ovanför body — enligt kanon § *Utökning till SuperModule*, inte `ChameleonInputShell` / `useChameleonMorph` (som Dagbok använder för mode-byte in-place).

Detta är avsiktligt: Brusfiltret SuperModule har separata lägen (klistra → svar → JADE → spara), inte opacity-morph mellan delegates.

---

## Sandbox-isolering

| Område | Bedömning |
|--------|-----------|
| `functions/` | Ej ändrad |
| `firestore.rules` | Ej ändrad |
| Nya prod-routes | Inga |
| Mock-läge | `setTimeout` + lokala strängar — helt offline |
| Live-läge | Valfri inbäddning av `BiffPublicPanel` — samma som `/widget/hamn`; använd **Demo-läge** för ren offline-granskning |

---

## Kända GAP (ej blockerande)

| ID | Beskrivning | Status |
|----|-------------|--------|
| GAP-BF-IMG | Referens-PNG via Vite-import (bundlad) — inte `/public/` 404 | **Stängd** 2026-06-19 |
| GAP-BF-DEFAULT | Default Demo-läge (`livePanel=false`) | **Stängd** 2026-06-19 |

---

## Smoke

```bash
npm run smoke:brusfiltret-lab
```

---

## Build (2026-06-19, polish)

```
npm run build → PASS
tsc -b && vite build → ✓ built in ~15s
Chunk: BrusfiltretSupermoduleLabPage-*.js (~7 kB gzip ~2.6 kB)
```

---

## YOLO-vakt (lab-scope)

| Check | Status |
|-------|--------|
| Tre silos / ingen cross-RAG i lab | PASS |
| LLM beslutar inte auth/WORM | PASS (mock) |
| Locked UX orörd | PASS |
| Inga backend-ändringar | PASS |

**GO** för merge av verify-doc only.
