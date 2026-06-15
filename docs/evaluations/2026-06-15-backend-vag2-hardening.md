# Backend Våg 2 — säkerhets-härdning — 2026-06-15

**Fortsätter:** [`2026-06-15-backend-djupanalys.md`](./2026-06-15-backend-djupanalys.md) · Våg 1 klar samma dag  
**Status:** Kod klar — **ej deploy** utan explicit Pontus OK

---

## Utfört (kod)

| # | Åtgärd | Filer |
|---|--------|-------|
| 1 | `guardSensitiveCallableV2` på 5 callables | `agents.ts`, `projectMedia.ts` |
| 2 | `user_overwhelm` emitter | `breakDownResponse` → `emitSynapse(..., user_overwhelm)` |
| 3 | GCP-inventory refresh | `docs/GCP-INVENTORY-LATEST.md` (live `firebase functions:list` 2026-06-15) |
| 4 | App Check smoke + deploy-lista | `smoke_valv_security.mjs`, denna eval |

**Medvetet utan full guard:** `invalidateSession` (logout / Zero Footprint — auth-only, låg LLM-kostnad).

### Callable guards (nya)

| Callable | Rate/min | Fil |
|----------|----------|-----|
| `getAgentRegistry` | 30 | `agents.ts` |
| `createBarnportenPairing` | 10 | `agents.ts` |
| `claimBarnportenPairing` | 10 | `agents.ts` |
| `generatePayslip` | 5 | `agents.ts` |
| `analyzeProjectImage` | 10 | `projectMedia.ts` |

### user_overwhelm

`breakDownResponse` emitterar nu `user_overwhelm` → `paralysBrytarenSynapse` via `synapseBus.ts` (ersätter direkt `applyParalysBreak`-anrop).

---

## App Check enforce

| Lager | Status |
|-------|--------|
| Klient `initAppCheck()` | **done** (`main.tsx`, `appCheck.ts`) |
| `guardSensitiveCallableV2` fail-closed | **done** när `APP_CHECK_ENFORCE=true` |
| Functions env `APP_CHECK_ENFORCE=true` | **USER** — `functions/.env.gen-lang-client-0481875058` (gitignored; se Fas 14B) |
| Firebase Console → Cloud Functions **Enforce** | **USER** (~2 min) |

Utan Console Enforce: Functions-kod är fail-closed vid env=true, men Firebase-nivå saknar dubbellager tills Console togglas.

**Manuell prod-smoke efter Console Enforce:** login → MåBra / Kunskap / Valv / Barnporten QR — inga `failed-precondition` App Check.

---

## Deploy (när godkänt)

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions:getAgentRegistry,functions:createBarnportenPairing,functions:claimBarnportenPairing,functions:generatePayslip,functions:analyzeProjectImage,functions:breakDownResponse
```

Om Våg 1 ej deployad än — kombinera med [`2026-06-15-backend-djupanalys.md`](./2026-06-15-backend-djupanalys.md) deploy-rad (rules + `generateWeeklyInsights`).

---

## Smoke (agent)

```bash
cd functions && npm run build
cd .. && npm run build
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:valv-security
```

---

## Skjutet till Våg 3+

- JWT 15 min vs server session 1 h — synk (PMIR)
- `WeeklySummary.tsx` — `withVaultSessionPayload` för `generateWeeklyInsights`
- CMEK runtime-verifiering
- Native biometric hardening vs WebAuthn
