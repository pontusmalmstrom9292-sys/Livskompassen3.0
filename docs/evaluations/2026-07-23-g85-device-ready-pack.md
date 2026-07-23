# G85 device-ready pack — Fas 24 P0 (agent prep)

Date: 2026-07-23  
Status: **device-ready** (NOT G85 PASS — Pontus must run on phone)

## Machine prep (done)

- Gold Companion Våg 1–4 already on main
- Smart Time / Widget AI Android + web bridge smoke PASS
- Sacred Lock ghost-exit race fixed (unlock callback)
- escapeJs quote escape + actionable notif VISIBILITY_PRIVATE
- `compileDebugJavaWithJavac` + `verifySecurityComponents` PASS
- `smoke:companion-widgets` · `locked-ux` · `android-platform` · `inbox` PASS

## One G85 pass (~15–20 min) — do this once

1. Android Studio → Run on G85
2. Hem: header/dock + Companion-rail (max 2)
3. Pin **Capture** → one mic tap → recording (no full chrome)
4. Valv unlock → background **&lt;3s** → return without kickout; logcat no App Check 400
5. One Gold hub vs mockup (Dagbok or Familjen)
6. Log day N in `docs/G85-DAILY-DRIVER-CHECKLIST.md`

## Logcat filters

```
APP_CHECK
Valv
SacredLock
WidgetCapture
```

## After day 7

Update `docs/PROJECT_STATE.md` → G85 7d done. Only then claim Fas 24 P0 closed.
