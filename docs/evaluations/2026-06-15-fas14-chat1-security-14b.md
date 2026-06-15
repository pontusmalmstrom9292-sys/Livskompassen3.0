# Fas 14B — Chat 1 Security Auditor — 2026-06-15

**Status:** PASS (agent) — App Check Console + MåBra deploy väntar Pontus OK

---

## 14B.1 App Check enforce

| Del | Status | Notering |
|-----|--------|----------|
| Klient web | **Kod klar** | `src/modules/core/firebase/appCheck.ts` + `main.tsx` |
| Klient Android | **Kod klar** | `@capacitor-firebase/app-check` CustomProvider |
| Functions fail-open | **Kod klar** | `APP_CHECK_ENFORCE` i `functions/.env.*` |
| Console enforce | **USER** | Se [`docs/DEPLOY.md`](../DEPLOY.md) § App Check — reCAPTCHA v3 site key → `.env` → rebuild hosting |

**Smoke:** `smoke:valv-security` **PASS** · `smoke:auth-login` (kör vid auth-ändring)

**Deploy efter Console:** Named callables enligt DEPLOY.md — **fråga Pontus före** `APP_CHECK_ENFORCE=true`.

---

## 14B.2 typecheck:core-strict

| Resultat |
|----------|
| `npm run typecheck:core-strict` **PASS** — 0 fel |

Utökad include: `src/modules/shared/ui/HubErrorBoundary.tsx` (se Chat 5).

---

## 14B.3 Plausible deniability audit

| Kontroll | Resultat |
|----------|----------|
| Valv-session gate på bevis-routing | **PASS** — `smoke:plausible-deniability` |
| Separata silos i UI | **PASS** — inga valv-ord i publikt läge utan session |
| Firestore läs utan vault-session | Rules: `reality_vault` kräver `isOwnerVault()` — **OK** |

**GAP:** Ingen kodändring krävd.

---

## 14B.4 Legacy `vault` collection audit

**Fil:** `firestore.rules` rad 309–313

```
// Legacy alias — prod skriver till reality_vault. Läs kvar för ev. migrerade rader; inga nya poster (MT-2).
match /vault/{docId} {
  allow read: if isOwnerVault();
  allow create, update, delete: if false;
}
```

| Bedömning | Åtgärd |
|-----------|--------|
| Read-only WORM-aligned | **Behåll** tills prod-data audit bekräftar 0 rader i `vault` |
| Radera rules-block | **DEFER** — kräver PMIR + prod Firestore Console-koll |

**Smoke:** `smoke:vault-worm` **PASS**

---

## 14B.5 MåBra 3.0 deploy prep

**Kanon:** [`2026-06-14-mabra-3.0-implementation.md`](./2026-06-14-mabra-3.0-implementation.md)

| Artefakt | Status |
|----------|--------|
| `MabraGoalPanel`, `VitCurriculumPanel`, Recovery modules | **I repo** |
| Rules R1/R2/R3/R5 | **I repo** — PMIR-stopp |
| `functions:mabraCoach` | **Bygg klar** — deploy väntar OK |

**Smoke:** `smoke:mabra` STATIC PASS (App Check-nycklar i `.env` vid enforce)

**Deploy (efter explicit OK):**

```bash
firebase deploy --only firestore:rules
firebase deploy --only functions:mabraCoach
firebase deploy --only hosting
```

---

## Blocker

| Blocker | Ägare |
|---------|-------|
| App Check Console + prod `.env` | Pontus |
| MåBra 3.0 rules deploy | Pontus PMIR OK |
