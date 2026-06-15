# LIFE-OS-CORE-LOCKED

**Datum:** 2026-06-15 · **CHECKPOINT-7 (ChatBox våg 1 FINAL)**

Allt nedan får **ALDRIG** refaktoreras, döljas bakom flags eller raderas utan **explicit Pontus-OK + snapshot** (+ PMIR vid merge/firestore.rules).

Kanonreferenser: [`SECURITY-LOCK-MANIFEST.md`](./SECURITY-LOCK-MANIFEST.md) · [`SYNAPSE-LOCK-SPEC.md`](./SYNAPSE-LOCK-SPEC.md) · [`UPLOAD-UNIFIED-SPEC.md`](./UPLOAD-UNIFIED-SPEC.md) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)

---

## 1. Säkerhet & WORM (CP-1, CP-6)

**Backend-filer (referens):** `firestore.rules` · `callableGuards.ts` · `vaultSessionGate.ts` · `unlockVault.ts` · `synapseBus.ts` + `driveIngestSynapse` / `dcapAlertSynapse` / `journalWovenSynapse` / `paralysBrytarenSynapse` · `stateStore.ts` · `orchestrator.ts` · `kompis-supervisor.ts`

| Område | Nyckelfiler | Smoke |
|--------|-------------|-------|
| WORM collections | `firestore.rules` — `reality_vault`, `children_logs`, `journal`, `dossier_snapshots`, `dcap_alerts`, `evolution_ledger` | valv-security |
| Dual vault gate | `vaultSessionGate.ts`, `unlockVault.ts`, `issueVaultSession` | valv-security |
| Callable guards | `callableGuards.ts`, `guardSensitiveCallableV2` | valv-security |
| App Check (kod + Console) | `appCheck.ts`, `APP_CHECK_ENFORCE=true`, Firebase Console Enforce | inkast + valv-security |
| DCAP före LLM | `routeFromDcap`, `classifyInboxDocument`, `kompis-supervisor.ts` | orkester |
| Tre silos — ingen cross-RAG | U1 — `kampspar`/`kb_docs`, `reality_vault`, `children_logs` | grunder-kanon |

---

## 2. G10 Inkast (CP-3, CP-4)

| Område | Nyckelfiler | Smoke |
|--------|-------------|-------|
| Backend klassificering | `inboxClassifier.ts`, `applyInkastConfidenceGate` (0.75) | inkast, inbox |
| Persist + HITL | `inboxPersist.ts`, `routeInboxToWorm`, `inbox_queue` | inbox |
| Storage onFinalize | `inkastStorageOnFinalize.ts` | build |
| Audio MIME | `inkastMimeTypes.ts` | inkast |
| Source allowlist | `inkastSourceModule.ts` | inkast |
| UI CapturePanel | `CapturePanel.tsx`, `CaptureSuperModule.tsx`, delegates | locked-ux, inkast |

**MUST NOT:** bevis → `kb_docs`; auto-promote barnlogg → Valv.

---

## 3. SynapseBus (CP-5)

| Trigger | Handler | Silo |
|---------|---------|------|
| `drive_file_ingested` | `driveIngestSynapse` | G10 routing → kb_docs \| reality_vault \| children_logs \| inbox_queue |
| `journal_woven` | `journalWovenSynapse` | `kampspar` (optIn === true) |
| `dcap_alert` | `dcapAlertSynapse` | `dcap_alerts` WORM |
| `user_overwhelm` | `paralysBrytarenSynapse` | mikrosteg (session) |

Smoke: `smoke:orkester` · Snapshot: `./scripts/snapshot_locked_module.sh synapser`

---

## 4. Locked UX §11–17 (CP-1)

Se [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md):

- Barnfokus-frågor (Familjen)
- Valv: Mönster + Orkester + Kunskapsbank + Aktörskarta
- Planering P3 Kanban `/planering`
- Barnporten + Inkorg→Valv HITL
- Ikoner D1, M2, WH1, WH2
- Meny drawer (Vardag + Valv-sektioner)

**INTE locked (DEFER):** MåBra hybrid-8, JOY-17, evolution_ledger UI — se §7.

Smoke: `smoke:locked-ux`

---

## 5. Sacred Features (aldrig utan PMIR)

Verklighetsvalvet · Sanningens Sköld · Morgonkompassen · Dossier · Speglar · Zero Footprint · Draft Layer · Device Clear

---

## 6. Dokumentation LOCK (refereras av rules)

| Dokument | CP |
|----------|-----|
| `SECURITY-LOCK-MANIFEST.md` | CP-1 |
| `UPLOAD-UNIFIED-SPEC.md` | CP-2 |
| `SYNAPSE-LOCK-SPEC.md` | CP-5 |
| `DEPLOY-CHATBOT-WAVE.md` | CP-6 |
| `APPCHECK-ENFORCE-GUIDE.md` | CP-6 |
| `DESIGN-KEEP-REGISTER.md` | CP-7 |
| `docs/external-ai/bifoga/` (struktur + sync) | CP-7 |

---

## 7. Medvetet INTE locked (WIP / DEFER)

| Område | Status | Nästa |
|--------|--------|-------|
| Upload unified Valv DirectPanel | WIP | efter UI-våg B1 |
| Valv modul (supermodule UI) | WIP | PHASE-08 |
| MåBra 19.2–19.5, hybrid-8, JOY-17 | DEFER | efter core lock |

Se [`CURSOR-HANDOFF-OPEN.md`](./CURSOR-HANDOFF-OPEN.md).

---

## Snapshot-kommandon (Pontus)

```bash
./scripts/snapshot_locked_module.sh inkast
./scripts/snapshot_locked_module.sh synapser
# valv / upload-unified när respektive modul når LOCK
```

Giltiga modulnamn: `valv` · `inkast` · `synapser` · `upload-unified` — **inte** `locked_ux`.
