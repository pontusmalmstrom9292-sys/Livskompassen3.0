# Implementationsplan — BIFF-filter, Kompassråd, Tyst reflektion

**Datum:** 2026-06-18  
**Status:** Utkast — väntar godkännande före kod  
**Kanon:** grunder-kanon.mdc · backend-agents.mdc · deep-research-pmir.mdc

---

## Sammanfattning

Tre Gemini-funktioner som idag **saknas eller bara delvis finns**. Planen återanvänder befintliga mönster (`processBrusfilter`, `journalQuickMirror`, `generateCompassInsight`) men bygger **tre nya, smala callables** med prompts centraliserade i `functions/src/sharedRules.ts`.

| # | Feature | Nuvarande | Mål | Rules-ändring |
|---|---------|-----------|-----|---------------|
| 1 | BIFF-filter (inline) | Hamn/Brusfilter (annat flöde) | Knapp vid textarea → ersätt utkast | Nej |
| 2 | Kompassråd (dynamiskt) | Statiskt `KompassradPanel` | Gemini + kontext, tap = nytt | Nej |
| 3 | Tyst reflektion | `journalQuickMirror` (ephemeral) | Persistens på journal-post | **Ja (PMIR)** |

**Rekommenderad ordning:** 1 → 2 → 3 (ökande risk; våg 3 kräver explicit OK på `firestore.rules`).

---

## Gemensamma principer

### Kostnad & säkerhet
- Modell: `gemini-2.5-flash` (samma som Brusfilter) — billig, snabb, JSON-kapabel.
- Alla callables: `guardSensitiveCallableV2`, App Check när enforced, per-UID rate limit.
- **Ingen** cross-RAG, ingen Valv-läsning utan vault-session (gäller våg 2 om journal ingår).
- Prompts **endast** i `sharedRules.ts` — inte hårdkodade i agenter.

### UX (Obsidian Calm)
- Inga chattbubblor — inline textbyte eller diskret fade-in.
- Knappar: dämpad guld/indigo, `rounded-xl`, ikon `Wand2` eller `Sparkles` (inte ny locked icon).
- Fel: tyst fallback (behåll originaltext / statiskt citat / spara utan AI-fält).

### Zero Footprint
- BIFF-rewrite och Kompassråd lagras **inte** i Firestore (session/local cache OK).
- Tyst reflektion är **immutable metadata** skriven en gång vid journal-create (WORM-kompatibelt).

---

## Våg 1 — BIFF-filter («Tvätta enligt BIFF»)

### Syfte
Användaren skriver ett **utkast** (svar till ex, meddelande i stress). En knapp strukturerar om texten enligt BIFF — utan JADE — och **ersätter** texten i samma fält.

### Avgränsning mot befintligt

| Befintligt | Skillnad |
|------------|----------|
| `BiffPublicPanel` (Hamn) | Analyserar **inkommande** meddelande; separat panel |
| `processBrusfilter` (Inkast) | DCAP + logistik + svar; egen preview-fas |
| **Nytt** | **Utgående utkast**, inline, ett fält |

### Backend

**Ny callable:** `biffRewriteDraft`

- `functions/src/callables/biffRewriteDraft.ts`
- `functions/src/sharedRules.ts` → `BIFF_REWRITE_DRAFT_SYSTEM_PROMPT`
- `functions/src/index.ts` → export

**Request:** `{ draft: string; context?: 'dagbok' | 'hamn' | 'inkast' }`

**Response:** `{ cleanedText: string; toneCheck: 'pass' | 'still_emotional' | 'too_long' }`

- `draft` max 4000 tecken.
- Rate limit: **20/min**.
- Ingen vault-session krävs.

### Frontend

**Ny komponent:** `src/modules/shared/ui/BiffRewriteButton.tsx`

Integrationspunkter:
1. `ReflectionEditor.tsx` — bredvid Mic (prioritet)
2. Hamn/Inkast — valfri våg 1b

**Service:** `src/modules/core/api/biffRewriteDraftService.ts`

### Acceptanskriterier
- Knapp vid dagboks-textarea när text ≥ 10 tecken
- Inline ersättning, ingen modal
- Deploy: `functions:biffRewriteDraft` + `hosting`

**Estimat:** ~4–6 h

---

## Våg 2 — Kompassråd (dynamiskt hem-kort)

### Syfte
Dynamisk mening i `KompassradPanel` från Gemini. Tap → nytt citat.

### Kontextkällor (idag)

| Signal | Källa |
|--------|-------|
| Dygnsfas | `getCompassFlowMeta()` |
| Kapacitet | `useCapacityGate` / `evolution_hub` |
| Energi/humör | Senaste `check_ins` (`energy`, `mood`) |
| Dagens steg | `pickHomeDaySteps()` (Planering) |
| Senaste journal | Senaste post: mood + 120 tecken text |

**Notering:** Separata «Fysisk energi / Mental klarhet»-fält finns inte som eget UI ännu — våg 2 använder `CheckIn.energy`/`mood` och `capacityScore`.

### Backend

**Ny callable:** `generateKompassrad`

- Server läser kontext (ej klient-bulk)
- Response: `{ line: string; generatedAt: string }` — max 6 ord
- Rate limit: **10/min**
- Klient-cache: `sessionStorage`, TTL 4h

### Frontend

- Hook: `useKompassrad.ts`
- Uppdatera `KompassradPanel.tsx` — onClick refresh, fade-in
- Fallback: befintlig `getCompassAdvice()`

**Estimat:** ~6–8 h

---

## Våg 3 — Tyst reflektion (journal-save)

### Syfte
Vid spara: Gemini → `primary_emotion`, tags (1–2), `hidden_win` — **persisterat** på journal.

### WORM / Firestore — PMIR krävs

Utöka `isValidJournalCreate()` med valfritt:

```ts
aiReflection?: {
  primaryEmotion: string;
  suggestedTags: string[];
  hiddenWin: string;
  model: string;
}
```

### Backend

**Ny callable:** `journalSilentReflection`

Flöde: Spara-klick → callable → merge tags → `saveJournalEntry` med `aiReflection`

Gäller `handleSave` **och** `handleQuickSave` i `useJournalFlow.ts`.

### Frontend

- Utöka `JournalEntry` typ
- `JournalEntryCard.tsx` — guld-pills + kursiv `hiddenWin`
- `saveJournalEntry` skickar `aiReflection`

**Estimat:** ~8–10 h

---

## Test & deploy

| Våg | Functions | Hosting | Rules |
|-----|-----------|---------|-------|
| 1 | `biffRewriteDraft` | ja | nej |
| 2 | `generateKompassrad` | ja | nej |
| 3 | `journalSilentReflection` | ja | **ja** |

Smoke: `npm run build`, `smoke:locked-ux`, `smoke:orkester`

---

## Beslut som behöver ditt OK

1. Ordning **1 → 2 → 3**?
2. Våg 3 — OK att utöka journal WORM med `aiReflection`?
3. BIFF-knapp — Dagbok först, eller även Hamn i våg 1?
4. Kompassråd — Gemini med statisk fallback (rekommenderat)?

---

## Nästa steg efter godkännande

Våg 1: `biffRewriteDraft` + `BiffRewriteButton` i `ReflectionEditor`

**Prompt för Cursor (våg 1):**

Implementera våg 1 enligt docs/evaluations/2026-06-18-gemini-biff-kompassrad-tyst-reflektion.md. Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.

---

## Flow-audit (2026-06-18) — undvik dubletter

Genomgång av befintliga AI-flöden. **Bygg vidare på dessa — skapa inte parallella system.**

### Dagbok — `useJournalFlow` + `DagbokInputSuperModule`

| Läge | AI idag | Persistens | Överlapp med spec |
|------|---------|------------|-------------------|
| `reflektion` | Ingen AI vid save | WORM journal | **Tyst reflektion** ska in i `persistEntry()` här |
| `quick_mirror` | `journalQuickMirror` efter save | WORM + ephemeral UI 12s | Delvis spegling — **inte** samma som hidden_win i arkiv |
| Valv öppet | `weaveJournalEntry` (async, HITL) | `weaver_pending` | **Annorlunda** — Valv-metadata, kräver godkännande |

**Beslut:** Tyst reflektion hookas i **`persistEntry()`** (gemensam för reflektion + quick_mirror). Låt `journalQuickMirror` vara kvar för snabblägets ephemeral spegling — eller slå ihop till ett callable med `mode` om vi vill minska antal endpoints.

### BIFF — tre befintliga spår (inte inline-utkast)

| Spår | Callable | UI | Riktning |
|------|----------|-----|----------|
| Trygg Hamn | `analyzeMessage` (`module: safe_harbor`) | `BiffPublicPanel` | **Inkommande** sms → Grey Rock-svar i separat fält |
| Inkast/Valv | `processBrusfilter` | `CapturePanel` fas `brusfilter`, `VaultOrkesterPanel` | **Inkommande** → `biff_draft_reply` (kopiera) |
| Global FAB | samma Hamn-panel | `BiffWidgetFAB` | Flytande brusfilter |

**Beslut:** Ny **inline rewrite** ska **inte** återanvända `analyzeMessage` (tung DCAP/Gräns-Arkitekten) eller `processBrusfilter` (DCAP-schema). Extrahera gemensam prompt-bit i `sharedRules.ts`, ny tunn callable `biffRewriteDraft` — eller `processBrusfilter` med `mode: 'outgoing_draft'` om vi vill en fil (rekommendation: **egen callable**, tydligare silo).

**Inte förväxla med:** `KbtTransformatorPanel` (`mabraCoach` mode transformator) — inåtvänd tanke, tre kort, MåBra — **inte** BIFF/sms.

### Kompassråd — statiskt + dashboard-insikt

| System | Typ | Plats |
|--------|-----|-------|
| `getCompassAdvice()` | Deterministisk citatbank | `KompassradPanel`, Hem, Hamn |
| `buildAdaptiveMemoryCards()` | Regelbaserade kort | Hem discovery |
| `generateCompassInsight` | Gemini veckosammanfattning | `/dashboard` only |

**Beslut:** Uppgradera **`KompassradPanel`** + ny `generateKompassrad` — **inte** utöka `generateCompassInsight`. Behåll `getCompassAdvice()` som offline-fallback.

### Valv — mönster-AI (ej dagbok)

| Callable | Syfte |
|----------|-------|
| `assistPatternMetadata` | HCF-taktik-IDs på vault-post |
| `weaveJournalEntry` | Emotioner/actors/threat → HITL |

**Inte** använd för dagbokstaggar eller hidden_win.

### Reviderad implementationsstrategi

1. **BIFF-filter** — ny callable, men delad BIFF-prompt i `sharedRules.ts` med Brusfilter; UI endast i `ReflectionEditor` (+ ev. Hamn reply-fält senare).
2. **Kompassråd** — byt datakälla i befintlig `KompassradPanel`, inte nytt fristående kort.
3. **Tyst reflektion** — **en** hook i `useJournalFlow.persistEntry()`; utöka `JournalEntry` + `JournalEntryCard`; **inte** nytt supermodule-läge i `dagbokInputModes.ts`.
