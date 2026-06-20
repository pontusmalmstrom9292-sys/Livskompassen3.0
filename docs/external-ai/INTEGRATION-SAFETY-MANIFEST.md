# Integration Safety Manifest — Multi-AI Hub

**Syfte:** Oförhandlingsbara regler när Cursor, Gemini, NotebookLM, ChatBox/Copilot Pro och MCP samarbetar.

**Senast uppdaterad:** 2026-06-20

## Grundprincip

**Cursor är enda skrivare till repo.** Extern AI = Ej verifierat tills import-gate GO + smoke PASS + YOLO GO.

## Tre silos

Kunskap (`kampspar`/`kb_docs`) · Valv (`reality_vault`) · Barnen (`children_logs`). Ingen cross-RAG. Bevis → `reality_vault` only.

## WORM

`children_logs`, `reality_vault`, `journal`, `dossier_snapshots`, `dcap_alerts`, `evolution_ledger`

## PMIR hard stops

`firestore.rules`, Barnporten kanon-UI, Sacred/Locked UX borttagning, mass-radering, App Check Enforce, tunga CF, OAuth Kalender/Gmail.

## Kommandokedja

```bash
npm run integration:sync:all
npm run integration:preflight
npm run integration:night
npm run smoke:predeploy:build
```

Kanon: `.cursor/rules/grunder-kanon.mdc`, `yolo-vakt-gate.mdc`, `anti-hallucination.mdc`
