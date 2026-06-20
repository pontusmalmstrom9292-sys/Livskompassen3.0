# PR #48 — Säker dependency-split plan

**Datum:** 2026-06-20  
**Ursprunglig PR:** [#48](https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0/pull/48) — Dependabot bulk (12 paket)  
**Status:** Stäng #48. Hantera i 4 separata vågorna nedan.

---

## Bakgrund

PR #48 buntar ihop 5 MAJOR-versionshopp med 7 säkra minor/patch-uppdateringar. Det är för riskabelt att merga som en enhet — ett enskilt bröl döljs av de andra.

**Verifierat säkra (minor/patch):**
| Paket | Från | Till |
|-------|------|------|
| `@capacitor-firebase/authentication` | 8.2.0 | 8.3.0 |
| `@capacitor/android` | 8.3.4 | 8.4.1 |
| `@capacitor/core` | 8.4.0 | 8.4.1 |
| `date-fns` | 4.1.0 | 4.4.0 |
| `firebase` | 12.13.0 | 12.15.0 |
| `react-router-dom` | 7.15.1 | 7.18.0 |
| `zustand` | 5.0.13 | 5.0.14 |

**Kräver separat hantering (MAJOR):**
| Paket | Från | Till | Filer berörda |
|-------|------|------|---------------|
| `react` + `react-dom` | 18.3.1 | 19.2.7 | ~444 filer |
| `framer-motion` | 11.18.2 | 12.40.0 | 15 filer |
| `lucide-react` | 0.368.0 | 1.21.0 | 325 filer |
| `tailwind-merge` | 2.6.1 | 3.6.0 | 1 fil |

---

## Våg 1 — Säkra patches (gör nu, ingen risk)

**Åtgärd:** Kör manuellt i root:
```bash
npm install \
  @capacitor-firebase/authentication@8.3.0 \
  @capacitor/android@8.4.1 \
  @capacitor/core@8.4.1 \
  date-fns@4.4.0 \
  firebase@12.15.0 \
  react-router-dom@7.18.0 \
  zustand@5.0.14 \
  --legacy-peer-deps
```

**Gate:**
- [ ] `npm run build` PASS
- [ ] `npm run smoke:predeploy` PASS
- [ ] Commit + PR

---

## Våg 2 — tailwind-merge 2→3 (enkel, 1 fil)

**Berör:** `src/modules/features/lifeJournal/evidence/kompis/components/KompisAvatar.tsx`

**Breaking changes i v3:**
- `twMerge` och `extendTailwindMerge` fungerar som förut
- Standardkonfigurationen har strikte regler för `border-*` och `ring-*` klasser
- Kolla att inga dynamiska Tailwind-klasser i KompisAvatar slås ihop fel

**Åtgärd:**
```bash
npm install tailwind-merge@3.6.0 --legacy-peer-deps
```

**Gate:**
- [ ] `npm run build` PASS
- [ ] Visuell koll på KompisAvatar i appen
- [ ] `npm run smoke:locked-ux` PASS

---

## Våg 3 — lucide-react 0.368 → 1.21 (stor yta, låg risk)

**Berör:** 325 filer — men API är oförändrat. Ikoner heter samma sak.

**Enda risken:** ett fåtal ikoner döptes om i v1.0. Kontrollera:
- `ArrowUpDown` → kvar ✅
- `CheckCircle2` → kvar ✅  
- `Anchor`, `Compass`, `Sparkles`, `Loader2` → alla kvar ✅
- Kör `npm run build` — TypeScript-fel om en ikon saknas syns direkt

**Åtgärd:**
```bash
npm install lucide-react@1.21.0 --legacy-peer-deps
```

**Gate:**
- [ ] `npm run build` PASS (inga missing icon-imports)
- [ ] Spot-check 5 skärmar visuellt

---

## Våg 4 — framer-motion 11→12 (15 animerade komponenter)

**Berörda filer:**
- `ParalysisBreaker.tsx`, `BarnportenPage.tsx`, `BarnportenLevelTwoStage.tsx`
- `ArchiveCalendarView.tsx`, `ArchiveHub.tsx`, `ArchiveShelf.tsx`, `ArchiveListView.tsx`
- `QuickCaptureOverlay.tsx`, `Tidshjulet.tsx`, `SOSOverlay.tsx`
- `BreathingExercise.tsx`, `WeeklySummary.tsx`, `DailySummaryCard.tsx`
- `ReflectionPage.tsx`, `DailyTasksList.tsx`

**Breaking changes i v12:**
- `AnimatePresence` — `mode` prop finns kvar, men exit-timing ändrades
- `motion` layout-animationer — `layoutId` synkroniseras annorlunda
- `BreathingExercise` använder troligen `animate` med keyframes — kontrollera

**Åtgärd:**
```bash
npm install framer-motion@12.40.0 --legacy-peer-deps
```

Testa specifikt:
- SOSOverlay (exit-animationer kritiska för UX)
- QuickCaptureOverlay (slide-in/out)
- BreathingExercise (cirkel-animation)
- ArchiveHub (list-transitions)

**Gate:**
- [ ] `npm run build` PASS
- [ ] Manuell test av SOSOverlay + QuickCaptureOverlay + BreathingExercise
- [ ] `npm run smoke:locked-ux` PASS

---

## Våg 5 — React 18→19 (SIST, mest riskfyllt)

**Scope:** ~444 filer. Gör detta i en dedikerad session med tid.

**Kända brott i din kod:**
- `React.FC` utan explicit `children?: React.ReactNode` — minst 15 komponenter:
  - `VaultOverview`, `LayoutShell`, `ToastContainer`, `Toast`, `EvolutionDevPanel`
  - `ForalderTryggDashboard`, `ForalderTryggContainer`, `SystemStatusPanel`
  - `ContentWorkspace`, `JournalTimeline`, `SmartToolbar`, `DayForensicsPanel`
  - `WeeklySummary`, `TimelineView`, `DailySummaryCard`

**Steg:**
1. `npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19 --legacy-peer-deps`
2. Kör `npm run build` — TypeScript listar alla broken `React.FC`
3. Fixa varje komponent: lägg till `children?: React.ReactNode` eller byt till `function Comp()`
4. `StrictMode` i React 19 är striktare — kör appen och kolla konsolen

**Gate:**
- [ ] `npm run build` PASS (0 TS-fel)
- [ ] `npm run smoke:predeploy` PASS
- [ ] `npm run smoke:locked-ux` PASS
- [ ] Manuell test: inloggning → Valv → Inkast → SOS-overlay

---

## Exekveringsordning

```
Stäng PR #48
  → Våg 1 (säkra patches) — 10 min
  → Våg 2 (tailwind-merge) — 15 min
  → Våg 3 (lucide-react) — 15 min
  → Våg 4 (framer-motion) — 30-45 min
  → Våg 5 (React 19) — 1-2 h dedikerad session
```

---

## Cursor-prompt för Våg 1-3 (autorun)

```text
Kör Våg 1-3 från docs/evaluations/2026-06-20-pr48-deps-safe-split.md:
1. Installera säkra patches (Våg 1)
2. Uppdatera tailwind-merge till 3.6.0 (Våg 2)  
3. Uppdatera lucide-react till 1.21.0 (Våg 3)
Kör npm run build efter varje steg. Om build PASS → commit och gå till nästa.
Stanna vid första build-fel och rapportera exakt fel + fil.
Arbeta autonomt. Rör INTE react, react-dom, framer-motion.
```

## Cursor-prompt för Våg 4 (framer-motion)

```text
Kör Våg 4 från docs/evaluations/2026-06-20-pr48-deps-safe-split.md:
Uppdatera framer-motion från 11.18.2 till 12.40.0.
Kontrollera alla 15 berörda filer för breaking changes.
Fokus: SOSOverlay, QuickCaptureOverlay, BreathingExercise exit-animationer.
npm run build PASS krävs. Stanna vid TypeScript-fel.
```

## Cursor-prompt för Våg 5 (React 19)

```text
Kör Våg 5 från docs/evaluations/2026-06-20-pr48-deps-safe-split.md:
Uppdatera react + react-dom från 18.3.1 till 19.2.7.
Fixa ALLA React.FC-komponenter som saknar explicit children prop.
Lista: VaultOverview, LayoutShell, ToastContainer, Toast, EvolutionDevPanel,
ForalderTryggDashboard, ForalderTryggContainer, SystemStatusPanel,
ContentWorkspace, JournalTimeline, SmartToolbar, DayForensicsPanel,
WeeklySummary, TimelineView, DailySummaryCard.
npm run build PASS + smoke:predeploy + smoke:locked-ux krävs.
Rör inga andra filer utöver React 19-brott.
```
