# Fas 21 — Leverans

**Datum:** 2026-06-18 · **Status:** DONE (implementation)

## Levererat

- 7 zon-memos + masterplan v2 + FAS21-SPRINT-AUTORUN + fas21_autorun_init
- **21.1** Arkiv-batch 4a+4b
- **21.2** M3.0-C PMIR doc
- **21.3** M3.0-C UI (explore anon, reflection cards)
- **21.4** MåBra v27 bank-wire + mabraCoach bank
- **21.5** CUR-MYNDIGHET-01 curriculum våg 30
- **21.6** sub-lazy Valv/Familjen
- **21.7** Hemkompass redan wire (Forge+Paralys) — verifierad
- **21.8** Inkast Hem→Hjärtat genväg + toast
- **21.9** Hamn brusfilter PMIR + polish defer wizard impl
- **21.10** JWT refresh + App Check runbook
- **21.11** Play Integrity runbook + android doc

## Defer

Se masterplan defer-tabell · FP-TI utanför Fas 21

## Smoke (2026-06-18)

- Tier 0: `smoke:manifest`, `smoke:tier1` — PASS
- Tier 1: `build`, `functions build`, `smoke:locked-ux`, `smoke:orkester` — PASS
- Våg-extra: inkast, inkast-vardag, valv-security, mabra, content-waves, hamn, android-platform, compass — PASS
- Tier 3: `orkester:night` — PASS (ESLint + cursor-rollout SKIP_FAIL — känt)

## Deploy (2026-06-18 — DONE)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions && npm run build
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0 && npm run build
firebase deploy --only functions:invalidateSession,functions:mabraCoach,hosting
```

- URL: https://gen-lang-client-0481875058.web.app
- Functions: invalidateSession, mabraCoach
