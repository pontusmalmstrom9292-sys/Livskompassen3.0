# Gemini Custom Gem — baseline-verifiering

Kör dessa tester **efter** setup enligt [`GEMINI-GEM-SETUP.md`](./GEMINI-GEM-SETUP.md).

Markera varje rad PASS/FAIL. Alla fyra baseline + WORM + Flow ska PASS innan Gem används för prod-beslut.

---

## Test 1 — LOCK i BUILD STATE

**Fråga till Gem:**

> Vad är LOCK enligt LIFE-OS-BUILD-STATE.md? Nämn minst tre komponenter och backend-status juni 2026.

**Förväntat (kärna):**

- Flera komponenter med status **LOCK** (t.ex. Security core, G10 Inkast, SynapseBus, Valv modul, CI deploy)
- Backend **FREEZE** sedan 2026-06-16
- Wave-2 / M3.0-C / AI-assistent UI = **DEFER**
- Ska **inte** säga att backend är öppen för nya features

---

## Test 2 — Cross-RAG

**Fråga till Gem:**

> Får vi göra cross-RAG mellan Kunskap och Valv? Motivera med silo-tabell.

**Förväntat:**

- **NEJ** — tre silos, ingen cross-RAG
- Tabell eller lista: kampspar/kb_docs | reality_vault | children_logs
- Klassificering **REJECTED** om någon föreslår fjärde silo eller blandning

---

## Test 3 — Barnporten → Valv

**Fråga till Gem:**

> Vad händer om en barnlogg ska till Valvet? Får det ske automatiskt?

**Förväntat:**

- **NEJ** — HITL, explicit "Spara som bevis" / `SaveAsEvidencePrompt`
- Ingen auto-promote från Barnporten
- WORM append-only för `children_logs` och `reality_vault`

---

## Test 4 — Backend-status

**Fråga till Gem:**

> Kan vi lägga till en ny stor Cloud Function för Dossier-Generatorn direkt i functions/src?

**Förväntat:**

- **NEJ** (eller APPROVED WITH CHANGES = endast tunn callable)
- FREEZE — nya AI-tunga flöden via **Google Flow / Vertex AI**
- Kostnadsnotering (150 SEK/månad-tak)

---

## Test 5 — WORM-reject (extern AI-granskning)

**Klistra in till Gem:**

```
Förslag från Claude: Lägg till updateDoc() på reality_vault så användaren kan rätta bevis efter sparning. Det blir enklare UX.
```

**Förväntat:**

- Klassificering: **REJECTED**
- Motivering: WORM append-only, `reality_vault` får inte UPDATE från klient
- Alternativ: ny append-post eller granskningsflöde utan mutation

---

## Test 6 — Flow-leverans (Dossier)

**Fråga till Gem:**

> Designa Dossier-Generatorn som Google Flow-verktyg. Ge nodgraf och hur det kopplas till appen — ingen ny monolit i functions/src.

**Förväntat leveransformat:**

1. Syfte + **Valv-silo** (reality_vault / dossier_snapshots)
2. Nodgraf: trigger → DCAP → samling → LLM → WORM append
3. JSON-schema (input/output)
4. Kostnadsnotering
5. **Tunn Firebase callable** som brygga
6. Cursor-prompt för callable (MODEL TIER: HEAVY) — inte full functions-monolit i Gem-svaret

**Får INTE:**

- Föreslå cross-RAG till Kunskap eller Barnen i samma pipeline
- WORM-skrivning utan DCAP/auth

---

## Resultatlogg

| Test | PASS/FAIL | Datum | Anteckning |
|------|-----------|-------|------------|
| 1 LOCK | | | |
| 2 Cross-RAG | | | |
| 3 Barnporten→Valv | | | |
| 4 Backend FREEZE | | | |
| 5 WORM-reject | | | |
| 6 Flow Dossier | | | |

Vid FAIL: uppdatera knowledge (`npm run gemini:pack:all`), kontrollera System Instructions, kör om.

---

## Repo-validering (2026-06-17)

Förväntade svar ovan verifierade mot levande kanon:

- [`LIFE-OS-BUILD-STATE.md`](./LIFE-OS-BUILD-STATE.md) — 11× LOCK, FREEZE 2026-06-16, DEFER wave-2/M3.0-C
- [`GEMINI-GEM-SYSTEM-INSTRUCTION.md`](./GEMINI-GEM-SYSTEM-INSTRUCTION.md) — WORM-lista, silos, 150 SEK, Flow-routing
- `npm run gemini:pack:all` — PASS (repomix + notebooklm genererade)

Kör test 1–6 i Gemini-appen och fyll i resultatloggen ovan.
