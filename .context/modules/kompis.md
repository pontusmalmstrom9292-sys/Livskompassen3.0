# Kompis / Kunskap

**Route:** `/vardagen?tab=kunskap` (redirect `/kunskap`) · **AuthGate:** ja (kunskap-flik i Vardagen)

**Spec (konsoliderad):** [`docs/specs/incoming/Kunskap-SPEC.md`](../../docs/specs/incoming/Kunskap-SPEC.md)

## Syfte

Semantiskt livsminne (Life-OS): fråga/svar med källhänvisningar mot **egna** data. Avlastar kognitiv belastning. **Skild från Valv-Chat** (`reality_vault` = forensik only).

**Kampspår** = datalager (`kampspar` + `kb_docs`). **Kunskapsvalvet** = UI + RAG ovanpå.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `KunskapPage` | Flikar: Kunskapsvalv (chat) \| Tidshjulet |
| `KnowledgeVaultChat` | Fråga → `knowledgeVaultQuery` → svar + citations |
| `Tidshjulet` | Cirkulär vy + senaste poster (Firestore `kampspar`) |
| `KampsparIngestForm` | WORM create (Tidshjuls-flik) |
| `KompisAvatar` | Header (`MainLayout`); pulserar vid AI-anrop |

**Navigation:** Dock → Vardagen — ingen egen Kunskap-ikon.

## Backend

| Callable / lib | Data |
|----------------|------|
| `knowledgeVaultQuery` | `kampspar` + `kb_docs` via `kampsparQueryRag` (token-match) |
| `ingestKampsparEntry` | WORM create + `embeddingDim` |
| `notifyNewFile` → `analyzeDriveFile` | Drive → `kb_docs` (kräver `ownerId`) |

**Agenter:** Livs-Arkivarien, Mönster-Arkivarien — prompts i `functions/src/sharedRules.ts` only.

**JSON:** `{ answer, citations[{ docId, collection, date, title, excerpt }] }`

## Datamodell (WORM)

- **`kampspar`:** ownerId, title, content, category?, source, eventDate?, embeddingDim? (number), createdAt
- **`kb_docs`:** ownerId, title, content, folderId, source=drive, driveFileId, mimeType, embeddingDim?, createdAt

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Flikar, RAG, Tidshjulet, ingest, silo från valv | Drive prod, deploy smoke | ANN, klickbara citations, supervisor, prediktivt Tidshjulet |

**Inte klart:** Dagbok/Kompasser auto → `kampspar` (dagbok → Vävaren → `reality_vault` idag). Dossier → Kunskapsbank (stub).

## Kladd 2026-05-21

- **Routing:** Metodartiklar (gaslighting, BBIC-tips, coping) → Kunskap — **inte** Valv/Hamn.
- **Policy (låst):** Trauma/LVU/beroende → opt-in manuell ingest per post ([`Kladd-2026-05-21-kampspar-kandidater.md`](../../docs/specs/incoming/Kladd-2026-05-21-kampspar-kandidater.md)).
- **Gap:** Ingen auto-RAG från rå Kladd; Livs-Coachen ≠ Ekonomi.
- **Avvisat:** Synaps personregister auto; Stjärnbilder/gamification.

## Säkerhet

- Callables auth-protected server-side
- Zero Footprint: chatt i React RAM (partial audit vid Kill Switch)
- Skild från `valvChatQuery` / `reality_vault`

## Vision (bevara)

- Smart arkiv, Dumpa och glöm (e-post/Telegram → kampspar)
- Drive = kladd; Firestore WORM = destillerat minne
- Prediktiv tidslinje (Framtidsfönstret)

Kod: `src/modules/kompis/` · Plan: [`src/modules/kompis/module_plan.md`](../../src/modules/kompis/module_plan.md) · Prompter: [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md), [`ai-prompts-kladd-kampspar.md`](../../docs/specs/ai-prompts-kladd-kampspar.md)
