# Fas 13 våg 1 — security-12c

**Trigger:** Fas 13 Sprint · våg `security-12c`  
**Git:** `main` @ `685e7f413` (lokal diff, ej committad)  
**Kört:** 2026-06-15 CEST  
**GAP:** 12C — `weeklySummary` / `compass` läste `reality_vault` utan Valv-session

---

## Säkerhetsblock

| Regel | Status |
|-------|--------|
| WORM | **OK** — endast läsning; ingen write-logik ändrad |
| Tre silos | **OK** — `reality_vault` endast med giltig session |
| Zero Footprint | **OK** |
| Prompts i `sharedRules.ts` | **OK** — inga nya prompts |
| PMIR `firestore.rules` | **OK** — orörd |
| Ingen force-push | **OK** |

---

## Leverans

### Backend

- `functions/src/lib/vaultSessionGate.ts` — ny `vaultSessionGrantsVaultRead()`:
  - Ingen token → skip `reality_vault` (journal-only)
  - Token → `assertVaultSession` innan läsning
- `functions/src/callables/weeklySummary.ts` — vault-gate på `generateWeeklySummary`
- `functions/src/callables/compass.ts` — vault-gate på `generateCompassInsight`

### Frontend

- `WeeklySummaryModal.tsx` — `withVaultSessionPayload({})`
- `useCompassSummary.ts` — `withVaultSessionPayload({})`

### Smoke

- `smoke_valv_session_gate.mjs` — statisk guard för weeklySummary + compass
- `smoke_valv_security.mjs` — samma

---

## Resultat

| Kommando | Status |
|----------|--------|
| `cd functions && npm run build` | **PASS** |
| `npm run build` | **PASS** |
| `npm run smoke:valv-gate` | **PASS** |
| `npm run smoke:valv-security` | **PASS** |
| `npm run smoke:compass` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |
| Deploy `functions:generateWeeklySummary,functions:generateCompassInsight` | **PASS** |

**Prod:** https://gen-lang-client-0481875058.web.app (functions live europe-west1)

### Deploy-blocker (löst)

Första deploy misslyckades: `functions/package-lock.json` ur sync (jest devDeps). Fix: `cd functions && npm install` → retry **PASS**.

---

## Beteende efter fix

| Scenario | `reality_vault` |
|----------|-----------------|
| Anrop utan `vaultSessionToken` | **Läses inte** — journal-only summary / `vaultCount: 0` |
| Anrop med giltig Fyren-token | **Läses** efter `assertVaultSession` |
| Ogiltig/expired token | **permission-denied** |

---

## Nästa steg

**Våg 2 — `worm-medium`:** `inboxPersist.ts` + `VaultService.ts` WORM-align → `smoke:vault-worm`, `smoke:inkast`.
