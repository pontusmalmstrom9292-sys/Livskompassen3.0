# Livskompassen — install (Motorola + surfplattor)

**Prod-URL:** https://gen-lang-client-0481875058.web.app  
**Kopia på skrivbordet:** `~/Desktop/Livskompassen-install-checklista.md` (samma innehåll)

---

## Förälder — Motorola (widgets)

- [ ] Android Studio: `~/StudioProjects/Livskompassen3.0/android`
- [ ] **File → Sync Project with Gradle Files**
- [ ] USB + USB-felsökning → **Run** ▶
- [ ] Hemskärm: **Widgetar** → Livskompassen (Inspelning, Hamn, …)

**Efter prod-APK (`npm run cap:sync:prod`):** UI uppdateras från Hosting vid push till `main` — ingen USB för vanliga frontend-ändringar.

---

## Barn — surfplatta (PWA)

- [ ] Chrome → https://gen-lang-client-0481875058.web.app
- [ ] **Lägg till på hemskärmen**
- [ ] Logga in

---

## GitHub Hosting CI (engång)

- [ ] Secret `FIREBASE_SERVICE_ACCOUNT` (GCP `github-hosting-deploy`, roll Hosting Admin)
- [ ] Secrets `VITE_FIREBASE_*` från `.env` (6 st)

Se [`CI-HOSTING.md`](./CI-HOSTING.md) — utan Homebrew: secrets via GitHub web UI.

---

## Tema

`/dev/themes` → **Varm Hamn** (`G-varm-hamn`) eller **Auto per modul**.
