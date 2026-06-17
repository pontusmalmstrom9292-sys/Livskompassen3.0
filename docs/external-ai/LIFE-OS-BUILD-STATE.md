# LIFE-OS-BUILD-STATE (levande sanning)

Uppdateras vid varje CHECKPOINT. Register vinner över minne.

**Senast uppdaterad:** 2026-06-17 (P1 Brusfilter LOCK + Backend FREEZE oförändrad)

| Komponent | Nyckelfiler | Status | Smoke | CHECKPOINT |
|-----------|-------------|--------|-------|------------|
| Security core (WORM + vault + guards) | `firestore.rules`, `unlockVault.ts`, `callableGuards.ts` | **LOCK** | tier1 + valv-gate 2026-06-16 | **CP-1** |
| Locked UX §11–17 | `.context/locked-ux-features.md` | **LOCK** | locked-ux PASS 2026-06-16 | **CP-1** |
| G10 Inkast backend | `inboxClassifier.ts`, `submitInkastLite.ts`, `inkastStorageOnFinalize.ts` | **LOCK** | inkast + inbox + inkast-upload 2026-06-16 | **CP-3** |
| G10 Inkast UI (CapturePanel + filer) | `CapturePanel.tsx`, `CaptureSuperModule.tsx` | **LOCK** | inkast PASS 2026-06-16 | **CP-4** |
| Upload unified (Valv DirectPanel) | `InkastDirectPanel.tsx`, `VaultInkastCompact.tsx` | **LOCK** | inkast-upload + valv-compact 2026-06-16 | **CP-4b** |
| SynapseBus (4 triggers) | `synapseBus.ts`, synapse handlers | **LOCK** | synapse-triggers + orkester 2026-06-16 | **CP-5** |
| ADK Manifest runtime | `adk/manifest.ts`, `registry.ts`, `orchestrator.ts` | **LOCK** | manifest + orkester 2026-06-16 | **CP-5b** |
| Valv chat E2E | `valvChatAgent.ts`, `valvChatQuery` | **LOCK** | valv-chat-e2e 2026-06-16 | **CP-8** |
| App Check (kod) | `appCheck.ts`, `callableGuards.ts` | **LOCK** | tier1 2026-06-16 | **CP-6** |
| Valv modul | `evidence/vault/` | **LOCK** | B1 + valv-mode 2026-06-16 | **B1** |
| **P1 Brusfilter v1 (Valv Orkester)** | `processBrusfilter.ts`, `VaultOrkesterPanel.tsx` | **LOCK** | orkester 2026-06-17 | **P1** |
| **P1 Brusfilter v2 (Inkast HITL)** | `InkastBrusfilterPreview.tsx`, `CapturePanel.tsx` | **LOCK** | inkast 2026-06-17 | **P1b** |
| CI deploy | `.github/workflows/firebase-hosting-main.yml` | **LOCK** | smoke:tier1 + functions deploy | **CP-9** |
| **P2 Dossier v2 (AI foreword)** | `dossierAiForeword.ts`, `generateDossierInternal.ts` | **LOCK** | dossier 2026-06-17 | **P2** |
| MåBra 19.2–19.5 / wave-2 / M3.0-C | — | **DEFER** | — | efter FREEZE |
| AI-assistent UI | — | **DEFER** | — | — |

## Statusförklaring

- **LOCK** — smoke PASS, får inte refaktoreras utan explicit OK + snapshot
- **FREEZE** — backend-kärnan låst; endast bugfix + content ingest efter KEEP
- **DEFER** — medvetet senarelagt

## Nästa steg (Pontus)

1. **Använd:** Valv → **Inkast** → «Filtrera brus först» (kräver Fyren) → godkänn → spara
2. **P1 v1+v2 LOCK** 2026-06-17
3. **Nästa:** använd Dossier med «Kort AI-inledning» — P2 LOCK 2026-06-17
4. **Inget nytt:** Wave-2 polish, M3.0-C, AI-assistent UI förblir DEFER
