# Telefon — PWA via Firebase Hosting

**Produktions-URL:** https://gen-lang-client-0481875058.web.app  
**Manifest:** [`public/manifest.webmanifest`](../public/manifest.webmanifest)  
**Uppdatering:** build + deploy hosting, sedan ladda om PWA (ingen service worker i appen).

---

## Engång: lägg appen på hemskärmen (iPhone)

1. Öppna **Safari** (inte Chrome in-app).
2. Gå till https://gen-lang-client-0481875058.web.app
3. Vänta tills appen laddat (ingen röd auth-fel i skärm — Anonymous Auth ska vara aktiv i Firebase Console).
4. Tryck **Dela** (fyrkant med pil) → **Lägg till på hemskärmen**.
5. Öppna **Livskompassen** från ikonen — `standalone`, porträtt.

**Android:** Chrome → meny → *Installera app* / *Lägg till på startskärmen*.

---

## Efter kodändringar (Hosting-läge)

```bash
npm run deploy:hosting
```

Eller preview (egen URL, skriver inte över prod):

```bash
npm run deploy:hosting:preview
```

**Efter deploy på telefon:** stäng PWA helt (appväxlare) och öppna igen, eller dra ner för att uppdatera i Safari först och öppna sedan från hemskärmen.

**Backend-ändringar** (Functions) kräver separat deploy — se [`DEPLOY.md`](./DEPLOY.md). Hosting räcker bara för UI.

---

## Verifiera auth (engång)

| Steg | Förväntat |
|------|-----------|
| Öppna appen | Ingen permanent "auth failed" |
| Firebase Console → Authentication | Anonym användare skapas vid första besök |
| Modulhub / Dagbok | Kan spara till Firestore med ditt `uid` |

---

## Manuell prod-smoke på telefon

Kör [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) **#11–20** mot Hosting-URL. Logga i [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) § Telefon prod-smoke.

---

## Alternativ: lokal dev (realtid / HMR)

Samma Wi‑Fi som Mac:

```bash
npm run dev
```

Öppna `http://<Mac-IP>:5173` i Safari. Se [`FIREBASE_SYNC.md`](./FIREBASE_SYNC.md) § Två lägen.
