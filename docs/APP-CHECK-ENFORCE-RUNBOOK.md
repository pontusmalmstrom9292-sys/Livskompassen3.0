# App Check Enforce — Runbook (Pontus manuellt)

1. Staging: `npm run build` + hosting deploy → verifiera ingen 400 på exchangeRecaptchaV3Token
2. Console → App Check → Web reCAPTCHA v3 = samma key som CI
3. Android: Play Integrity för `com.livskompassen.app` — se `docs/PLAY-INTEGRITY-ANDROID.md`
4. Sätt `APP_CHECK_ENFORCE=true` i functions runtime
5. Console → Cloud Functions → Enforce
6. Smoke: `npm run smoke:valv-gate`, `smoke:valv-security`, `smoke:auth-login`

## Fas 22 staging-checklist (våg 22.10)

- [ ] `npm run build` + hosting deploy till staging
- [ ] `npm run smoke:valv-security` PASS
- [ ] `npm run smoke:auth-login` PASS
- [ ] `npm run smoke:cache` PASS
- [ ] Android: `npm run smoke:android-platform` PASS
- [ ] Pontus: Console Enforce **endast** efter ovan — se fas20-manual-pontus-gates.md
