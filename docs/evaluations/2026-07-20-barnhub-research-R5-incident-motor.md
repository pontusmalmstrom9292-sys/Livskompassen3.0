# R5 — Incidentanalys-motor (Barnen-silo)

**Datum:** 2026-07-20  
**Typ:** Design-dokument (ingen prod-kod)  
**Status:** Research / PMIR-underlag  
**Silo:** Barnen (`children_logs`)  
**Callable (föreslagen):** `analyzeChildIncident`  
**Kostnadsmål:** ≤ 1× Gemini Flash per anrop; fail-closed utan LLM

---

## 0. Syfte (ett exempel)

**Input (förälder):**  
«Kasper sa att mamma sagt att pappa inte vill träffa honom.»

**Mål:**  
1. Tagga observabelt mönster (triangulering / lojalitetskonflikt) **utan diagnos**.  
2. Ge förälder: relevanta frågekort + kort fördjupning + **barn-respons-script** (till barnet — inte BIFF till ex).  
3. Append-WORM till `children_logs` med epistemik `[citat]` / `[tolkning]`.  
4. Stärka lexical Barnen-RAG. Ingen cross-RAG. Ingen vector i Fas A.

---

## 1. Icke-mål (hard)

| Förbjudet | Motivering |
|-----------|------------|
| Grey Rock / BIFF-ton mot ex | Det är Gräns-Arkitekten / Valv — fel silo och fel mottagare |
| Diagnos på motpart eller barn | Kanon: beteende + datum; `barn-observation-epistemik` |
| Auto-promote → `reality_vault` | Kräver HITL (`SaveAsEvidencePrompt`) |
| Cross-RAG Kunskap/Valv | `memory-silo` / `siloEnforcer` |
| Ny Firestore-collection | Behåll WORM i `children_logs` |
| Vertex / Pro / minInstances | `cost-guard` — Flash only, scale-to-zero |
| Återanvända `TACTIC_PATTERN_DEFS` rakt av | SMS-motpart-taktik; här: **barnrapporterade** signaler + BBIC-ton |

**Återanvänd endast mönsterformen** från `shared/patterns/tacticPatternLibrary.ts`  
(`id` + `pattern` + `weight` + `compile`/`scan`) — **inte** teknik-etiketter som DARVO/GASLIGHTING mot SMS, och **inte** Hamn/Grey Rock-svar.

---

## 2. Källor som låses som kanon

| Artefakt | Roll i R5 |
|----------|-----------|
| `functions/src/lib/childrenLogsQueryRag.ts` | Lexical token-score; endast `children_logs`; `isParentVisibleChildLog` |
| `functions/src/lib/childObservationEpistemics.ts` + klient-spegel | `[citat]` / `[tolkning]` |
| `.cursor/rules/barn-observation-epistemik.mdc` | MUST/MUST NOT vid spar |
| `firestore.rules` `isValidChildrenLogCreate` + `WORM_SCHEMA.children_logs` | Allowlist; append-only |
| `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` | Ton-mall: neutral BBIC, ingen Valv-ton |
| `shared/patterns/tacticPatternLibrary.ts` | Heuristik-engine-form (ny `bh-*`-bibliotek) |
| `Silo.BARNEN` / `createSiloGuard` | Runtime silo-grind |

---

## 3. Tag-katalog (deterministisk, före Gemini)

Ny delad katalog (designnamn): `shared/patterns/barnIncidentPatternLibrary.ts`  
Prefix `bh-` (barn-heuristik). Tags = **beteendemönster**, aldrig klinisk diagnos.

| Tag-id | Tag | Heuristik (exempel, svenska) | Vikt |
|--------|-----|------------------------------|------|
| `bh-tri-001` | `triangulering` | barnet återger budskap från ena föräldern om den andra; «mamma/pappa sa att du…» | 40 |
| `bh-loy-001` | `loyalty_conflict` | måste välja sida; «vem tycker du mest om»; skuld om glädje hos den andra | 35 |
| `bh-pap-001` | `parental_alienation_pattern` | **beteendeetikett**: upprepade negativa budskap om den andra föräldern via barnet — **ej** PA-diagnos | 35 |
| `bh-gate-001` | `contact_fear_relay` | «vill inte träffa dig», «du bryr dig inte» — kontaktångest vidarebefordrad | 30 |
| `bh-blame-001` | `blame_relay` | barnet bär ansvar/skuld för vuxenkonflikt | 30 |
| `bh-anx-001` | `separation_anxiety_signal` | oro före/efter överlämning kopplad till budskap | 20 |
| `bh-unc-001` | `unclear_source` | osäker om citat vs förälder-tolkning | 10 |

**Regel:** `parental_alienation_pattern` får aldrig renderas som «diagnos» i UI eller WORM. Visa etikett: *«Observerat kommunikationsmönster (beteende)»*.

### Exempelmatch

Text: *Kasper sa att mamma sagt att pappa inte vill träffa honom.*

| Match | Tag |
|-------|-----|
| «sa att mamma sagt» + budskap om pappa | `triangulering` |
| «inte vill träffa» | `contact_fear_relay` |
| kombination | `loyalty_conflict` (sekundär) |

---

## 4. Sekvensdiagram

```mermaid
sequenceDiagram
  autonumber
  actor P as Förälder (UI Familjen)
  participant C as analyzeChildIncident
  participant H as barnIncidentHeuristic
  participant B as Incident-bank<br/>(frågekort + scripts)
  participant G as Gemini Flash
  participant W as children_logs WORM
  participant R as childrenLogsQueryRag<br/>(lexical)

  P->>C: rawText, childAlias, optional epistemicHint
  C->>C: Auth + App Check + rateLimit<br/>siloGuard(BARNEN)
  C->>H: scanText (deterministisk FÖRE LLM)
  H-->>C: tags[], weights, heuristicVersion
  C->>B: map tags → questionCardIds + scriptIds<br/>(bracket-filter om ålder känd)

  alt Flash tillgänglig och budget OK (max 1 anrop)
    C->>G: systemPrompt + heuristik-tags + råtext<br/>(ingen Valv/Kunskap-kontext)
    G-->>C: JSON (schema §6)
    Note over C: Validera JSON; strip diagnos-ord;<br/>behåll heuristik-tags som floor
  else Flash fail / timeout / ogiltig JSON
    C->>C: fail-closed: tags + bank-scripts endast
  end

  C->>W: create children_logs<br/>category=incident, action=incident_analys<br/>observation med [citat]/[tolkning]<br/>additive fält (PMIR §5)
  Note over W: update/delete = false (WORM)
  W-->>R: ny post ingår i lexical corpus
  C-->>P: tags, frågekort, fördjupning,<br/>barn-respons-script, wormDocId,<br/>analysisMode
```

**Invarianten:** Heuristik körs alltid. LLM får **berika** (fördjupning, script-variant), aldrig **ersätta** silo-, WORM- eller tag-beslut.

---

## 5. Additive Firestore-fält (PMIR) — samma `children_logs`

Ingen ny collection. Append-only oförändrad (`allow update, delete: if false`).

### 5.1 Befintliga fält (återanvänd)

| Fält | Värde vid incident |
|------|-------------------|
| `category` | `'incident'` (**ny kategori-värde** — UI-lista; idag fri string i rules) |
| `action` | `'incident_analys'` |
| `observation` | Epistemik-prefix + text (MUST) |
| `truth` | Valfri kort BBIC-sammanfattning (förälder-syn) — beteende, ej diagnos |
| `childAlias` | `Kasper` \| `Arvid` \| … |
| `bankId` | Primärt script-id (t.ex. `BH-SCRIPT-TRI-01`) |
| `authorRole` | `'parent'` (default) |
| `visibility` | `'parent'` (aldrig `private_child` i denna callable) |
| `sourceRef` | Valfritt: `incident:${requestId}` |
| `createdAt` | Server timestamp |

### 5.2 Föreslagna **additiva** fält (kräver PMIR)

Uppdatera **synkront** (samma PR):

1. `firestore.rules` → `isValidChildrenLogCreate` / `wormKeysOnly`  
2. `functions/src/lib/wormValidator.ts` → `WORM_SCHEMA.children_logs.allowed`  
3. Klient `assertWormPayload` / create-helpers om speglade

| Fält | Typ | Constraints | Syfte |
|------|-----|-------------|-------|
| `incidentTags` | `list<string>` | max 8; varje id `^bh-[a-z0-9-]+$` ≤ 48 | Deterministiska tag-id |
| `analysisMode` | `string` | enum: `heuristic` \| `flash` \| `fail_closed` | Spårbarhet / audit |
| `heuristicVersion` | `string` | ≤ 32 (t.ex. `2026.07.1`) | Biblioteksversion |
| `questionBankIds` | `list<string>` | max 5; id ≤ 48 | Frågekort som föreslogs |
| `scriptBankId` | `string` | ≤ 48; får spegla `bankId` | Barn-respons-script |
| `flashUsed` | `bool` | default false | Kostnads-/smoke-gate |

**Fallback utan PMIR (Fas A minimal):**  
Skriv endast allowlistade fält; lägg tag-lista som kompakt rad i `truth` prefix `[incident_meta] tags=…` — **temporärt**, teknisk skuld tills PMIR godkänner additiva nycklar.

### 5.3 Epistemik-regel vid write

För exemplet:

```
observation:
  [citat] "Mamma sa att pappa inte vill träffa mig."
  [tolkning] Kasper återgav budskap om pappas vilja att träffas efter samtal om mamma.
```

Callable MUST anropa `formatChildObservation` / splitta citat vs tolkning. Om klient skickar blandad text utan prefix → infer `tolkning` för förälder-narrativ och be UI bekräfta citat-del (HITL-light), annars fail-closed till `[tolkning]` endast.

---

## 6. Gemini response JSON-schema (Flash only)

**Modell:** `gemini-2.5-flash` (samma pin som `childrenLogsAgent`).  
**Max anrop:** 1. Inga retries mot Pro. Timeout → fail-closed.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "livskompassen.analyzeChildIncident.flash.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "deepening",
    "childResponseScript",
    "suggestedQuestionIds",
    "toneCheck",
    "epistemicSplit"
  ],
  "properties": {
    "deepening": {
      "type": "string",
      "maxLength": 600,
      "description": "BBIC-neutral fördjupning till förälder. Max 4 korta meningar. Ingen diagnos, ingen Grey Rock, ingen råd till ex."
    },
    "childResponseScript": {
      "type": "object",
      "additionalProperties": false,
      "required": ["toChild", "doNot"],
      "properties": {
        "toChild": {
          "type": "string",
          "maxLength": 400,
          "description": "Ord förälder kan säga till barnet. Trygg, konkret, en sak i taget."
        },
        "doNot": {
          "type": "string",
          "maxLength": 200,
          "description": "Vad förälder ska undvika i stunden (t.ex. gräva i mamma-citat)."
        }
      }
    },
    "suggestedQuestionIds": {
      "type": "array",
      "maxItems": 3,
      "items": { "type": "string", "maxLength": 48 },
      "description": "Endast id från given banklista — hallucinera inte nya id."
    },
    "toneCheck": {
      "type": "string",
      "enum": ["pass", "too_clinical", "too_valv", "too_long"]
    },
    "epistemicSplit": {
      "type": "object",
      "additionalProperties": false,
      "required": ["citat", "tolkning"],
      "properties": {
        "citat": { "type": "string", "maxLength": 500 },
        "tolkning": { "type": "string", "maxLength": 500 }
      }
    },
    "tagRefinement": {
      "type": "array",
      "maxItems": 4,
      "items": {
        "type": "string",
        "enum": [
          "triangulering",
          "loyalty_conflict",
          "parental_alienation_pattern",
          "contact_fear_relay",
          "blame_relay",
          "separation_anxiety_signal",
          "unclear_source"
        ]
      },
      "description": "Valfri berikning. Server union:ar med heuristik-floor — tar aldrig bort högviktiga heuristik-tags."
    }
  }
}
```

**Serverpost-process:**

1. Parse JSON; vid fail → `analysisMode=fail_closed`.  
2. Union tags: `heuristic ∪ tagRefinement` (heuristik med vikt ≥ 30 får inte droppas).  
3. `suggestedQuestionIds` ∩ bank allowlist.  
4. Strip/blocklista: `diagnos`, `narcissist`, `PA-syndrom`, `borderline`, Grey Rock, BIFF, «säg till mamma».  
5. `toneCheck != pass` → byt till bank-script.

---

## 7. Prompt-utkast — `sharedRules` (PMIR)

**Namn:** `ANALYZE_CHILD_INCIDENT_SYSTEM_PROMPT`  
**Plats:** `functions/src/sharedRules.ts` (enda runtime-promptkälla)  
**PMIR:** krävs före merge (runtime-prompt).

```text
Du är Incident-stöd i Livskompassen — Barnen-silo (Familjen).

UPPDRAG:
Hjälp föräldern svara tryggt när barnet återger svåra budskap om vårdnad/kontakt.
Du skriver ENDAST till föräldern om (a) fördjupning och (b) ord att säga till barnet.

TON:
- Neutral, BBIC-inspirerad dokumentation.
- Lågaffektiv, klinisk, svensk.
- En sak i taget. Max kognitiv belastning låg.

MUST:
- Skilj barnets ord (citat) från förälderns tolkning.
- Beskriv observerbart beteende och kommunikationsmönster.
- Föreslå endast question-id från listan i användarprompten.
- Barn-respons-script riktas till barnet: trygghet, närvaro, ingen press att välja sida.

MUST NOT:
- Diagnos på barn, förälder eller motpart.
- Grey Rock, BIFF, JADE-råd, sms/mejl-utkast till ex.
- Gaslighting-analys eller Valv-/dossier-ton.
- Juridiska slutsatser eller «samla bevis»-uppmaningar.
- Hitta på fakta, citat eller question-id.
- Cross-referera Kunskap eller Valv.

INPUT du får:
- childAlias
- rawText
- heuristicTags (redan beräknade — behandla som golv)
- allowedQuestionIds[]
- optional bracket

OUTPUT:
Returnera ENDAST giltig JSON enligt schema v1 (ingen markdown).
```

**User-prompt-mall (kod, ej sharedRules):**

```text
childAlias: Kasper
rawText: …
heuristicTags: ["triangulering","contact_fear_relay"]
allowedQuestionIds: ["BP-PLAY-LOY-03","BF-lojalitet-2",…]
bracket: early_school
```

---

## 8. Callable — kontrakt

| Nyckel | Värde |
|--------|-------|
| Namn | `analyzeChildIncident` |
| Export | `functions/src/callables/agents/` (eller `family/`) → `index.ts` |
| Silo | `Silo.BARNEN` via `createSiloGuard('analyzeChildIncident', Silo.BARNEN)` |
| Auth | `guardSensitiveCallableV2` |
| Rate-limit | **10 / uid / min** (strängare än `childrenLogsQuery` 30 — incident är dyrare kognitivt) |
| LLM | max **1×** `gemini-2.5-flash`; `flashUsed` speglas i WORM |
| Läs | Valfritt: `fetchChildrenLogsForQuery(uid, rawText, childAlias, limit=6)` — **endast** lexical, endast parent-visible |
| Skriv | 1× `children_logs` create (WORM) |
| Return | `{ wormDocId, tags, deepening, childResponseScript, questionCards, analysisMode, flashUsed }` |

**Kostnad:** 0 när fail-closed / heuristik-only. Flash = 1 anrop. Ingen vector-index. Ingen Scheduler.

---

## 9. Frågekort + fördjupning + barn-script (bank)

### 9.1 Frågekort (återanvänd Barnfokus / PLAY-bank)

Mappa tag → lins `lojalitet` / `kanslor` / `reflektion` via befintlig `barnfokusQuestionsForBracket` — **ingen ny låst array borttagen**.

Exempel (design-id; wire mot bank i Fas B):

| Tag | Frågekort (idé) |
|-----|-----------------|
| `triangulering` | «Vad kändes i magen när du hörde det?» |
| `loyalty_conflict` | «Du behöver inte välja. Vad vill *du* göra ikväll?» |
| `contact_fear_relay` | «Jag vill träffa dig. Vad skulle kännas lugnt nästa gång?» |

### 9.2 Barn-respons-script (inte BIFF)

**Exempel script `BH-SCRIPT-TRI-01`:**

> **Till Kasper:**  
> «Tack för att du berättade. Jag vill träffa dig. Det där behöver du inte reda ut — det sköter vi vuxna. Nu: ska vi … (lek / middag / lugn stund)?»

> **Undvik:** Fråga ut detaljer om mammas ord; bevisa dig för barnet; be barnet vidarebefordra svar.

### 9.3 Fördjupning (förälder, fail-closed bank)

> Barnet återger ett budskap om din vilja att träffas. Det är ett kommunikationsmönster mellan vuxna som landar hos barnet. Fokus nu: trygghet och tydlig närvaro — inte utredning av budskapet.

---

## 10. Minne & RAG

| Regel | Detalj |
|-------|--------|
| Write-path | Samma `children_logs` → lexical corpus i `searchableText()` (`observation`, `truth`, `category`, `action`, …) |
| Read-path | Endast `fetchChildrenLogsForQuery` — **ingen** `vaultRag` / `kampsparQueryRag` |
| Vector | **Deferred** (Fas C+); ingen `findNearest` i R5 |
| Cross-RAG | Förbjudet; `enforceSiloIsolation` fail-closed |
| private_child | Filtreras bort via `isParentVisibleChildLog` |
| Effekt | Fler incident-poster med taggad text ⇒ bättre lexical träffar för `childrenLogsQuery` / Mönster-Arkivarien Barnen |

Utöka `searchableText` (Fas B, liten diff): inkludera `incidentTags.join(' ')` när fältet finns — PMIR-kopplat.

---

## 11. Fail-closed-matris

| Fel | Beteende |
|-----|----------|
| Flash timeout / 5xx | `analysisMode=fail_closed`; bank-script + heuristik-tags; WORM skrivs ändå |
| Ogiltig JSON | samma |
| `toneCheck` fail | byt till bank-script |
| Rate-limit | `resource-exhausted`; ingen WORM; UI: «vänta en stund» |
| Saknad `childAlias` | `invalid-argument` |
| Diagnos-ord i modellsvär | strip + bank-fallback |

---

## 12. Avslut — återanvändning, faser, kostnad

### Återanvänd (kostnad 0)

- Lexical RAG-pipeline (`childrenLogsQueryRag`)  
- Epistemik-helpers (server + klient)  
- WORM create-path + hash-chain hook  
- Silo-guard / rate-limit / App Check  
- Pattern-engine-form från `tacticPatternLibrary` (ny `bh-*`-fil)  
- Barnfokus bracket-wire + PLAY-bank-id  
- Ton-mall från `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT`

### Fas A — max 5 leverabler (design → tunn spike, fortfarande PMIR innan prod-prompt)

1. `barnIncidentPatternLibrary` + unit-test på exemplet Kasper.  
2. Bank: 3 scripts + 3 frågekorts-kopplingar (filer under `docs/specs` / content-bank — ingen locked UX-borttagning).  
3. Callable-skelett `analyzeChildIncident` heuristik-only (`flashUsed=false`).  
4. WORM write `category=incident` med `[citat]`/`[tolkning]` (utan nya fält om PMIR ej klar).  
5. Smoke-skiss `smoke:child-incident` (offline assert tags + epistemik).

### Fas B–C

| Fas | Innehåll |
|-----|----------|
| **B** | PMIR: additiva fält + `ANALYZE_CHILD_INCIDENT_SYSTEM_PROMPT` + 1× Flash; UI-panel i Familjen (progressive disclosure) |
| **C** | Lexical `incidentTags` i RAG searchableText; Mönster-Arkivarien Barnen citerar incident-rader; vector **fortfarande deferred** |

### Kostnad

| Post | SEK |
|------|-----|
| Fas A (heuristik + bank + WORM) | **0** (ingen LLM) |
| Per prod-anrop med Flash | 1× flash (befintlig `GEMINI_API_KEY`) |
| Ny infra / Vertex / vector | **0** (ej i scope) |

---

## 13. PMIR-checklista (innan kod merge)

- [ ] Runtime-prompt i `sharedRules.ts`  
- [ ] Allowlist-fält i `firestore.rules` + `wormValidator`  
- [ ] Ny callable export + silo-guard  
- [ ] Ingen cross-RAG / ingen Valv-auto-promote  
- [ ] `smoke:cost-guard` PASS  
- [ ] `smoke:children` / ny incident-smoke PASS  
- [ ] Pontus OK på etiketten `parental_alienation_pattern` (beteende-copy i UI)

---

## 14. Enradssammanfattning

**R5** = deterministisk `bh-*`-heuristik → bank (frågor + barn-script) → valfri 1× Flash-berikning → WORM `children_logs` med epistemik → starkare lexical Barnen-RAG; fail-closed utan LLM; kostnad Fas A = 0.
