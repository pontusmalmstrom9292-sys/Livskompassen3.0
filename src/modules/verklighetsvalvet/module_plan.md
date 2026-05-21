# verklighetsvalvet — module plan

## Overview

Sacred Feature: WORM evidence vault (Verklighetsvalvet). Route `/valv` via dold Fyren-åtkomst (Shield 3s + PIN/WebAuthn).

Canonical: `.context/modules/verklighetsvalvet.md` · Spec: `docs/specs/incoming/Verklighetsvalvet-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/VaultEntryForm.tsx` | Enkel/tvåspalt/tresteg/magkänsel + media + röst |
| `components/VaultPage.tsx` | PIN gate, form, lista, Stäng → `/dagbok` |
| `components/VaultLogList.tsx` | Append-only lista + PDF-knapp per post |
| `utils/exportVaultRecord.ts` | Per-post PDF via utskriftsdialog |
| `constants/vaultEntry.ts` | BODY_SIGNALS, VAULT_ENTRY_MODES, SHIELD_STEPS |
| `types/vaultEntry.ts` | VaultEntryType, VaultLogInput |
| `../core/layout/FloatingDock.tsx` | Fyren — 3s progress + biometri |
| `../core/auth/webauthn.ts` | Passkey-gate (client MVP) |
| `../core/hooks/useShakeToKill.ts` | 15 m/s² → kill switch + `/` |
| `../core/hooks/useSpeechToText.ts` | Röst-memo transkription |
| `../core/firebase/firestore.ts` | `assertWormPayload`, `saveVaultLog`, `getVaultLogs` |
| `../core/firebase/storage.ts` | `uploadVaultEvidence` → `vault_evidence/{uid}/` |

## Status

| Area | Status |
|------|--------|
| Fyren 3s + progress ring | **done** |
| WebAuthn gate | **partial** — client MVP |
| WORM rules | **done** — Firestore append-only |
| WORM client guard | **done** — `assertWormPayload` |
| Shake-to-Kill | **done** — RAM + navigate `/` |
| Enkel / tvåspalt / tresteg / magkänsel | **done** |
| VaultLogList | **done** |
| Stäng valv → Lager 1 (`/dagbok`) | **done** |
| Media-uppladdning (skärmdump) | **done** — Storage + `evidenceUrl` |
| Röst-memo | **done** — Web Speech + textarea |
| Per-post PDF (utskrift) | **done** — `exportVaultRecordAsPdf` |
| Storage rules deploy | **required** — `storage.rules` + `firebase deploy --only storage` |
| Full Dossier-export (samlad) | **planned** — se `dossier/module_plan.md` |
| Valv-Chat (`/valv/chat`) | **planned** |
| notifyNewFile webhook | **planned** |
| Variant B: long-press Dagbok→valv | **planned** (nav-beslut) |
| Vault session Zero Footprint (background) | **partial** |

## CMEK-verifiering (drift)

1. Firebase Console → Firestore → Encryption → CMEK key ring
2. Bekräfta att `reality_vault` och `journal` omfattas
3. Cloud Audit Log: `Decrypt` + `Encrypt` events synliga
4. Crypto-shredding testplan: key disable → data oläslig

## Security notes

- Demo PIN endast för lokal utveckling — produktion via env/WebAuthn
- Zero Footprint: vault unlock rensas vid background/timeout/kill switch
- Evidence via Drive → `notifyNewFile` (se `docs/DRIVE_AUTOMATION.md`)
- Storage: uid-scoped `vault_evidence/{userId}/**`

## Nästa fas (implementera när användaren säger kör)

1. Valv-Chat UI + `valvChatQuery`  
2. Full Dossier-generator (samlad export)  
3. notifyNewFile webhook
