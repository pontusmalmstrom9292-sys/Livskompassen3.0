# verklighetsvalvet

> Sacred Feature — Sanningens Sköld. WORM-bevisbank (Lager 2) mot gaslighting.

## Syfte

Append-only, tidsstämplade sanningar. Skild från Dagbok (Lager 1). Plausible deniability via **Fyren** (dold ingång).

## Route och ingång

| | |
|---|---|
| **Route** | `/dagbok?tab=bevis` (redirect `/valv`) |
| **AuthGate** | ja |
| **Fyren** | 3s long-press BookOpen → WebAuthn → PIN → bevis |
| **Flik Bevis** | Synlig idag; mål: endast Fyren |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/VaultPage.tsx` | PIN, flikar Logga \| Sök |
| `components/VaultEntryForm.tsx` | 4 inmatningslägen + media + röst |
| `components/VaultLogList.tsx` | Append-only lista + PDF/post |
| `utils/exportVaultRecord.ts` | Klient-PDF per post |
| `types/vaultEntry.ts` | Entry-typer |

**Valv-Chat:** `../valv_chatt/` (Sök-flik)

## Data

| Collection | Innehåll |
|------------|----------|
| `reality_vault` | WORM-bevis (action, truth, category, media, …) |

**Klient:** `saveVaultLog`, `uploadVaultEvidence`  
**Callable:** `valvChatQuery` (via valv_chatt)

## Beror på

- `core` — PinGate, WebAuthn, EvidenceMediaAttach, firestore
- `valv_chatt` — Sök-flik i VaultPage

## Kopplingar

- **Dagbok** — Hjärtat-kluster, Vävaren
- **Speglings_system** — EvidenceCompare
- **safe_harbor** — spara BIFF som bevis
- **dossier** — aggregering till PDF

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `reality_vault` — WORM, glömmer inte |
| **RAG / chatt** | Valv-Chat via `valvChatQuery` (**deployad** west1; `smoke:valv` PASS 2026-05-22) |
| **PDF / samlad export** | per post + Dossier |
| **Planerat** | klickbara citations |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/verklighetsvalvet.md)
- [Verklighetsvalvet-SPEC](../../../docs/specs/modules/Verklighetsvalvet-SPEC.md)
- [valv_chatt README](../valv_chatt/README.md)
