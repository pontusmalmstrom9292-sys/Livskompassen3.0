# LOST-FEATURES-REGISTER — återvinning superhub

**Datum:** 2026-06-01 · **Gren:** `main` · **Kanon:** superhub (`/liv` + fristående `/arbetsliv`)

**Syfte:** Jämförelse repomix/GitHub vs live kod — vad som finns, är partial, driftar eller förlorats.

**Status:** `live` | `partial` | `lost` | `drift` | `rejected`

---

## Ekonomi & arbetsliv

| feature_id | modul | fanns_i | finns_i_kod | route | status | återinför | risk |
|------------|-------|---------|-------------|-------|--------|-----------|------|
| ECO-01 | ekonomi | repomix EconomyPage | `features/dailyLife/wellbeing/economy/EconomyPage.tsx` | `/liv?tab=kompasser&vardagenTab=ekonomi` | **live** | nej | — |
| ECO-02 | ekonomi | repomix veckopeng/matlåda | `EconomyPage.tsx` + `economy_profiles` | samma | **live** | nej | WORM transactions |
| ECO-03 | ekonomi | repomix "Dynamiska Sparmål" | `getBudgetSavings` / `setBudgetSaving` i `timeEconomyFirestore.ts` | — (ingen UI) | **partial** | **ja P2** | — |
| ECO-04 | ekonomi | repomix lönespec UI | `EconomyPayslipCard.tsx` + `generatePayslip` | Valv PIN + `/arbetsliv?tab=tid` (Fas 2) | **partial→live** | ja P1 | WORM payslip snapshots |
| ECO-05 | ekonomi | repomix fasta räkningar | `EconomyLogPanel.tsx` | `/arbetsliv?tab=logg` | **live** | nej | — |
| ECO-06 | arbetsliv | repomix stämpel | `StampClockPage` via `ArbetslivHubPage` | `/arbetsliv?tab=stampla` | **live** | nej | — |
| ECO-07 | arbetsliv | repomix tid/flex | `TimeAndPayPanel` / `EconomyTidPanel` | `/arbetsliv?tab=tid` | **live** | nej | — |
| ECO-08 | arbetsliv | repomix sjuk/VAB forensik | `VaultEconomyPanel` | `/dagbok?tab=bevis&vaultTab=arbetsliv_franvaro` | **live** | nej | PIN/Valv |
| ECO-09 | arbetsliv | repomix lön Valv | `VaultForensicPanel` + payslip | `vaultTab=arbetsliv_lon` | **live** | nej | PIN |
| ECO-10 | ekonomi | vendor Fas 2 skatt | `functions/src/economy/vendor/` | ej UI | **partial** | defer P3 | ingen LLM i silo |
| ECO-11 | routing | `/vardagen?tab=ekonomi` | `RedirectVardagenToLiv` i `AppRoutes.tsx` | → `/liv?…&vardagenTab=ekonomi` | **live** | nej | legacy URL |
| ECO-12 | routing | `/liv?tab=ekonomi` krock | `LivShellPage` legacyRedirect | → kompasser+vardagenTab | **live** | nej | fixat superhub |
| ECO-13 | routing | `/liv?tab=logg` krock | `LivShellPage` legacyRedirect | → `/arbetsliv?tab=logg` | **live** | nej | fixat superhub |
| ECO-14 | routing | navigationRegistry `/vardagen` + arbetsliv tab | `navigationRegistry.ts` vs `AppRoutes` | registry ≠ render | **drift** | ja Fas 1 | docs only |
| ECO-15 | routing | EconomyPage → logg deep link | `EconomyPage.tsx` | `/arbetsliv?tab=logg` | **partial→live** | ja Fas 1 | — |
| ECO-16 | routing | Arbetsliv → ekonomi länk | `ArbetslivHubPage.tsx` | `/ekonomi` eller liv+vardagenTab | **partial→live** | ja Fas 1 | — |

## MåBra

| feature_id | modul | fanns_i | finns_i_kod | route | status | återinför | risk |
|------------|-------|---------|-------------|-------|--------|-----------|------|
| MAB-01 | mabra | repomix WellnessPage | `MabraPage.tsx` + hub registry | `/liv?tab=mabra` | **live** | nej | U6 bankId |
| MAB-02 | mabra | repomix andning | `BreathingExercise.tsx` | inuti MabraPage flow | **live** | nej | — |
| MAB-03 | mabra | repomix frågekort | `mabraReflectionCards.ts` + `MabraReflectionDeckTool` | hub → tool | **live** | nej | P1 bankId |
| MAB-04 | mabra | repomix mikrolekar | `MabraMicroPlayTool` + `mabraExtendedPlays.ts` | hub → tool | **live** | nej | PLAY only |
| MAB-05 | mabra | repomix känslokort | `MabraFeelingCardsTool` | hub → tool | **live** | nej | — |
| MAB-06 | mabra | repomix KBT | `KbtTransformatorPanel` + callable | MabraPage | **live** | nej | guard mabraCoachGuard |
| MAB-07 | mabra | repomix helskärm spel | — (inbäddat i layout) | `MabraToolShell` i MainLayout | **partial** | **ja Fas 3** | locked UX |
| MAB-08 | mabra | repomix streak/XP | Kladd §G | — | **rejected** | nej | Mabra-SPEC |
| MAB-09 | mabra | `mabraCoach` callable | `functions/src/index.ts` | backend | **live** | nej | — |
| MAB-10 | mabra | Vit curriculum | `VitCurriculumPanel` + `curriculumCatalog.ts` | MabraPage | **live** | nej | REFLECTION |

## Kompasser & superhub

| feature_id | modul | fanns_i | finns_i_kod | route | status | återinför | risk |
|------------|-------|---------|-------------|-------|--------|-----------|------|
| VAR-01 | kompasser | repomix DashboardPage | `DashboardPage.tsx` | `/liv?tab=kompasser` | **live** | nej | — |
| VAR-02 | superhub | plan monolit `/liv` | `LivShellPage.tsx` | `/liv` | **live** | nej | design lock |
| VAR-03 | superhub | `/vardagen` primär hub | redirect → `/liv` | legacy | **drift** | nej | medvetet |
| VAR-04 | planering | `/planering` | redirect `/liv?tab=handling` | **live** | nej | locked UX P3 |

## Medvetet borttaget

| feature_id | modul | anledning | status |
|------------|-------|-----------|--------|
| REJ-01 | core | Shake-to-Kill | **rejected** 2026-06-01 |
| REJ-02 | mabra | Gamification stjärnor | **rejected** Kladd §G |
| REJ-03 | mabra | LLM-frågekort prod utan bank | **rejected** U6 |

---

## Godkända återinföringar (implementeras)

| Prio | feature_id | Fas |
|------|------------|-----|
| P0 | ECO-05, ECO-13 | Fas 1 länkar |
| P1 | ECO-04, ECO-15, ECO-16, ECO-14 | Fas 1–2 |
| P2 | ECO-03 | Fas 2 EconomySavingsPanel |
| P3 | ECO-10 | defer |
| P1 | MAB-07 | Fas 3 immersive |

**Källor:** `docs/archive/repomix/repomix-baseline-2026-05-21-backend.md`, `docs/evaluations/2026-06-01-superhub-leverans.md`, `REFACTOR_DIAGNOSTICS.md`, grep `src/modules/features/dailyLife/`.
