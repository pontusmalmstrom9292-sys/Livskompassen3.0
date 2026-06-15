# Valv Privacy — genomförbarhetsplan (research)

> **Status:** `closed` (research) · Fas 2.1 **deferred** — feature flag ej påbörjad.

**Datum:** 2026-05-29  
**Kanon:** [`Verklighetsvalvet-SPEC.md`](../specs/modules/Verklighetsvalvet-SPEC.md) §14 · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)

## Slutsats

**Fyren + PIN är live.** Synlig Bevis-flik i Hjärtat är medvetet kvar tills Fyren sitter i muskelminnet. **Fas 2.1** = feature flag — implementera **efter** Samla 1.2 (så du kan testa ingång).

## REASONS (kort)

| | |
|---|---|
| **Requirements** | Plausible deniability — yttre observatör ser dagbok |
| **Approach** | `VITE_VALV_HIDE_BEVIS_TAB` styr `getVisibleHjartatTabIds` + `ClusterGrid` |
| **Safeguards** | Fyren 3s + WebAuthn oförändrad; döljer inte `/dagbok?tab=bevis` URL |

## Kodkartläggning

| Yta | Fil | Notering |
|-----|-----|----------|
| Fyren 3s | `FloatingDock.tsx` | BookOpen long-press → WebAuthn |
| Bevis-flik | `tabRegistry.ts` · `HjartatPage.tsx` | `getVisibleHjartatTabIds` |
| ClusterGrid länk | `ClusterGrid.tsx` | «Verklighetsvalvet» |
| WebAuthn | `webauthn.ts` · `sessionService.ts` | `setVaultGate` |
| Android | `.cursor/rules/android-capacitor.mdc` | SHA-1, cap sync |

## Faser

| Fas | Leverans | Kod? |
|-----|----------|------|
| 2.R | Denna eval | Nej |
| 2.1 | `VITE_VALV_HIDE_BEVIS_TAB=true` döljer flik + ClusterGrid | Ja — efter Samla |
| 2.2 | WebAuthn-felsök Android — dokumentera i eval | Docs only |
| 2.3 | Duress-PIN, CMEK | **Ej MVP** — research only |

## MUST NOT

- Ta bort Fyren eller PIN-gate
- Kräva PIN för `/hamn` Grey Rock (VALV-HUBB-SPEC)

## Nästa steg

Efter Samla PASS: **`kör Valv Privacy Fas 2.1`**
