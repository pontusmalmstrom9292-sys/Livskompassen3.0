# Hub runtime sweep — 2026-07-23 (session 4bae45)

**Platform:** Cursor · Composer · debug mode  
**Mode:** Analys (ingen produktfix utan G85-bevis)

## Gates

| Gate | Result |
|------|--------|
| smoke:tier1 (utan module-lock) | PASS |
| smoke:module-lock | FAIL — debug-instrumentering i MOD-CORE-CHROME |
| Playwright e2e locked-ux + tokens | 9 passed, 1 flaky |
| Hub sweep preview :4173 | 18/18 OK |
| Android G85 | ingen enhet |

## Hypoteser (web)

- A/B scroll: REJECTED (web OK)
- F AuthErrorBoundary: REJECTED (0 catches)
- G AppUnlockGate: REJECTED (needsUnlock false)
- H hub crash: REJECTED (18/18)
- D/E Android dock: INCONCLUSIVE (kräver G85)

## Nästa

Pontus bekräftar Mac-web räcker, eller USB G85 för native.
