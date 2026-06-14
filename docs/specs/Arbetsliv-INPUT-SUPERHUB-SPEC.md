# Arbetsliv — Universal Input Superhub (SPEC)

**Datum:** 2026-06-14  
**Status:** **Godkänd för implementation (Fas 10A→10C)** — W2 routerskelett  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §8 · [`module_plan.md`](../../src/modules/features/dailyLife/arbetsliv/module_plan.md)  
**Analys:** [`docs/evaluations/2026-06-14-arbetsliv-superhub-djupanalys.md`](../evaluations/2026-06-14-arbetsliv-superhub-djupanalys.md)  
**Referensmönster:** [`Ekonomi-INPUT-SUPERHUB-SPEC.md`](./Ekonomi-INPUT-SUPERHUB-SPEC.md) · [`Familjen-INPUT-SUPERHUB-SPEC.md`](./Familjen-INPUT-SUPERHUB-SPEC.md)

---

## 1. Syfte

Ersätta **TabBar-växling** mellan stämpel, tid och logg med en polymorf **Universal Input Hub** — `ArbetslivInputSuperModule` — där användaren byter **läge** utan sidbyte.

Arbetsliv förblir **vardagszon** (stämpel och flex öppna). Frånvaro och lönespec stannar under **Valv** (PIN). Superhubben är **inmatnings-yta** för `time_entries` och `economy_ledger`, inte ersättning för Valv-forensik eller Ekonomi Superhub.

---

## 2. Scope och avgränsning

### In scope (W2)

- Router-komponent + lägesväxlare (tre primärlägen)
- Tre delegate-paneler → befintliga komponenter (**oförändrade**)
- Shadow route: `/arbetsliv/input?inputMode=…`
- Valv-CTA via `vaultDrawerPath` (frånvaro, lön)
- Färgburkar: guld zon (`glow-bottom-gold`, `calm-card`)
- Smoke: `scripts/smoke_arbetsliv_superhub.mjs`

### Out of scope (v1)

- Ny Firestore-samling
- Ändring av `StampClockPage`, `EconomyTidPanel`, `EconomyLogPanel`
- Ändring av `generatePayslip` callable
- Montering i `AppRoutes` / `ArbetslivHubPage` (**W3**)
- Kapacitetsstyrd gating (Arbetsliv har ingen evolution_hub-nivå idag — alla tre lägen alltid synliga)
- `CaptureSuperModule` variant arbetsliv (framtida Fas 10D)

### Skild från (oförändrat)

| Zon | Roll |
|-----|------|
| **Valv** | Frånvaro, lön, payslip WORM — PIN |
| **Ekonomi Superhub** | Vardagsekonomi — bro-länk hit, **ingen** ledger-write |
| **Planering** | Kanban — separat zon |

---

## 3. Kärnarkitektur

### 3.1 Komponentträd

```
src/modules/features/dailyLife/arbetsliv/
  supermodule/
    ArbetslivInputSuperModule.tsx   # Canonical router — NO Firestore
    arbetslivInputModes.ts          # Mode union, labels, metadata
    index.ts
    delegates/
      ArbetslivStamplaDelegate.tsx  # Fas 10C
      ArbetslivTidDelegate.tsx      # Fas 10C
      ArbetslivLoggDelegate.tsx     # Fas 10C
  routing/
    ArbetslivInputRoutes.tsx        # Shadow /arbetsliv/input
```

### 3.2 Arkitekturregler

| Regel | Krav |
|-------|------|
| Tunn router | `ArbetslivInputSuperModule` delegerar — **inga** Firestore-anrop |
| Writes | Endast via wrappade paneler (befintliga helpers) |
| Container | `calm-card glow-bottom-gold overflow-hidden rounded-2xl` |
| Mode union | Alla mode-strängar **endast** i `arbetslivInputModes.ts` |
| Valv-nav | **Endast** `vaultDrawerPath()` — aldrig inline Valv-paneler |

### 3.3 Delegate-kontrakt

| Delegate | Wrappar | Write-target |
|----------|---------|--------------|
| **`ArbetslivStamplaDelegate`** | `StampClockPage` | `time_entries` |
| **`ArbetslivTidDelegate`** | `EconomyTidPanel` | Read; payslip via Valv-länk i panel |
| **`ArbetslivLoggDelegate`** | `EconomyLogPanel` | `economy_ledger`, fasta räkningar |

**Props:** Routern skickar valfritt `onChanged` till logg-delegate. Ingen `userId`-prop — paneler läser `useStore` internt (samma som hub idag).

---

## 4. Gränssnitt och typer

### 4.1 Mode union

```typescript
export type ArbetslivInputMode = 'stampla' | 'tid' | 'logg';
```

### 4.2 Mode metadata

| Mode ID | Label | Description | tier | writeTarget |
|---------|-------|-------------|------|-------------|
| `stampla` | Stämpel | Stämpla in och ut — flex | primary | `time_entries` |
| `tid` | Tid & flex | Veckosaldo och lönespec-länk | primary | read-only + Valv |
| `logg` | Logg | Fasta räkningar och ledger | primary | `economy_ledger` |

```typescript
export const DEFAULT_ARBETSLIV_INPUT_MODE: ArbetslivInputMode = 'stampla';
```

### 4.3 URL

| Route | Beskrivning |
|-------|-------------|
| `/arbetsliv/input` | Hub default (`stampla`) |
| `/arbetsliv/input?inputMode=tid` | Tid & flex |
| `/arbetsliv/input?inputMode=logg` | Ekonomilogg |

Paritet med legacy: `/arbetsliv?tab=stampla` tills W3 migrerar.

---

## 5. UI-specifikation

### 5.1 Container

```tsx
<section
  className="calm-card glow-bottom-gold overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 p-4 sm:p-5"
  aria-label="Arbetsliv inmatningshub"
>
```

### 5.2 Header

- Eyebrow: `Universal Input` (serif, guld, uppercase)
- Titel: `Ett läge i taget`
- Lead: Stämpel och flex öppna här; frånvaro/lön i Valv
- Valv-CTA: `Link` till `vaultDrawerPath('arbetsliv_franvaro')` med sekundär hint till lön

### 5.3 Lägesväxlare

- Tre knappar (alla primary — ingen "Mer…" i v1)
- Aktiv: `border-accent/20 bg-accent/10 text-accent`
- Scroll-island: `calm-scroll-island max-h-[min(70vh,640px)]`

---

## 6. Routing (shadow)

`ArbetslivInputRoutes.tsx` exporterar nested route:

```tsx
<Route path="input" element={<ArbetslivInputSuperModule />} />
```

**W3:** Mount under `/arbetsliv/*` i `AppRoutes.tsx` (paritet med `MabraRoutes`).

---

## 7. Migreringsplan

| Fas | Leverans | Ägare |
|-----|----------|-------|
| **10A** | Djupanalys + denna SPEC | W2 ✓ |
| **10B** | `ArbetslivInputSuperModule` + modes | W2 ✓ |
| **10C** | Delegates + `ArbetslivInputRoutes` | W2 ✓ |
| **10D** | Live-montering, bro-uppdatering, locked-ux | W3 |

---

## 8. Smoke-checklista

- [ ] `arbetslivInputModes.ts` — tre modes + parser
- [ ] `ArbetslivInputSuperModule.tsx` — `glow-bottom-gold`
- [ ] Tre delegates importerar protected komponenter
- [ ] `vaultDrawerPath` i supermodule (inte legacy `?tab=franvaro`)
- [ ] `ArbetslivInputRoutes.tsx` — path `input`
- [ ] `npm run smoke:arbetsliv-superhub` PASS

---

## 9. Förbjudet (W2)

- Ändra `ArbetslivHubPage.tsx`, `AppRoutes.tsx`, firestore.rules
- Ändra `StampClockPage`, `EconomyTidPanel`, `EconomyLogPanel`
- Montera Valv-paneler (`VaultEconomyPanel`) i supermodule
- Indigo/smaragd glow — **endast** guld för denna modul
