# Systemkontroll — Manuell smoke — 2026-05-23

**Trigger:** Plan "Snabb väg: designplan, färdig app, synk och låsning" — Fas 1  
**Källor:** [`SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md), [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)  
**Automatiserat (agent):** `npm run smoke:build`, `npm run smoke:all` — se § Automatiserad smoke nedan

---

## Sammanfattning

| Kategori | Status |
|----------|--------|
| Build (frontend + functions) | **PASS** 2026-05-23 (`npm run smoke:build`) |
| Automatiserad callable-smoke | **PASS** 2026-05-23 (alla 13 skript) |
| Manuell UI #1–20 | **Öppen** — checkbox per rad nedan (ägare: användaren) |

**Prod-URL:** https://gen-lang-client-0481875058.web.app  
**Lokal:** `npm run dev` → http://localhost:5173

---

## Automatiserad smoke (backend / callables)

Kör från repo-root (kräver Firebase Auth env / service account som i befintliga smoke-skript):

```bash
npm run smoke:build
npm run smoke:all
```

| Script | Resultat | Datum |
|--------|----------|-------|
| smoke:kunskap | PASS | 2026-05-23 |
| smoke:speglar | PASS | 2026-05-23 |
| smoke:dossier | PASS | 2026-05-23 |
| smoke:compass | PASS | 2026-05-23 |
| smoke:mabra | PASS | 2026-05-23 |
| smoke:valv | PASS | 2026-05-23 |
| smoke:journal | PASS | 2026-05-23 |
| smoke:children | PASS | 2026-05-23 |
| smoke:entities | PASS | 2026-05-23 |
| smoke:inbox | PASS | 2026-05-23 |
| smoke:cache | PASS | 2026-05-23 |
| smoke:tidshjul | PASS | 2026-05-23 |
| smoke:grans | PASS | 2026-05-23 |

**Historik PASS:** [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md) (2026-05-22).

---

## Manuell smoke — UI (#1–20)

Markera **PASS** / **FAIL** / **SKIP** efter test i appen (telefon rekommenderas för #11–12).

| # | Test | Route | PASS/FAIL | Notering |
|---|------|-------|-----------|----------|
| 1 | Auth | Öppna app | | |
| 2 | Dagbok | `/dagbok` — spara post | | `journal` |
| 3 | Valv | Fyren 3s → PIN → Bevis | | `reality_vault` |
| 4 | Barnen | `/familjen` — spara logg | | `children_logs` |
| 5 | Kompasser | `/vardagen` check-in | | `checkins` |
| 6 | BIFF | `/hamn` — analyzeMessage | | |
| 7 | Kunskap | `/vardagen?tab=kunskap` | | |
| 8 | Vävaren | Dagbok spara → ~30s | | `vävaren_metadata` |
| 9 | Speglar | `/dagbok?tab=speglar` | | |
| 10 | Barnen fysio | Kasper → fysiologi | | |
| 11 | WebAuthn | Fyren 3s i hub | | |
| 12 | Kill switch | Skaka hårt (mobil) | | |
| 13 | Dagbok röst | Mikrofon sv-SE | | |
| 14 | Dagbok → Speglar | gaslighting-länk | | |
| 15 | Speglar AI | Spegla | | |
| 16 | Valv media | Skärmdump | | Storage |
| 17 | Valv PDF | PDF-knapp | | |
| 18 | Dossier bro | Bevis → Dossier | | `/dossier` |
| 19 | Legacy redirect | `/valv`, `/barnen` | | |
| 20 | Vault unlock reset | Bevis → Reflektion | | |

---

## Sacred Features (snabbkoll)

| Feature | PASS/FAIL | Smoke # |
|---------|-----------|---------|
| Verklighetsvalvet | | 3, 16–17 |
| Sanningens Sköld | | 3 |
| Morgonkompassen | | 5 |
| Dossier-Generator | | 18 + smoke:dossier |
| Speglings-Systemet | | 9, 14–15 |
| Zero Footprint | | 20 |
| Kill Switch | | 12 |

---

## FUNKTIONSLOCK (UX)

| ID | PASS/FAIL | Var testat |
|----|-----------|------------|
| F-01 Kognitiv skala | | Header alla sidor |
| F-02 Kompassråd | | `/` |
| F-03 Familjen-flikar | | `/familjen` |
| F-04 Barnprofilkort | | tab=barnfokus |
| F-05 Minnesankare | | tab=barnfokus |
| F-06 Validering | | under minnesankare |
| F-07 Korsreferens | | tab=korsref |
| F-08 WORM-skriv | | korsref / valv |

---

## Rekommenderat nästa steg

1. **Du:** Fyll i manuell UI-tabell (#1–20) efter en session (15–25 min) på telefon eller Hosting.
2. Vid FAIL — notera konsol/Firestore uid; kör **B**-prompt från [`SYSTEMKONTROLL.md`](../SYSTEMKONTROLL.md).
3. Före skarp prod: `kör G17` ([`G17-Server-PIN-WebAuthn-GAP.md`](../specs/modules/G17-Server-PIN-WebAuthn-GAP.md)).

---

## Blocker

_(tom tills manuell test hittar fel)_
