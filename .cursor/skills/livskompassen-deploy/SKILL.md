> **Register:** `docs/prompts/PROMPTER-SKILLS-FUNKTIONER-REGISTER.md`

# Livskompassen Deploy Skill

Use when zone-builders or verifier report PASS and prod deploy is needed. **Deploy is a skill, not a subagent.**

Kanon: [`.cursor/rules/deploy-paminnelser.mdc`](../rules/deploy-paminnelser.mdc) · [`docs/DEPLOY.md`](../../docs/DEPLOY.md)

## When to use

- After backend/callable changes → functions build + targeted `firebase deploy --only functions:<name>`
- After frontend/UI changes → `npm run build` + `firebase deploy --only hosting`
- After rules → `firestore:rules` or `storage` only
- After web change for Android → `npm run build:web && npx cap sync android`

## Project root

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase use gen-lang-client-0481875058
```

## MUST

- Ask Pontus: *"Ska jag köra deploy nu?"* unless already approved
- Run relevant smoke after deploy (see `docs/SMOKE_CHECKLIST.md`)
- Hard refresh web (Cmd+Shift+R) or reinstall APK on auth issues

## MUST NOT

- Full `firebase deploy --only functions` without noting `notifyNewFile` secret
- Commit `.env` or service-account JSON
- Deploy without build when code changed

## Zone → typical deploy

| Zone | Often needs |
|------|-------------|
| Z1 Valv | hosting + valv callables |
| Z3+6 Inkast | functions (ingest/DCAP) + hosting |
| Z4 Vardagen | hosting |
| Z5+2 Familjen | hosting + optional children callables |

After deploy, delegate `/specialist-verifier` on the zone smoke set.
