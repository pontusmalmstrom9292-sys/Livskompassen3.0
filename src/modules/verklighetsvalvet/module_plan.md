# verklighetsvalvet — module plan

## Overview

Sacred Feature: WORM evidence vault (Verklighetsvalvet / Sanningens Sköld). Route `/dagbok?tab=bevis`; redirect `/valv`. Dold ingång via Fyren (3s long-press BookOpen + WebAuthn + PIN).

Canonical: `.context/modules/verklighetsvalvet.md` · Spec: `docs/specs/incoming/Verklighetsvalvet-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/VaultEntryForm.tsx` | Enkel/tvåspalt/tresteg/magkänsel + media + röst |
| `components/VaultPage.tsx` | PIN gate, Logga/Sök-flikar, Stäng → Reflektion |
| `components/VaultLogList.tsx` | Append-only lista + PDF-knapp per post |
| `utils/exportVaultRecord.ts` | Per-post PDF via utskriftsdialog |
| `constants/vaultEntry.ts` | BODY_SIGNALS, VAULT_ENTRY_MODES, SHIELD_STEPS |
| `types/vaultEntry.ts` | VaultEntryType, VaultLogInput |
| `../dagbok/components/HjartatPage.tsx` | Bevis-flik, session lock vid flikbyte |
| `../core/layout/FloatingDock.tsx` | Fyren — 3s progress + WebAuthn |
| `../core/auth/webauthn.ts` | Passkey-gate (client MVP) |
| `../core/hooks/useShakeToKill.ts` | 15 m/s², 2s debounce → kill switch + `/` |
| `../core/hooks/useSpeechToText.ts` | Röst → text i truth |
| `../core/firebase/firestore.ts` | `assertWormPayload`, `saveVaultLog`, `getVaultLogs` |
| `../core/firebase/storage.ts` | `uploadVaultEvidence` → `vault_evidence/{uid}/` |
| `../valv_chatt/` | ValvChatPanel, `useValvChatSession`, `valvChatQuery` |

## Status

| Area | Status |
|------|--------|
| Fyren 3s + progress ring (BookOpen) | **done** |
| WebAuthn gate | **done** — client MVP |
| PIN setup/verify | **done** — localStorage hash |
| WORM rules + client guard | **done** |
| Shake-to-Kill | **done** |
| Enkel / tvåspalt / tresteg / magkänsel | **done** |
| VaultLogList + klient save | **done** |
| Media upload → `evidenceUrl` | **done** |
| Röst → text (Web Speech sv-SE) | **done** |
| Per-post PDF (utskrift) | **done** |
| Valv-Chat (Sök-flik) | **done** |
| Stäng / flikbyte session lock | **done** |
| Storage rules deploy | **required** — `firebase deploy --only storage` |
| Synlig Bevis-flik | **gap** — plausible deniability |
| Dölj Bevis-flik (Fyren only) | **planned** — efter muskelminne |
| Klickbara citations | **planned** |
| Drive → valv (manuellt godkännande) | **planned** |
| Full Dossier / BBIC batch | **planned** — `dossier/module_plan.md` |
| Sanningens Ankare (pinned posts) | **planned** |
| CMEK drift-verifiering | **planned** |
| Duress-PIN | **planned** — ej MVP |
| Zero Footprint idle audit | **partial** |

## Produktbeslut (låsta 2026-05)

1. Drive → valv: manuellt godkännande (Drive-auto → kb_docs)
2. PDF: klient per post; Dossier callable senare
3. Valv-Chat: nollställ vid flikbyte
4. WebAuthn + PIN; duress-PIN senare
5. Dölj Bevis-flik när Fyren sitter i muskelminnet

## Nästa fas (implementera när användaren säger kör)

1. Dölj Bevis-flik + ClusterGrid-länk (Fyren only)
2. Klickbara citations i ValvChatPanel
3. Drive-ingest med manuellt godkännande → `reality_vault`
4. Full Dossier-generator (samlad export)

## Security notes

- Demo PIN: `VITE_VAULT_PIN` endast lokal utveckling
- Zero Footprint: vault unlock + chat rensas vid flikbyte/kill switch
- Evidence: en fil per post (`evidenceUrl`); Storage uid-scoped
- Valv-Chat: isolerad från `knowledgeVaultQuery`
