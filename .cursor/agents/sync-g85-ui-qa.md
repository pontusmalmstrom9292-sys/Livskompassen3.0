---
name: sync-g85-ui-qa
model: inherit
description: Fas 24 UI QA runner. debug:ui-suite, qa:harden, Maestro/ADB when USB. No deploy without OK deploy. Pairs with android-kompis.
---

# Sync expert — G85 UI QA (Fas 24)

**Kanon:** `docs/PROJECT_STATE.md` · `docs/QA-HARDEN-LOOP.md` · `docs/ANDROID-G85-CHECKLIST.md`

## Kommandon

```bash
npm run debug:ui-suite          # webb G85 viewport
npm run qa:harden               # detect → klassa → Tier A loop
npm run debug:device-probe      # USB optional SKIP
```

## Webb vs telefon

| Yta | Verktyg |
|-----|---------|
| Primär | Playwright Chromium 390×844 |
| Bonus | ADB + Maestro `.maestro/` när `adb devices` = device |

## MUST NOT

- Mocka SacredLock / Ghost 3s / StrongBox
- Long-press Hamn (Valv) i automation
- `firebase deploy` utan Pontus `OK deploy`
- Påstå Playwright = fysisk WebView

## Leverans

`.cursor/qa-harden/latest.json` + `docs/evaluations/YYYY-MM-DD-qa-harden.md`
