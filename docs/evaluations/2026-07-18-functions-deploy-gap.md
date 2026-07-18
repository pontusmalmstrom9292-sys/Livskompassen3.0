# Functions deploy gap — source vs live

Date: 2026-07-18
Status: inventory (no deploy)

Run when authenticated:

```bash
firebase functions:list --project gen-lang-client-0481875058
```

Compare against `functions/src/index.ts` exports. Redeploy missing callables only with Pontus OK.

Known newer candidates (verify live): kasam*, backup*, pipeline*, kompassrad*, biometric challenge*, weaveJournalEntry after U1 fix.
