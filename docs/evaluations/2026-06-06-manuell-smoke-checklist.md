# Manuell smoke — Cursor-native rollout (2026-06-06)

**Efter:** Upload Fas 1–3 + Liv launcher + deploy hosting  
**Checklista:** [`SMOKE_CHECKLIST.md`](../SMOKE_CHECKLIST.md)

---

## Du kör (ca 15 min)

| # | Test | Förväntat |
|---|------|-----------|
| **Hem** | `/` inloggad | En «Skriv»-yta (CaptureSuper hem-capture) + ReviewQueue — **ingen** dubbel inkast |
| **Kompass** | Hem widget | Smart inkast via kompass-variant |
| **Liv** | Drawer → «Liv och göra» | 6 stora kort; MåBra/Planering/Arbetsliv → fullsid + «← Liv och göra» |
| **Planering** | `/planering` inkorg | Länk till Valv granskningskö — **ingen** inbäddad kö |
| **Valv Samla** | PIN → Samla → granska | **Enda** canonical InboxReviewQueue |
| **#3** | Valv bevis → `reality_vault` | WORM post |
| **#4** | Barnen logg | Optimistic save |
| **Speglar** | ACT → VIVIR | En Fortsätt-knapp (ACT), inte dubbel |

---

## Deploy (efter manuell OK)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase deploy --only hosting
```

Hard refresh: `Cmd + Shift + R`

---

## Agent smoke (PASS 2026-06-06)

`npm run build` · `smoke:inkast` · `smoke:inbox` · `smoke:locked-ux` · `smoke:design-modules` · `smoke:arbetsliv`
