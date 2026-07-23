# verklighetsvalvet

> Sacred Feature — Sanningens Sköld. WORM-bevisbank (Lager 2) mot gaslighting.  
> **Locked UX:** `.context/locked-ux-features.md` §2 + §2b (Samla Inkast+Arkiv+Sök).

## Syfte

Append-only, tidsstämplade sanningar. Skild från Dagbok (Lager 1). Plausible deniability via **Fyren** (dold ingång).

## Route och ingång

| | |
|---|---|
| **Route** | `/valvet?vaultTab=…` (`ValvetRoutePage` → `VaultPage`) |
| **Legacy redirects** | `/valv`, `/dagbok?tab=bevis` → `/valvet` |
| **AuthGate** | ja + WebAuthn/biometri → `issueVaultSession` |
| **Fyren** | 3s long-press BookOpen → WebAuthn → `/valvet` |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/VaultPage.tsx` | Gate, zon-chrome, SuperModule |
| `supermodule/ValvInputSuperModule.tsx` | **§2b LÅST** — Inkast + Samla (aldrig Inkast-only) |
| `components/zones/ValvSamlaZone.tsx` | Arkivlista + Sök (ValvChat) |
| `components/VaultEntryForm.tsx` | 4 inmatningslägen + media + röst |
| `components/VaultLogList.tsx` | Append-only lista + PDF/post |
| `utils/exportVaultRecord.ts` | Klient-PDF per post |
| `types/vaultEntry.ts` | Entry-typer |

**Valv-Chat:** `../vaultChat/` (flik `vaultTab=sok`)

## Data

| Collection | Innehåll |
|------------|----------|
| `reality_vault` | WORM-bevis (action, truth, category, media, …) |

**Klient:** `saveVaultLog`, `uploadVaultEvidence`  
**Callable:** `valvChatQuery` (via valv_chatt)

## Smoke

```bash
npm run smoke:locked-ux
npm run smoke:valv-mode
npm run smoke:valv-security
```
