# DEPLOY-CHATBOT-WAVE — PHASE-03 → 05

**Projekt:** `gen-lang-client-0481875058`  
**Region:** `europe-west1`  
**Rot:** `/Users/Livskompassen/StudioProjects/Livskompassen3.0`  
**Senast:** 2026-06-15 (CHECKPOINT-6)

Kanonisk deploy-lathund för ChatBox-vågen CP-3 → CP-5. Kör från projektrot efter `firebase use gen-lang-client-0481875058`.

---

## Förutsättningar

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
cd functions && npm run build && cd ..
npm run build
```

---

## CP-3 — Inkast backend (PHASE-03)

**Ändrade filer:** `inboxClassifier.ts`, `submitInkastLite.ts`, `inkastStorageOnFinalize.ts`, `inkastMimeTypes.ts`, `inkastSourceModule.ts`, `transcribeInkastAudio.ts`

| Resurs | Deploy? | Kommando |
|--------|---------|----------|
| `submitInkastLite` | **JA** | se nedan |
| `onInkastEvidenceFinalized` | **JA** | Storage trigger — `vault_evidence/{uid}/inkast/*` |
| `previewInboxClassification` | **JA** | CapturePanel (CP-4) anropar vid fil-preview |
| `getInboxQueue`, `confirmInboxItem`, `dismissInboxItem` | valfritt | Oförändrad signatur — deploy om du vill synka all inkast-kod |
| `storage` rules | **SKIP** | Ej ändrat i CP-3 (`vault_evidence` fanns redan) |
| `firestore:rules` | **SKIP** | Ej ändrat — PMIR krävs före deploy |

```bash
firebase deploy --only functions:submitInkastLite,functions:onInkastEvidenceFinalized,functions:previewInboxClassification,functions:getInboxQueue,functions:confirmInboxItem,functions:dismissInboxItem
```

**Smoke efter CP-3 deploy:**

```bash
npm run smoke:inkast
npm run smoke:inbox
```

---

## CP-4 — Frontend upload (PHASE-04)

**Ändrade filer:** `CapturePanel.tsx`, `CaptureSuperModule.tsx`, inkast-delegates (Familjen, Planering, Ekonomi, Hem, MåBra)

| Resurs | Deploy? | Kommando |
|--------|---------|----------|
| Hosting (SPA) | **JA** | se nedan |
| Functions | **SKIP** | Backend redan CP-3 |

```bash
npm run build
firebase deploy --only hosting
```

**Prod-URL:** https://gen-lang-client-0481875058.web.app

**Smoke efter CP-4 deploy:**

```bash
npm run smoke:locked-ux
npm run build
```

**Manuell:** Testa filuppladdning + preview i CapturePanel (Familjen / Planering).

---

## CP-5 — Synapse lock (PHASE-05)

**Ändrade filer:** `journalWovenSynapse.ts` (idempotens), `dcapAlertSynapse.ts` (idempotens)

| Resurs | Status | Kommando |
|--------|--------|----------|
| `journalWovenToKampspar` | ✔ **deployad** 2026-06-15 | — |
| `analyzeMessage` | ✔ **deployad** 2026-06-15 | — |

Om du behöver köra om:

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions:journalWovenToKampspar,functions:analyzeMessage
```

**Smoke efter CP-5 deploy:**

```bash
npm run smoke:orkester
```

**Snapshot (Pontus vid LOCK):**

```bash
./scripts/snapshot_locked_module.sh synapser
```

---

## firestore:rules — SKIP

**Ej ändrat** i PHASE-03 → 05. Deploy kräver PMIR + explicit Pontus-OK.

```bash
# KÖR INTE utan PMIR:
# firebase deploy --only firestore:rules
```

---

## Hela vågen — en körning (om inget redan deployat)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
cd functions && npm run build && cd ..
npm run build

firebase deploy --only \
  functions:submitInkastLite,\
functions:onInkastEvidenceFinalized,\
functions:previewInboxClassification,\
functions:getInboxQueue,\
functions:confirmInboxItem,\
functions:dismissInboxItem,\
functions:journalWovenToKampspar,\
functions:analyzeMessage,\
hosting
```

---

## Smoke — full CP-3 → 06

```bash
npm run smoke:valv-security
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:inkast
npm run smoke:inbox
```

---

## PHASE-06 — App Check (nästa steg)

Console Enforce körs **manuellt av Pontus** — se [`APPCHECK-ENFORCE-GUIDE.md`](./APPCHECK-ENFORCE-GUIDE.md).

**Pontus måste köra Firebase Console → App Check → Enforce** — agenten kan inte toggla detta.

---

## Referenser

- [`DEPLOY.md`](../DEPLOY.md) — full callable-inventering
- [`LIFE-OS-BUILD-STATE.md`](./LIFE-OS-BUILD-STATE.md) — LOCK/WIP per komponent
- [`CHECKPOINT-LOG.md`](./CHECKPOINT-LOG.md) — CP-historik
- [`2026-06-15-fas21-callables-guard-inventory.md`](../evaluations/2026-06-15-fas21-callables-guard-inventory.md) — guard-lista
