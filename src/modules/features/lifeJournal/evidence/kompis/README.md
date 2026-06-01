# kompis

> Kompis / Kunskap — semantiskt livsminne (RAG) och Tidshjulet. Skild från Valv-Chat.

## Syfte

Fråga/svar med källhänvisningar mot egna data (`kampspar` + `kb_docs`). Avlastar kognitiv belastning. **Inte** forensik — det är Valv-Chat.

## Route och ingång

| | |
|---|---|
| **Route** | Valv → Kunskapsbank: `/dagbok?tab=bevis&vaultTab=kunskapsbank` (redirect `/kunskap`) |
| **AuthGate** | ja (PIN i Valv) |
| **Dock** | Vardagen (Sprout) — ingen egen Kunskap-ikon i publikt läge |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/KunskapPage.tsx` | Flikar: Kunskapsvalv \| Tidshjulet |
| `components/KnowledgeVaultChat.tsx` | Chat + citations |
| `components/Tidshjulet.tsx` | Cirkulär vy + senaste poster |
| `components/KampsparIngestForm.tsx` | WORM create till Minne |
| `components/KompisAvatar.tsx` | Header-avatar |
| `api/knowledgeVaultService.ts` | `knowledgeVaultQuery` |
| `api/kampsparService.ts` | `ingestKampsparEntry` |

## Data

| Collection | Innehåll |
|------------|----------|
| `kampspar` | Livshändelser, WORM |
| `kb_docs` | Drive → destillerade dokument |

**Callable:** `knowledgeVaultQuery`, `ingestKampsparEntry`

## Beror på

- `core` — layout, auth, UI
- `functions/` — agenter (Livs-Arkivarien, Mönster-Arkivarien) i `sharedRules.ts`

## Kopplingar

- **Verklighetsvalvet** — skild data (`reality_vault`)
- **Valv-Chat** — skild callable
- **Dossier** — aggregerar valda källor till PDF

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `kampspar`, `kb_docs` — WORM |
| **RAG / chatt** | Ja — `knowledgeVaultQuery`, Livs-Arkivarien |
| **PDF / samlad export** | Dossier kan inkludera Kunskap (planerat) |
| **Planerat** | Vector Search ANN (index i GCP, endpoint saknas) |

Se [arkiv-minne.md](../../../.context/arkiv-minne.md).

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/evidence/kompis.md)
- [Kunskap-SPEC](../../../docs/specs/modules/Kunskap-SPEC.md)
- [ai-prompts-moduler-master](../../../docs/specs/ai-prompts-moduler-master.md)
