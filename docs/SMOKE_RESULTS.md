# Smoke-resultat (Fas 3 + Kampspår)

**Datum:** 2026-05-21  
**Branch:** `cleanup-phase-1`

## Automatiserade kontroller

| Kontroll | Resultat |
|----------|----------|
| `npm run build` (frontend) | **PASS** |
| `cd functions && npm run build` | **PASS** |
| Firestore rules inkl. `kampspar` | **PASS** (lokal fil) |
| Firestore indexes `kampspar`, `kb_docs` | **PASS** (lokal fil) |

## Manuella tester (kräver deploy + inloggning)

Kör mot lokal `npm run dev` eller [Hosting](https://gen-lang-client-0481875058.web.app) efter deploy av nya functions.

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | Auth | uid i Firebase Auth | **Ej körd** — manuell |
| 2 | Dagbok spara | `journal` post | **Ej körd** |
| 3 | Valv | `reality_vault` post | **Ej körd** |
| 4 | Barnen | `children_logs` | **Ej körd** |
| 5 | Kompasser | `checkins` | **Ej körd** |
| 6 | Hamn BIFF | Grey Rock-svar | **Ej körd** |
| 7 | Kunskap RAG | Svar + citations från `kampspar`/`kb_docs` | **Ej körd** — kräver `ingestKampsparEntry` + `knowledgeVaultQuery` deploy |
| 8 | Kampspår ingest | Tidshjulet visar nod + lista | **Ej körd** |
| 9 | Hamn → bevis | Original sparas i `reality_vault` | **Ej körd** |
| 10 | Speglar → Hamn | Länk med förifylld text | **Ej körd** |
| 11 | Dossier route | `/dossier` visar stub | **Ej körd** |
| 12 | KompisAvatar | Header visar avatar vid Kunskap-laddning | **Ej körd** |

## Deploy-krav för nya features

```bash
firebase deploy --only firestore:rules,firestore:indexes,functions:ingestKampsparEntry,functions:knowledgeVaultQuery
```

Se [`DEPLOY.md`](./DEPLOY.md).

## Module plan sync (denna session)

- [`src/modules/valv_chatt/module_plan.md`](../src/modules/valv_chatt/module_plan.md) — uppdaterad till implementerad panel
- [`src/modules/kompis/module_plan.md`](../src/modules/kompis/module_plan.md) — Tidshjulet + RAG + ingest
- [`src/modules/dossier/module_plan.md`](../src/modules/dossier/module_plan.md) — route `/dossier` stub
