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
| `node scripts/smoke_kunskap.mjs` | **PASS** (2026-05-21) |
| `node scripts/smoke_speglar.mjs` | **PASS** (2026-05-21) |
| `npm run smoke:dossier` | **PASS** (2026-05-21) |

## Kunskap smoke (automatiserat)

Kör: `npm run smoke:kunskap` (kräver `.env` med `VITE_FIREBASE_*`, Anonymous Auth, deployade callables).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `ingestKampsparEntry` | **PASS** | WORM create + docId |
| `knowledgeVaultQuery` | **PASS** | Svar + citations från `kampspar` |
| Citation pekar på ingest-doc | **PASS** | Token-match RAG |
| Full Gemini/Vertex LLM | **PASS** | `GEMINI_API_KEY` + `gemini-2.5-flash` via `defineSecret` (2026-05-21) |
| `embeddingDim` vid ingest | **null** | Embedding API (textembedding-gecko) svarar inte i prod — icke-blockerande |

**Full AI-syntes:** `firebase functions:secrets:set GEMINI_API_KEY` + `secrets: [geminiApiKey]` på `knowledgeVaultQuery` (se `functions/src/lib/geminiSecret.ts`).

## Speglar smoke (automatiserat)

Kör: `npm run smoke:speglar` (kräver `.env`, Anonymous Auth, deployad `speglingsMirror`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `speglingsMirror` | **PASS** | Svar med `mirror` (string) |
| Full Gemini/Vertex LLM | **OK** | `gemini-2.5-flash` + `GEMINI_API_KEY` (secret på callable) |

```bash
firebase deploy --only functions:speglingsMirror --force
npm run smoke:speglar
```

## Dossier smoke (automatiserat)

Kör: `npm run smoke:dossier` (kräver `.env`, Anonymous Auth, deployad `generateDossier`, Firestore rules `dossier_snapshots`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `reality_vault` seed (smoke) | **PASS** | WORM create före export |
| `generateDossier` | **PASS** | `dossierId` + SHA-256 `documentHash` |
| `dossier_snapshots` read | **PASS** | `includedDocIds` + hash matchar |
| PDF bytes (`%PDF`) | **PASS** | via `pdfBase64` fallback |
| Signed URL (Storage) | **fallback** | IAM `signBlob` saknas — klient får `pdfBase64` |

```bash
firebase deploy --only firestore:rules,storage,functions:generateDossier
npm run smoke:dossier
```

**UI (manuell):** Hjärtat → Bevis → PIN → flik **Dossier** → wizard → *Generera låst dossier* → *Ladda ner PDF*.

**Valfri GCP-fix för signed URL:** ge Functions service account `roles/iam.serviceAccountTokenCreator` (self) så `getSignedUrl` fungerar utan base64.

## Manuella tester (övriga moduler)

Kör mot lokal `npm run dev` eller [Hosting](https://gen-lang-client-0481875058.web.app).

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | Auth | uid i Firebase Auth | **Ej körd** — manuell |
| 2 | Dagbok spara | `journal` post | **Ej körd** |
| 3 | Valv | `reality_vault` post | **Ej körd** |
| 4 | Barnen | `children_logs` | **Ej körd** |
| 5 | Kompasser | `checkins` | **Ej körd** |
| 6 | Hamn BIFF | Grey Rock-svar | **Ej körd** |
| 7 | Kunskap RAG (UI) | Svar + citations i chat | **Ej körd** — callables OK via script |
| 8 | Kampspår ingest (UI) | Tidshjulet visar nod | **Ej körd** — callable OK via script |
| 9 | Hamn → bevis | Original sparas i `reality_vault` | **Ej körd** |
| 10 | Speglar → Hamn | Länk med förifylld text | **Ej körd** — `speglingsMirror` OK via script |
| 11 | Dossier (UI) | Valv → flik Dossier → PDF + hash | **Ej körd** — E2E OK via `smoke:dossier` |
| 12 | KompisAvatar | Header pulserar vid Kunskap-fråga | **Ej körd** |

## Deploy-krav för Kunskap

```bash
firebase deploy --only firestore:rules,firestore:indexes,functions:ingestKampsparEntry,functions:knowledgeVaultQuery
npm run smoke:kunskap
```

Se [`DEPLOY.md`](./DEPLOY.md).

## Kodfixar under smoke (2026-05-21)

- `functions/src/lib/generateDossierInternal.ts` — `pdfBase64` fallback när signed URL (`signBlob`) nekas
- `src/modules/dossier/components/DossierPage.tsx` — nedladdning via URL eller data-URI
- `scripts/smoke_dossier.mjs` — automatiserad E2E (vault seed + snapshot + PDF)

- `functions/src/lib/genaiClient.ts` — `vertexai: true` för @google/genai
- `functions/src/agents/knowledgeVaultAgent.ts` — VertexAI SDK + degraded RAG-fallback vid LLM-fel
- `functions/src/agents/vertexAgent.ts` — `gemini-2.5-flash` + `GEMINI_API_KEY` via secret; degraded ACT-fallback vid LLM-fel
- `functions/src/index.ts` — `speglingsMirror` `.runWith({ secrets: ['GEMINI_API_KEY'] })`

## Module plan sync

- [`src/modules/kompis/module_plan.md`](../src/modules/kompis/module_plan.md)
- [`docs/specs/incoming/Kunskap-SPEC.md`](./specs/incoming/Kunskap-SPEC.md)
