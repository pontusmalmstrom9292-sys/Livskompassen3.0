# G17 — Server/WebAuthn PIN-verifiering (P0)

**Status:** **open** — planerad; implementera endast vid `kör [GAP]`  
**Spår:** `.context/security.md` § Öppna säkerhets-GAP — P0 Valv/Barnen client-PIN  
**Relaterat:** Fyren 3s (`FloatingDock`), `PinGate`, `webauthn.ts`

---

## Problem

| Yta | Idag | Risk |
|-----|------|------|
| Verklighetsvalvet | `VaultPage.tsx` — `verifyPin` mot `VITE_VAULT_PIN` / lokal hash | PIN i klient = bypass via devtools |
| Barnen | `PinGate` — lokal PIN | Samma |
| WebAuthn | `webauthn.ts` — challenge lokalt | Ingen server-verifiering av assertion |

**Regel:** Layered Defense lager 1 — identitet får inte avgöras enbart i browser.

---

## Mål (PASS-kriterier)

1. Callable `verifyVaultGate` (eller utökad `invalidateSession`-familj) verifierar PIN **hash server-side** (Firebase Auth uid + rate limit).
2. WebAuthn: registrering + assertion verifieras mot Firestore `webauthn_credentials/{uid}` (eller Secret Manager challenge store).
3. Klient: `PinGate` / `VaultPage` anropar callable; **ingen** produktions-PIN i `import.meta.env` utom dev bypass flag.
4. Smoke: ny rad i `SMOKE_CHECKLIST.md` — fel PIN → 403, rätt PIN → unlock token/session flag (kort TTL, Zero Footprint).

---

## Föreslagen approach (REASONS)

| | |
|---|---|
| **Requirements** | Server är source of truth för vault/barnen unlock |
| **Entities** | `users/{uid}/gate_secrets` (hash only), `webauthn_credentials` |
| **Approach** | Callable + bcrypt/argon2 hash; WebAuthn `@simplewebauthn/server` i Functions |
| **Structure** | `functions/src/gate/verifyVaultGate.ts`, `functions/src/gate/webauthnVerify.ts` |
| **Operations** | Rate limit 5 försök/min per uid; logga inte PIN i Cloud Logging |
| **Norms** | Barnen-PIN skild från valv-PIN (olika hash keys) |
| **Safeguards** | Fail-closed; dev bypass endast `FUNCTIONS_EMULATOR` + explicit env |

---

## Implementation (ett steg i taget)

| Steg | Åtgärd | Rör rules? |
|------|--------|------------|
| 1 | Schema + rules för `gate_secrets` (read: owner, write: false från klient) | ja |
| 2 | `setVaultPin` callable (första gången — hash på server) | nej |
| 3 | `verifyVaultGate` callable → short-lived unlock claim i session store (RAM) | nej |
| 4 | Wire `VaultPage` + `BarnensPage` till callable | nej |
| 5 | WebAuthn server verify (Fyren) | nej |
| 6 | Ta bort `VITE_VAULT_PIN` från prod build | nej |
| 7 | Smoke + uppdatera `security.md` P0 → **done** | nej |

---

## Förbjudet

- LLM eller klient-only boolean `isVaultUnlocked` utan server-svar
- Delad PIN mellan valv och barnen
- PIN i git eller Hosting env för prod

---

## Kommando (när användaren säger `kör G17`)

```bash
cd functions && npm run build
firebase deploy --only functions:verifyVaultGate,functions:setVaultPin
# + uppdatera frontend PinGate/VaultPage
npm run build
```

**Estimat:** 1–2 byggpass (backend först, sedan frontend).
