# LIFE-OS-BUILD-STATE (levande sanning)

Uppdateras vid varje CHECKPOINT. Register vinner över minne.

**Senast uppdaterad:** 2026-06-18 (P4 + P6 LOCK efter smoke E2E)

| Komponent | Nyckelfiler | Status | Smoke | CHECKPOINT |
|-----------|-------------|--------|-------|------------|
| Security core (WORM + vault + guards) | `firestore.rules`, `unlockVault.ts`, `callableGuards.ts` | **LOCK** | valv-security + locked-ux 2026-06-18 | **CP-1** · **F19.1** |
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
| **P3 Flow-assist (Mönster metadata)** | `assistPatternMetadata`, `VaultMonsterPanel.tsx`, `patternScanService.ts` | **LOCK** | pattern-metadata + orkester 2026-06-18 | **P3** |
| **P4 MåBra bank_parafras** | `mabraCoach` mode `bank_parafras`, `VitCardFlowPanel`, `VitMemoryFlowPanel` | **LOCK** | smoke:mabra E2E PASS 2026-06-18 | **P4** |
| **P6 Dossier Flow-tidslinje** | `dossierAiForeword.ts`, `generateDossierInternal.ts`, `DossierPage.tsx` | **LOCK** | smoke:dossier E2E PASS 2026-06-18 | **P6** |
| Fas 19.1 security sprint | `invalidateSession` guard, D14 ParentReminderFooter | **LOCK** | valv-security 2026-06-18 | **F19.1** |
| **Fas 19.2–19.5 (MåBra)** | hybrid-8, hex→tokens, JOY-17, evolution_ledger dual-write | **LOCK** | mabra + modulvaljare + evolution + innehall 2026-06-18 | **F19.2–19.5** |
| Wave 29.1 barn-epistemik | `childObservationEpistemics.ts`, `saveChildrenLog` | **LOCK** | smoke:barn-epistemik 2026-06-18 | **V1** |
| MB-PLAY-54321 | `MabraGrounding54321Wizard.tsx`, `grounding54321Play.ts` | **LOCK** | smoke:mabra 2026-06-18 | **V2** |
| MB-REF-rsd-04 | `rsdErrorCopy.ts`, `mabraCoachService.ts`, `mabraContentBank.ts` | **LOCK** | smoke:mabra + innehall 2026-06-18 | **V3** |
| Planering modulpinnar | `planningModulePinStorage.ts`, `PinnedPlaneringModuleSlot.tsx` | **LOCK** | locked-ux + planering 2026-06-18 | **PLAN-PIN** |
| Barnporten barn-PWA | `barnportenRollout.ts`, `BarnportenPausedPanel.tsx` | **PAUSED** (`BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED=false`) | locked-ux 2026-06-18 | **V4** |
| App Check Console Enforce | Firebase Console → Enforce | **LOCK** | Pontus Console 2026-06-17 | **V6** |
| M3.0-C Fitness/Näring | evolution_hub | **DEFER** | — | **F19.N+** |
| BP-PUSH (FCM barn) | — | **DEFER** | — | **V6** |
| AI-assistent UI | — | **DEFER** | — | — |

## Statusförklaring

- **LOCK** — smoke PASS, får inte refaktoreras utan explicit OK + snapshot
- **FREEZE** — backend-kärnan låst; endast bugfix + content ingest efter KEEP
- **PAUSED** — implementerat men avstängt via flagga; kräver Pontus OK + PMIR för enable
- **DEFER** — medvetet senarelagt

## Nästa steg (Pontus)

1. **Använd:** Familjen livslogg med citat/tolkning; MåBra 5-4-3-2-1-lek; Valv Mönster Flow-assist
2. **Använd:** Dossier med AI-tidslinje (`includeAiForeword`) i Valv
3. **DEFER:** BP-PUSH, barn-PWA rollout, M3.0-C Fitness/Näring, AI-assistent UI
4. **Leverans:** `docs/evaluations/2026-06-18-produktkomplett-leverans.md`
