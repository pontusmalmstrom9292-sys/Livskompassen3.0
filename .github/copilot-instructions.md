# Livskompassen — GitHub Copilot instructions

**Roll:** Readonly analys, review och SPEC. **Cursor** är enda kodskrivare — ändra inte Sacred paths utan explicit Pontus-OK (PMIR).

## Kärn-invariants

- **WORM:** Append-only för `reality_vault`, `children_logs`, `journal`, `evolution_ledger`. Server-tidsstämpel. Beteende + datum — aldrig diagnos på motpart.
- **Tre silos:** Håll RAG strikt separerat — Kunskap (`kampspar`/`kb_docs`), Valv (`reality_vault`), Familjen (`children_logs`). Ingen cross-RAG mellan silor.
- **DCAP före LLM:** Routing i kod (`routeFromDcap`, `classifyInboxDocument`, `resolveExecutorId`) — LLM beslutar inte auth, silo eller WORM.
- **Zero Footprint:** Rensa session och synapse-state vid logout, blur och panic.
- **Locked UX:** Bevara Valv, Familjen/Barnporten, Planering-widget och övriga låsta moduler intakta.

## PMIR-stopp (vänta explicit OK)

`firestore.rules` · `storage.rules` · locked UX · runtime-prompter (`sharedRules.ts`) · mass-radering · Sacred Features.

## Verifiering före merge/deploy

Kör eller referera: `npm run smoke:predeploy` · `npm run smoke:locked-ux` · YOLO GO före prod.

## Ton och arbetssätt

Progressive disclosure — ett konkret steg i taget. Inget JADE. Verifiera mot kod/docs; osäkerhet → *"Ej tillräckligt data för bedömning."*

## 3-zonsystem

- **Hjärtat** `/hjartat` — Dagbok, Speglar; Valv via `/valvet`
- **Vardagen** `/vardagen` — MåBra, Planering, Ekonomi, Arbetsliv
- **Familjen** `/familjen` — Barnfokus, Livslogg, Barnporten, Trygg Hamn

Kanon: `.cursor/index.mdc` · `docs/specs/modules/Arkiv-GAP-REGISTER.md` · `docs/governance/GUARD-REGLERBOK.md`
