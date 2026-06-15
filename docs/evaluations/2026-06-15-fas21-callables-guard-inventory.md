# Fas 21 — Callable App Check guard-inventering (P1)

**Datum:** 2026-06-15 · **Status:** Kod klar — **ej mass-deploy** utan explicit lista nedan  
**Kanon:** [`callableGuards.ts`](../../functions/src/lib/callableGuards.ts) · `APP_CHECK_ENFORCE=true` i prod

---

## USER-påminnelse

Firebase Console → **App Check → Enforce** för Cloud Functions när guards är deployade och smoke PASS.

---

## Guardade i Fas 21 (ny kod)

| Callable | Fil | Rate/min | Kategori |
|----------|-----|----------|----------|
| `parseVoiceCommand` | `voiceCommand.ts` | 15 | Inkast-adjacent (submitInkastLite) |
| `getEntityProfileRegistry` | `valv.ts` | 30 | Valv user + `assertVaultSession` |
| `addEntityProfile` | `valv.ts` | 20 | Valv user + `assertVaultSession` |
| `getContextCacheStatus` | `knowledge.ts` | 30 | Kunskap registry |
| `ingestKampsparEntry` | `knowledge.ts` | 10 | Kunskap ingest (v1) |
| `journalWovenToKampspar` | `agents.ts` | 10 | Weaver-adjacent |

---

## Redan guardade (Fas 19–20 — rör ej)

`unlockVault`, `submitInkastLite`, `getInboxQueue`, `confirmInboxItem`, `dismissInboxItem`, `previewInboxClassification`, `weaveJournalEntry`, `approveWeaverMetadata`, `rejectWeaverMetadata`, `mabraCoach`, `analyzeMessage`, `valvChatQuery`, `knowledgeVaultQuery`, `childrenLogsQuery`, `generateEmbedding`, `chatWithKompis`, m.fl.

---

## Öppna (defer — ej Fas 21 scope)

| Callable | Anledning |
|----------|-----------|
| `invalidateSession` | Logout — låg LLM-kostnad; auth-only idag |
| `getAgentRegistry` | Read-only metadata |
| `analyzeProjectImage` | Projekt OCR — ägarcheck i kod |
| `createBarnportenPairing` / `claimBarnportenPairing` | Barn-PWA — separat PMIR |
| `generatePayslip` | Ekonomi — separat PMIR |
| `parseVoiceCommand` region | Migrerad till `europe-west1` i Fas 21 |

---

## Deploy-lista (när Pontus godkänner)

```bash
cd functions && npm run build
firebase deploy --only functions:parseVoiceCommand,functions:getEntityProfileRegistry,functions:addEntityProfile,functions:getContextCacheStatus,functions:ingestKampsparEntry,functions:journalWovenToKampspar
```

Smoke efter deploy: `npm run smoke:valv-security` · `npm run smoke:inkast` · `npm run smoke:innehall`
