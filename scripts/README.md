# Scripts — Livskompassen v2

**Senast:** 2026-05-22 (byggpass audit)

## Drive (Firebase auto + Google engång)

| Script | Kommando | Syfte |
|--------|----------|-------|
| Wire-up | `npm run drive:wireup` | Deploy `notifyNewFile`, smoke webhook, skriv Script Properties till terminal |
| Smoke webhook | `npm run smoke:drive` | 401 utan secret + auth med secret |

Kopiera `.drive-setup.json.example` → `.drive-setup.json` (gitignored) med Drive folder IDs.

## Smoke (kräver ADC + deployad backend)

| Script | Kommando | Modul / GAP |
|--------|----------|-------------|
| Kunskap RAG | `npm run smoke:kunskap` | kompis, G2/G3 |
| Valv-Chat | `npm run smoke:valv` | valv_chatt, G1 |
| Dossier | `npm run smoke:dossier` | dossier |
| Barnen RAG | `npm run smoke:children` | barnens_livsloggar, G8 |
| Inkorg | `npm run smoke:inbox` | kompis, G10 |
| Gräns-Arkitekten | `npm run smoke:grans` | safe_harbor, G14 |
| Entity profiles | `npm run smoke:entities` | G9 |
| Context cache | `npm run smoke:cache` | G12 |
| Tidshjul | `npm run smoke:tidshjul` | G13 |
| Speglar | `npm run smoke:speglar` | speglings_system |
| Kompasser | `npm run smoke:compass` | kompasser |
| Måbra | `npm run smoke:mabra` | mabra |

Kör från repo-rot. Resultat loggas i [`docs/SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md).

## Ekonomi / stämpel (Firestore)

| Script | Kommando | Syfte |
|--------|----------|-------|
| Import Kalkylark | `node scripts/import-pontus-sheet.mjs --stamp-csv <fil> --dry-run` | Engångsimport `time_entries` från CSV |
| Import ledger | `node scripts/import-pontus-sheet.mjs --ledger-csv <fil>` | Engångsimport `economy_ledger` |
| Smoke stämpel | `npm run smoke:ekonomi` | `time_entries` in/ut + cleanup |
| Enhetstester | `npm test` | `payTimeRules`, `taxTable32`, `payAbsenceRules`, `generatePayslipCore` |
| Smoke lönespec | `npm run smoke:payslip` | Callable `generatePayslip` + `payslip_snapshots` |
| Sync till Functions | `node scripts/sync-payroll-to-functions.mjs` | Körs automatiskt vid `cd functions && npm run build` |

Manuell smoke: [`docs/SMOKE_EKONOMI_TID.md`](../docs/SMOKE_EKONOMI_TID.md).

## Natt-CI (byggpass + SDK)

| Script | Kommando | Syfte |
|--------|----------|-------|
| Byggpass | `npm run natt-ci` | build + eslint + smoke:valv/kunskap/dossier |
| Agent review | `npm run natt-ci:agent` | byggpass + `@cursor/sdk` (kräver `CURSOR_API_KEY`) |

Första gång: `cd scripts/natt-ci && npm install`. Se [`docs/NATT-CI.md`](../docs/NATT-CI.md).

## Hosting (telefon / PWA)

| Script | Kommando |
|--------|----------|
| Prod deploy | `npm run deploy:hosting` |
| Preview channel | `npm run deploy:hosting:preview` |

Guide: [`docs/TELEFON-HOSTING.md`](../docs/TELEFON-HOSTING.md).

## Byggpass-kedja (manuell, samma som natt-ci)

```bash
npm run natt-ci
```

Utökad kedja:

```bash
npm run smoke:children && npm run smoke:inbox && npm run smoke:grans
```

## GCP / infra

| Script | Syfte |
|--------|-------|
| `setup_gcp_cmek.sh` | CMEK (Lager 3) |
| `setup_vector_search.sh` | Vector index G2/G3 |
| `gcp_inventory.sh` | Inventering → docs |

## Övrigt

| Mapp | Innehåll |
|------|----------|
| `google-apps-script/` | Drive → `notifyNewFile` (`sorter.gs`) |
| `ai/` | Python ADK-experiment |
| `gdpr_cleanup.ts` | Retention-verktyg |
