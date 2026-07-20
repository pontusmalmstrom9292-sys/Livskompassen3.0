# App Check enable runbook (no code flip)

**Date:** 2026-07-20 · **Wave:** B06 · **Agent scope:** documentation only — **no deploy**, **no** `firestore.rules`, **no** enforce flip in repo.

## Goal

Gradually turn on Firebase App Check on **Cloud Functions** while keeping **Valv client gate soft** until G85 Play Integrity is stable on Motorola G85.

## Preconditions

- [ ] G85 daily driver day 1–7 logged without App Check HTTP 400 on Valv (`docs/G85-DAILY-DRIVER-CHECKLIST.md`)
- [ ] `npm run smoke:predeploy:build` PASS
- [ ] Pontus writes **`OK Enforce`** before production enforce

## Pontus — Firebase Console steps

1. Open [Firebase Console](https://console.firebase.google.com) → project **gen-lang-client-0481875058**.
2. **Build → App Check** → register apps if missing:
   - **Android:** Play Integrity (release); debug provider only for dev builds with registered debug token.
   - **Web:** reCAPTCHA v3 — site key must match `VITE_APP_CHECK_RECAPTCHA_SITE_KEY` in Hosting secrets / build.
3. Enable enforcement **per product** in Console (monitor first):
   - Start with **Cloud Functions** (not Firestore rules in this runbook).
   - Keep **Firestore / Storage** enforcement off until Functions soak is clean.
4. Register G85 debug token (dev only): logcat `AppCheck` debug token → Console → Manage debug tokens.

## Functions — environment (GCP / Firebase)

Set on Cloud Functions (Firebase CLI or GCP Console → Functions → environment variables):

```bash
APP_CHECK_ENFORCE=true
```

Optional monitoring phase (before hard reject):

```bash
APP_CHECK_MODE=log   # default in appCheckEnforcement.ts — log only
# then APP_CHECK_MODE=enforce when ready
```

**Do not set** in this wave:

- `VALV_REQUIRES_APP_CHECK=true` in client code (`src/modules/core/firebase/appCheck.ts` stays **`false`**).
- Firestore rules App Check enforce.

## Client expectations (unchanged)

| Flag | Value | Meaning |
|------|-------|---------|
| `VALV_REQUIRES_APP_CHECK` | **`false`** | Valv opens without blocking on token |
| `APP_CHECK_ENFORCE` (Functions) | `true` when ready | Callables reject missing/invalid App Check |
| `VITE_APP_CHECK_RECAPTCHA_SITE_KEY` | set in prod build | Web token minting |

Reference: `functions/src/lib/callableGuards.ts` (`isAppCheckEnforcementEnabled`), `src/modules/core/firebase/appCheck.ts`.

## Rollout order (recommended)

1. Console: App Check registered for Android + Web.
2. Deploy Functions with `APP_CHECK_ENFORCE=false` — verify tokens appear in logs (`APP_CHECK_MODE=log`).
3. Pontus G85 smoke: Valv unlock, inkast callable, no 400.
4. Set `APP_CHECK_ENFORCE=true` on Functions only.
5. Soak 24–48h; watch Functions logs for `App Check verification failed`.
6. **Later wave (PMIR):** consider `VALV_REQUIRES_APP_CHECK=true` only after Play Integrity stable on G85.

## Rollback

1. Set `APP_CHECK_ENFORCE=false` (or unset) on Functions → redeploy functions.
2. If Console enforcement was enabled: App Check → Cloud Functions → **Unenforce** (or downgrade to monitoring).
3. Client: keep `VALV_REQUIRES_APP_CHECK=false` — no client rollback needed.
4. Verify: Valv + inkast callables from G85 and web; `npm run smoke:predeploy:live` if configured.

## Explicit MUST NOT (this runbook)

- Agent / CI must **not** commit `VALV_REQUIRES_APP_CHECK=true`.
- Agent / CI must **not** deploy or change `firestore.rules` App Check without Pontus `OK deploy`.
- Do not enable Storage/Firestore enforce in same step as Functions until Pontus OK.

## Verification checklist

- [ ] Callable with valid token: 200
- [ ] Callable without token (with enforce on): `failed-precondition` / permission denied
- [ ] Valv UI still opens with `VALV_REQUIRES_APP_CHECK=false`
- [ ] G85 logcat: no repeated App Check 400 on Valv session
