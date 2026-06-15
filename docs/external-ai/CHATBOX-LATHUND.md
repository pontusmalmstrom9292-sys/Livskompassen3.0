# ChatBox AI — Lathund (7 dagar)

Kort översikt utan prompter. Detaljer och prompter: [`README.md`](./README.md) · [`CHECKPOINT-PROTOCOL.md`](./CHECKPOINT-PROTOCOL.md).

**Syfte:** Spara Cursor/Google-krediter. Tung analys och kod i **ChatBox AI**. Cursor för granskning, smoke, låsning och deploy.

**Parallellt UI/design:** [`UI-DESIGN-HANDOFF.md`](./UI-DESIGN-HANDOFF.md) — annat körfält, samma projektplan, inga filkrockar.

---

## Innan du börjar

| Vad | Var |
|-----|-----|
| Modellval | [`MODEL-PICKER.md`](./MODEL-PICKER.md) |
| Status LOCK/OPEN | [`LIFE-OS-BUILD-STATE.md`](./LIFE-OS-BUILD-STATE.md) |
| Repomix + bifoga-mappar | `npm run chatbot:pack:all` |
| Bifoga-filer (register m.m.) | [`bifoga/`](./bifoga/) — `npm run chatbot:sync:bifoga` |
| Lokal backup-mapp | `~/Livskompassen-snapshots/` |

**Regel:** Max **2 parallella** ChatBox-chattar. Kod från två chattar på samma fil = nej.

---

## Ritual efter varje ChatBox-chatt (CHECKPOINT)

1. Spara svaret i `leveranser/`
2. Granska i Cursor — applicera bara godkända ändringar
3. Kör smoke (se tabell per dag nedan)
4. Uppdatera `LIFE-OS-BUILD-STATE.md` (LOCK om PASS)
5. Städa filer om det passar — [`REPO-HYGIENE.md`](./REPO-HYGIENE.md)
6. Om LOCK → `./scripts/snapshot_locked_module.sh <modul>`
7. Uppdatera `CHECKPOINT-LOG.md`
8. Först då — nästa ChatBox-chatt

---

## 7 dagar — vad, modell, leverans, smoke

### Dag 1 — Säkerhetslås (audit, ingen ny kod)

| | |
|---|---|
| **Modell** | Claude Opus 4.8 |
| **Repomix** | `exports/chatbot-handoff/chatbot-pack-security.md` |
| **Gör** | Inventera WORM, vault-gate, synapser, DCAP, locked UX |
| **Leverans** | `SECURITY-LOCK-MANIFEST.md` |
| **Smoke** | `smoke:valv-security` · `smoke:locked-ux` |
| **Parallellt OK** | Sonar 2 — App Check-research (egen chatt, bara docs) |

---

### Dag 2 — Upload SPEC (ingen kod än)

| | |
|---|---|
| **Modell** | Claude Opus 4.8 |
| **Repomix** | `exports/gemini-handoff/konsolidering-upload/` |
| **Gör** | En canonical upload-väg frontend + backend; behåll 3 silos |
| **Leverans** | `UPLOAD-UNIFIED-SPEC.md` |
| **Smoke** | Ingen kod — du godkänner SPEC manuellt |
| **Extra** | Design-audit kan köras här — [`PHASE-DESIGN-AUDIT.md`](./PHASE-DESIGN-AUDIT.md) |

---

### Dag 3 — Backend upload

| | |
|---|---|
| **Modell** | GPT-5.5 eller Gemini 3.1 Pro |
| **Vänta** | Dag 2 godkänd |
| **Gör** | `inkastSourceModule`, audio-MIME, Storage onFinalize, confidence 0.75 |
| **Smoke** | `functions build` · `smoke:inkast` · `smoke:inbox` |

---

### Dag 4 — Frontend upload

| | |
|---|---|
| **Modell** | Claude Sonnet 4.6 |
| **Helprompt** | [`PHASE-04-FULL-PROMPT.md`](./PHASE-04-FULL-PROMPT.md) |
| **Vänta** | Dag 3 klar (CHECKPOINT-3 PASS) |
| **Gör** | Filer i `CapturePanel` över alla Superhubs |
| **Smoke** | `npm run build` · `smoke:locked-ux` |
| **Snapshot** | `snapshot_locked_module.sh upload-unified` om LOCK |

---

### Dag 5 — Synapse-lås

| | |
|---|---|
| **Chatt 1** | Grok 4.20 — analys → `SYNAPSE-LOCK-SPEC.md` |
| **Chatt 2** | GPT-5.5 — kod om luckor |
| **Gör** | Idempotens, silo-routing, ingen fjärde RAG |
| **Smoke** | `smoke:orkester` |
| **Snapshot** | `snapshot_locked_module.sh synapser` om LOCK |

---

### Dag 6 — App Check + deploy-förberedelse

| | |
|---|---|
| **Chatt 1** | Sonar 2 — Firebase Console-steg |
| **Chatt 2** | GPT-5.4 — deploy-checklista |
| **Du manuellt** | App Check Enforce i Firebase Console |
| **Leverans** | `DEPLOY-CHATBOT-WAVE.md` |

---

### Dag 7 — Final lås

| | |
|---|---|
| **Modell** | GPT-5.4 Mini |
| **Bifoga** | [`bifoga/01-register/`](./bifoga/01-register/) + [`02-leveranser/`](./bifoga/02-leveranser/) + [`04-repomix/`](./bifoga/04-repomix/) · kör `npm run chatbot:sync:bifoga` först |
| **Gör** | `LIFE-OS-CORE-LOCKED.md`, design-städlista, PMIR-utkast |
| **Smoke** | `smoke:orkester` · `smoke:locked-ux` |
| **Arkivera** | Sammanfattning → `docs/evaluations/` |

---

## När en modul är LOCK

1. Smoke PASS
2. Rad i `LIFE-OS-BUILD-STATE.md` = LOCK
3. Rad i `LIFE-OS-CORE-LOCKED.md`
4. **Lokal kopia:** `./scripts/snapshot_locked_module.sh valv|inkast|synapser|upload-unified`
5. Fråga Cursor om git commit + push (du godkänner)

| Modul | Snapshot-kommando |
|-------|-------------------|
| Valv | `snapshot_locked_module.sh valv` |
| Inkast (redan låst) | `snapshot_locked_module.sh inkast` |
| Synapser | `snapshot_locked_module.sh synapser` |
| Upload unified | `snapshot_locked_module.sh upload-unified` |

---

## Städning (löpande)

- **KEEP** — aktiv design/specs: [`DESIGN-KEEP-REGISTER.md`](./DESIGN-KEEP-REGISTER.md)
- **ARCHIVE** — gamla mockups → `docs/archive/design-2026-06/` (flytta, radera inte direkt)
- Logga i `HYGIENE-LOG.md`

Största städ-kandidater: `docs/design/icons-proposals/`, `redesign-proposals/`, oanvända `themes/`.

---

## Medvetet senare (spara krediter)

MåBra hybrid-8 (Fas 19.2), hex-tokens, evolution_ledger, Projekt P2+ — **efter** upload + synapse är låsta.

---

## Vad som redan är klart i projektet

- G1–G16 done · G10 Inkast låst 2026-06-06
- 4 synapser live
- **Öppet:** upload inte enhetlig, audio-MIME, Storage trigger, App Check Console Enforce

---

## Snabbstart Dag 1

1. `npm run chatbot:pack:all`
2. ChatBox → Opus 4.8 → ny chatt
3. Öppna `PHASE-01-security-lock.md` (prompt där om du behöver)
4. Efter svar → CHECKPOINT i Cursor

*Prompter finns i `PHASE-0X-*.md` och `CHATBOT-MASTER-PROMPT.md` — denna lathund refererar bara till dem.*
