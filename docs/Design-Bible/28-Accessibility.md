# Kapitel 28 — Tillgänglighet (Accessibility)

> **Status:** Kanon · Executive Midnight DAD v1.0  
> **Målgrupp:** Lead UI Engineer, alla agenter som rör `src/**`  
> **Källor:** `premium-ui.mdc` · `component-standards.mdc` · `chameleon-ui-modularity.mdc` · `ai-governance-self-review.mdc` · `ai-cognitive-companion.mdc`

---

## 1. Syfte

Livskompassen är ett **neuroanpassat premium Life OS**. Tillgänglighet är inte ett tillägg — det är kärnan i produktlöftet: lugn, tydlighet och låg kognitiv belastning för användare med ADHD, GAD och utmattning.

Detta kapitel definierar minimikrav för:

- WCAG 2.1 nivå **AA**
- **44 px** touch-ytor (Motorola G85)
- **`prefers-reduced-motion`**
- **Svenska** skärmläsar-etiketter
- **Kognitiv** tillgänglighet (progressive disclosure)

---

## 2. WCAG AA — minimikrav

### 2.1 Kontrast

Executive Midnight bygger på mörk marinblå/svart bas med varm guldaccent. AA kräver:

| Element | Krav | Praktik i Livskompassen |
|---------|------|-------------------------|
| Brödtext | ≥ 4.5:1 mot bakgrund | `text-text`, `text-text-muted` — tokens, inte `#fff/60` ad hoc |
| Stora rubriker (≥ 18px bold / 24px) | ≥ 3:1 | `ds-header__title`, hub-rubriker |
| Interaktiva kontroller | ≥ 3:1 mot intilliggande yta | Knappar, fokusring, dock-ikoner |
| Ikon-only knappar | Etikett + kontrast | `aria-label` på svenska (se §5) |

**Glas och blur:** Semi-transparenta ytor (`bg-surface-2/70`, `backdrop-blur-md`) får **inte** sänka kontrast under AA. Verifiera mot den faktiska composited bakgrunden — inte bara token-värdet i isolering.

### 2.2 Fokus & tangentbord

- Alla interaktiva element ska nås med **Tab** och aktiveras med **Enter/Space**.
- Fokus ska vara **synlig** — använd befintliga DS-klasser (`focus-visible:ring-*`, `header-chrome-btn` m.m.).
- Inga **keyboard traps** i modaler utan tydlig stängning (`Escape`, fokusåterställning).
- Skip-länkar behövs sälligen (mobil-first), men hub-navigation ska ha logisk tab-ordning.

### 2.3 Semantik

- En `<h1>` per vy (header/titel).
- `<nav aria-label="…">` för hub-navigatorer (t.ex. Planering, drawer).
- `<button>` för handlingar, `<a>` för navigation — blanda inte utan skäl.
- `role="group"` + `aria-label` för valgrupper (känslor, kroppsstatus, lägen).

---

## 3. Touch-ytor — 44 × 44 px (G85)

**Kanon:** Motorola G85 är referens-enhet. Mobil-first; inga hover-only kritiska flöden.

### 3.1 Regel

Minsta **tryckyta** (hit area) = **44 × 44 CSS-pixlar** för alla primära kontroller:

```tsx
// Tailwind — föredraget mönster
className="min-h-[44px] min-w-[44px] touch-manipulation"

// Executive-komponenter
// ExecutiveSettingsList, ExecutiveChecklistCard, HeaderButton, NavItem
```

### 3.2 Undantag

- Sekundära inline-länkar i brödtext får vara mindre om de har tillräcklig vertikal padding i sin rad.
- Dekorativa element (tick marks på kompassen) — inte interaktiva.
- **Aldrig** undantag på SOS, Barnporten, spara/stäng, eller dock-navigation.

### 3.3 Verifiering

- Visuell inspektion i Theme Lab / dev tools (bounding box).
- `smoke:locked-ux` indirekt via executive-komponenter.
- Efter web-ändring som ska till telefon: `npm run build:web && npx cap sync android`.

---

## 4. Reduced motion

**Kanon:** Respektera `prefers-reduced-motion: reduce`. Animation ska förstärka lugn — aldrig distrahera eller trigga illamående.

### 4.1 Design system-hook

```ts
// src/design-system/motion/useDsReducedMotion.ts
import { useDsReducedMotion, dsMotionOrInstant } from '@/design-system/motion/useDsReducedMotion';
```

- `useDsReducedMotion()` — läser Framer Motion `useReducedMotion`.
- `dsMotionOrInstant(reduced, fullProps, instantProps?)` — nollställer `transition.duration` vid reduce.

### 4.2 Regler

| Tillåtet (full motion) | Vid reduced motion |
|-----------------------|-------------------|
| Opacity fade | Instant eller max 0 ms |
| Subtil scale (0.98 press) | Ingen scale |
| Blur-in transitions | Ingen blur-animation |
| Spring physics | Linear instant |

### 4.3 CSS

- Använd `@media (prefers-reduced-motion: reduce)` i global CSS för keyframe-animationer som inte går via Framer Motion.
- **Chameleon morph (~350 ms):** behåll fade men hoppa över parallax/scale om reduced.

---

## 5. Svenska skärmläsar-etiketter

**Språk:** Svenska i `aria-label`, `aria-labelledby`, knapp-texter och live regions — appen är svensk.

### 5.1 Mönster

```tsx
<button aria-label="Stäng SOS-läge" … />
<button aria-label={isRecording ? 'Stoppa inspelning' : 'Starta inspelning'} … />
<nav aria-label="Planeringsverktyg per kategori" … />
<div role="group" aria-label="Känslor"> … </div>
```

### 5.2 Regler

- **Ikon-only:** alltid `aria-label` på svenska — aldrig bara `title`.
- **Tillstånd:** dynamiska etiketter vid toggle (spela/stoppa, öppen/stängd).
- **Dold visuell text:** om endast ikon syns, etiketten ska beskriva **handlingen**, inte ikonens form.
- **Engelska tekniska termer:** undvik i SR-etiketter ("Submit" → "Spara", "Close" → "Stäng").
- **`aria-hidden="true"`** på dekorativa SVG:er bredvid synlig text.

### 5.3 Live regions

- Toasts, spara-bekräftelser, optimistisk feedback: `role="status"` eller `aria-live="polite"`.
- Kris/SOS: tydlig etikett utan att skapa panik — faktisk, kort svenska.

---

## 6. Kognitiv tillgänglighet

**Kanon:** `ai-cognitive-companion.mdc` — progressive disclosure, ett steg i taget, minimal kognitiv belastning.

### 6.1 Progressive disclosure

- Max **4–6** synliga val i Chameleon mode-picker; resten via drawer/steg 2.
- **Ett primärt CTA** per kort/sektion när möjligt.
- Undvik väggar av text — korta stycken, hub-specifik hierarki (DAD home screen).

### 6.2 ADHD-säker feedback

- Optimistisk sparning (Familjen Barnfokus) — omedelbar visuell bekräftelse.
- Tydliga tomma tillstånd (`EmptyState`) — vad händer härnäst?
- Inga tidsbegränsade modaler för kritiska flöden utan förlängning.

### 6.3 Hypervigilans & lugn

- Inga blinkande element, countdown-pressure eller röda varningsflöden utanför SOS.
- Executive Midnight: lugn rörelse, inga "gamified" distraktioner.
- **Paralys-Brytaren-ton:** bryt overwhelm till ett testbart mikrosteg.

### 6.4 Läsbarhet

- Typografi: Cormorant (display) + Inter (body) — tokens i `typography.ts`.
- Radlängd och spacing via design tokens — inga magic numbers.
- Hub-lås: `hub-view-lock` + `calm-scroll-island` — förutsägbar scroll på G85.

---

## 7. Komponentkrav (component-standards)

Varje komponent ska vara:

| Krav | Tillgänglighetsimplikation |
|------|---------------------------|
| Accessible | WCAG AA + SR + keyboard |
| Responsive | 320–1440 px, dock clearance |
| Token based | Kontrast via tokens, inte hex |
| Animated | Respekterar reduced motion |
| Single responsibility | Tydlig fokus för SR |

---

## 8. Test & verifiering

### 8.1 Automatiskt

```bash
npm run build
npm run smoke:locked-ux      # executive 44px, locked chrome
npm run smoke:design-modules # DS-moduler
```

### 8.2 Manuellt (rekommenderat vid UI-PR)

- VoiceOver (macOS/iOS) eller TalkBack (Android G85) — svenska etiketter.
- Tangentbord-only genomgång av ny vy.
- DevTools → Rendering → `prefers-reduced-motion: reduce`.
- Lighthouse Accessibility ≥ 90 (se kapitel 30).

### 8.3 Self-review checklist

Från `ai-governance-self-review.mdc`:

- Fokus synlig
- aria-labels
- 44 px touch
- Kontrast på navy/glass

---

## 9. Förbjudet (anti-mönster)

- Hover-only kritiska actions (ingen motsvarighet för touch).
- `outline: none` utan synlig `focus-visible`-ersättning.
- Engelska `aria-label` i produktions-UI.
- Autoplay-animationer som ignoreras reduced motion.
- Små hit areas (< 44 px) på primära flöden.
- Färg som enda bärare av information (lägg till ikon/text).

---

## 10. Pekare & relaterade kapitel

| Resurs | Sökväg |
|--------|--------|
| Reduced motion hook | `src/design-system/motion/useDsReducedMotion.ts` |
| Header 44px | `src/design-system/components/Header.tsx` |
| Nav 44px | `src/design-system/components/Navigation.tsx` |
| Chameleon mobil | `.cursor/rules/chameleon-ui-modularity.mdc` |
| Kognitiv companion | `.cursor/rules/ai-cognitive-companion.mdc` |
| Performance (blur) | `29-Dark-Mode.md` · `30-Performance.md` |
| AI-beslut | `32-AI-Rules.md` |

---

*SLUT KAPITEL 28*
