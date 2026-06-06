# Kompis / Kunskap

**Kanonisk kod:** `src/modules/features/lifeJournal/evidence/kompis/`  
**Route:** `/valvet?vaultTab=kunskapsbank` (PIN) · **Legacy:** `/kunskap` → redirect · **AuthGate:** ja  
**Spec (konsoliderad):** [`docs/specs/modules/Kunskap-SPEC.md`](../../docs/specs/modules/Kunskap-SPEC.md)

## Syfte

Semantiskt livsminne (Life-OS): fråga/svar med källhänvisningar mot **egna** data. Avlastar kognitiv belastning. **Skild från Valv-Chat** (`reality_vault` = forensik only).

**Minne** = datalager (`kampspar` + `kb_docs`). **Kunskapsvalvet** = UI + RAG ovanpå.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `VaultKunskapsbankPanel` | Kunskapsvalv + Tidshjulet (bakom Valv PIN) |
| `KnowledgeVaultChat` | Fråga → `knowledgeVaultQuery` → svar + citations |
| `Tidshjulet` | Cirkulär vy + senaste poster (Firestore `kampspar`) |
| `KampsparIngestForm` | WORM create (Tidshjuls-flik) |
| `KompisAvatar` | Header (`MainLayout`); pulserar vid AI-anrop |

**Navigation:** Valv drawer → Kunskapsbank (PIN) — ingen publik Kunskap-flik i Vardagen.

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

## Säkerhet

- Callables auth-protected server-side
- Zero Footprint: chatt i React RAM
- Skild från `valvChatQuery` / `reality_vault`

Kod: `src/modules/features/lifeJournal/evidence/kompis/` · Plan: [`src/modules/features/lifeJournal/evidence/kompis/module_plan.md`](../../src/modules/features/lifeJournal/evidence/kompis/module_plan.md)
