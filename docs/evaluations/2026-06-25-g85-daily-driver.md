# G85 Daily Driver — 7-dagars friktionslogg

**Plattform:** Motorola G85 · Capacitor Android  
**Start:** 2026-06-25  
**Mål:** P0 — appen som vardagsverktyg, inte bara grön smoke  
**Prod-URL i appen:** https://gen-lang-client-0481875058.web.app (`cap:sync:prod` körd 2026-06-28 efter hosting deploy)

---

## Installera på telefonen (engångs)

1. USB-kabel till Mac · **Utvecklarläge** + **USB-felsökning** på G85
2. Terminal: `npm run android:open` → Android Studio öppnas
3. Android Studio: **Sync Gradle** → **Run** (grön play) mot G85
4. Vid inloggningsstrul: avinstallera appen på telefonen → kör Run igen
5. Logga in med **Logga in**-fliken (samma Google-konto som på Mac)

**Alternativ utan Android Studio:** `npm run android:run:prod` (kräver att telefonen syns via `adb devices`)

---

## Daglig mikro-checklista (~5 min)

Gör detta **en gång per dag** i 7 dagar. Skriv max 1–2 meningar per rad i tabellen nedan.

| # | Test | Var |
|---|------|-----|
| 1 | Öppna appen kallstart (från hemskärm) | Hem |
| 2 | Fyren — fånga en tanke/obs (valfri silo) | Widget / Fyren |
| 3 | MåBra — öppna hubben, ev. SOS eller andning | `/vardagen?tab=mabra` |
| 4 | Dagbok — skriv 3 ord eller Tyst läge 30 sek | `/hjartat` |
| 5 | Stäng appen helt → öppna igen (minne kvar?) | System |
| 6 | Panik «Dölj» om du testar widget (valfritt) | Widget |

**Energimärkning:** 🟢 låg · 🟡 medium · 🔴 hög stress / dissociation

---

## Friktionslogg

| Dag | Datum | Energi | Vad funkade | Friktion / bugg | Fix-prioritet |
|-----|-------|--------|-------------|-----------------|---------------|
| 1 | 2026-06-25 | | | | |
| 2 | 2026-06-26 | | | | |
| 3 | 2026-06-27 | | | | |
| 4 | 2026-06-28 | | | | |
| 5 | 2026-06-29 | | | | |
| 6 | 2026-06-30 | | | | |
| 7 | 2026-07-01 | | | | |

**Prioritet:** P0 = blockerar vardag · P1 = irriterande · P2 = nice-to-have

---

## Snabbanteckningar (fritt fält)

```
Dag 1:


Dag 2:


Dag 3:


Dag 4:


Dag 5:


Dag 6:


Dag 7:

```

---

## Avslut efter dag 7

- [ ] Minst 5 av 7 dagar använd (ärlig markering)
- [ ] P0-friktioner listade (om några)
- [ ] Rekommendation: **fortsätt bygga** / **fixa P0 först** / **pausa feature**

**Nästa steg efter loggen:** Cursor-agent fixar endast P0-friktioner — inga nya hubbar utan PMIR.

---

## Teknisk referens

| Gate | Status |
|------|--------|
| `smoke:android-platform` | PASS 2026-06-25, 2026-06-28 |
| `smoke:auth-login` | PASS 2026-06-28 |
| `smoke:predeploy:build` | PASS 2026-06-28 |
| `build:web` | PASS 2026-06-25, 2026-06-28 |
| `cap:sync:prod` | PASS 2026-06-28 (efter hosting deploy) |
| `smoke:android-prod-sync` | PASS 2026-06-28 |
| Hosting live (23E) | https://gen-lang-client-0481875058.web.app |
| SHA-1 / `client_type: 1` | Verifierad i smoke |

Kanon: [`.context/android-capacitor.md`](../../.context/android-capacitor.md) · [`docs/FIREBASE-AUTH-LATHUND.md`](../FIREBASE-AUTH-LATHUND.md)

### Körning 2026-06-28 (YOLO #7 g85-prod-sync)

- `npm run build:web` — PASS
- `npm run cap:sync:prod` — PASS (WebView → live Hosting)
- `npm run smoke:android-platform` — PASS
- `npm run smoke:auth-login` — PASS
- `npm run smoke:android-prod-sync` — PASS
- **Fix:** `cap:sync:prod` exporterar nu `CAPACITOR_SERVER_URL` till både build och `cap sync` (tidigare saknades `server.url` i APK).

**Kör på G85 nu:** USB + felsökning → `npm run android:open` → Gradle Sync → Run. Eller: `npm run android:run:prod` om `adb devices` visar telefonen.

### Körning 2026-06-28 (prep + smoke)

- `npm run build:web` — PASS
- `npm run smoke:android-platform` — PASS
- `npm run smoke:auth-login` — PASS
- `npm run smoke:predeploy:build` — PASS
