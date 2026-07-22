# FP-TI-S8 — Vågplan, budget, Android blur-risker

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S8` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast — prod merge kräver PMIR |
| **Specialist** | `livskompassen-master-architect` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |

---

## 1. Mål

Pixel-exakt FP-TI executive chrome i Design Freeport utan att migrera prod Obsidian Calm 2.0.

**Route:** `/dev/design-freeport` · **Tema:** `tactile-obsidian` · **Gate:** S15 screenshot diff ≤ 2 %.

---

## 2. Vågplan

| Våg | Leverans | Filer | Smoke |
|-----|----------|-------|-------|
| **W0** | Research S11–S16 (denna mapp) | `docs/evaluations/research-raw/tactile-inspiration/*` | — |
| **W1** | CSS tokens S12 + exec-primitives S14 | `design-freeport.css` | `smoke:design-freeport` |
| **W2** | 5-slot nav + RESURSER overlay S13/S5 | `ExecutiveExactBottomNav`, `ExecutiveResourcesOverlay` | + snapshot |
| **W3** | EKONOMI lab S4 | `FreeportEkonomiLab.tsx` | snapshot skärm 2 |
| **W4** | DAGBOK + MåBra S6 | `FreeportHjartatHub` utökning | `smoke:innehall` vid prod-wire |
| **W5** | INSTÄLLNINGAR + logout S7 | `FreeportSettingsLab.tsx` | `smoke:plausible-deniability` |
| **W6** | Playwright gate S15 | `scripts/visual/fp-ti/*.spec.ts` | `smoke:fp-ti-visual` |
| **W7** | Jury gap closure S16 | — | alla snapshots PASS |

**Ingen prod-deploy** förrän W6 PASS + PMIR godkänd.

---

## 3. Budget (skala-till-noll)

| Post | Kostnad | Not |
|------|---------|-----|
| CSS/JS sandbox | `0 kr` | lokalt |
| Playwright CI | `0 kr` | GitHub Actions free tier |
| Firestore reads i lab | `0 kr` | mockdata only |
| Screenshot storage | `<50 MB` | `docs/design/references/fp-ti-baselines/` |
| Vertex / LLM | `0 kr` | ingen AI i FP-TI wave |
| Firebase deploy | `0 kr` | hosting endast vid prod-merge (ej FP-TI) |

**Förbjudet:** Cloud Functions för tema-switch · externa font-CDN utan self-host.

---

## 4. Android / Capacitor-risker

| Risk | Orsak | Mitigation |
|------|-------|------------|
| `backdrop-filter: blur(12px)` på nav | WebView GPU — jank på äldre Android | Fallback: `background: rgba(0,0,0,0.95)` utan blur |
| `box-shadow` 3-lager | Overdraw | Behåll max 3 lager (S12) |
| Cinzel font FOUT | Kapacitor asset load | `font-display: swap`; preload i `index.html` |
| FAB `margin-top: -24px` | Clip av `overflow:hidden` parent | `.design-freeport__phone { overflow: visible }` |
| Safe area inset | Android gest nav | `padding-bottom: env(safe-area-inset-bottom, 34px)` på nav |
| APK-storlek | Extra PNG baselines | Baselines i repo, ej i APK |

**Test:** `npm run build:web && npx cap sync android` efter W2; manuell Run på fysisk enhet.

---

## 5. Arkitekturgränser

| Gräns | Regel |
|-------|-------|
| Prod CSS | `obsidian-calm-2.css` orörd |
| Sandbox CSS | `design-freeport.css` + `.design-freeport__exec-*` |
| Ikoner | D1 `LivskompassMark` i FAB — `smoke:locked-icons` |
| IA | Prod 3-zon låst; ref 5-slot endast sandbox |
| RAG / silos | U1 — ingen cross-RAG i chrome-arbete |

---

## 6. Definition of Done (FP-TI exact)

1. 5 skärmar snapshot PASS (S15).
2. 10 jury-gaps stängda (S16).
3. `npm run smoke:design-freeport` PASS.
4. `npm run build` PASS.
5. PMIR skriven — **ej** merge utan Pontus OK.

---

## 7. Nästa konkreta steg (W1)

Infoga S12 CSS-block + S14 primitives i `design-freeport.css` under kommentar `/* FP-TI exact */`.
