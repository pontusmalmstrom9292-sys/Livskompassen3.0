# Kapitel 30 — Prestanda

> **Status:** Kanon  
> **Referens-enhet:** Motorola G85 (Android, Capacitor, gratis tier)  
> **Källor:** `premium-ui.mdc` · `chameleon-ui-modularity.mdc` · `ai-governance-self-review.mdc` · `.orkester/copilot-yolo-queue.json`

---

## 1. Syfte

Premium UI får **aldrig** offra prestanda. Målet: appen känns handgjord och flytande på G85 — utan onödiga omladdningar, tunga blur-lager eller bundle-bloat.

**Grundregel (premium-ui):** Refine, don't rebuild — optimering ska vara kirurgisk, inte arkitekturbyte.

---

## 2. Memoization

### 2.1 När

| Teknik | Användning |
|--------|------------|
| `React.memo` | Lista-items, delegate-komponenter, dock-ikoner |
| `useMemo` | Dyra derivat (filtrerade listor, sortering) |
| `useCallback` | Handlers till memo-barn, Firestore listeners |
| `useRef` | Värden som inte ska trigga re-render |

### 2.2 När inte

- Premature memo på triviala komponenter (< 5 rader JSX).
- `useCallback` utan memo-barn — onödig komplexitet.
- Memo som döljer buggar i stale closures — testa beteende först.

### 2.3 Chameleon / SuperModule

- Delegates (`FamiljenBarnfokusDelegate`, `DagbokInputDelegate`) ska inte re-rendera hela shell vid mode-byte.
- `ChameleonInputShell` — morph-state isolerat; logic i hooks, skin i styles.

---

## 3. Lazy loading

### 3.1 Route-level code splitting

**Kanon (YOLO-kö):** Dynamic `import()` för tunga zoner:

```tsx
// Mönster — /valvet och /familjen chunks
const VaultPage = lazy(() => import('./VaultPage'));
const FamiljenPage = lazy(() => import('./FamiljenPage'));
```

Mål: minska initial bundle — G85 cold start.

### 3.2 Komponent-level

- Modaler, tunga paneler (Kunskapsbank, Orkester) — lazy när de inte är above-the-fold.
- Admin/dev-routes — alltid lazy (`/dev/*`).

### 3.3 Data

- Firestore: paginera listor; undvik N+1 i render loops.
- Bilder: lazy + rätt storlek (se §6).

---

## 4. backdrop-blur — kostnad

Glasestetik är **signatur** (DAD) — men `backdrop-filter: blur()` är GPU-tungt, särskilt på G85.

### 4.1 Riktlinjer

| Klass | Användning | Kostnad |
|-------|------------|---------|
| `backdrop-blur-sm` | Små overlays, hints | Låg |
| `backdrop-blur-md` | Kort, paneler | Medel |
| `backdrop-blur-xl` / `2xl` | Header, drawer, SOS | Hög — max ett lager i viewport |

### 4.2 Regler

- **Max 1–2** blur-lager synliga samtidigt i viewport.
- Undvik blur **på blur** (nested glass panels).
- Fullscreen SOS (`backdrop-blur-2xl`) — acceptabelt (sällan, kort session).
- Preferera **semi-opak `bg-surface-2/80`** framför extra blur om prestanda sjunker.
- Testa scroll jank på G85 efter ny hub med flera `backdrop-blur-md` kort.

### 4.3 Alternativ vid behov

- Solid token-bakgrund + subtil border (`border-border/40`) istället för blur.
- CSS `will-change` sparsamt — inte på hela listor.

---

## 5. Lighthouse

### 5.1 Mål (web build, referens)

| Kategori | Mål | Notering |
|----------|-----|----------|
| Performance | ≥ 85 | Mörk glass-app — realistiskt tak |
| Accessibility | ≥ 90 | Se kapitel 28 |
| Best Practices | ≥ 90 | HTTPS, inga deprecated APIs |
| SEO | N/A | SPA bakom auth — låg prioritet |

### 5.2 Vanliga regressionskällor

- Obundna stora bilder i `/public/design/`
- Sync third-party scripts (undvik i prod)
- Main-thread block vid stora JSON-imports
- Framer Motion på listor med 100+ items utan virtualisering

### 5.3 Körning

```bash
npm run build
# Lighthouse CLI eller Chrome DevTools → Production build preview
```

---

## 6. Motorola G85 — specifika mål

### 6.1 Enhetsprofil

- Mid-range Android, Capacitor WebView
- Primär testtelefon för Pontus — **gratis tier**, ingen scope creep på native features

### 6.2 Mått

| Mått | Mål |
|------|-----|
| Touch response | < 100 ms perceived (optimistic UI) |
| Route transition | < 300 ms till första paint (lazy chunks prefetch vid hover om web) |
| Scroll | 60 fps på hub-listor (ingen blur-stacking) |
| Cold start | Minimera main bundle — zone lazy routes |
| Minne | Undvik stora canvas/SVG-animationer i bakgrund |

### 6.3 Android sync

Efter prestanda-kritisk web-ändring:

```bash
npm run build:web && npx cap sync android
```

Gradle Sync → Clean → Run på enheten.

---

## 7. Bilder & assets

- WebP/AVIF där möjligt; PNG för kanon-referenser ok i `/public/design/`.
- `loading="lazy"` på below-fold bilder.
- SVG för kompass (custom, låst) — inte raster upscale.
- Theme preview-bilder — endast Theme Lab, inte bundled i main chunk.

---

## 8. Rerender & state

- Håll Firestore listeners i hooks/services — inte i varje leaf component.
- Context: dela upp (auth vs theme vs hub) — undvik global re-render.
- Zustand/store: selektorer för granular subscribe.

---

## 9. Scale-to-zero (GCP)

Prestanda inkluderar **kostnad**:

- Cloud Functions: kalla start acceptabel — onödiga triggers nej (`GCP-KOSTNADSVAKT.md`).
- Inga polling-loops i klienten mot Firestore utan backoff.
- RAG/LLM — server-side, inte i render path.

---

## 10. Verifiering

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
# Vid route-split-ändring:
npm run smoke:orkester
```

**Self-review #2:** No unnecessary deps; `prefers-reduced-motion`; scale-to-zero.

---

## 11. Anti-mönster

- Blur på varje kort i en 20-items lista
- `import entire library` (lodash full, icon packs)
- Synkron tunga beräkningar i render
- Nya npm-paket för en 10-raders utility
- Animera `box-shadow` på scroll (prefer transform/opacity)

---

## 12. Pekare

| Resurs | Sökväg |
|--------|--------|
| Reduced motion | `src/design-system/motion/useDsReducedMotion.ts` |
| Lazy routes (exempel) | `.orkester/copilot-yolo-queue.json` |
| Android sync | `.cursor/rules/android-capacitor.mdc` |
| Kostnad | `docs/governance/GCP-KOSTNADSVAKT.md` |
| Blur i kodbas | grep `backdrop-blur` i `src/modules/` |

---

*SLUT KAPITEL 30*
