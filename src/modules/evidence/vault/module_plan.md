# verklighetsvalvet — module plan

## Overview

Sacred Feature: WORM evidence vault (Verklighetsvalvet / Sanningens Sköld). Route `/dagbok?tab=bevis`; redirect `/valv`. Dold ingång via Fyren (3s long-press BookOpen + WebAuthn + PIN).

Canonical: `.context/modules/evidence/vault.md` · Spec: `docs/specs/modules/Verklighetsvalvet-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/VaultEntryForm.tsx` | Enkel/tvåspalt/tresteg/magkänsel + media + röst |
| `components/VaultPage.tsx` | PIN gate, Logga/Sök/**Mönster/Orkester**/Dossier, Stäng → Reflektion |
| `components/VaultMonsterPanel.tsx` | Låst UX — deterministisk frekvens (Pansaret) |
| `components/VaultOrkesterPanel.tsx` | Låst UX — agentregister + SMS mönstersökning |
| `components/VaultLogList.tsx` | Append-only lista + PDF-knapp per post |
| `utils/exportVaultRecord.ts` | Per-post PDF via utskriftsdialog |
| `constants/vaultEntry.ts` | BODY_SIGNALS, VAULT_ENTRY_MODES, SHIELD_STEPS |
| `types/vaultEntry.ts` | VaultEntryType, VaultLogInput |
| `../diary/diary/components/HjartatPage.tsx` | Bevis-flik, session lock vid flikbyte |
| `../core/layout/FloatingDock.tsx` | Fyren — 3s progress + WebAuthn |
| `../core/auth/webauthn.ts` | Passkey-gate (client MVP) |
| `../core/hooks/useShakeToKill.ts` | 15 m/s², 2s debounce → kill switch + `/` |
| `../core/hooks/useSpeechToText.ts` | Röst → text i truth |
| `../core/firebase/firestore.ts` | `assertWormPayload`, `saveVaultLog`, `getVaultLogs` |
| `../core/firebase/storage.ts` | `uploadVaultEvidence` → `vault_evidence/{uid}/` |
| `../evidence/vaultChat/` | ValvChatPanel, `useValvChatSession`, `valvChatQuery` |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Fyren 3s + WORM | Dold ingång, Sanningens Sköld | Ja | **done** |
| Tvåspalt / tresteg / magkänsel | Hens version vs sanning | Ja | **done** |
| Storage `evidenceUrl` | PDF/sms-export, ej Drive-auto | Ja | **done** |
| Shake-to-Kill | Panik + iOS-test | Ja | **done** |
| Orosanmälan + skolbevis | §D beviskandidater | Manuell | **use now** |
| Vävaren godkännande | Önskat före permanent AI-tagg | Auto idag | **planned** |
| Dölj Bevis-flik | Plausible deniability | Nej | **planned** |
| BBIC-filter export | Soc/jurist | Nej | **planned** (Dossier fas 2) |
| Sanningens Ankare landning | Notebook | Nej | **planned** |
| Auto Storage-analys | Notebook vision | Nej | **rejected** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Produktbeslut (låsta 2026-05)

1. Drive → valv: manuellt godkännande (Drive-auto → kb_docs)
2. PDF: klient per post; Dossier callable senare
3. Valv-Chat: nollställ vid flikbyte
4. WebAuthn + PIN; duress-PIN senare
5. Dölj Bevis-flik när Fyren sitter i muskelminnet

## Nästa fas (implementera när användaren säger kör)

1. Dölj Bevis-flik + ClusterGrid-länk (Fyren only, feature flag)
2. Klickbara citations i ValvChatPanel
3. Drive-ingest med manuellt godkännande → `reality_vault`
4. ~~Full Dossier-generator~~ → **done** (`DossierPage` + `generateDossier`; kvar: BBIC-mall, Vävaren försätt)
5. Sanningens Ankare (`pinned`) + citation UX

## Security notes

- Demo PIN: `VITE_VAULT_PIN` endast lokal utveckling
- Zero Footprint: vault unlock + chat rensas vid flikbyte/kill switch
- Evidence: en fil per post (`evidenceUrl`); Storage uid-scoped
- Valv-Chat: isolerad från `knowledgeVaultQuery`
