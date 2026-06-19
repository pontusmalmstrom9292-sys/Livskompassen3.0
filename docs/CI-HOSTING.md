# CI & deploy — manuell gate (GitHub Actions avstängt)

**Status 2026-06-19:** GitHub Actions **arkiverade** (billing). Ingen auto-deploy vid push.  
**Arkiv:** [`docs/archive/github-actions-2026-06-19/`](archive/github-actions-2026-06-19/)  
**Kanon:** [`docs/DEPLOY.md`](DEPLOY.md) · [`docs/YOLO-VAKT-GATE.md`](YOLO-VAKT-GATE.md)

**Mac (kanonisk mapp):** `~/StudioProjects/Livskompassen3.0`  
**Prod-URL:** https://gen-lang-client-0481875058.web.app

---

## Rutin före deploy

```bash
cd ~/StudioProjects/Livskompassen3.0
npm run smoke:predeploy:build
npm run build
firebase deploy --only hosting
```

Functions/rules/storage: se [`DEPLOY.md`](DEPLOY.md) — **inte** auto vid push.

---

## GitHub Actions (inaktivt)

Tidigare workflows (hosting deploy, PR gate, Android distribution, sacred backup) ligger i arkiv.  
**Valfritt:** GitHub → repo **Settings → Actions → Disable actions** (slipper billing helt).

Secrets (`VITE_FIREBASE_*`, `FIREBASE_SERVICE_ACCOUNT`) behövs **inte** för lokal deploy om `.env` finns.

---

## Android (Capacitor)

| Vad | Uppdateras |
|-----|------------|
| Webb + PWA | `firebase deploy --only hosting` |
| Native APK-innehåll | `npm run cap:sync:prod` + Android Studio Run |

Se [`android/README.md`](../android/README.md) · [`INSTALL-CHECKLIST.md`](INSTALL-CHECKLIST.md).

---

## Felsökning

| Symptom | Åtgärd |
|---------|--------|
| Deploy fail lokalt | Kör `npm run smoke:predeploy:build` — fixa FAIL först |
| App oförändrad på telefon | Hard refresh / rensa PWA-cache |
| Vill ha CI igen | Fixa billing → flytta YAML från arkiv → enable Actions |

---

## Historik (arkiverad auto-CI)

Auto-deploy via `.github/workflows/firebase-hosting-main.yml` pausad 2026-06-19.  
PR quality gate (våg 3) implementerad men ej körd i molnet p.g.a. billing.  
Setup-secrets: [`scripts/set_github_hosting_secrets.sh`](../scripts/set_github_hosting_secrets.sh) (vid återaktivering).
