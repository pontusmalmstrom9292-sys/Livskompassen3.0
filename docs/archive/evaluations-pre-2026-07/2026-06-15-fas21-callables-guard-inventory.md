# Fas 21 — Callable App Check guard-inventering (P1)

**Datum:** 2026-06-15 (Våg 2 backend) · **Status:** Kod klar — **ej mass-deploy** utan explicit lista nedan  
**Kanon:** [`callableGuards.ts`](../../functions/src/lib/callableGuards.ts) · `APP_CHECK_ENFORCE=true` i prod  
**Våg 2:** [`2026-06-15-backend-vag2-hardening.md`](./2026-06-15-backend-vag2-hardening.md)

---

## USER-påminnelse

Firebase Console → **App Check → Enforce** för Cloud Functions när guards är deployade och smoke PASS.

---

## Guardade i Fas 21 + Backend Våg 2 (ny kod)

| Callable | Fil | Rate/min | Kategori |
|----------|-----|----------|----------|
| `parseVoiceCommand` | `voiceCommand.ts` | 15 | Inkast-adjacent |
| `getEntityProfileRegistry` | `valv.ts` | 30 | Valv user + `assertVaultSession` |
| `addEntityProfile` | `valv.ts` | 20 | Valv user + `assertVaultSession` |
| `getContextCacheStatus` | `knowledge.ts` | 30 | Kunskap registry |
| `ingestKampsparEntry` | `knowledge.ts` | 10 | Kunskap ingest (v1) |
| `journalWovenToKampspar` | `agents.ts` | 10 | Weaver-adjacent |
| `getAgentRegistry` | `agents.ts` | 30 | A2A metadata (Våg 2) |
| `createBarnportenPairing` | `agents.ts` | 10 | Barnporten QR (Våg 2) |
| `claimBarnportenPairing` | `agents.ts` | 10 | Barnporten claim (Våg 2) |
| `generatePayslip` | `agents.ts` | 5 | Ekonomi (Våg 2) |
| `analyzeProjectImage` | `projectMedia.ts` | 10 | Projekt OCR (Våg 2) |

---

## Redan guardade (Fas 19–20 — rör ej)

`unlockVault`, `submitInkastLite`, `getInboxQueue`, `confirmInboxItem`, `dismissInboxItem`, `previewInboxClassification`, `weaveJournalEntry`, `approveWeaverMetadata`, `rejectWeaverMetadata`, `mabraCoach`, `analyzeMessage`, `valvChatQuery`, `knowledgeVaultQuery`, `childrenLogsQuery`, `generateEmbedding`, `chatWithKompis`, m.fl.

---

## Öppna (defer)

| Callable | Anledning |
|----------|-----------|
| `invalidateSession` | Logout — låg LLM-kostnad; auth-only medvetet (Zero Footprint) |

---

## Deploy-lista (när Pontus godkänner)

```bash
cd functions && npm run build
firebase deploy --only functions:parseVoiceCommand,functions:getEntityProfileRegistry,functions:addEntityProfile,functions:getContextCacheStatus,functions:ingestKampsparEntry,functions:journalWovenToKampspar,functions:getAgentRegistry,functions:createBarnportenPairing,functions:claimBarnportenPairing,functions:generatePayslip,functions:analyzeProjectImage,functions:breakDownResponse
```

Smoke efter deploy: `npm run smoke:valv-security` · `npm run smoke:inkast` · `npm run smoke:innehall`
