# Drogfrihet — Hub-spec

**Datum:** 2026-05-27 · **Status:** P0 hub (client-bank + statisk kunskap)

## Syfte

Stödja ett nyktert och drogfritt liv med **kognitiv avlastning**: ett mikrosteg i taget, reflektion utan skam, och tydliga resurser. Hubben är **inte** beroendevård, diagnos eller krisbehandling.

## Route & navigation

| | |
|---|---|
| URL | `/drogfrihet` |
| Meny | Drawer → **Vardag** (efter MåBra) |
| Tema | `J-mabra-lavendel` (återanvänt) |
| Auth | `AuthGate` |

## Sektioner

| Flik | Innehåll |
|------|----------|
| **Idag** | Dagräknare (skrivskyddad) + ett reflektionskort per dag (`pickDrogfrihetIdag`) |
| **Stöd** | 113, 1177, beroendevård-länkar (statisk text) |
| **Reflektion** | Pool `DF-REF-01`–`10`, ett kort i taget |
| **Kunskap** | Statisk FACT-lista från seed — **ingen** `knowledgeVaultQuery` i hubben |

## U6

| Klass | Var | Kurator |
|-------|-----|---------|
| REFLECTION | Mabra-bank `DF-REF-*` | `specialist-mabra-curator` |
| FACT | Kunskap-seed `kunskap-fact-df-*` | `specialist-kunskap-seed` |

**MUST NOT:** fjärde RAG-silo · streak/XP i Mabra-bank · FACT i Mabra-bank · ex/konflikt-coaching här.

**Dagräknare:** lokal `localStorage` per konto · visas i hubben · **nollställ endast** `Inställningar → Drogfrihet` (tvåstegs bekräftelse).

## Kod

| Fil | Roll |
|-----|------|
| `src/modules/drogfrihet/components/DrogfrihetHubPage.tsx` | UI |
| `src/modules/drogfrihet/content/drogfrihetCatalog.ts` | KEEP-pool |
| `src/modules/drogfrihet/lib/pickDrogfrihetIdag.ts` | Daglig rotation |
| `src/modules/drogfrihet/constants/kunskapFacts.ts` | Statisk FACT |
| `src/modules/drogfrihet/constants/resources.ts` | Resurser |
| `src/modules/drogfrihet/lib/drogfrihetCounter.ts` | Dagräknare |
| `src/modules/core/pages/InstallningarPage.tsx` | Flik Drogfrihet (nollställ) |

## GAP (medvetet)

| GAP | Beskrivning |
|-----|-------------|
| Coach | Ingen dedikerad `drogfrihetCoach` i `sharedRules.ts` — P1 |
| Firestore | Ingen `vit_entries` för Drogfrihet — client-bank räcker P0 |
| Ingest | `kunskap-fact-df-*` ej exporterade till `kampspar` än |

## Smoke

`npm run smoke:innehall` · `npm run smoke:locked-ux` · `npm run build`
