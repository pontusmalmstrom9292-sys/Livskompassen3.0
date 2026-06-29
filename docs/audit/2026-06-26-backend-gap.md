# Backend GAP — 2026-06-26

## Live synapser (5)

drive_file_ingested, journal_woven, dcap_alert, user_overwhelm, widget_recording_ingested

## Stub / obsolete

- `kasam_aggregation` — stub, ingen caller (P2)
- `firestoreBackupJob.ts` — ej exporterad (P2)
- `kampsparRag.ts` — felaktig "Vector Search stub" kommentar (P2 fix)

## Smoke

`npm run smoke:synapse-triggers && npm run smoke:manifest && npm run smoke:dcap-routing`

## Beslut 2026-06-26 (P2)

**kasam_aggregation:** Behåll som defer-stub. Ingen caller — dokumenterad i synapseBus. Implementera inte utan PMIR.

**firestoreBackupJob:** Ej exporterad — defer tills DR PMIR godkänd.
