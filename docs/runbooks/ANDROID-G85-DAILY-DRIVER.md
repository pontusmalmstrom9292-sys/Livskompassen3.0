# Runbook — Android G85 Daily Driver (Fas 24 P0 sista bit)

**Mål:** 7-dagars verklig användning på Motorola G85 utan att appen kraschar, fryser eller läcker minne. Detta stänger Fas 24 P0.

**Status:** Fas 24 P0 = `smoke PASS` 2026-06-25. **G85 7d daily driver kvar.** Detta är USER-arbete — Cloud Agent kan inte testa på din telefon.

---

## Innan du börjar (förbered APK på Mac)

```bash
cd ~/StudioProjects/Livskompassen3.0

# 1. Pull senaste main (eller branchen du vill testa)
git checkout main && git pull origin main

# 2. Bygg + cap sync (bundlad version — APK med dist/ inbakat)
npm run build:web && npx cap sync android

# 3. Öppna i Android Studio
npx cap open android
```

I Android Studio:

1. **Sync Project with Gradle Files** (toolbar-knapp eller `Cmd+Shift+I` → Reload Gradle).
2. **Build → Clean Project** (om du ändrat auth eller WebView-relaterat).
3. Anslut Motorola G85 via USB. Aktivera USB-debugging (Inställningar → Om telefonen → tappa Build number 7 ggr → tillbaka → Utvecklaralternativ → USB-debugging på).
4. Tryck **Run** (gröna play-knappen) eller `Ctrl+R`.

Vid auth-strul: avinstallera `Livskompassen` från telefonen → kör Run igen.

---

## Daglig användning — vad du ska testa varje dag

Markera dagligen (✓ / ✗) i denna lista. Stäng vid ~5 min/dag.

### Dag 1 — Login + Hem

- [ ] Öppna appen från hem-skärmen
- [ ] Google-inloggning fungerar (native, inte web-popup)
- [ ] Hem-skärmen laddar utan vit ruta > 3 sek
- [ ] Floating Dock visar Familjen / Kompass / Dagbok

### Dag 2 — Hjärtat / Dagbok

- [ ] `/hjartat?tab=reflektion` öppnas
- [ ] Skriv 1 minne, spara
- [ ] Tomt fält efter spara, ingen krasch
- [ ] Tyst läge (Fas 23E) — slå på, skriv, spara, slå av

### Dag 3 — Familjen / Barnfokus

- [ ] `/familjen` öppnas i en scroll-yta (Fas 23.1)
- [ ] Barnfokus → Kasper eller Arvid
- [ ] Spara observation, fysiologi-värde
- [ ] Verifiera att inga andra barns data syns (silo-isolering)

### Dag 4 — Valv (long-press Fyren 3 sek)

- [ ] Long-press på Fyren → PIN/WebAuthn-prompt
- [ ] Lås upp med fingeravtryck
- [ ] Mönster-flik laddar
- [ ] Orkester-flik laddar
- [ ] Idle 1 timme → automatisk re-lock (Zero Footprint)

### Dag 5 — Inkast / Töm Skallen (Fas 23B)

- [ ] Hem → Inkast widget eller `/inkast`
- [ ] Snabb-spara 3 anteckningar
- [ ] HITL-preview (Fas 24 HITL1) visar förslag på silo
- [ ] Godkänn → hamnar i rätt silo

### Dag 6 — Offline-test

- [ ] Slå på flygplansläge
- [ ] Dagbok → spara → ska gå (Draft Layer)
- [ ] Valv → ska blockeras med tydligt fel (`OFFLINE-ANDROID.md`)
- [ ] Slå av flygplansläge → synk-chip blir grön
- [ ] Inga duplicerade anteckningar

### Dag 7 — Stress-test

- [ ] Använd appen 30 min sammanhängande
- [ ] Byt mellan minst 5 zoner
- [ ] Ingen krasch, ingen frys > 3 sek
- [ ] Batterianvändning < 5 % efter 30 min
- [ ] Avinstallera + installera om → login + data syns

---

## Definition of Done (Pontus markerar PASS)

- [ ] Alla 7 dagar gröna
- [ ] Inga `Logcat`-errors med `FATAL` eller `Crashlytics`
- [ ] WhatsApp-share från Inkast fungerar (om använt)
- [ ] PMIR uppdaterad: `MODUL-GAP-OVERSIKT.md` Fas 24 P0 → **G85 7d PASS**
- [ ] `SENASTE-SAMMANFATTNING.md` uppdaterad

När alla 7 dagar är gröna → säg "P0 stängt" till AI-agent → den uppdaterar Fas 24-tabellen.

---

## Vid problem

| Symptom | Sannolik orsak | Fix |
|---|---|---|
| Vit skärm > 5 sek vid start | WebView laddar live från Hosting (CAPACITOR_SERVER_URL) | Använd `npm run cap:sync` (bundlad), inte `cap:sync:prod` |
| Google-login öppnar webläsare | SHA-1 inte registrerad i Firebase Console | Se `.context/android-capacitor.md` § Google-inloggning |
| Native fingeravtryck-prompt visas inte | App Check Console Enforce ej PÅ + biometri ej aktiverat under Konto | Aktivera under Konto efter inlogg |
| Kraschar på `Cap.HTTP` | Backend-cors eller offline-policy | `OFFLINE-ANDROID.md` |

**Logcat-filter:** `adb logcat | grep -E "Livskompassen|FATAL|AndroidRuntime"`

---

## Cloud Agent kan inte göra detta åt dig

Daily driver-test kräver din fysiska telefon under verklig användning. Cloud Agent VM saknar:
- Tillgång till din Motorola G85
- Android Studio gradle build
- ADB-anslutning
- Verklig användning (kalender, notiser, batteri-stress)

Cloud Agent har dock **förberett**:
- ✓ APK bygger via `cap:sync` (verifierat)
- ✓ Smoke `smoke:android-platform` passerar (Fas 24 P0)
- ✓ Denna checklista
- ✓ Fix-katalog vid problem

**Du kör dag 1–7. Säg "G85 dag X klart" så uppdaterar agenten registret.**
