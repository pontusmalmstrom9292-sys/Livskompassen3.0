# Flow P1 — färdiga prompter (Gemini · ChatBox · Cursor)

**Syfte:** Fortsätt Brusfilter/Flow-planen utan Cursor-kvot. ChatBox har tunga modeller gratis (7-dagars prov).

**Kanon:** [`2026-06-17-flow-pipeline-karta.md`](../evaluations/2026-06-17-flow-pipeline-karta.md) · **Status:** P1 BUILD — väntar ditt godkännande i §6.

**Modellval (bekräftat i MODEL-PICKER):**

| Uppgift | Modell | Varför |
|---------|--------|--------|
| Callable SPEC, WORM, säkerhet | **Claude Opus 4.8** | Djup arkitektur |
| React / Inkast-preview UI | **Claude Sonnet 4.6** | Stark på frontend/TSX |
| Flow-verktygsdesign | Google Flow | ~2000 krediter, inte ChatBox |
| Prod-kod + smoke | Cursor | När du har kvot kvar |

**Sonnet 4.6** är projektets förstahandsval för React/Superhub — Opus för backend/SPEC.

---

## A. Uppdatera Gem (engångs, minskar vägran)

1. `npm run gemini:sync:kunskap`
2. Klistra om **Instructions** från `gemini-kunskap/00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt` (innehåller REFUSAL-SAFE-block)
3. **Knowledge — rekommenderad minimal uppsättning:**
   - `01`–`04`, `07`, `08`
   - `tier-2-valfritt/14`, `15`, `16`, `17` (denna fil)
4. **Ladda INTE** `05-locked-ux` eller `10-doman-covert` i Gem om du får vägran — de finns kvar i repo för Cursor.

---

## B. Ny Gemini-chatt — START (klistra först)

```text
Du är teknisk projektledare för Livskompassen v2 (React + Firebase, evidens-dagbok).

UPPDRAG: Fortsätt Flow-plan P1 — "faktanormalisering" före WORM-sparning i evidence vault.

FAKTA (inline, verifiera mot knowledge om uppladdad):
- Backend FREEZE 2026-06-16 — endast tunna callables + bugfix
- P1 lucka: classifyInboxDocument routar; saknas preview-steg före reality_vault
- Mål: preview JSON + HITL-knapp, ingen auto-WORM
- Filer: submitInkastLite.ts, inboxClassifier.ts, callableGuards.ts, CapturePanel.tsx
- Tre silos — ingen cross-RAG

GÖR NU (ett steg):
1. Sammanfatta P1 i max 8 rader på svenska
2. Fråga mig: "Godkänner du BUILD av P1?" (ja/nej)
3. Om ja — ge mig exakt CHATBOX-prompt (engelska) för callable SPEC med modell Claude Opus 4.8

Ton: klinisk, lågaffekt. Inga psykologiska råd — bara schema, callables, JSON.
```

---

## C. Efter du svarat "ja" — Gemini ger ChatBox-prompt

Om Gem inte genererar — klistra detta i **ny ChatBox-chatt · Opus 4.8**:

```text
Livskompassen v2 — SPEC only (no full prod implementation).

Task: Design thin callable `previewInkastClean` that:
- Uses guardSensitiveCallableV2; vault session when writing path is separate
- Accepts { rawText, sourceType: sms|email|note, locale: sv-SE }
- Calls external Flow/LLM endpoint (env URL) — returns preview JSON only
- Returns:
  { cleanFacts[], timelineHints[], emotionalBaitStripped[], suggestedTitle }
- NO write to reality_vault in this callable
- Confirm/save uses existing HITL: SaveAsEvidencePrompt / routeInboxToWorm pattern

READ (conceptual — do not invent paths):
- functions/src/lib/submitInkastLite.ts
- functions/src/lib/inboxClassifier.ts
- functions/src/callables/callableGuards.ts

MUST NOT: cross-RAG, auto WORM, replace classifyInboxDocument routing

Deliver:
1. TypeScript interfaces
2. Error codes + rate limit notes
3. Sequence diagram (text)
4. firestore.rules impact (expect: none)
5. Env vars list (FLOW_BRUSFILTER_URL etc.)

Model context: Claude Opus 4.8 — architecture depth required.
```

Spara svaret som: `docs/external-ai/leveranser/2026-06-17-previewInkastClean-spec.md`

---

## D. ChatBox — frontend preview (Sonnet 4.6)

**Efter** Opus-SPEC godkänd (av dig eller Gemini):

```text
Livskompassen v2 — React UI SPEC + component sketch (TypeScript).

Task: HITL preview panel for Inkast "clean facts" after previewInkastClean callable.

READ CONTEXT:
- Obsidian Calm: bg-surface-2, text-accent, border-border, rounded-xl
- Extend CapturePanel flow — do NOT remove G10 Inkast LOCK
- Pattern: SaveAsEvidencePrompt (manual promote to vault)

Deliver:
1. Component tree (CapturePanel extension vs child panel)
2. Props/state for preview JSON
3. UX copy Swedish — neutral, low-affect
4. One TSX sketch (~80 lines) for PreviewCleanFactsPanel
5. Loading/error states

MUST NOT: auto-save to reality_vault, streak/XP, public vault words without vaultSessionOpen

Model: Claude Sonnet 4.6 — frontend expert.
```

---

## E. Google Flow — P1 verktyg (§9.1)

Klistra i **Google Flow** (inte Gem):

```text
Build a Swedish forensic text-cleaning tool "Livskompassen Brusfilter" for high-conflict co-parent SMS/email.

CONSTRAINTS:
- Output neutral observable facts only — no diagnoses, no party labels
- Strip emotional bait, accusations, JADE triggers
- Preserve dates and logistics
- JSON output schema only

INPUT: rawText, sourceType (sms|email|note), locale sv-SE

OUTPUT JSON:
{
  "cleanFacts": ["max 8 bullet facts"],
  "timelineHints": [{"date": "YYYY-MM-DD or unknown", "fact": "string"}],
  "emotionalBaitStripped": ["what was removed, paraphrased"],
  "suggestedTitle": "short neutral title"
}

SYSTEM TONE: clinical, low-affect, Swedish. Facts for evidence vault, not coaching.

Do NOT decide legal outcomes. Do NOT merge knowledge from other domains.

Export: tool name, system prompt, user prompt template, one example SMS.
```

---

## F. Cursor — när du har kvot (wave 1 backend)

```text
MODEL TIER: HEAVY
SCOPE: backend-only
READ FIRST:
  - functions/src/lib/submitInkastLite.ts
  - functions/src/lib/inboxClassifier.ts
  - functions/src/callables/callableGuards.ts
  - docs/external-ai/leveranser/2026-06-17-previewInkastClean-spec.md
CONTEXT: P1 Brusfilter — implement previewInkastClean per approved ChatBox SPEC
TASK: Wave 1 — callable only. Flow URL from env. No WORM in preview.
MUST NOT: modify classifyInboxDocument routing; cross-silo; auto-promote reality_vault
VERIFY:
  - cd functions && npm run build
  - npm run smoke:inkast
  - npm run smoke:valv-security
DONE WHEN: build exit 0 AND smoke:inkast PASS

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
```

---

## G. Kedja (minsta antal steg)

```text
Gemini (B) → du godkänner P1 → ChatBox Opus (C) → ChatBox Sonnet (D) → Flow (E) parallellt → Cursor (F)
```

Gemini ska **granska** ChatBox-svar: "APPROVED / APPROVED WITH CHANGES / REJECTED" innan Cursor.

---

*Uppdaterad: 2026-06-17*
