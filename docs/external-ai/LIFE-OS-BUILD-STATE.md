# LIFE-OS-BUILD-STATE (levande sanning)

Uppdateras vid varje CHECKPOINT. Register vinner över minne.

**Senast uppdaterad:** 2026-06-15 (CHECKPOINT-6 LOCK — App Check Enforce klar)

| Komponent | Nyckelfiler | Status | Smoke | CHECKPOINT |
|-----------|-------------|--------|-------|------------|
| Security core (WORM + vault + guards) | `firestore.rules`, `unlockVault.ts`, `callableGuards.ts` | **LOCK** | valv-security PASS 2026-06-15 | **CP-1** |
| Locked UX §11–17 | `.context/locked-ux-features.md` | **LOCK** | locked-ux PASS 2026-06-15 | **CP-1** |
| G10 Inkast backend | `inboxClassifier.ts`, `submitInkastLite.ts`, `inkastStorageOnFinalize.ts` | **LOCK** | inkast + inbox PASS 2026-06-15 | **CP-3** |
| G10 Inkast UI (CapturePanel + filer) | `CapturePanel.tsx`, `CaptureSuperModule.tsx` | **LOCK** | build + locked-ux + inkast PASS 2026-06-15 | **CP-4** |
| Upload unified (Valv DirectPanel) | `InkastDirectPanel.tsx` | **WIP** | behålls tills steg 2 | CP-4 defer |
| SynapseBus (4 triggers) | `synapseBus.ts`, `driveIngestSynapse.ts`, `dcapAlertSynapse.ts`, `journalWovenSynapse.ts` | **LOCK** | build + orkester PASS 2026-06-15 | **CP-5** |
| App Check (kod + Console Enforce) | `appCheck.ts`, `callableGuards.ts`, Firebase Console | **LOCK** | inkast + valv-security PASS 2026-06-15 | **CP-6** |
| Deploy wave docs | `DEPLOY-CHATBOT-WAVE.md` | **LOCK** | — | **CP-6** |
| Upload unified SPEC | `UPLOAD-UNIFIED-SPEC.md` | **APPROVED** | CP-2 manuell | **CP-2** |
| Audio MIME i Inkast | `inkastMimeTypes.ts` | **LOCK** | CP-3 backend | **CP-3** |
| inkastSourceModule allowlist | `inkastSourceModule.ts` | **LOCK** | CP-3 | **CP-3** |
| Storage onFinalize inkast | `onInkastEvidenceFinalized` | **LOCK** | build PASS | **CP-3** |
| Valv modul | `src/modules/features/lifeJournal/evidence/vault/` | **WIP** | valv PASS | snapshot vid LOCK |
| MåBra 19.2–19.5 | hybrid-8, evolution_ledger | **DEFER** | — | efter core lock |

## Statusförklaring

- **LOCK** — smoke PASS, får inte refaktoreras utan explicit OK + snapshot
- **OPEN** — under aktiv utveckling eller väntar på manuellt steg (Console)
- **WIP** — delvis klar, snapshot vid nästa CP om PASS
- **DEFER** — medvetet senarelagt

## Nästa manuella steg (Pontus)

1. ~~Console Enforce~~ — **klar** 2026-06-15 (Pontus bekräftat)
2. **Snapshot synapser** (finns `~/Livskompassen-snapshots/2026-06-15-synapser/` — kör om vid behov): `./scripts/snapshot_locked_module.sh synapser`
3. ~~Deploy CP-3/4/5~~ — **klar** 2026-06-15
