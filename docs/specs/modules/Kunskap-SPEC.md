# Kunskap-SPEC

Källa: konsoliderad från 5 notebook-svar (2026-05) + kodgranskning mot `src/modules/kompis/` och `functions/`.  
Konsoliderad till [`.context/modules/kompis.md`](../../../.context/modules/kompis.md).

## 1. Syfte och användarbehov

Kunskapsvalvet är användarens **semantiskt livsminne** (Life-OS): rutiner, utmaningar, dokument och mönster över tid. Modulen avlastar kognitiv belastning vid ADHD/GAD genom att låta användaren ställa frågor mot **egna data** och få korta, objektiva svar med källhänvisningar — utan JADE.

**Minne** (`kampspar`) är det underliggande minneslagret. **Kunskapsvalvet** är UI + RAG ovanpå `kampspar` och `kb_docs`.

**Strikt skild från Valv-Chat:** forensisk bevisföring läser endast `reality_vault`. Livsminne och trauma/bevis får aldrig blandas (KASAM vs juridisk integritet).

## 2. Route och ingång

| | |
|---|---|
| **Route (prod UI)** | Valv PIN → `/dagbok?tab=bevis&vaultTab=kunskapsbank` (`VaultKunskapsbankPanel`) |
| **Legacy redirect** | `/kunskap`, `/vardagen?tab=kunskap` → Valv kunskapsbank (ingen publik kunskap-flik) |
| **AuthGate** | Firebase Auth + Valv-PIN för chat/RAG |
| **Navigation** | Drawer **Valv** → Kunskapsbank; **ej** publik Vardagen-flik (2026-05-31 hub-synk) |

KompisAvatar sitter i `MainLayout` (global header) och pulserar vid AI-anrop i Kunskapsvalvet.

## 3. UX-flöde (Progressive Disclosure)

**Idag (kod):**

1. **Flikar:** `KunskapPage` — *Kunskapsvalv (chat)* | *Tidshjulet* (synlig `TabBar`, inte dolda).
2. **Chat:** `KnowledgeVaultChat` — textarea + Skicka; svar i `BentoCard` med citations-lista.
3. **Laddning:** KompisAvatar pulserar (`setKompisAura`) under `knowledgeVaultQuery`.
4. **Tidshjulet:** Live `kampspar` (G13) — ringar Dåtid/Nutid/Framtid, klick + detaljkort + Mönster-hint + `TimelineEntry`-lista.
5. **Ingest:** Formulär på **Tidshjuls-fliken** (inte diskret plus-knapp på chat-fliken).

**Målbild (planerad):**

- Renare startvy: centrerat sök/chatt-fält, mindre visuellt brus.
- Citations som **piller/ikoner**; klick öppnar original i **läsläge-modal**.
- Valfri deeplink: `?docId=...` öppnar citation direkt.
- Prediktivt Tidshjulet (Mönster-Arkivarien) — utöver historisk vy.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

| Element | Token |
|---------|--------|
| Bakgrund | `#020617` (slate-950) |
| Yta / glass | `#0f172a` + blur |
| Insikt / rubriker / citations | `#FDE68A` (guld) |
| AI / fortsätt | `#818CF8` (indigo) |
| Bekräftelse / Kompis-puls | `#2DD4BF` (emerald) |
| Typografi | Outfit + Inter |

**Förbjudet:** naturteman, regnbåge, lila (utöver indigo), röriga grafer i Tidshjulet.

## 5. Datamodell (Firestore, WORM)

Skrivskydd via Security Rules: `create` med `ownerId == auth.uid`; `update, delete: if false`.

### Collection: `kampspar`

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Krävs |
| `title` | string | |
| `content` | string | |
| `category` | string? | |
| `source` | string | t.ex. `manual`, `user_input` |
| `eventDate` | string/timestamp? | |
| `embeddingDim` | **number?** | Dimensionsantal efter embedding — **inte** full vektor i Firestore |
| `createdAt` | timestamp | server-side |

### Collection: `kb_docs`

| Fält | Typ | Notering |
|------|-----|----------|
| `ownerId` | string | Krävs |
| `title` | string | |
| `content` | string | Extraherad text |
| `folderId` | string | |
| `source` | string | default `drive` |
| `driveFileId` | string | Idempotent nyckel |
| `mimeType` | string | |
| `embeddingDim` | **number?** | Samma som ovan |
| `createdAt` | timestamp | server-side |

**Inte i scope:** LLM inbyggt minne som källa. Kritisk data = externa WORM-snapshots.

## 6. Backend och agenter

Prompts **endast** i [`functions/src/sharedRules.ts`](../../../functions/src/sharedRules.ts).

| Callable / lib | Roll |
|----------------|------|
| `knowledgeVaultQuery` | Firebase Callable (`europe-west1`); auth krävs |
| `knowledgeVaultAgent` | Gemini + Livs-Arkivarien-prompt |
| `kampsparQueryRag` | **Lib** (inte callable): token-match över `kampspar` + `kb_docs`, fallback senaste |
| `ingestKampsparEntry` | WORM create + valfri embedding → `embeddingDim` |
| `notifyNewFile` → `analyzeDriveFile` | Drive webhook → `kb_docs` när `ownerId` skickas |

**Returnformat (tvingande JSON):**

```json
{
  "answer": "string",
  "citations": [
    {
      "docId": "string",
      "collection": "kampspar|kb_docs",
      "date": "YYYY-MM-DD",
      "title": "string",
      "excerpt": "string"
    }
  ]
}
```

**RAG idag:** token-match i [`kampsparQueryRag.ts`](../../../functions/src/lib/kampsparQueryRag.ts).  
**RAG planerat:** Firestore Vector Search ANN via `VECTOR_SEARCH_INDEX_ID` (stub i `kampsparRag.ts`).

**Agenter:** Livs-Arkivarien (syntes/RAG), Mönster-Arkivarien (trendanalys — delvis via Drive-ingest A2A).

## 7. Säkerhet

| Kontroll | Status |
|----------|--------|
| AuthGate + server-side `request.auth` på callables | **done** |
| Silo: `knowledgeVaultQuery` läser **aldrig** `reality_vault` | **done** |
| WORM rules `kampspar` / `kb_docs` | **done** (rules) |
| Zero Footprint: chatt-state i React RAM | **partial** — unmount rensar; ingen explicit Kunskap-cleanup vid Kill Switch |
| Kill Switch (`useShakeToKill`) | **done** — global, navigerar `/`, rensar valv-state |
| CMEK | Drift/GCP — enligt Layered Defense |

**Inte lagrat i `localStorage`:** Kunskapsvalv-chatt (React state). Siduppdatering = blank vy.

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| `KunskapPage` (flikar chat + tidshjul) | **done** |
| `KnowledgeVaultChat` + citations (statiska kort) | **done** |
| `Tidshjulet` (historiska noder från Firestore) | **done** |
| `KampsparIngestForm` + `ingestKampsparEntry` | **done** |
| RAG pipeline (`knowledgeVaultQuery` → agent → token-match) | **done** |
| Silo från Valv-Chat (`valvChatQuery` → `reality_vault`) | **done** |
| Drive → `kb_docs` (`driveIngestSynapse`, `persistKbDoc`) | **partial** — kod klar; prod webhook + smoke |
| Callable deploy + manuell smoke | **pending** — se `docs/SMOKE_RESULTS.md`, `docs/DEPLOY.md` |
| Vector Search ANN | **planned** |
| Klickbara citations + modal | **planned** |
| Kompis Supervisor i Kunskap-UI | **planned** |
| Prediktivt Tidshjulet | **planned** |
| Dagbok/Kompasser → auto `kampspar` | **planned** — idag: dagbok → Vävaren → `reality_vault`, inte `kampspar` |
| Dossier → Kunskapsbank | **planned** — `/dossier` stub; ingen write till `kampspar`/`kb_docs` |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | `/kunskap` redirect till `/vardagen?tab=kunskap` | **done** |
| 2 | Oinloggad användare blockeras av AuthGate på fliken | **done** |
| 3 | `knowledgeVaultQuery` returnerar giltig JSON `{ answer, citations[] }` | **done** (deploy krävs för prod) |
| 4 | Svar bygger **enbart** på `kampspar` + `kb_docs` — aldrig `reality_vault` | **done** |
| 5 | WORM: update/delete blockeras i Firestore rules | **done** |
| 6 | Citations klickbara → visar original post | **planned** |
| 7 | Zero Footprint: ingen persistent klient-cache av sökresultat | **partial** |
| 8 | Drive-filer med korrekt `ownerId` skapar `kb_docs` | **partial** |

## 10. Kopplingar till andra moduler

| Modul | Relation |
|-------|----------|
| **Valv-Chat** | Helt isolerad — `valvChatQuery` / `reality_vault` only |
| **Google Drive** | Kladd-lager → async `kb_docs` (inte `reality_vault`) |
| **Dagbok** | Vävaren skriver till `reality_vault` — **ingen** auto-pipeline till `kampspar` idag |
| **De 3 Kompasserna** | Ingen auto-ingest till `kampspar` idag |
| **Dossier** | Planerad export — stub; inkluderar inte Kunskapskällor än |
| **Home / Dashboard** | Planerad: Mönster-Arkivarien kan pusha insikt (BentoCard) |

## 11. Navigation

- **Kluster:** Vardagen (`ClusterGrid` → Kunskap-flik)
- **Dock:** `/vardagen` (Sprout) — inte separat Kunskap
- **Intern:** TabBar — Kunskapsvalv | Tidshjulet
- **Valv-Chat:** Separat ingång via upplåst `/valv` (Bevis/Sök-flik)

## 12. Tidigare diskussioner att bevara (vision)

- **Smart arkiv / självsorterande AI:** **done G10** — Drive → klassificering → silo (bevis ej i `kb_docs`).
- **Framtidsfönstret / prediktiv tidslinje:** Tidshjulet varnar/förutspår cykler utifrån `eventDate`.
- **Entity Recognition (kontextmotor):** Aktörer (barn, myndigheter) i loggar.
- **Dumpa och glöm:** E-post/Telegram → `kampspar` (framtida friktion minskad).
- **Drive = kladd, Kunskap = destillerat:** Drive får vara ostrukturerat; WORM i Firestore är sanningen.
- **Externa snapshots:** Lita aldrig på modellens inbyggda minne för kritisk data.

## 13. Avvisade eller alternativa idéer

- **Google Apps Script / Kalkylark som databas** — avvisat; Firebase Cloud Functions + Firestore.
- **Gemensam sök Valv + Kunskap** — avvisat (cross-contamination, PTSD-risk).
- **Minne som egen dock-ikon** — avvisat; datalager under Kunskap/Valv.
- **Redigera/radera Minne i UI** — avvisat (WORM); ny post = ny immutable snapshot.
- **Vertex AI Search som separat produktspår i MVP** — avvaktar; preferens **Firestore Vector Search** + `VECTOR_SEARCH_INDEX_ID` tills datamängd kräver mer.
- **Auto-RAG från rå Kladd-filer** — avvisat (Kladd §E).
- **Stjärnbilder / gamification** — avvisat (Kladd §G).
- **Livs-Coachen i Ekonomi** — avvisat (Kladd routing).

## 14. Kladd-synk (2026-05-21)

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §E, §H · [`Kladd-2026-05-21-kampspar-kandidater.md`](../../archive/kladd/Kladd-2026-05-21-kampspar-kandidater.md).

| Policy | Status |
|--------|--------|
| Trauma/LVU/beroende → opt-in manuell ingest | **låst** |
| Metodartiklar (gaslighting, BBIC-tips) | manuell / Drive → `kb_docs` |
| Blaze/GCP för LLM (ej AI Studio gratis) | **låst** drift |

## 15. Öppna produktbeslut (MVP-rekommendation)

| Fråga | Rekommendation | Låst? |
|-------|----------------|-------|
| Vector Search: Firestore native vs Vertex AI Search 2.0 | **Firestore native** (samma stack, scale-to-zero) | Nej — produktägare |
| Drive → `kb_docs`: auto vs human-in-the-loop | **Auto** (Drive = kladd; WORM skyddar) | Nej |
| Tidshjulet: cirkulärt vs vertikal feed | **Behåll cirkel** tills UX-test | Nej |
| Dagbok → `kampspar`: auto vs manuellt | **Manuellt only** (opt-in jobb senare) | Nej |
| Recency-viktning i ANN | Nyare poster högre vikt — **rekommenderat** vid ANN | Nej |
| Proaktiv Mönster-Arkivarien (schemalagt jobb) | **Senare** — reaktiv RAG först | Nej |

---

**Module plan (kod):** [`src/modules/kompis/module_plan.md`](../../../src/modules/kompis/module_plan.md)  
**Prompter:** [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md), [`ai-prompts-kladd-kampspar.md`](../ai-prompts-kladd-kampspar.md)
