# Core-SPEC

Källa: app-shell + Kladd 2026-05-21. Konsoliderad till `.context/modules/core.md`.

**Kladd-master:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §G, §H.

## 1. Syfte och användarbehov

Delad infrastruktur: layout, navigation, design tokens, auth-gate hooks, Zero Footprint, Kill Switch. Alla moduler bygger på samma Obsidian Calm och säkerhetskontrakt.

## 2. Route och ingång

- **MainLayout** omsluter alla routes
- **FloatingDock** — primär navigation
- **Fyren:** 3s long-press BookOpen → `/dagbok?tab=bevis`

## 3. UX-flöde (Progressive Disclosure)

Globalt: en primär handling per vy i moduler; core levererar chrome only.

**Fyren:** progress ring → WebAuthn (MVP) → PIN → valv-flik.

**Shake-to-Kill:** 15 m/s², debounce 2s → `invalidateSession` + `/`.

## 4. Visuell design (Obsidian Calm)

- `docs/specs/design-master.md` — tokens i `core/ui/tokens.ts`
- `AmbientBackground`, `BentoCard`, `StepIndicator`, `PinGate`
- **Förbjudet (Kladd):** natur/grön palett, stjärnbilder, gamification

## 5. Datamodell (Firestore)

Core äger inga produktcollections — delar `types/firestore.ts` schemas.

## 6. Backend och agenter

- Firebase init (`europe-west1`)
- Inga LLM i core

## 7. Säkerhet

- `isVaultUnlocked` i store — rensa vid logout (**audit planerad**)
- Kill Switch global
- WebAuthn + PIN (valv)
- Zero Footprint: `useZeroFootprint`, visibility handlers

## 8. Status idag vs planerat

| Område | Kladd 2026-05-21 | Kod |
|--------|------------------|-----|
| MainLayout + Dock + Ambient | Obsidian Calm | **done** |
| Fyren 3s + WebAuthn hook | Valv-ingång | **done** |
| Shake-to-Kill 15 m/s² | Kill Switch | **done** |
| Design system `core/ui` | | **done** |
| Zero Footprint sign-out audit | | **planned** |
| BodySignalChip (valv) | Text-chips idag | **planned** |
| Dold nödknapp shake | iOS PWA test | **planned** |
| Stjärnbilder / grön UI | **Avvisat** | — |

## 9. Acceptanskriterier

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | Alla moduler använder `BentoCard`/tokens | **done** |
| 2 | Fyren 3s öppnar bevis-flik efter gate | **done** |
| 3 | Shake triggar kill switch | **done** |
| 4 | Vault unlock rensas vid session end | **partial** |

## 10. Kopplingar

- **Kompis** — `KompisAvatar` i MainLayout
- **Verklighetsvalvet** — Fyren, PIN, shake
- **Alla moduler** — AuthGate, Firestore helpers

## 11. Navigation

**Aktiv:** Modulhub Variant C — se [`docs/specs/navigation-master.md`](../navigation-master.md).

- **L1:** [`FloatingDock`](../../src/modules/core/layout/FloatingDock.tsx) + [`ModuleHubPanel`](../../src/modules/core/layout/ModuleHubPanel.tsx) — fem livsområden
- **L2:** Kluster-flikar på `/dagbok` och `/vardagen` (`?tab=`)
- **L3:** Modul-läge lokalt (t.ex. Valv Logga/Sök; Dossier → `/dossier`)
- **Config:** [`src/modules/core/navigation/appNavigation.ts`](../../src/modules/core/navigation/appNavigation.ts) — single source för hub, hem och flikar
- **UI:** [`ClusterShell`](../../src/modules/core/ui/ClusterShell.tsx) på klustersidor

## 12. Tidigare diskussioner att bevara (vision)

- Sub-Synaptic / WebGL bakgrund när performance kräver det.
- Plausible deniability: yttre ska se dagbok, inte valv — Fyren som muskelminne.
- Scale-to-zero GCP — ingen mock-säkerhet.

## 13. Avvisade eller alternativa idéer

- **Stjärnbilder, streaks, frö/löv** — avvisat (Kladd §G, §H.2).
- **Nordisk skymning grön / natur-UI** — avvisat; Obsidian Calm låst.
- **Shield som egen dock-ikon** — avvisat; Fyren på BookOpen.
- **GAS / Express legacy server** — avvisat; `functions/` only.

---

**Module plan:** [`src/modules/core/module_plan.md`](../../../src/modules/core/module_plan.md)  
**Design:** [`docs/specs/design-master.md`](../design-master.md)
