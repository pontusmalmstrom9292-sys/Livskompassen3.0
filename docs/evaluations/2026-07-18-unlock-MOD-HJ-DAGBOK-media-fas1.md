# Unlock MOD-HJ-DAGBOK — Dagbok media Fas 1

- **Varför:** Tillåt `caption` + `attachments[]` (max 2) på journal-typer och bakåtkompat läsning; delad media-byggsten.
- **Scope:** `src/modules/features/lifeJournal/diary/diary/types/**`, koppling till shared media; `firestore.rules` journal-validering (PMIR via «Kör Fas 1»).
- **Risk:** Medel — WORM create-only kvar; legacy `attachment` måste fortfarande läsas.
- **Pontus:** approved: yes
